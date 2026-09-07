const academicPolicyService = require('./academicPolicyService');

/**
 * Deterministic Insight Engine
 * Generates transparent, rule-based operational and academic insights for students, supervisors, and coordinators.
 * Every insight contains: type, severity, title, reason, evidence, generatedAt, and subject.
 */

/**
 * Generate insights for a single student instance
 * @param {Object} student - Student instance with associations
 * @param {Object} [policy] - Academic policy object
 * @returns {Array<Object>} List of structured insights
 */
const generateStudentInsights = (student, policy = academicPolicyService.DEFAULT_ACADEMIC_POLICY) => {
    const insights = [];
    const now = new Date();
    const generatedAt = now.toISOString();
    const subject = {
        studentId: student.id,
        name: student.user?.name || 'Student',
        admissionNumber: student.admissionNumber
    };

    // 1. Attendance Insights
    const attStats = academicPolicyService.calculateAttendance(student.attendance || [], policy);
    if (attStats.totalRecords > 0) {
        if (attStats.isCritical) {
            insights.push({
                type: 'LOW_ATTENDANCE',
                severity: 'CRITICAL',
                title: 'Critical Attendance Deficiency',
                reason: `Attendance rate of ${attStats.rate}% is severely below the institutional critical threshold (${policy.criticalAttendancePercentage}%).`,
                evidence: {
                    rate: attStats.rate,
                    presentCount: attStats.presentCount,
                    totalRecords: attStats.totalRecords,
                    threshold: policy.criticalAttendancePercentage
                },
                actionUrl: '/attendance',
                actionText: 'Review Attendance Logs',
                generatedAt,
                subject
            });
        } else if (attStats.isAtRisk) {
            insights.push({
                type: 'LOW_ATTENDANCE',
                severity: 'WARNING',
                title: 'Attendance Compliance At Risk',
                reason: `Attendance rate of ${attStats.rate}% is below the required 75% graduation compliance standard.`,
                evidence: {
                    rate: attStats.rate,
                    threshold: policy.minAttendancePercentage
                },
                actionUrl: '/attendance',
                actionText: 'Improve Attendance Rate',
                generatedAt,
                subject
            });
        }

        // Attendance Trend Detection (Comparing first half vs second half if >= 6 records)
        const records = student.attendance || [];
        if (records.length >= 6) {
            const midpoint = Math.floor(records.length / 2);
            const olderRecords = records.slice(0, midpoint);
            const recentRecords = records.slice(midpoint);

            const olderRate = Math.round((olderRecords.filter(r => ['present', 'late'].includes(r.status)).length / olderRecords.length) * 100);
            const recentRate = Math.round((recentRecords.filter(r => ['present', 'late'].includes(r.status)).length / recentRecords.length) * 100);

            if (olderRate - recentRate >= 15) {
                insights.push({
                    type: 'ATTENDANCE_DECLINE',
                    severity: 'WARNING',
                    title: 'Attendance Trend Declining',
                    reason: `Recent attendance rate (${recentRate}%) dropped by ${olderRate - recentRate}% compared to previous period (${olderRate}%).`,
                    evidence: {
                        previousRate: olderRate,
                        recentRate: recentRate,
                        dropPercentage: olderRate - recentRate
                    },
                    actionUrl: '/attendance',
                    actionText: 'Monitor Attendance',
                    generatedAt,
                    subject
                });
            }
        }
    } else if (['APPROVED', 'ACTIVE'].includes(student.placementStatus)) {
        insights.push({
            type: 'LOW_ATTENDANCE',
            severity: 'CRITICAL',
            title: 'No Verified Attendance Recorded',
            reason: 'Placement is active but student has zero verified presence check-ins.',
            evidence: { totalRecords: 0 },
            actionUrl: '/attendance',
            actionText: 'Record Daily Check-in',
            generatedAt,
            subject
        });
    }

    // 2. Logbook Insights
    const logbooks = student.logbooks || [];
    const rejectedLogbooks = logbooks.filter(l => l.status === 'rejected');
    const pendingLogbooks = logbooks.filter(l => l.status === 'pending');

    if (rejectedLogbooks.length >= 2) {
        insights.push({
            type: 'REPEATED_LOGBOOK_REVISION',
            severity: 'WARNING',
            title: 'Multiple Logbook Revisions Requested',
            reason: `${rejectedLogbooks.length} weekly logbook submissions were returned with supervisor revision notes.`,
            evidence: {
                rejectedCount: rejectedLogbooks.length,
                weeks: rejectedLogbooks.map(l => l.weekNumber)
            },
            actionUrl: '/student/logbooks',
            actionText: 'Revise Returned Logbooks',
            generatedAt,
            subject
        });
    }

    // 3. Deadline & Assessment Insights
    const deadlines = academicPolicyService.calculateDeadlines(student, policy);
    const assessments = student.assessments || [];
    const industryEval = assessments.find(a => a.evaluatorType === 'industry' && a.score !== null);
    const uniEval = assessments.find(a => a.evaluatorType === 'university' && a.score !== null);

    if (deadlines.isAssessmentWindowOpen && !industryEval && ['APPROVED', 'ACTIVE'].includes(student.placementStatus)) {
        insights.push({
            type: 'MISSING_ASSESSMENT',
            severity: deadlines.isOverdue ? 'CRITICAL' : 'HIGH',
            title: 'Final Industry Evaluation Required',
            reason: deadlines.isOverdue
                ? `Attachment ended on ${new Date(student.endDate).toLocaleDateString()} without final industry assessment.`
                : `Attachment concludes in ${deadlines.daysRemaining} days. Final industry evaluation is now due.`,
            evidence: {
                endDate: student.endDate,
                daysRemaining: deadlines.daysRemaining,
                isOverdue: deadlines.isOverdue
            },
            actionUrl: '/industry/assessments',
            actionText: 'Grade Assessment',
            generatedAt,
            subject
        });
    }

    if (deadlines.isAssessmentWindowOpen && !uniEval && ['APPROVED', 'ACTIVE'].includes(student.placementStatus)) {
        insights.push({
            type: 'MISSING_ASSESSMENT',
            severity: deadlines.isOverdue ? 'CRITICAL' : 'HIGH',
            title: 'Final Academic Assessment Required',
            reason: deadlines.isOverdue
                ? `Attachment ended on ${new Date(student.endDate).toLocaleDateString()} without university faculty evaluation.`
                : `Attachment concludes in ${deadlines.daysRemaining} days. University faculty assessment is due.`,
            evidence: {
                endDate: student.endDate,
                daysRemaining: deadlines.daysRemaining,
                isOverdue: deadlines.isOverdue
            },
            actionUrl: '/university/assessments',
            actionText: 'Grade Academic Evaluation',
            generatedAt,
            subject
        });
    }

    // 4. Supervision Gaps
    const meetings = student.meetings || [];
    const completedMeetings = meetings.filter(m => ['confirmed', 'completed'].includes(m.status));
    const upcomingMeetings = meetings.filter(m => new Date(m.scheduledAt) >= now && m.status !== 'cancelled');

    if (['APPROVED', 'ACTIVE'].includes(student.placementStatus) && completedMeetings.length === 0 && upcomingMeetings.length === 0) {
        if (deadlines.percentElapsed >= 50) {
            insights.push({
                type: 'SUPERVISION_OVERDUE',
                severity: 'WARNING',
                title: 'Mandatory Supervision Site Visit Unscheduled',
                reason: `Attachment is ${deadlines.percentElapsed}% elapsed with no faculty site visit conducted or scheduled.`,
                evidence: {
                    percentElapsed: deadlines.percentElapsed,
                    completedVisits: 0
                },
                actionUrl: '/coordinator/supervision',
                actionText: 'Schedule Site Visit',
                generatedAt,
                subject
            });
        }
    }

    // 5. Completion Blockers
    const readiness = academicPolicyService.evaluateCompletionReadiness(student, policy);
    if (!readiness.ready && readiness.blockers.length > 0 && deadlines.daysRemaining <= 14) {
        insights.push({
            type: 'COMPLETION_BLOCKER',
            severity: 'HIGH',
            title: 'Unsatisfied Graduation Prerequisites',
            reason: `Student has ${readiness.blockers.length} unresolved criteria blocking official completion approval.`,
            evidence: {
                readinessScore: readiness.score,
                blockers: readiness.blockers
            },
            actionUrl: '/student/dashboard',
            actionText: 'View Blockers Checklist',
            generatedAt,
            subject
        });
    }

    return insights;
};

/**
 * Generate cohort-wide prioritized insights for a school or supervisor cohort
 * @param {Array<Object>} students - List of student instances
 * @param {Object} [policy] - Academic policy object
 * @returns {Array<Object>}
 */
const generateCohortInsights = (students, policy = academicPolicyService.DEFAULT_ACADEMIC_POLICY) => {
    return students.flatMap(s => generateStudentInsights(s, policy));
};

module.exports = {
    generateStudentInsights,
    generateCohortInsights
};
