const { Logbook, Student, User, Attendance, Assessment, Meeting } = require('../models');
const { refineSummary } = require('../services/aiService');
const { Op } = require('sequelize');
const { notifyPlacementSubmitted, notifyLogbookSubmitted } = require('../services/notificationService');
const academicPolicyService = require('../services/academicPolicyService');

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
 * Update student placement details & submit for approval
 */
const updateStudentPlacement = async (req, res) => {
    try {
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
            submitForApproval
        } = req.body;

        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // Students cannot modify placement once APPROVED or ACTIVE or COMPLETED without administrative approval
        if (['APPROVED', 'ACTIVE', 'COMPLETED'].includes(student.placementStatus)) {
            return res.status(400).json({
                success: false,
                message: `Cannot update placement in ${student.placementStatus} status without administrative approval.`
            });
        }

        // Validate date order if both are provided
        const effectiveStart = startDate || student.startDate;
        const effectiveEnd = endDate || student.endDate;
        if (effectiveStart && effectiveEnd && new Date(effectiveStart) > new Date(effectiveEnd)) {
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

        if (submitForApproval) {
            try {
                await notifyPlacementSubmitted({
                    studentUser: req.user,
                    placement: student,
                    schoolId: student.schoolId || req.schoolId
                });
            } catch (notifErr) {
                console.error('Failed to dispatch placement notification:', notifErr.message);
            }
        }

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

        // Dispatch notification to industry supervisor if assigned
        try {
            await notifyLogbookSubmitted({
                studentUser: req.user,
                logbook,
                industrySupervisorId: student.industrySupervisorId,
                schoolId: req.schoolId
            });
        } catch (notifErr) {
            console.error('Failed to dispatch logbook notification:', notifErr.message);
        }

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
 * Get unified Student Workspace
 * Aggregates attachment status, days tracker, action queue, lifecycle timeline, and completion readiness.
 */
const getStudentWorkspace = async (req, res) => {
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
                },
                {
                    model: Attendance,
                    as: 'attendance'
                },
                {
                    model: Logbook,
                    as: 'logbooks'
                },
                {
                    model: Assessment,
                    as: 'assessments'
                },
                {
                    model: Meeting,
                    as: 'meetings'
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const policy = academicPolicyService.getAcademicPolicy(student.schoolId || req.schoolId);

        // Day metrics calculation
        let totalDays = 0;
        let daysCompleted = 0;
        let daysRemaining = 0;
        let percentElapsed = 0;

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
                percentElapsed = 0;
            } else if (today >= end) {
                daysCompleted = totalDays;
                daysRemaining = 0;
                percentElapsed = 100;
            } else {
                daysCompleted = Math.max(0, Math.round((today - start) / msPerDay));
                daysRemaining = Math.max(0, totalDays - daysCompleted);
                percentElapsed = Math.round((daysCompleted / totalDays) * 100);
            }
        }

        // Compliance & Readiness evaluations
        const attendanceStats = academicPolicyService.calculateAttendance(student.attendance || [], policy);
        const readiness = academicPolicyService.evaluateCompletionReadiness(student, policy);
        const actionQueue = academicPolicyService.calculateStudentActionQueue(student, policy);
        const deadlines = academicPolicyService.calculateDeadlines(student, policy);

        // Chronological Lifecycle Timeline
        const timeline = [
            {
                id: 'PLACEMENT_SUBMITTED',
                title: 'Placement Submitted',
                date: student.createdAt,
                completed: student.placementStatus && student.placementStatus !== 'DRAFT',
                current: student.placementStatus === 'PENDING_APPROVAL'
            },
            {
                id: 'PLACEMENT_APPROVED',
                title: 'Placement Approved',
                date: student.placementStatus === 'APPROVED' || student.placementStatus === 'ACTIVE' ? student.updatedAt : null,
                completed: ['APPROVED', 'ACTIVE', 'COMPLETED'].includes(student.placementStatus),
                current: student.placementStatus === 'APPROVED' && !student.industrySupervisorId
            },
            {
                id: 'SUPERVISORS_ASSIGNED',
                title: 'Supervisors Assigned',
                date: (student.industrySupervisorId && student.universitySupervisorId) ? student.updatedAt : null,
                completed: Boolean(student.industrySupervisorId && student.universitySupervisorId),
                current: Boolean(student.industrySupervisorId || student.universitySupervisorId) && !(student.industrySupervisorId && student.universitySupervisorId)
            },
            {
                id: 'ATTACHMENT_STARTED',
                title: 'Attachment Started',
                date: student.startDate,
                completed: Boolean(student.startDate && new Date(student.startDate) <= new Date()),
                current: Boolean(student.startDate && new Date(student.startDate) <= new Date() && (student.attendance || []).length === 0)
            },
            {
                id: 'LOGBOOK_MILESTONE',
                title: 'Weekly Logbooks Approved',
                date: (student.logbooks || []).find(l => l.status === 'approved')?.updatedAt || null,
                completed: (student.logbooks || []).some(l => l.status === 'approved'),
                current: (student.logbooks || []).length > 0 && !(student.logbooks || []).some(l => l.status === 'approved')
            },
            {
                id: 'SUPERVISION_VISIT',
                title: 'Supervision Visit Conducted',
                date: (student.meetings || []).find(m => ['confirmed', 'completed'].includes(m.status))?.scheduledAt || null,
                completed: (student.meetings || []).some(m => ['confirmed', 'completed'].includes(m.status)),
                current: (student.meetings || []).some(m => m.status === 'pending')
            },
            {
                id: 'FINAL_EVALUATION',
                title: 'Final Assessments Graded',
                date: (student.assessments || []).find(a => a.score !== null)?.createdAt || null,
                completed: (student.assessments || []).length >= 2,
                current: (student.assessments || []).length === 1
            },
            {
                id: 'COMPLETION_SATISFIED',
                title: 'Attachment Completed',
                date: student.placementStatus === 'COMPLETED' ? student.updatedAt : null,
                completed: student.placementStatus === 'COMPLETED' || readiness.ready,
                current: readiness.ready && student.placementStatus !== 'COMPLETED'
            }
        ];

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    admissionNumber: student.admissionNumber,
                    course: student.course,
                    department: student.department,
                    placementStatus: student.placementStatus,
                    rejectionReason: student.rejectionReason,
                    organizationName: student.organizationName,
                    organizationAddress: student.organizationAddress,
                    organizationPhone: student.organizationPhone,
                    organizationEmail: student.organizationEmail,
                    contactPerson: student.contactPerson,
                    startDate: student.startDate,
                    endDate: student.endDate,
                    user: student.user,
                    industrySupervisor: student.industrySupervisor,
                    universitySupervisor: student.universitySupervisor
                },
                dates: {
                    startDate: student.startDate,
                    endDate: student.endDate,
                    totalDays,
                    daysCompleted,
                    daysRemaining,
                    percentElapsed
                },
                attendance: attendanceStats,
                readiness,
                actionQueue,
                deadlines,
                timeline,
                milestones: timeline,
                logbooksSummary: {
                    total: (student.logbooks || []).length,
                    approved: (student.logbooks || []).filter(l => l.status === 'approved').length,
                    pending: (student.logbooks || []).filter(l => l.status === 'pending').length,
                    rejected: (student.logbooks || []).filter(l => l.status === 'rejected').length
                },
                assessmentsSummary: {
                    total: (student.assessments || []).length,
                    industrySubmitted: (student.assessments || []).some(a => a.evaluatorType === 'industry'),
                    universitySubmitted: (student.assessments || []).some(a => a.evaluatorType === 'university')
                }
            }
        });
    } catch (error) {
        console.error('Get student workspace error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student workspace' });
    }
};

