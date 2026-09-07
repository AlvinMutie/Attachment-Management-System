const { Student, User, Logbook, Attendance, Assessment, Meeting } = require('../models');
const { notifyAssessmentSubmitted } = require('../services/notificationService');
const academicPolicyService = require('../services/academicPolicyService');

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

/**
 * Get Unified University Supervisor Workspace
 * Returns academic oversight summary, actionable intervention queue, and cohort academic compliance matrix.
 */
const getUniversityWorkspace = async (req, res) => {
    try {
        const policy = academicPolicyService.getAcademicPolicy(req.schoolId);

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

        const actionQueue = [];
        let completedVisitsCount = 0;
        let pendingVisitsCount = 0;
        let pendingAssessmentsCount = 0;
        let atRiskCount = 0;

        const studentRoster = students.map(student => {
            const attStats = academicPolicyService.calculateAttendance(student.attendance || [], policy);
            const readiness = academicPolicyService.evaluateCompletionReadiness(student, policy);
            const logbooks = student.logbooks || [];
            const approvedLogs = logbooks.filter(l => l.status === 'approved');
            const assessments = student.assessments || [];
            const uniEval = assessments.find(a => a.evaluatorType === 'university' && a.score !== null);
            const industryEval = assessments.find(a => a.evaluatorType === 'industry' && a.score !== null);
            const meetings = student.meetings || [];
            const conductedVisit = meetings.find(m => ['confirmed', 'completed'].includes(m.status));
            const upcomingVisit = meetings.find(m => new Date(m.scheduledAt) >= new Date() && m.status !== 'cancelled');

            if (conductedVisit) completedVisitsCount++;
            else pendingVisitsCount++;

            // Deadline calculations
            const msPerDay = 1000 * 60 * 60 * 24;
            const daysToEnd = student.endDate ? Math.round((new Date(student.endDate) - new Date()) / msPerDay) : null;
            const isUniAssessmentDue = !uniEval && daysToEnd !== null && daysToEnd <= policy.assessmentWindowDaysBeforeEnd;

            if (isUniAssessmentDue) {
                pendingAssessmentsCount++;
                actionQueue.push({
                    id: `SUBMIT_UNI_ASSESSMENT_${student.id}`,
                    studentId: student.id,
                    studentName: student.user?.name,
                    admissionNumber: student.admissionNumber,
                    priority: daysToEnd < 0 ? 'CRITICAL' : 'HIGH',
                    type: 'ASSESSMENT_DUE',
                    title: 'Submit University Academic Evaluation',
                    description: `Attachment ends on ${new Date(student.endDate).toLocaleDateString()} (${daysToEnd < 0 ? `${Math.abs(daysToEnd)} days overdue` : `${daysToEnd} days remaining`}).`,
                    link: '/university/assessments',
                    actionText: 'Grade Academic Assessment'
                });
            }

            // Check if supervision visit is needed
            if (!conductedVisit && !upcomingVisit && ['APPROVED', 'ACTIVE'].includes(student.placementStatus)) {
                actionQueue.push({
                    id: `SCHEDULE_VISIT_${student.id}`,
                    studentId: student.id,
                    studentName: student.user?.name,
                    admissionNumber: student.admissionNumber,
                    priority: 'MEDIUM',
                    type: 'SUPERVISION_REQUIRED',
                    title: 'Schedule Supervision Site Visit',
                    description: `Host organization: ${student.organizationName || 'Not Set'}. Schedule mandatory faculty visit.`,
                    link: '/university/meetings',
                    actionText: 'Schedule Visit'
                });
            }

            // Deficient attendance intervention
            if (attStats.isCritical) {
                atRiskCount++;
                actionQueue.push({
                    id: `ATTENDANCE_INTERVENTION_${student.id}`,
                    studentId: student.id,
                    studentName: student.user?.name,
                    admissionNumber: student.admissionNumber,
                    priority: 'CRITICAL',
                    type: 'ACADEMIC_DEFICIENCY',
                    title: 'Critical Attendance Deficiency Alert',
                    description: `Attendance compliance is ${attStats.rate}% (below critical ${policy.criticalAttendancePercentage}% threshold).`,
                    link: '/university/dashboard',
                    actionText: 'Investigate'
                });
            }

            return {
                id: student.id,
                name: student.user?.name,
                email: student.user?.email,
                admissionNumber: student.admissionNumber,
                course: student.course || student.department,
                department: student.department,
                organizationName: student.organizationName,
                startDate: student.startDate,
                endDate: student.endDate,
                placementStatus: student.placementStatus,
                industrySupervisor: student.industrySupervisor,
                attendance: attStats,
                logbooksSummary: {
                    total: logbooks.length,
                    approved: approvedLogs.length
                },
                supervision: {
                    conducted: Boolean(conductedVisit),
                    visitDate: conductedVisit ? conductedVisit.scheduledAt : (upcomingVisit ? upcomingVisit.scheduledAt : null),
                    status: conductedVisit ? 'conducted' : (upcomingVisit ? 'scheduled' : 'pending')
                },
                assessments: {
                    universitySubmitted: Boolean(uniEval),
                    universityScore: uniEval ? uniEval.score : null,
                    industrySubmitted: Boolean(industryEval),
                    industryScore: industryEval ? industryEval.score : null,
                    isDue: isUniAssessmentDue
                },
                readiness
            };
        });

        const metricsObj = {
            totalStudents: students.length,
            totalAssigned: students.length,
            activeAttachments: students.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus)).length,
            activePlacements: students.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus)).length,
            completedVisitsCount,
            pendingVisitsCount,
            completedAssessments: students.flatMap(s => s.assessments || []).filter(a => a.score !== null).length,
            pendingAssessmentsCount,
            atRiskCount
        };

        res.json({
            success: true,
            data: {
                metrics: metricsObj,
                summary: metricsObj,
                actionQueue,
                students: studentRoster
            }
        });
    } catch (error) {
        console.error('Get university workspace error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch university workspace' });
    }
};

module.exports = {
    getMyStudents,
    getStudentOverview,
    getUniversityAssessments,
    submitUniversityAssessment,
    getUniversityWorkspace
};
