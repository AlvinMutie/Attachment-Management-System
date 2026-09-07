/**
 * Centralized Academic Policy & Compliance Service
 * Authoritative single source of truth for academic rules, attendance compliance thresholds,
 * logbook milestones, assessment requirements, deadline detection, and completion readiness.
 */

// Default Institutional Academic Policy Configuration
const DEFAULT_ACADEMIC_POLICY = {
    minAttendancePercentage: 75,
    criticalAttendancePercentage: 60,
    minApprovedLogbooks: 1,
    requireIndustryAssessment: true,
    requireUniversityAssessment: true,
    requireSupervisionVisit: true,
    assessmentWindowDaysBeforeEnd: 14,
    logbookReviewGracePeriodDays: 7
};

/**
 * Retrieve academic policy for a specific school tenant
 * (Enables future school-specific customization while providing instant defaults)
 */
const getAcademicPolicy = (schoolId = null) => {
    return { ...DEFAULT_ACADEMIC_POLICY };
};

/**
 * Centralized Attendance Compliance Calculator
 * @param {Array} attendanceRecords - Array of Attendance instances or raw objects
/**
 * Calculate attendance metrics from records or counts
 * @param {Array|number} attendanceRecordsOrPresent - Array of attendance records or number of present days
 * @param {Object|number} policyOrTotal - Academic policy object or total days count
 * @param {Object} [optionalPolicy] - Academic policy object if first two args were numbers
 * @returns {Object}
 */
const calculateAttendance = (attendanceRecordsOrPresent = [], policyOrTotal = DEFAULT_ACADEMIC_POLICY, optionalPolicy = DEFAULT_ACADEMIC_POLICY) => {
    let totalRecords = 0;
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let excusedCount = 0;
    let policy = DEFAULT_ACADEMIC_POLICY;

    if (typeof attendanceRecordsOrPresent === 'number') {
        presentCount = attendanceRecordsOrPresent;
        totalRecords = typeof policyOrTotal === 'number' ? policyOrTotal : presentCount;
        policy = optionalPolicy || DEFAULT_ACADEMIC_POLICY;
    } else if (Array.isArray(attendanceRecordsOrPresent)) {
        const records = attendanceRecordsOrPresent;
        totalRecords = records.length;
        policy = (typeof policyOrTotal === 'object' && policyOrTotal !== null) ? policyOrTotal : DEFAULT_ACADEMIC_POLICY;

        presentCount = records.filter(a => a.status === 'present').length;
        lateCount = records.filter(a => a.status === 'late').length;
        absentCount = records.filter(a => a.status === 'absent').length;
        excusedCount = records.filter(a => a.status === 'excused').length;
    }

    if (totalRecords === 0) {
        return {
            totalRecords: 0,
            presentCount: 0,
            lateCount: 0,
            absentCount: 0,
            excusedCount: 0,
            rate: 0,
            status: 'NO_RECORDS',
            isCompliant: false,
            isCritical: true,
            isAtRisk: true
        };
    }

    // Present + Late count towards positive attendance
    const positiveCount = presentCount + lateCount;
    const rate = Math.round((positiveCount / totalRecords) * 100);

    const isCompliant = rate >= policy.minAttendancePercentage;
    const isCritical = rate < policy.criticalAttendancePercentage;
    const isAtRisk = !isCompliant;

    let status = 'COMPLIANT';
    if (isCritical) {
        status = 'CRITICAL';
    } else if (isAtRisk) {
        status = 'AT_RISK';
    }

    return {
        totalRecords,
        presentCount,
        lateCount,
        absentCount,
        excusedCount,
        rate,
        status,
        isCompliant,
        isCritical,
        isAtRisk
    };
};

/**
 * Deterministic Completion Readiness Evaluator
 * Evaluates whether a student satisfies all 6 mandatory academic & operational milestones.
 * @param {Object} student - Student instance with associations
 * @param {Object} policy - Academic policy
 * @returns {Object} { ready, score, blockers, checklist }
 */
