const { Student, User, Attendance, Logbook, Assessment } = require('../models');
const { Op } = require('sequelize');

/**
 * Get assigned students for the industry supervisor
 */
const getAssignedStudents = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const students = await Student.findAll({
            where: {
                industrySupervisorId: req.user.id,
                schoolId: req.schoolId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'status']
                },
                {
                    model: Attendance,
                    as: 'attendance',
                    where: { date: today },
                    required: false,
                    attributes: ['id', 'status', 'timestamp', 'notes']
                },
                {
                    model: Logbook,
                    as: 'logbooks',
                    limit: 1,
                    order: [['weekNumber', 'DESC']],
                    attributes: ['id', 'weekNumber', 'status', 'summary', 'createdAt']
                }
            ]
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Get assigned students error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch assigned students' });
    }
};

/**
 * Get live presence of students for an industry supervisor (legacy & dashboard hub)
 */
const getLivePresence = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const students = await Student.findAll({
            where: {
                industrySupervisorId: req.user.id,
                schoolId: req.schoolId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                },
                {
                    model: Attendance,
                    as: 'attendance',
                    where: { date: today },
                    required: false,
                    attributes: ['status', 'timestamp']
                },
                {
                    model: Logbook,
                    as: 'logbooks',
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    attributes: ['weekNumber', 'status', 'attachments']
                }
            ]
        });

        res.json({
            success: true,
            data: students.map(student => ({
                id: student.id,
                name: student.user.name,
                email: student.user.email,
                course: student.course || student.department,
                admissionNumber: student.admissionNumber,
                presenceStatus: student.attendance.length > 0 ? student.attendance[0].status : 'not-scanned',
                lastSeen: student.attendance.length > 0 ? student.attendance[0].timestamp : null,
                latestLogbook: student.logbooks.length > 0 ? student.logbooks[0] : null
            }))
        });
    } catch (error) {
        console.error('Get live presence error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch presence data' });
    }
};

/**
 * Get logbooks of assigned students only
 */
const getSupervisorLogbooks = async (req, res) => {
    try {
        const { studentId, status } = req.query;

        // Find student IDs assigned to this supervisor
        const assignedStudents = await Student.findAll({
            where: {
                industrySupervisorId: req.user.id,
                schoolId: req.schoolId
            },
            attributes: ['id']
        });

        const assignedStudentIds = assignedStudents.map(s => s.id);

        if (studentId && !assignedStudentIds.includes(studentId)) {
            return res.status(403).json({ success: false, message: 'Access denied: student not assigned to you' });
        }

        if (assignedStudentIds.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const whereClause = {
            studentId: studentId || { [Op.in]: assignedStudentIds }
        };

        if (status) {
            whereClause.status = status;
        }

        const logbooks = await Logbook.findAll({
            where: whereClause,
            include: [
                {
                    model: Student,
                    as: 'student',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: logbooks
        });
    } catch (error) {
        console.error('Get supervisor logbooks error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch logbooks' });
    }
};

/**
 * Review a student logbook (approve or reject with comment)
 */
const reviewLogbook = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, supervisorComment } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'approved', 'rejected', or 'pending'"
            });
        }

        const logbook = await Logbook.findByPk(id, {
            include: [{ model: Student, as: 'student' }]
        });

        if (!logbook) {
            return res.status(404).json({ success: false, message: 'Logbook entry not found' });
        }

        // Verify that the student is assigned to this industry supervisor
        if (logbook.student.industrySupervisorId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: student is not assigned to you'
            });
        }

        await logbook.update({
            status,
            supervisorComment: supervisorComment !== undefined ? supervisorComment : logbook.supervisorComment
        });

        res.json({
            success: true,
            message: `Logbook entry ${status} successfully.`,
            data: logbook
        });
    } catch (error) {
        console.error('Review logbook error:', error);
        res.status(500).json({ success: false, message: 'Failed to review logbook' });
    }
};

/**
 * Get attendance records for assigned students
 */
