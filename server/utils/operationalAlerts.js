const { Student, User, Attendance, Logbook, Assessment } = require('../models');
const { Op } = require('sequelize');

/**
 * Deterministic Operational Alert Rules Engine (Rule-based, NO AI/ML)
 */

/**
 * Evaluate operational alerts for an individual student
 * @param {Object} student - Student instance with associations
 * @returns {Array} alerts - List of alert objects
 */
const evaluateStudentAlerts = (student) => {
    const alerts = [];
    const now = new Date();

    // 1. Placement Approval Alert
    if (student.placementStatus === 'PENDING_APPROVAL') {
        const submittedAt = new Date(student.updatedAt || student.createdAt);
        const daysPending = Math.floor((now - submittedAt) / (1000 * 60 * 60 * 24));
        if (daysPending >= 3) {
            alerts.push({
                type: 'PENDING_PLACEMENT_APPROVAL',
                severity: daysPending >= 7 ? 'CRITICAL' : 'WARNING',
                title: 'Pending Placement Approval',
                description: `Placement application submitted ${daysPending} days ago is still awaiting administrator review.`,
                recommendedAction: 'Review and approve/reject placement application.',
                studentId: student.id,
                studentName: student.user?.name || 'Unknown Student',
                admissionNumber: student.admissionNumber
            });
        }
    }

    // 2. Attendance Warning (< 75% or >= 3 absences)
    if (['APPROVED', 'ACTIVE'].includes(student.placementStatus)) {
        const attendanceList = student.attendance || [];
        if (attendanceList.length > 0) {
            const presentOrLate = attendanceList.filter(a => ['present', 'late'].includes(a.status)).length;
            const absentCount = attendanceList.filter(a => a.status === 'absent').length;
            const attendanceRate = Math.round((presentOrLate / attendanceList.length) * 100);

            if (attendanceRate < 75 || absentCount >= 3) {
                alerts.push({
                    type: 'ATTENDANCE_RISK',
                    severity: attendanceRate < 60 || absentCount >= 5 ? 'CRITICAL' : 'WARNING',
                    title: 'Low Attendance Alert',
                    description: `Attendance rate is ${attendanceRate}% (${absentCount} absence${absentCount === 1 ? '' : 's'} recorded). Minimum threshold is 75%.`,
                    recommendedAction: 'Verify presence with industry supervisor and issue attendance notice.',
                    studentId: student.id,
                    studentName: student.user?.name || 'Unknown Student',
                    admissionNumber: student.admissionNumber,
                    metrics: { attendanceRate, totalRecords: attendanceList.length, absentCount }
                });
            }
        }

        // 3. Logbook Submission & Review Alerts
        const logbooks = student.logbooks || [];
        const pendingReviews = logbooks.filter(l => l.status === 'pending').length;
        if (pendingReviews >= 2) {
            alerts.push({
                type: 'UNREVIEWED_LOGBOOKS',
                severity: 'WARNING',
                title: 'Unreviewed Logbook Submissions',
                description: `${pendingReviews} weekly logbook submissions are pending supervisor review.`,
                recommendedAction: 'Notify industry supervisor to complete pending logbook reviews.',
                studentId: student.id,
                studentName: student.user?.name || 'Unknown Student',
                admissionNumber: student.admissionNumber
            });
        }

        // 4. Milestone Assessment & Approaching Completion Alerts
        if (student.endDate) {
            const endDate = new Date(student.endDate);
            const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

            if (daysRemaining <= 14 && daysRemaining >= 0) {
                const assessments = student.assessments || [];
                const hasIndustryEval = assessments.some(a => a.evaluatorType === 'industry');
                const hasUniversityEval = assessments.some(a => a.evaluatorType === 'university');

                if (!hasIndustryEval || !hasUniversityEval) {
                    alerts.push({
                        type: 'MISSING_ASSESSMENT',
                        severity: daysRemaining <= 7 ? 'CRITICAL' : 'WARNING',
                        title: 'Missing Required Assessment',
                        description: `Attachment ends in ${daysRemaining} days. Missing: ${!hasIndustryEval ? 'Industry Assessment' : ''} ${!hasIndustryEval && !hasUniversityEval ? 'and ' : ''}${!hasUniversityEval ? 'University Assessment' : ''}.`,
                        recommendedAction: 'Request immediate submission of final evaluation assessments.',
                        studentId: student.id,
                        studentName: student.user?.name || 'Unknown Student',
                        admissionNumber: student.admissionNumber
                    });
                } else {
                    alerts.push({
                        type: 'APPROACHING_COMPLETION',
                        severity: 'INFO',
                        title: 'Attachment Approaching Completion',
                        description: `Attachment period concludes in ${daysRemaining} days on ${student.endDate}.`,
                        recommendedAction: 'Prepare final completion sign-off and certificate issuance.',
                        studentId: student.id,
                        studentName: student.user?.name || 'Unknown Student',
                        admissionNumber: student.admissionNumber
                    });
                }
            }
        }

        // 5. Unassigned Supervisors Alert
        if (!student.industrySupervisorId || !student.universitySupervisorId) {
            const missing = [];
            if (!student.industrySupervisorId) missing.push('Industry Supervisor');
            if (!student.universitySupervisorId) missing.push('University Supervisor');

            alerts.push({
                type: 'UNASSIGNED_SUPERVISOR',
                severity: 'WARNING',
                title: 'Incomplete Supervisor Assignment',
                description: `Student is missing assigned ${missing.join(' and ')}.`,
                recommendedAction: 'Assign designated supervisors via Administrator Console.',
                studentId: student.id,
                studentName: student.user?.name || 'Unknown Student',
                admissionNumber: student.admissionNumber
            });
        }
    }

    return alerts;
};

/**
 * Get all operational alerts for an entire school
 * @param {string} schoolId
 * @returns {Object} alertSummary
 */
const getInstitutionalOperationalAlerts = async (schoolId) => {
    const students = await Student.findAll({
        where: { schoolId },
        include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
            { model: Attendance, as: 'attendance', attributes: ['id', 'status', 'date'] },
            { model: Logbook, as: 'logbooks', attributes: ['id', 'weekNumber', 'status', 'createdAt'] },
            { model: Assessment, as: 'assessments', attributes: ['id', 'type', 'evaluatorType', 'score'] }
        ]
    });

    const allAlerts = [];
    for (const student of students) {
        const studentAlerts = evaluateStudentAlerts(student);
        allAlerts.push(...studentAlerts);
    }

    const criticalCount = allAlerts.filter(a => a.severity === 'CRITICAL').length;
    const warningCount = allAlerts.filter(a => a.severity === 'WARNING').length;
    const infoCount = allAlerts.filter(a => a.severity === 'INFO').length;

    return {
        summary: {
            total: allAlerts.length,
            critical: criticalCount,
            warning: warningCount,
            info: infoCount
        },
        alerts: allAlerts
    };
};

module.exports = {
    evaluateStudentAlerts,
    getInstitutionalOperationalAlerts
};