/**
 * Revise & Update a rejected weekly logbook
 */
const updateLogbook = async (req, res) => {
    try {
        const { id } = req.params;
        const { summary, dailyEntries } = req.body;

        const student = await Student.findOne({ where: { userId: req.user.id } });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const logbook = await Logbook.findOne({
            where: {
                id,
                studentId: student.id
            }
        });

        if (!logbook) {
            return res.status(404).json({ success: false, message: 'Logbook entry not found' });
        }

        // Students cannot edit approved logbooks
        if (logbook.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Approved logbooks are finalized and cannot be modified.'
            });
        }

        let parsedDailyEntries = logbook.dailyEntries;
        if (dailyEntries) {
            try {
                parsedDailyEntries = typeof dailyEntries === 'string' ? JSON.parse(dailyEntries) : dailyEntries;
            } catch (e) {
                parsedDailyEntries = logbook.dailyEntries;
            }
        }

        // Process new attachments if uploaded
        let newAttachments = logbook.attachments || [];
        if (req.files && req.files.length > 0) {
            const uploadedFiles = req.files.map(file => ({
                url: `/uploads/logbooks/${file.filename}`,
                name: file.originalname,
                type: file.mimetype
            }));
            newAttachments = [...newAttachments, ...uploadedFiles];
        }

        await logbook.update({
            summary: summary !== undefined ? summary : logbook.summary,
            dailyEntries: parsedDailyEntries,
            attachments: newAttachments,
            status: 'pending', // Resets to pending for supervisor review
            supervisorComment: null
        });

        // Notify supervisor of resubmission
        try {
            await notifyLogbookSubmitted({
                studentUser: req.user,
                logbook,
                industrySupervisorId: student.industrySupervisorId,
                schoolId: req.schoolId
            });
        } catch (notifErr) {
            console.error('Failed to dispatch logbook resubmission notification:', notifErr.message);
        }

        res.json({
            success: true,
            message: 'Logbook revised and resubmitted for supervisor review.',
            data: logbook
        });
    } catch (error) {
        console.error('Update logbook error:', error);
        res.status(500).json({ success: false, message: 'Failed to update logbook' });
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
    getStudentWorkspace,
    updateLogbook
};
