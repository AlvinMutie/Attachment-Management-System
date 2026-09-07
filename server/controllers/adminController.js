const { User, Student, School, AuditLog, Logbook, Attendance, Assessment, sequelize } = require('../models');
const { logAudit } = require('../utils/auditLogger');
const { parseStudentCSV } = require('../services/csvService');
const { generateInstitutionalReport } = require('../services/reportService');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

/**
 * Get all students for the current school with optional search and pagination
 */
const getInstitutionalStudents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { schoolId: req.schoolId };
        if (status) {
            whereClause.placementStatus = status;
        }

        const { count, rows } = await Student.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'status', 'lastLogin'],
                    where: search ? {
                        [sequelize.Op.or]: [
                            { name: { [sequelize.Op.iLike]: `%${search}%` } },
                            { email: { [sequelize.Op.iLike]: `%${search}%` } }
                        ]
                    } : {}
                },
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'universitySupervisor', attributes: ['id', 'name', 'email'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                students: rows,
                pagination: {
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page)
                }
            }
        });
    } catch (error) {
        console.error('Get institutional students error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student registry' });
    }
};

/**
 * Get student placements for the school with status filtering
 */
const getInstitutionalPlacements = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { schoolId: req.schoolId };
        if (status) {
            whereClause.placementStatus = status;
        }

        const { count, rows } = await Student.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'status']
                },
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'universitySupervisor', attributes: ['id', 'name', 'email'] }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['updatedAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                placements: rows,
                pagination: {
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page)
                }
            }
        });
    } catch (error) {
        console.error('Get institutional placements error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch placement applications' });
    }
};

/**
 * Review (Approve or Reject) a student placement application
 */
const reviewPlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid placement status. Must be APPROVED, REJECTED, ACTIVE, COMPLETED, or CANCELLED.'
            });
        }

        const student = await Student.findOne({
            where: {
                id,
                schoolId: req.schoolId
            },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student placement record not found within this school'
            });
        }

        await student.update({
            placementStatus: status,
            rejectionReason: status === 'REJECTED' ? (rejectionReason || 'Placement details incomplete or not eligible.') : null
        });

        res.json({
            success: true,
            message: `Placement has been ${status.toLowerCase()} successfully.`,
            data: student
        });
    } catch (error) {
        console.error('Review placement error:', error);
        res.status(500).json({ success: false, message: 'Failed to review placement' });
    }
};

/**
 * Create a new student and their user account
 */
const createInstitutionalStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, email, password, admissionNumber, department, course, yearOfStudy } = req.body;

        if (!name || !email || !admissionNumber || !department) {
            return res.status(400).json({ success: false, message: 'Name, email, admissionNumber, and department are required' });
        }

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Identity node already exists globally' });
        }

        const school = await School.findByPk(req.schoolId);

        const user = await User.create({
            name,
            email,
            password: password || 'ChangeMe123!',
            role: 'student',
            schoolId: req.schoolId
        }, { transaction });

        const student = await Student.create({
            userId: user.id,
            schoolId: req.schoolId,
            admissionNumber,
            department,
            course: course || department,
            yearOfStudy: yearOfStudy || 'Year 3',
            institution: school ? school.name : 'University'
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Student successfully onboarded',
            data: { user, student }
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Create student error:', error);
        res.status(500).json({ success: false, message: 'Failed to deploy student node' });
    }
};

/**
 * Get all supervisors for the school
 */
const getInstitutionalSupervisors = async (req, res) => {
    try {
        const { role } = req.query;

        const whereClause = { schoolId: req.schoolId };
        if (role) {
            whereClause.role = role;
        } else {
            whereClause.role = {
                [sequelize.Op.in]: ['industry_supervisor', 'university_supervisor']
            };
        }

        const supervisors = await User.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'email', 'role', 'status', 'lastLogin']
        });

        res.json({
            success: true,
            data: supervisors
        });
    } catch (error) {
        console.error('Get supervisors error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch supervisor registry' });
    }
};

/**
 * Assign supervisor to student (industry or university)
 */