const evaluateCompletionReadiness = (student, policy = DEFAULT_ACADEMIC_POLICY) => {
    const blockers = [];
    const checklist = {
        placementApproved: false,
        industrySupervisorAssigned: false,
        universitySupervisorAssigned: false,
        attendanceThresholdMet: false,
        logbooksSubmittedAndReviewed: false,
        supervisionCompleted: false,
        industryAssessmentCompleted: false,
        universityAssessmentCompleted: false
    };

    // 1. Placement Status
    if (['APPROVED', 'ACTIVE', 'COMPLETED'].includes(student.placementStatus)) {
        checklist.placementApproved = true;
    } else {
        blockers.push(`Placement status is '${student.placementStatus || 'DRAFT'}' (must be approved or active)`);
    }

    // 2. Supervisors Assigned
    if (student.industrySupervisorId) {
        checklist.industrySupervisorAssigned = true;
    } else {
        blockers.push('Industry supervisor is not assigned');
    }

    if (student.universitySupervisorId) {
        checklist.universitySupervisorAssigned = true;
    } else {
        blockers.push('University supervisor is not assigned');
    }

    // 3. Attendance Compliance
    const attResult = calculateAttendance(student.attendance || [], policy);
    if (attResult.totalRecords > 0 && attResult.isCompliant) {
        checklist.attendanceThresholdMet = true;
    } else if (attResult.totalRecords === 0) {
        blockers.push('No verified attendance records logged');
    } else {
        blockers.push(`Attendance compliance is ${attResult.rate}% (minimum required threshold is ${policy.minAttendancePercentage}%)`);
    }

    // 4. Logbooks Progress
    const logbooks = student.logbooks || [];
    const approvedLogbooks = logbooks.filter(l => l.status === 'approved');
    const pendingLogbooks = logbooks.filter(l => l.status === 'pending');
    const rejectedLogbooks = logbooks.filter(l => l.status === 'rejected');

    if (approvedLogbooks.length >= policy.minApprovedLogbooks && pendingLogbooks.length === 0 && rejectedLogbooks.length === 0) {
        checklist.logbooksSubmittedAndReviewed = true;
    } else if (logbooks.length === 0) {
        blockers.push('No weekly logbook reports submitted');
    } else if (rejectedLogbooks.length > 0) {
        blockers.push(`${rejectedLogbooks.length} logbook entry(ies) rejected and require revision`);
    } else if (pendingLogbooks.length > 0) {
        blockers.push(`${pendingLogbooks.length} logbook submission(s) pending supervisor review`);
    } else {
        blockers.push(`Requires at least ${policy.minApprovedLogbooks} approved logbook report(s)`);
    }

    // 5. Supervision Meeting
    const meetings = student.meetings || [];
    const completedMeetings = meetings.filter(m => ['confirmed', 'completed'].includes(m.status));
    if (!policy.requireSupervisionVisit || completedMeetings.length > 0) {
        checklist.supervisionCompleted = true;
    } else {
        blockers.push('Required academic supervision visit/meeting has not been conducted');
    }

    // 6. Industry Assessment
    const assessments = student.assessments || [];
    const industryEval = assessments.find(a => a.evaluatorType === 'industry' && a.score !== null);
    if (!policy.requireIndustryAssessment || industryEval) {
        checklist.industryAssessmentCompleted = true;
    } else {
        blockers.push('Final industry supervisor evaluation has not been submitted');
    }

    // 7. University Assessment
    const universityEval = assessments.find(a => a.evaluatorType === 'university' && a.score !== null);
    if (!policy.requireUniversityAssessment || universityEval) {
        checklist.universityAssessmentCompleted = true;
    } else {
        blockers.push('Final university academic assessment has not been submitted');
    }

    const totalCriteria = Object.keys(checklist).length;
    const satisfiedCriteria = Object.values(checklist).filter(Boolean).length;
    const score = Math.round((satisfiedCriteria / totalCriteria) * 100);
    const ready = blockers.length === 0;

    return {
        ready,
        isReady: ready,
        score,
        blockers,
        checklist
    };
};

/**
 * Calculate Prioritized Action Queue for a Student
 * Determines immediate actionable tasks for the student dashboard.
 * @param {Object} student - Student instance with associations
 * @param {Object} policy - Academic policy
 * @returns {Array} Array of prioritized action objects
 */
