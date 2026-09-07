const { Logbook, Student, User, Attendance, Assessment } = require('../models');
const { refineSummary } = require('../services/aiService');
const { Op } = require('sequelize');

/**
 * Get student profile with placement and supervisor details
 */
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { userId: req.user.id },
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
                    model: User,
                    as: 'universitySupervisor',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get student profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student profile' });
    }
};

/**
 * Submit / update student attachment placement application
 */
const updateStudentPlacement = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // Students cannot modify placement once APPROVED or ACTIVE or COMPLETED unless school admin reopens it
        if (['APPROVED', 'ACTIVE', 'COMPLETED'].includes(student.placementStatus)) {
            return res.status(400).json({
                success: false,
                message: `Cannot update placement in ${student.placementStatus} status without administrative approval.`
            });
        }

        const {
            course,
            yearOfStudy,
            phone,
            organizationName,
            organizationAddress,
            organizationPhone,
            organizationEmail,
            contactPerson,
            startDate,
            endDate,
            submitForApproval = false
        } = req.body;

        // Basic date validation
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be after end date.'
            });
        }

        const newStatus = submitForApproval ? 'PENDING_APPROVAL' : (student.placementStatus === 'REJECTED' ? 'DRAFT' : student.placementStatus || 'DRAFT');

        await student.update({
            course: course !== undefined ? course : student.course,
            yearOfStudy: yearOfStudy !== undefined ? yearOfStudy : student.yearOfStudy,
            phone: phone !== undefined ? phone : student.phone,
            organizationName: organizationName !== undefined ? organizationName : student.organizationName,
            organizationAddress: organizationAddress !== undefined ? organizationAddress : student.organizationAddress,
            organizationPhone: organizationPhone !== undefined ? organizationPhone : student.organizationPhone,
            organizationEmail: organizationEmail !== undefined ? organizationEmail : student.organizationEmail,
            contactPerson: contactPerson !== undefined ? contactPerson : student.contactPerson,
            startDate: startDate !== undefined ? startDate : student.startDate,
            endDate: endDate !== undefined ? endDate : student.endDate,
            placementStatus: newStatus,
            rejectionReason: submitForApproval ? null : student.rejectionReason
        });

        res.json({
            success: true,
            message: submitForApproval ? 'Placement application submitted for approval.' : 'Placement details saved successfully.',
            data: student
        });
    } catch (error) {
        console.error('Update student placement error:', error);
        res.status(500).json({ success: false, message: 'Failed to update placement details' });
    }
};

/**
 * Get comprehensive attachment progress metrics for the student
 */
const getStudentProgress = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // Attendance stats
        const totalAttendance = await Attendance.count({ where: { studentId: student.id } });
        const presentCount = await Attendance.count({
            where: {
                studentId: student.id,
                status: { [Op.in]: ['present', 'late'] }
            }
        });

        // Logbook stats
        const totalLogbooks = await Logbook.count({ where: { studentId: student.id } });
        const approvedLogbooks = await Logbook.count({ where: { studentId: student.id, status: 'approved' } });
        const pendingLogbooks = await Logbook.count({ where: { studentId: student.id, status: 'pending' } });
        const rejectedLogbooks = await Logbook.count({ where: { studentId: student.id, status: 'rejected' } });

        // Assessments
        const assessments = await Assessment.findAll({
            where: { studentId: student.id },
            attributes: ['id', 'type', 'evaluatorType', 'score', 'status', 'createdAt']
        });

        // Day metrics calculation
        let totalDays = 0;
        let daysCompleted = 0;
        let daysRemaining = 0;

        if (student.startDate && student.endDate) {
            const start = new Date(student.startDate);
            const end = new Date(student.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const msPerDay = 1000 * 60 * 60 * 24;
            totalDays = Math.max(1, Math.round((end - start) / msPerDay) + 1);

            if (today < start) {
                daysCompleted = 0;
                daysRemaining = totalDays;
            } else if (today >= end) {
                daysCompleted = totalDays;
                daysRemaining = 0;
            } else {
                daysCompleted = Math.max(0, Math.round((today - start) / msPerDay));
                daysRemaining = Math.max(0, totalDays - daysCompleted);
            }
        }

        const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

        res.json({
            success: true,
            data: {
                placementStatus: student.placementStatus,
                startDate: student.startDate,
                endDate: student.endDate,
                totalDays,
                daysCompleted,
                daysRemaining,
                attendance: {
                    totalRecords: totalAttendance,
                    presentCount,
                    attendanceRate
                },
                logbooks: {
                    total: totalLogbooks,
                    approved: approvedLogbooks,
                    pending: pendingLogbooks,
                    rejected: rejectedLogbooks
                },
                assessments: {
                    total: assessments.length,
                    records: assessments
                },
                hasIndustrySupervisor: !!student.industrySupervisorId,
                hasUniversitySupervisor: !!student.universitySupervisorId
            }
        });
    } catch (error) {
        console.error('Get student progress error:', error);
        res.status(500).json({ success: false, message: 'Failed to compute progress metrics' });
    }
};