const assignSupervisor = async (req, res) => {
    try {
        const { studentId, supervisorId, type } = req.body; // type: 'industry' or 'university'

        if (!studentId || !supervisorId || !type) {
            return res.status(400).json({ success: false, message: 'studentId, supervisorId, and type are required' });
        }

        if (!['industry', 'university'].includes(type)) {
            return res.status(400).json({ success: false, message: "Type must be 'industry' or 'university'" });
        }

        const student = await Student.findOne({ where: { id: studentId, schoolId: req.schoolId } });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student node not found' });
        }

        const expectedRole = type === 'industry' ? 'industry_supervisor' : 'university_supervisor';
        const supervisor = await User.findOne({
            where: {
                id: supervisorId,
                schoolId: req.schoolId,
                role: expectedRole
            }
        });

        if (!supervisor) {
            return res.status(404).json({
                success: false,
                message: `Supervisor not found or not registered as a ${expectedRole} in this school`
            });
        }

        if (type === 'industry') {
            await student.update({ industrySupervisorId: supervisorId });
        } else {
            await student.update({ universitySupervisorId: supervisorId });
        }

        res.json({
            success: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} supervisor assigned successfully.`
        });
    } catch (error) {
        console.error('Assign supervisor error:', error);
        res.status(500).json({ success: false, message: 'Failed to establish oversight link' });
    }
};

/**
 * Get school attendance records
 */
const getInstitutionalAttendance = async (req, res) => {
    try {
        const { date, studentId, status, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { schoolId: req.schoolId };
        if (date) whereClause.date = date;
        if (studentId) whereClause.studentId = studentId;
        if (status) whereClause.status = status;

        const { count, rows } = await Attendance.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Student,
                    as: 'student',
                    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
                },
                {
                    model: User,
                    as: 'scanner',
                    attributes: ['id', 'name', 'role']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['date', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                attendance: rows,
                pagination: {
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page)
                }
            }
        });
    } catch (error) {
        console.error('Get institutional attendance error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance records' });
    }
};

/**
 * Bulk onboard students via CSV
 */
const bulkOnboardStudents = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No CSV file provided' });
    }

    const transaction = await sequelize.transaction();
    try {
        const studentsData = await parseStudentCSV(req.file.path);
        const school = await School.findByPk(req.schoolId);
        const results = { successful: 0, failed: 0, errors: [] };

        for (const data of studentsData) {
            try {
                // Check if user exists
                const userExists = await User.findOne({ where: { email: data.email } });
                if (userExists) {
                    results.failed++;
                    results.errors.push(`Email ${data.email} already exists`);
                    continue;
                }

                // Create User
                const user = await User.create({
                    name: data.name,
                    email: data.email,
                    password: 'ChangeMe123!', // Default password
                    role: 'student',
                    schoolId: req.schoolId
                }, { transaction });

                // Create Student Profile
                await Student.create({
                    userId: user.id,
                    schoolId: req.schoolId,
                    admissionNumber: data.admissionNumber,
                    department: data.department,
                    course: data.course || data.department,
                    yearOfStudy: data.yearOfStudy || 'Year 3',
                    institution: school.name
                }, { transaction });

                results.successful++;
            } catch (err) {
                results.failed++;
                results.errors.push(`Error creating ${data.email}: ${err.message}`);
            }
        }

        await transaction.commit();

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: `Bulk onboarding complete. ${results.successful} successful, ${results.failed} failed.`,
            data: results
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Bulk onboarding error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to process bulk onboarding' });
    }
};

/**
 * Get institutional analytics summary
 */
const getInstitutionalAnalytics = async (req, res) => {
    try {
        const totalStudents = await Student.count({ where: { schoolId: req.schoolId } });
        const totalLogbooks = await Logbook.count({ where: { schoolId: req.schoolId } });
        const pendingReviews = await Logbook.count({ where: { schoolId: req.schoolId, status: 'pending' } });
        const approvedLogbooks = await Logbook.count({ where: { schoolId: req.schoolId, status: 'approved' } });
        const totalAttendance = await Attendance.count({ where: { schoolId: req.schoolId } });
        const activePlacements = await Student.count({
            where: {
                schoolId: req.schoolId,
                placementStatus: { [sequelize.Op.in]: ['APPROVED', 'ACTIVE'] }
            }
        });
        const pendingPlacements = await Student.count({
            where: {
                schoolId: req.schoolId,
                placementStatus: 'PENDING_APPROVAL'
            }
        });

        // Calculate average attendance rate
        const avgAttendance = totalStudents > 0 ? Math.min(100, Math.round((totalAttendance / (totalStudents * 20)) * 100)) : 0;

        res.json({
            success: true,
            data: {
                totalStudents,
                activePlacements,
                pendingPlacements,
                totalLogbooks,
                pendingReviews,
                approvedLogbooks,
                totalAttendance,
                avgAttendance
            }
        });
    } catch (error) {
        console.error('Get institutional analytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to aggregate institutional data' });
    }
};

/**
 * Generate and download institutional PDF report
 */
const generateInstitutionalPDF = async (req, res) => {
    try {
        const school = await School.findByPk(req.schoolId);

        // Fetch real analytics data
        const totalStudents = await Student.count({ where: { schoolId: req.schoolId } });
        const totalLogbooks = await Logbook.count({ where: { schoolId: req.schoolId } });
        const pendingReviews = await Logbook.count({ where: { schoolId: req.schoolId, status: 'pending' } });
        const totalAttendance = await Attendance.count({ where: { schoolId: req.schoolId } });
        const avgAttendance = totalStudents > 0 ? Math.min(100, Math.round((totalAttendance / (totalStudents * 20)) * 100)) : 0;

        const analytics = {
            totalStudents,
            totalLogbooks,
            pendingReviews,
            totalAttendance,
            avgAttendance
        };

        const { fileName, filePath } = await generateInstitutionalReport(analytics, school);

        res.download(filePath, `AMS-Report-${school.name.replace(/\s+/g, '-')}.pdf`, (err) => {
            if (err) {
                console.error('PDF Download error:', err);
            }
        });
    } catch (error) {
        console.error('Generate PDF error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate institutional record' });
    }
};

module.exports = {
    getInstitutionalStudents,
    getInstitutionalPlacements,
    reviewPlacement,
    createInstitutionalStudent,
    getInstitutionalSupervisors,
    assignSupervisor,
    getInstitutionalAttendance,
    bulkOnboardStudents,
    getInstitutionalAnalytics,
    generateInstitutionalPDF
};
