const academicPolicyService = require('./academicPolicyService');

/**
 * Explainable Operational Risk Scoring Service
 * Computes transparent, deterministic student risk scores (0–100) based strictly on authoritative policy criteria.
 * Every score includes an inspectable list of contributors, evidence, and actionable recommendations.
 */

/**
 * Compute the academic operational risk score for a student
 * @param {Object} student - Student instance with associations
 * @param {Object} [policy] - Academic policy object
 * @returns {Object} { score, level, contributors, recommendations }
 */
const calculateStudentRiskScore = (student, policy = academicPolicyService.DEFAULT_ACADEMIC_POLICY) => {
    let rawScore = 0;
    const contributors = [];
    const recommendations = [];

    if (!student || !['APPROVED', 'ACTIVE', 'PENDING_APPROVAL'].includes(student.placementStatus)) {
        return {
            score: 0,
            level: 'LOW',
            contributors: [],
            recommendations: ['Student placement is not active or is completed.']
        };
    }

    const attStats = academicPolicyService.calculateAttendance(student.attendance || [], policy);
    const deadlines = academicPolicyService.calculateDeadlines(student, policy);
    const logbooks = student.logbooks || [];
    const assessments = student.assessments || [];
    const meetings = student.meetings || [];

    // 1. Attendance Contributors
    if (attStats.totalRecords === 0) {
        rawScore += 35;
        contributors.push({
            factor: 'UNRECORDED_ATTENDANCE',
            points: 35,
            title: 'No Verified Attendance Recorded',
            description: 'No daily presence check-in records have been submitted.',
            evidence: { totalRecords: 0 }
        });
        recommendations.push('Prompt student to record daily QR check-ins.');
    } else if (attStats.isCritical) {
        rawScore += 35;
        contributors.push({
            factor: 'CRITICAL_ATTENDANCE_DEFICIENCY',
            points: 35,
            title: 'Critical Attendance Deficiency',
            description: `Attendance rate of ${attStats.rate}% is below critical threshold (${policy.criticalAttendancePercentage}%).`,
            evidence: { rate: attStats.rate, threshold: policy.criticalAttendancePercentage }
        });
        recommendations.push('Immediate coordinator intervention required regarding student presence.');
    } else if (attStats.isAtRisk) {
        rawScore += 20;
        contributors.push({
            factor: 'AT_RISK_ATTENDANCE',
            points: 20,
            title: 'Attendance Below Graduation Standard',
            description: `Attendance rate of ${attStats.rate}% is below the required 75% graduation standard.`,
            evidence: { rate: attStats.rate, threshold: policy.minAttendancePercentage }
        });
        recommendations.push('Encourage consistent daily attendance to recover compliance standing.');
    }

    // Attendance Trend
    const records = student.attendance || [];
    if (records.length >= 6) {
        const midpoint = Math.floor(records.length / 2);
        const olderRecords = records.slice(0, midpoint);
        const recentRecords = records.slice(midpoint);

        const olderRate = Math.round((olderRecords.filter(r => ['present', 'late'].includes(r.status)).length / olderRecords.length) * 100);
        const recentRate = Math.round((recentRecords.filter(r => ['present', 'late'].includes(r.status)).length / recentRecords.length) * 100);

        if (olderRate - recentRate >= 15) {
            rawScore += 15;
            contributors.push({
                factor: 'ATTENDANCE_DOWNWARD_TREND',
                points: 15,
                title: 'Attendance Downward Velocity',
                description: `Attendance declined by ${olderRate - recentRate}% in recent weeks.`,
                evidence: { previousRate: olderRate, recentRate: recentRate }
            });
            recommendations.push('Investigate potential workplace or transport issues causing recent absences.');
        }
    }

    // 2. Logbook Contributors
    const rejectedLogbooks = logbooks.filter(l => l.status === 'rejected');
    if (rejectedLogbooks.length > 0) {
        const points = Math.min(20, rejectedLogbooks.length * 10);
        rawScore += points;
        contributors.push({
            factor: 'REJECTED_LOGBOOKS',
            points,
            title: 'Logbook Revisions Outstanding',
            description: `${rejectedLogbooks.length} weekly logbooks were rejected and need student correction.`,
            evidence: { count: rejectedLogbooks.length }
        });
        recommendations.push('Student must revise and resubmit rejected logbooks with supervisor feedback.');
    }

    if (logbooks.length === 0 && deadlines.percentElapsed >= 25) {
        rawScore += 15;
        contributors.push({
            factor: 'NO_LOGBOOKS_SUBMITTED',
            points: 15,
            title: 'No Weekly Logbooks Logged',
            description: `Attachment is ${deadlines.percentElapsed}% elapsed with zero weekly reports.`,
            evidence: { totalLogbooks: 0 }
        });
        recommendations.push('Student must begin logging weekly workplace activities.');
    }

    // 3. Assessment Contributors
    const industryEval = assessments.find(a => a.evaluatorType === 'industry' && a.score !== null);
    const uniEval = assessments.find(a => a.evaluatorType === 'university' && a.score !== null);

    if (deadlines.isAssessmentWindowOpen) {
        if (!industryEval) {
            const pts = deadlines.isOverdue ? 20 : 10;
            rawScore += pts;
            contributors.push({
                factor: 'MISSING_INDUSTRY_ASSESSMENT',
                points: pts,
                title: 'Pending Final Industry Evaluation',
                description: deadlines.isOverdue ? 'Attachment ended without industry evaluation.' : 'Final industry evaluation is due.',
                evidence: { isOverdue: deadlines.isOverdue }
            });
            recommendations.push('Notify industry supervisor to submit student final evaluation.');
        }

        if (!uniEval) {
            const pts = deadlines.isOverdue ? 20 : 10;
            rawScore += pts;
            contributors.push({
                factor: 'MISSING_UNIVERSITY_ASSESSMENT',
                points: pts,
                title: 'Pending Faculty Assessment',
                description: deadlines.isOverdue ? 'Attachment ended without university faculty grading.' : 'University evaluation is due.',
                evidence: { isOverdue: deadlines.isOverdue }
            });
            recommendations.push('Remind assigned university supervisor to submit academic evaluation.');
        }
    }

    // 4. Supervision Visit Gaps
    const conductedVisit = meetings.find(m => ['confirmed', 'completed'].includes(m.status));
    const upcomingVisit = meetings.find(m => new Date(m.scheduledAt) >= new Date() && m.status !== 'cancelled');

    if (!conductedVisit && !upcomingVisit && deadlines.percentElapsed >= 50) {
        rawScore += 10;
        contributors.push({
            factor: 'SUPERVISION_VISIT_UNSCHEDULED',
            points: 10,
            title: 'Supervision Site Visit Gap',
            description: 'Halfway through attachment with no faculty site visit scheduled.',
            evidence: { percentElapsed: deadlines.percentElapsed }
        });
        recommendations.push('Schedule mandatory faculty on-site supervision visit.');
    }

    // Bound score between 0 and 100
    const finalScore = Math.min(100, Math.max(0, rawScore));

    let level = 'LOW';
    if (finalScore >= 80) level = 'CRITICAL';
    else if (finalScore >= 60) level = 'ELEVATED';
    else if (finalScore >= 30) level = 'MODERATE';

    if (recommendations.length === 0) {
        recommendations.push('Student is on track. Maintain current performance.');
    }

    return {
        score: finalScore,
        level,
        contributors,
        recommendations
    };
};

module.exports = {
    calculateStudentRiskScore
};
