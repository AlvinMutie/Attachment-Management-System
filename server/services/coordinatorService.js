const { Student, User, School, Attendance, Logbook, Assessment, Meeting, SupervisorAssignment, Organization, sequelize } = require('../models');
const { Op } = require('sequelize');
const { getInstitutionalOperationalAlerts, evaluateStudentAlerts } = require('../utils/operationalAlerts');
const { notifySupervisorAssigned, notifySupervisorReassigned } = require('./notificationService');
const { logAudit } = require('../utils/auditLogger');
const academicPolicyService = require('./academicPolicyService');

/**
 * Deterministic Completion Readiness Evaluator
 * Delegates to centralized academicPolicyService for authoritative cross-system consistency.
 */
const evaluateCompletionReadiness = (student) => {
    return academicPolicyService.evaluateCompletionReadiness(student);
};

/**
 * Get Comprehensive Coordinator Dashboard Metrics
 */
const getCoordinatorDashboardMetrics = async (schoolId) => {
    const totalStudents = await Student.count({ where: { schoolId } });
    const pendingPlacements = await Student.count({ where: { schoolId, placementStatus: 'PENDING_APPROVAL' } });
    const approvedPlacements = await Student.count({ where: { schoolId, placementStatus: 'APPROVED' } });
    const activeAttachments = await Student.count({
        where: {
            schoolId,
            placementStatus: { [Op.in]: ['APPROVED', 'ACTIVE'] }
        }
    });

    const unassignedIndustry = await Student.count({
        where: { schoolId, industrySupervisorId: null }
    });
    const unassignedUniversity = await Student.count({
        where: { schoolId, universitySupervisorId: null }
    });
    const unassignedStudents = await Student.count({
        where: {
            schoolId,
            [Op.or]: [{ industrySupervisorId: null }, { universitySupervisorId: null }]
        }
    });

    const pendingSupervision = await Meeting.count({
        where: { schoolId, status: 'pending' }
    });

    // Compute upcoming completions (end date within 14 days)
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const nowStr = now.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksLater.toISOString().split('T')[0];

    const upcomingCompletions = await Student.count({
        where: {
            schoolId,
            placementStatus: { [Op.in]: ['APPROVED', 'ACTIVE'] },
            endDate: { [Op.between]: [nowStr, twoWeeksStr] }
        }
    });

    // Fetch students with records to calculate completion readiness totals
    const allStudents = await Student.findAll({
        where: { schoolId },
        include: [
            { model: Attendance, as: 'attendance', attributes: ['status'] },
            { model: Logbook, as: 'logbooks', attributes: ['status'] },
            { model: Assessment, as: 'assessments', attributes: ['evaluatorType', 'score'] },
            { model: Meeting, as: 'meetings', attributes: ['status'] }
        ]
    });

    let completionReadyCount = 0;
    let completionBlockedCount = 0;

    allStudents.forEach(s => {
        const evalRes = evaluateCompletionReadiness(s);
        if (evalRes.ready) {
            completionReadyCount++;
        } else if (['APPROVED', 'ACTIVE'].includes(s.placementStatus)) {
            completionBlockedCount++;
        }
    });

    const alertsData = await getInstitutionalOperationalAlerts(schoolId);

    return {
        totalStudents,
        pendingPlacements,
        approvedPlacements,
        activeAttachments,
        unassignedStudents,
        unassignedIndustry,
        unassignedUniversity,
        pendingSupervision,
        upcomingCompletions,
        completionReady: completionReadyCount,
        completionBlocked: completionBlockedCount,
        alertsSummary: alertsData.summary
    };
};

/**
 * Get Prioritized Attention Queue for Coordinator
 */
const getPrioritizedAttentionQueue = async (schoolId) => {
    const alertsData = await getInstitutionalOperationalAlerts(schoolId);
    const alerts = alertsData.alerts || [];

    // Sort order: CRITICAL -> WARNING -> INFO
    const severityWeight = { CRITICAL: 1, WARNING: 2, INFO: 3 };
    const sortedAlerts = [...alerts].sort((a, b) => {
        const weightA = severityWeight[a.severity] || 99;
        const weightB = severityWeight[b.severity] || 99;
        return weightA - weightB;
    });

    return {
        summary: alertsData.summary,
        queue: sortedAlerts
    };
};

/**
 * Assign or Reassign a Supervisor with Historical Tracking & Notifications
 */