/**
 * Get student's attendance history
 */
const getStudentAttendance = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const attendance = await Attendance.findAll({
            where: { studentId: student.id },
            order: [['date', 'DESC']]
        });

        res.json({
            success: true,
            data: attendance
        });
    } catch (error) {
        console.error('Get student attendance error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance history' });
    }
};

/**
 * Record student check-in
 */
const recordStudentCheckIn = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const today = new Date().toISOString().split('T')[0];

        // Check if attendance already recorded today
        const existingAttendance = await Attendance.findOne({
            where: {
                studentId: student.id,
                date: today
            }
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: `Attendance already recorded for today (${existingAttendance.status}).`,
                data: existingAttendance
            });
        }

        const { notes, verificationMethod = 'manual' } = req.body;

        const record = await Attendance.create({
            studentId: student.id,
            schoolId: req.schoolId,
            date: today,
            timestamp: new Date(),
            status: 'present',
            scannedBy: req.user.id,
            verificationMethod,
            notes: notes || null
        });

        res.status(201).json({
            success: true,
            message: 'Check-in recorded successfully for today.',
            data: record
        });
    } catch (error) {
        console.error('Record student check-in error:', error);
        res.status(500).json({ success: false, message: 'Failed to record check-in' });
    }
};

/**
 * Get student's assessments
 */
const getStudentAssessments = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const assessments = await Assessment.findAll({
            where: { studentId: student.id },
            include: [
                {
                    model: User,
                    as: 'evaluator',
                    attributes: ['id', 'name', 'email', 'role']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: assessments
        });
    } catch (error) {
        console.error('Get student assessments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch assessments' });
    }
};

/**
 * Submit a weekly logbook
 */
const submitLogbook = async (req, res) => {
    try {
        const { weekNumber, startDate, endDate, summary, dailyEntries } = req.body;
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        if (!weekNumber || !startDate || !endDate || !summary) {
            return res.status(400).json({
                success: false,
                message: 'Week number, start date, end date, and summary are required.'
            });
        }

        // Process attachments
        const attachments = req.files ? req.files.map(file => ({
            url: `/uploads/logbooks/${file.filename}`,
            name: file.originalname,
            type: file.mimetype
        })) : [];

        let parsedDailyEntries = {};
        if (dailyEntries) {
            try {
                parsedDailyEntries = typeof dailyEntries === 'string' ? JSON.parse(dailyEntries) : dailyEntries;
            } catch (e) {
                parsedDailyEntries = {};
            }
        }

        const logbook = await Logbook.create({
            studentId: student.id,
            schoolId: req.schoolId,
            weekNumber: parseInt(weekNumber),
            startDate,
            endDate,
            summary,
            dailyEntries: parsedDailyEntries,
            attachments,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Logbook submitted successfully',
            data: logbook
        });
    } catch (error) {
        console.error('Submit logbook error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit logbook' });
    }
};

/**
 * Get student's logbooks
 */
const getMyLogbooks = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const logbooks = await Logbook.findAll({
            where: { studentId: student.id },
            order: [['weekNumber', 'DESC']]
        });

        res.json({
            success: true,
            data: logbooks
        });
    } catch (error) {
        console.error('Get my logbooks error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch logbooks' });
    }
};

/**
 * AI Refine a logbook summary
 */
const refineLogbookSummary = async (req, res) => {
    try {
        const { summary } = req.body;
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const refinedDraft = await refineSummary(summary, { department: student.department });

        res.json({
            success: true,
            data: {
                original: summary,
                refined: refinedDraft
            }
        });
    } catch (error) {
        console.error('Refine summary error detailed:', {
            error: error.message,
            stack: error.stack,
            userId: req.user.id
        });
        res.status(500).json({ success: false, message: `AI Refinement failed: ${error.message}` });
    }
};

module.exports = {
    getStudentProfile,
    updateStudentPlacement,
    getStudentProgress,
    getStudentAttendance,
    recordStudentCheckIn,
    getStudentAssessments,
    submitLogbook,
    getMyLogbooks,
    refineLogbookSummary
};
