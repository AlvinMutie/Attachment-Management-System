const { Student, User, Logbook, Attendance, Assessment, Meeting } = require('../models');
const { notifyAssessmentSubmitted } = require('../services/notificationService');

/**
 * Get students assigned to the university supervisor with attachment progress metrics
 */
const getMyStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: {
                universitySupervisorId: req.user.id,
                schoolId: req.schoolId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'status']
                },
                {
                    model: User,
                    as: 'industrySupervisor',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Logbook,
                    as: 'logbooks',
                    attributes: ['id', 'weekNumber', 'status', 'createdAt']
                },
                {
                    model: Attendance,
                    as: 'attendance',
                    attributes: ['id', 'status', 'date']
                },
                {
                    model: Assessment,
                    as: 'assessments',
                    attributes: ['id', 'type', 'evaluatorType', 'score', 'status']
                }
            ]
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Get my students error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch assigned students' });
    }
};

/**
 * Get detailed overview of a single student assigned to this university supervisor
 */
const getStudentOverview = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findOne({
            where: {
                id,
                universitySupervisorId: req.user.id,
                schoolId: req.schoolId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'status']
                },
                {
                    model: User,
                    as: 'industrySupervisor',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Logbook,
                    as: 'logbooks',
                    order: [['weekNumber', 'DESC']]
                },
                {
                    model: Attendance,
                    as: 'attendance',
                    order: [['date', 'DESC']]
                },
                {
                    model: Assessment,
                    as: 'assessments',
                    include: [{ model: User, as: 'evaluator', attributes: ['id', 'name', 'role'] }]
                }
            ]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or not assigned to your supervision roster'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get student overview error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student details' });
    }
};

/**
 * Get assessments submitted by this university supervisor
 */
const getUniversityAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.findAll({
            where: {
                evaluatorId: req.user.id,
                schoolId: req.schoolId,
                evaluatorType: 'university'
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
        console.error('Get university assessments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch assessments' });
    }
};

/**
 * Submit academic assessment for an assigned student
 */
const submitUniversityAssessment = async (req, res) => {
    try {
        const { studentId, type, score, feedback, criteria } = req.body;

        if (!studentId || !type || score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'studentId, type, and score are required.'
            });
        }

        // Verify that the student is assigned to this university supervisor
        const student = await Student.findOne({
            where: {
                id: studentId,
                universitySupervisorId: req.user.id,
                schoolId: req.schoolId
            }
        });

        if (!student) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: student is not assigned to your supervision'
            });
        }

        const assessment = await Assessment.create({
            studentId,
            evaluatorId: req.user.id,
            schoolId: req.schoolId,
            type,
            evaluatorType: 'university',
            score: parseInt(score),
            feedback,
            criteria: criteria || {},
            status: 'submitted'
        });

        // Dispatch notification to student
        try {
            await notifyAssessmentSubmitted({
                studentUserId: student.userId,
                evaluatorName: req.user.name,
                type: `${type.toUpperCase()} (University)`,
                schoolId: req.schoolId
            });
        } catch (notifErr) {
            console.error('Failed to dispatch university assessment notification:', notifErr.message);
        }

        res.status(201).json({
            success: true,
            message: 'Academic assessment submitted successfully.',
            data: assessment
        });
    } catch (error) {
        console.error('Submit university assessment error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit academic assessment' });
    }
};

module.exports = {
    getMyStudents,
    getStudentOverview,
    getUniversityAssessments,
    submitUniversityAssessment
};
