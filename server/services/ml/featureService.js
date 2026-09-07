const academicPolicyService = require('../academicPolicyService');

/**
 * Feature Engineering Pipeline for AMS ML Infrastructure
 * Derives normalized feature vectors from operational data while strictly preventing data leakage.
 * No future information (e.g. final grades, future attendance, post-attachment outcomes) is included.
 */

/**
 * Extract feature vector from student operational snapshot
 * @param {Object} student - Student instance with associations
 * @param {Date} [observationDate=new Date()] - Observation point in time for leakage prevention
 * @param {Object} [policy] - Academic policy object
 * @returns {Object} { features, featureArray, featureNames }
 */
const extractStudentFeatures = (student, observationDate = new Date(), policy = academicPolicyService.DEFAULT_ACADEMIC_POLICY) => {
    // Filter records up to observation date to guarantee zero data leakage
    const obsTime = new Date(observationDate).getTime();

    const attendanceRecords = (student.attendance || []).filter(a => new Date(a.date || a.createdAt).getTime() <= obsTime);
    const logbookRecords = (student.logbooks || []).filter(l => new Date(l.createdAt).getTime() <= obsTime);
    const assessmentRecords = (student.assessments || []).filter(a => new Date(a.createdAt).getTime() <= obsTime);
    const meetingRecords = (student.meetings || []).filter(m => new Date(m.scheduledAt || m.createdAt).getTime() <= obsTime);

    // 1. Attendance Metrics
    const attStats = academicPolicyService.calculateAttendance(attendanceRecords, policy);
    const attendance_rate = attStats.rate;

    // Attendance Trend (delta between recent and older records)
    let attendance_trend = 0;
    if (attendanceRecords.length >= 4) {
        const mid = Math.floor(attendanceRecords.length / 2);
        const older = attendanceRecords.slice(0, mid);
        const recent = attendanceRecords.slice(mid);
        const oldRate = Math.round((older.filter(r => ['present', 'late'].includes(r.status)).length / older.length) * 100);
        const newRate = Math.round((recent.filter(r => ['present', 'late'].includes(r.status)).length / recent.length) * 100);
        attendance_trend = newRate - oldRate;
    }

    // 2. Timeline & Elapsed Duration
    let days_remaining = 0;
    let placement_duration_elapsed = 0;
    let deadline_pressure = 0;

    if (student.startDate && student.endDate) {
        const start = new Date(student.startDate).getTime();
        const end = new Date(student.endDate).getTime();
        const totalDurationDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        const elapsedDays = Math.max(0, Math.round((obsTime - start) / (1000 * 60 * 60 * 24)));
        days_remaining = Math.max(0, Math.round((end - obsTime) / (1000 * 60 * 60 * 24)));

        placement_duration_elapsed = Math.min(100, Math.round((elapsedDays / totalDurationDays) * 100));
        deadline_pressure = days_remaining <= 14 ? (14 - days_remaining) / 14 : 0;
    }

    // 3. Logbook Signals
    const total_logbooks = logbookRecords.length;
    const approved_logbooks = logbookRecords.filter(l => l.status === 'approved').length;
    const logbook_revision_count = logbookRecords.filter(l => l.status === 'rejected').length;
    const overdue_logbooks = (placement_duration_elapsed >= 25 && total_logbooks === 0) ? 1 : 0;

    // 4. Assessment & Supervision Signals
    const assessment_completion_rate = assessmentRecords.filter(a => a.score !== null).length >= 2 ? 100 : (assessmentRecords.length > 0 ? 50 : 0);
    const supervision_completed = meetingRecords.some(m => ['confirmed', 'completed'].includes(m.status)) ? 1 : 0;

    const features = {
        attendance_rate,
        attendance_trend,
        days_remaining,
        placement_duration_elapsed,
        deadline_pressure: parseFloat(deadline_pressure.toFixed(2)),
        total_logbooks,
        approved_logbooks,
        logbook_revision_count,
        overdue_logbooks,
        assessment_completion_rate,
        supervision_completed
    };

    const featureNames = Object.keys(features);
    const featureArray = Object.values(features);

    return {
        features,
        featureArray,
        featureNames
    };
};

module.exports = {
    extractStudentFeatures
};