const calculateStudentActionQueue = (student, policy = DEFAULT_ACADEMIC_POLICY) => {
    const actions = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Placement Submission Action
    if (!student.placementStatus || student.placementStatus === 'DRAFT') {
        actions.push({
            id: 'SUBMIT_PLACEMENT',
            priority: 'HIGH',
            title: 'Submit Placement Application',
            description: 'Provide host organization details, address, and supervisor contacts for institutional approval.',
            link: '/student/profile',
            actionText: 'Complete Placement'
        });
        return actions;
    }

    if (student.placementStatus === 'PENDING_APPROVAL') {
        actions.push({
            id: 'PENDING_APPROVAL',
            priority: 'MEDIUM',
            title: 'Placement Pending Approval',
            description: 'Your attachment application is currently under review by the School Coordinator.',
            link: '/student/profile',
            actionText: 'View Status'
        });
        return actions;
    }

    if (student.placementStatus === 'REJECTED') {
        actions.push({
            id: 'REVISE_PLACEMENT',
            priority: 'CRITICAL',
            title: 'Placement Application Rejected',
            description: student.rejectionReason || 'Please review feedback and update placement details.',
            link: '/student/profile',
            actionText: 'Update Placement'
        });
        return actions;
    }

    // 2. Attendance Check-in Action (if active and not checked in today)
    const attendanceRecords = student.attendance || [];
    const checkedInToday = attendanceRecords.some(a => a.date === todayStr);
    if (!checkedInToday && ['APPROVED', 'ACTIVE'].includes(student.placementStatus)) {
        actions.push({
            id: 'CHECK_IN_TODAY',
            priority: 'HIGH',
            title: 'Daily Attendance Check-In',
            description: 'Log your attendance verification for today to maintain academic compliance.',
            link: '/student/dashboard',
            actionText: 'Check In Now'
        });
    }

    // 3. Rejected Logbooks Action (Requires Student Revision)
    const logbooks = student.logbooks || [];
    const rejectedLogbooks = logbooks.filter(l => l.status === 'rejected');
    rejectedLogbooks.forEach(l => {
        actions.push({
            id: `REVISE_LOGBOOK_${l.id}`,
            priority: 'HIGH',
            title: `Revise Week ${l.weekNumber} Logbook`,
            description: `Supervisor requested revision: "${l.supervisorComment || 'Please revise entries'}"`,
            link: '/student/logbooks',
            actionText: 'Revise & Resubmit'
        });
    });

    // 4. Logbook Weekly Submission Action
    const pendingLogbooks = logbooks.filter(l => l.status === 'pending');
    if (logbooks.length === 0 && ['APPROVED', 'ACTIVE'].includes(student.placementStatus)) {
        actions.push({
            id: 'SUBMIT_FIRST_LOGBOOK',
            priority: 'MEDIUM',
            title: 'Submit Week 1 Logbook',
            description: 'Record your initial weekly industrial learning outcomes and tasks.',
            link: '/student/logbooks',
            actionText: 'Submit Logbook'
        });
    }

    // 5. Supervision Meeting Action
    const meetings = student.meetings || [];
    const upcomingMeetings = meetings.filter(m => new Date(m.scheduledAt) >= new Date() && m.status !== 'cancelled');
    upcomingMeetings.forEach(m => {
        actions.push({
            id: `UPCOMING_MEETING_${m.id}`,
            priority: 'MEDIUM',
            title: 'Upcoming Supervision Meeting',
            description: `Scheduled for ${new Date(m.scheduledAt).toLocaleDateString()} at ${m.venue || 'On-site'}`,
            link: '/student/visits',
            actionText: 'View Details'
        });
    });

    return actions;
};

/**
 * Calculate Deadline & Overdue Milestones for a Student
 * @param {Object} student - Student instance with associations
 * @param {Object} policy - Academic policy
 * @returns {Array} Array of deadline milestone objects
 */
const calculateDeadlines = (student, policy = DEFAULT_ACADEMIC_POLICY) => {
    const deadlines = [];
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;

    if (student.startDate && student.endDate) {
        const start = new Date(student.startDate);
        const end = new Date(student.endDate);

        // Attachment End Deadline
        const daysToEnd = Math.round((end - now) / msPerDay);
        let status = 'UPCOMING';
        if (daysToEnd < 0) status = 'OVERDUE';
        else if (daysToEnd === 0) status = 'DUE_TODAY';

        deadlines.push({
            id: 'ATTACHMENT_END',
            title: 'Attachment Conclusion Date',
            targetDate: student.endDate,
            daysRemaining: daysToEnd,
            status,
            category: 'PLACEMENT'
        });

        // Final Assessment Deadline (window before end)
        if (daysToEnd <= policy.assessmentWindowDaysBeforeEnd && daysToEnd >= -30) {
            const assessments = student.assessments || [];
            const hasIndustry = assessments.some(a => a.evaluatorType === 'industry' && a.score !== null);
            const hasUni = assessments.some(a => a.evaluatorType === 'university' && a.score !== null);

            deadlines.push({
                id: 'FINAL_ASSESSMENTS',
                title: 'Final Academic & Industry Evaluations',
                targetDate: student.endDate,
                daysRemaining: daysToEnd,
                status: (hasIndustry && hasUni) ? 'COMPLETED' : (daysToEnd < 0 ? 'OVERDUE' : 'DUE_SOON'),
                category: 'ASSESSMENT'
            });
        }
    }

    return deadlines;
};

module.exports = {
    DEFAULT_ACADEMIC_POLICY,
    getAcademicPolicy,
    calculateAttendance,
    evaluateCompletionReadiness,
    calculateStudentActionQueue,
    calculateDeadlines
};