const assignSupervisorWithHistory = async ({
    schoolId,
    studentId,
    supervisorId,
    type, // 'industry' or 'university'
    assignedBy, // Coordinator or Admin User ID
    reason = 'Initial supervisor assignment'
}) => {
    const transaction = await sequelize.transaction();
    try {
        if (!['industry', 'university'].includes(type)) {
            throw { status: 400, message: "Type must be 'industry' or 'university'" };
        }

        const student = await Student.findOne({
            where: { id: studentId, schoolId },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        }, { transaction });

        if (!student) {
            throw { status: 404, message: 'Student record not found in this school' };
        }

        const expectedRole = type === 'industry' ? 'industry_supervisor' : 'university_supervisor';
        const newSupervisor = await User.findOne({
            where: { id: supervisorId, schoolId, role: expectedRole }
        }, { transaction });

        if (!newSupervisor) {
            throw { status: 404, message: `Supervisor not found or not registered as a ${expectedRole} in this school` };
        }

        const currentSupervisorId = type === 'industry' ? student.industrySupervisorId : student.universitySupervisorId;
        const isReassignment = Boolean(currentSupervisorId && currentSupervisorId !== supervisorId);
        let previousSupervisor = null;

        if (isReassignment) {
            previousSupervisor = await User.findByPk(currentSupervisorId, { transaction });

            // Close previous active assignment record
            await SupervisorAssignment.update(
                {
                    endedAt: new Date(),
                    status: 'reassigned'
                },
                {
                    where: {
                        studentId: student.id,
                        supervisorType: type,
                        status: 'active'
                    },
                    transaction
                }
            );
        }

        // Create new active SupervisorAssignment history entry
        const assignmentRecord = await SupervisorAssignment.create({
            schoolId,
            studentId: student.id,
            supervisorId: newSupervisor.id,
            supervisorType: type,
            assignedBy,
            assignedAt: new Date(),
            reason,
            status: 'active'
        }, { transaction });

        // Update Student model current supervisor foreign key
        if (type === 'industry') {
            await student.update({ industrySupervisorId: newSupervisor.id }, { transaction });
        } else {
            await student.update({ universitySupervisorId: newSupervisor.id }, { transaction });
        }

        await transaction.commit();

        // Dispatch notifications asynchronously
        try {
            if (isReassignment) {
                await notifySupervisorReassigned({
                    studentUserId: student.userId,
                    studentName: student.user?.name || 'Student',
                    oldSupervisorUserId: currentSupervisorId,
                    newSupervisorUserId: newSupervisor.id,
                    supervisorRole: expectedRole,
                    newSupervisorName: newSupervisor.name,
                    reason,
                    schoolId
                });
            } else {
                await notifySupervisorAssigned({
                    studentUserId: student.userId,
                    supervisorUserId: newSupervisor.id,
                    supervisorRole: expectedRole,
                    supervisorName: newSupervisor.name,
                    schoolId
                });
            }
        } catch (notifErr) {
            console.error('Failed to dispatch supervisor assignment notification:', notifErr.message);
        }

        // Log audit
        try {
            await logAudit({
                userId: assignedBy,
                action: isReassignment ? 'REASSIGN_SUPERVISOR' : 'ASSIGN_SUPERVISOR',
                targetType: 'Student',
                targetId: student.id,
                metadata: {
                    type,
                    supervisorId: newSupervisor.id,
                    supervisorName: newSupervisor.name,
                    previousSupervisorId: currentSupervisorId,
                    reason
                },
                schoolId
            });
        } catch (auditErr) {
            console.error('Failed to log supervisor assignment audit:', auditErr.message);
        }

        return {
            success: true,
            isReassignment,
            assignment: assignmentRecord,
            student
        };
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        throw error;
    }
};

/**
 * Get Supervisor Workload Matrix with Capacity Indicators
 */
const getSupervisorWorkloadMatrix = async (schoolId) => {
    const supervisors = await User.findAll({
        where: {
            schoolId,
            role: { [Op.in]: ['industry_supervisor', 'university_supervisor'] }
        },
        attributes: ['id', 'name', 'email', 'role'],
        order: [['role', 'ASC'], ['name', 'ASC']]
    });

    const workloadList = [];

    for (const sup of supervisors) {
        const isUni = sup.role === 'university_supervisor';
        const assignedStudents = await Student.findAll({
            where: isUni ? { universitySupervisorId: sup.id } : { industrySupervisorId: sup.id },
            attributes: ['id', 'placementStatus']
        });

        const studentIds = assignedStudents.map(s => s.id);
        const activeCount = assignedStudents.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus)).length;
        const completedCount = assignedStudents.filter(s => s.placementStatus === 'COMPLETED').length;

        let pendingLogbooks = 0;
        if (!isUni && studentIds.length > 0) {
            pendingLogbooks = await Logbook.count({
                where: {
                    studentId: { [Op.in]: studentIds },
                    status: 'pending'
                }
            });
        }

        const completedAssessments = await Assessment.count({
            where: { evaluatorId: sup.id }
        });

        let pendingSupervisionMeetings = 0;
        if (isUni) {
            pendingSupervisionMeetings = await Meeting.count({
                where: {
                    initiatorId: sup.id,
                    status: 'pending'
                }
            });
        }

        workloadList.push({
            id: sup.id,
            name: sup.name,
            email: sup.email,
            role: sup.role,
            assignedStudentsCount: assignedStudents.length,
            activeStudentsCount: activeCount,
            completedStudentsCount: completedCount,
            pendingLogbooksCount: pendingLogbooks,
            completedAssessmentsCount: completedAssessments,
            pendingSupervisionCount: pendingSupervisionMeetings,
            workloadStatus: assignedStudents.length > 15 ? 'HIGH' : assignedStudents.length > 8 ? 'MODERATE' : 'NORMAL'
        });
    }

    return workloadList;
};

module.exports = {
    evaluateCompletionReadiness,
    getCoordinatorDashboardMetrics,
    getPrioritizedAttentionQueue,
    assignSupervisorWithHistory,
    getSupervisorWorkloadMatrix
};
