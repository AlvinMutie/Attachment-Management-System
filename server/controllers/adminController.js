const { User, Student, School, AuditLog, Logbook, Attendance, sequelize } = require('../models');
const { logAudit } = require('../utils/auditLogger');
const { parseStudentCSV } = require('../services/csvService');
const { generateInstitutionalReport } = require('../services/reportService');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

/**
 * Get all students for the current school
 */
const getInstitutionalStudents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await Student.findAndCountAll({
            where: { schoolId: req.schoolId },
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
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name'] },
                { model: User, as: 'universitySupervisor', attributes: ['id', 'name'] }
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
 * Create a new student and their user account
 */
const createInstitutionalStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, email, password, admissionNumber, department } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Identity node already exists globally' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'student',
            schoolId: req.schoolId
        }, { transaction });

        const student = await Student.create({
            userId: user.id,
            schoolId: req.schoolId,
            admissionNumber,
            department,
            institution: (await School.findByPk(req.schoolId)).name
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
        const { role = 'industry_supervisor' } = req.query;

        const supervisors = await User.findAll({
            where: {
                schoolId: req.schoolId,
                role: role
            },
            attributes: ['id', 'name', 'email', 'status', 'lastLogin']
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
 * Assign supervisor to student
 */
const assignSupervisor = async (req, res) => {
    try {
        const { studentId, supervisorId, type } = req.body; // type: 'industry' or 'university'

        const student = await Student.findOne({ where: { id: studentId, schoolId: req.schoolId } });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student node not found' });
        }

        const supervisor = await User.findOne({ where: { id: supervisorId, schoolId: req.schoolId } });
        if (!supervisor) {
            return res.status(404).json({ success: false, message: 'Supervisor node not found' });
        }

        if (type === 'industry') {
            await student.update({ industrySupervisorId: supervisorId });
        } else {
            await student.update({ universitySupervisorId: supervisorId });
        }

        res.json({
            success: true,
            message: 'Oversight link established successfully'
        });
    } catch (error) {
        console.error('Assign supervisor error:', error);
        res.status(500).json({ success: false, message: 'Failed to establish oversight link' });
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
        const totalAttendance = await Attendance.count({ where: { schoolId: req.schoolId } });

        // Calculate average attendance (very simplified for MVP)
        const avgAttendance = totalStudents > 0 ? Math.min(100, Math.round((totalAttendance / (totalStudents * 20)) * 100)) : 0;

        res.json({
            success: true,
            data: {
                totalStudents,
                totalLogbooks,
                pendingReviews,
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
            // Cleanup: Optional files deletion if not needed anymore
            // fs.unlinkSync(filePath); 
        });
    } catch (error) {
        console.error('Generate PDF error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate institutional record' });
    }
};

module.exports = {
    getInstitutionalStudents,
    createInstitutionalStudent,
    getInstitutionalSupervisors,
    assignSupervisor,
    bulkOnboardStudents,
    getInstitutionalAnalytics,
    generateInstitutionalPDF
};