const getSupervisorAttendance = async (req, res) => {
    try {
        const { studentId, date } = req.query;

        const assignedStudents = await Student.findAll({
            where: {
                industrySupervisorId: req.user.id,
                schoolId: req.schoolId
            },
            attributes: ['id']
        });

        const assignedStudentIds = assignedStudents.map(s => s.id);

        if (studentId && !assignedStudentIds.includes(studentId)) {
            return res.status(403).json({ success: false, message: 'Access denied: student not assigned to you' });
        }

        if (assignedStudentIds.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const whereClause = {
            studentId: studentId || { [Op.in]: assignedStudentIds }
        };

        if (date) {
            whereClause.date = date;
        }

        const attendance = await Attendance.findAll({
            where: whereClause,
            include: [
                {
                    model: Student,
                    as: 'student',
                    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
                }
            ],
            order: [['date', 'DESC']]
        });

        res.json({
            success: true,
            data: attendance
        });
    } catch (error) {
        console.error('Get supervisor attendance error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
    }
};

/**
 * Mark or correct attendance for an assigned student
 */
const markSupervisorAttendance = async (req, res) => {
    try {
        const { studentId, date, status, notes } = req.body;

        if (!studentId || !date || !status) {
            return res.status(400).json({
                success: false,
                message: 'studentId, date, and status are required.'
            });
        }

        // Verify assignment
        const student = await Student.findOne({
            where: {
                id: studentId,
                industrySupervisorId: req.user.id,
                schoolId: req.schoolId
            }
        });

        if (!student) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: student is not assigned to you'
            });
        }

        let record = await Attendance.findOne({
            where: {
                studentId,
                date
            }
        });

        if (record) {
            await record.update({
                status,
                notes: notes !== undefined ? notes : record.notes,
                scannedBy: req.user.id,
                verificationMethod: 'supervisor_verified'
            });
        } else {
            record = await Attendance.create({
                studentId,
                schoolId: req.schoolId,
                date,
                timestamp: new Date(),
                status,
                scannedBy: req.user.id,
                verificationMethod: 'supervisor_marked',
                notes: notes || null
            });
        }

        res.json({
            success: true,
            message: 'Attendance recorded successfully.',
            data: record
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ success: false, message: 'Failed to record attendance' });
    }
};

/**
 * Get assessments submitted by this industry supervisor
 */
const getSupervisorAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.findAll({
            where: {
                evaluatorId: req.user.id,
                schoolId: req.schoolId,
                evaluatorType: 'industry'
            },
            include: [
                {
                    model: Student,
                    as: 'student',
                    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: assessments
        });
    } catch (error) {
        console.error('Get supervisor assessments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch assessments' });
    }
};

/**
 * Submit / create assessment for an assigned student
 */
const submitSupervisorAssessment = async (req, res) => {
    try {
        const { studentId, type, score, feedback, criteria } = req.body;

        if (!studentId || !type || score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'studentId, type, and score are required.'
            });
        }

        // Verify assignment
        const student = await Student.findOne({
            where: {
                id: studentId,
                industrySupervisorId: req.user.id,
                schoolId: req.schoolId
            }
        });

        if (!student) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: student is not assigned to you'
            });
        }

        const assessment = await Assessment.create({
            studentId,
            evaluatorId: req.user.id,
            schoolId: req.schoolId,
            type,
            evaluatorType: 'industry',
            score: parseInt(score),
            feedback,
            criteria: criteria || {},
            status: 'submitted'
        });

        res.status(201).json({
            success: true,
            message: 'Assessment submitted successfully.',
            data: assessment
        });
    } catch (error) {
        console.error('Submit assessment error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit assessment' });
    }
};

module.exports = {
    getAssignedStudents,
    getLivePresence,
    getSupervisorLogbooks,
    reviewLogbook,
    getSupervisorAttendance,
    markSupervisorAttendance,
    getSupervisorAssessments,
    submitSupervisorAssessment
};
