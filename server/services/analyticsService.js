const { Student, User, Attendance, Logbook, Assessment, Meeting, Organization, SupervisorAssignment, School } = require('../models');
const { Op } = require('sequelize');
const academicPolicyService = require('./academicPolicyService');

/**
 * Advanced Analytics Aggregation Service
 * Computes tenant-isolated metrics across Placements, Attendance, Logbooks, Assessments, Supervision, and Organizations.
 */

/**
 * Get institutional overview analytics for a school
 * @param {string} schoolId
 * @returns {Promise<Object>}
 */
const getInstitutionalAnalytics = async (schoolId) => {
    const policy = academicPolicyService.getAcademicPolicy(schoolId);

    const [students, organizations, supervisors, meetings] = await Promise.all([
        Student.findAll({
            where: { schoolId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'status'] },
                { model: Attendance, as: 'attendance' },
                { model: Logbook, as: 'logbooks' },
                { model: Assessment, as: 'assessments' },
                { model: Meeting, as: 'meetings' }
            ]
        }),
        Organization.findAll({ where: { schoolId } }),
        User.findAll({
            where: {
                schoolId,
                role: { [Op.in]: ['industry_supervisor', 'university_supervisor'] }
            },
            attributes: ['id', 'name', 'email', 'role']
        }),
        Meeting.findAll({ where: { schoolId } })
    ]);

    const totalStudents = students.length;
    const activePlacements = students.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus)).length;
    const completedPlacements = students.filter(s => s.placementStatus === 'COMPLETED').length;
    const pendingPlacements = students.filter(s => s.placementStatus === 'PENDING_APPROVAL').length;
    const draftPlacements = students.filter(s => s.placementStatus === 'DRAFT' || !s.placementStatus).length;
    const rejectedPlacements = students.filter(s => s.placementStatus === 'REJECTED').length;

    // 1. Placement Velocity & Rates
    const placementRate = totalStudents > 0 ? Math.round(((activePlacements + completedPlacements) / totalStudents) * 100) : 0;
    const completionRate = (activePlacements + completedPlacements) > 0 
        ? Math.round((completedPlacements / (activePlacements + completedPlacements)) * 100) 
        : 0;

    // 2. Attendance Aggregation & Compliance Distribution
    let totalAttendanceRecords = 0;
    let compliantStudentsCount = 0;
    let atRiskStudentsCount = 0;
    let criticalStudentsCount = 0;
    let sumAttendanceRates = 0;
    let activeWithAttendance = 0;

    students.forEach(student => {
        const attStats = academicPolicyService.calculateAttendance(student.attendance || [], policy);
        totalAttendanceRecords += attStats.totalRecords;

        if (['APPROVED', 'ACTIVE', 'COMPLETED'].includes(student.placementStatus)) {
            if (attStats.totalRecords > 0) {
                sumAttendanceRates += attStats.rate;
                activeWithAttendance++;
                if (attStats.isCritical) criticalStudentsCount++;
                else if (attStats.isAtRisk) atRiskStudentsCount++;
                else compliantStudentsCount++;
            } else {
                criticalStudentsCount++; // No records logged
            }
        }
    });

    const averageAttendanceRate = activeWithAttendance > 0 ? Math.round(sumAttendanceRates / activeWithAttendance) : 0;

    // 3. Logbook Submissions & Review Velocity
    const allLogbooks = students.flatMap(s => s.logbooks || []);
    const totalLogbooks = allLogbooks.length;
    const approvedLogbooks = allLogbooks.filter(l => l.status === 'approved').length;
    const pendingLogbooks = allLogbooks.filter(l => l.status === 'pending').length;
    const rejectedLogbooks = allLogbooks.filter(l => l.status === 'rejected').length;
    const logbookApprovalRate = totalLogbooks > 0 ? Math.round((approvedLogbooks / totalLogbooks) * 100) : 0;

    // 4. Assessment Progress
    const allAssessments = students.flatMap(s => s.assessments || []);
    const industryAssessments = allAssessments.filter(a => a.evaluatorType === 'industry' && a.score !== null);
    const universityAssessments = allAssessments.filter(a => a.evaluatorType === 'university' && a.score !== null);
    const avgIndustryScore = industryAssessments.length > 0
        ? Math.round(industryAssessments.reduce((acc, a) => acc + a.score, 0) / industryAssessments.length)
        : null;
    const avgUniversityScore = universityAssessments.length > 0
        ? Math.round(universityAssessments.reduce((acc, a) => acc + a.score, 0) / universityAssessments.length)
        : null;

    // 5. Supervision Coverage
    const completedSupervisions = meetings.filter(m => ['confirmed', 'completed'].includes(m.status)).length;
    const supervisionCoverageRate = activePlacements > 0 
        ? Math.round((students.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus) && (s.meetings || []).some(m => ['confirmed', 'completed'].includes(m.status))).length / activePlacements) * 100)
        : 0;

    // 6. Historical Monthly Cohort Trends (Last 6 Months)
    const monthlyTrends = computeMonthlyTrends(students, allLogbooks, allAssessments);

    return {
        summary: {
            totalStudents,
            activePlacements,
            completedPlacements,
            pendingPlacements,
            draftPlacements,
            rejectedPlacements,
            placementRate,
            completionRate,
            activeOrganizations: organizations.length,
            totalSupervisors: supervisors.length
        },
        attendance: {
            totalRecords: totalAttendanceRecords,
            averageRate: averageAttendanceRate,
            distribution: {
                compliant: compliantStudentsCount,
                atRisk: atRiskStudentsCount,
                critical: criticalStudentsCount
            }
        },
        logbooks: {
            total: totalLogbooks,
            approved: approvedLogbooks,
            pending: pendingLogbooks,
            rejected: rejectedLogbooks,
            approvalRate: logbookApprovalRate
        },
        assessments: {
            total: allAssessments.length,
            industryCount: industryAssessments.length,
            universityCount: universityAssessments.length,
            avgIndustryScore,
            avgUniversityScore
        },
        supervision: {
            totalMeetings: meetings.length,
            completedMeetings: completedSupervisions,
            coverageRate: supervisionCoverageRate
        },
        monthlyTrends
    };
};

/**
 * Compute monthly timeline trends from operational records
 */
function computeMonthlyTrends(students, logbooks, assessments) {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        const matchMonth = (dateStr) => {
            if (!dateStr) return false;
            const date = new Date(dateStr);
            return date.getFullYear() === year && date.getMonth() === monthIndex;
        };

        const placementsInMonth = students.filter(s => matchMonth(s.createdAt) || matchMonth(s.startDate)).length;
        const logbooksInMonth = logbooks.filter(l => matchMonth(l.createdAt)).length;
        const assessmentsInMonth = assessments.filter(a => matchMonth(a.createdAt)).length;

        months.push({
            month: `${monthKey} ${year}`,
            placements: placementsInMonth,
            logbooks: logbooksInMonth,
            assessments: assessmentsInMonth
        });
    }

    return months;
}

/**
 * Get student personal analytics
 * @param {string} studentId
 * @param {string} schoolId
 * @returns {Promise<Object>}
 */
const getStudentPersonalAnalytics = async (studentId, schoolId) => {
    const policy = academicPolicyService.getAcademicPolicy(schoolId);
    const student = await Student.findOne({
        where: { id: studentId, schoolId },
        include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
            { model: Attendance, as: 'attendance' },
            { model: Logbook, as: 'logbooks' },
            { model: Assessment, as: 'assessments' },
            { model: Meeting, as: 'meetings' }
        ]
    });

    if (!student) return null;

    const attStats = academicPolicyService.calculateAttendance(student.attendance || [], policy);
    const readiness = academicPolicyService.evaluateCompletionReadiness(student, policy);
    const deadlines = academicPolicyService.calculateDeadlines(student, policy);

    // Compute weekly attendance trajectory
    const attendanceByWeek = {};
    (student.attendance || []).forEach(a => {
        const date = new Date(a.date || a.createdAt);
        const weekNum = Math.ceil(date.getDate() / 7);
        const key = `W${weekNum}`;
        if (!attendanceByWeek[key]) attendanceByWeek[key] = { present: 0, total: 0 };
        attendanceByWeek[key].total++;
        if (['present', 'late'].includes(a.status)) attendanceByWeek[key].present++;
    });

    const weeklyTrend = Object.entries(attendanceByWeek).map(([week, data]) => ({
        week,
        rate: Math.round((data.present / data.total) * 100)
    }));

    return {
        student: {
            id: student.id,
            name: student.user?.name,
            admissionNumber: student.admissionNumber,
            placementStatus: student.placementStatus,
            organizationName: student.organizationName
        },
        attendance: {
            ...attStats,
            weeklyTrend
        },
        logbooks: {
            total: (student.logbooks || []).length,
            approved: (student.logbooks || []).filter(l => l.status === 'approved').length,
            pending: (student.logbooks || []).filter(l => l.status === 'pending').length,
            rejected: (student.logbooks || []).filter(l => l.status === 'rejected').length
        },
        assessments: {
            total: (student.assessments || []).length,
            industry: (student.assessments || []).find(a => a.evaluatorType === 'industry'),
            university: (student.assessments || []).find(a => a.evaluatorType === 'university')
        },
        readiness,
        deadlines
    };
};

/**
 * Data Quality Audit Query
 * Inspects completeness, missing attachments, orphaned assignments, and state consistency.
 * @param {string} schoolId
 * @returns {Promise<Object>}
 */
const performDataQualityAudit = async (schoolId) => {
    const students = await Student.findAll({
        where: { schoolId },
        include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
            { model: Attendance, as: 'attendance' },
            { model: Logbook, as: 'logbooks' },
            { model: Assessment, as: 'assessments' }
        ]
    });

    const missingAttendance = [];
    const missingIndustrySupervisor = [];
    const missingUniversitySupervisor = [];
    const missingDates = [];
    const incompletePlacements = [];

    students.forEach(s => {
        const studentInfo = {
            id: s.id,
            name: s.user?.name || 'Unknown',
            admissionNumber: s.admissionNumber || 'N/A',
            status: s.placementStatus
        };

        if (['APPROVED', 'ACTIVE'].includes(s.placementStatus)) {
            if (!s.attendance || s.attendance.length === 0) {
                missingAttendance.push({ ...studentInfo, issue: 'No verified attendance logs recorded' });
            }
            if (!s.industrySupervisorId) {
                missingIndustrySupervisor.push({ ...studentInfo, issue: 'Industry supervisor not assigned' });
            }
            if (!s.universitySupervisorId) {
                missingUniversitySupervisor.push({ ...studentInfo, issue: 'University supervisor not assigned' });
            }
            if (!s.startDate || !s.endDate) {
                missingDates.push({ ...studentInfo, issue: 'Attachment start or end dates missing' });
            }
        } else if (s.placementStatus === 'DRAFT') {
            incompletePlacements.push({ ...studentInfo, issue: 'Placement application in draft' });
        }
    });

    const totalAudited = students.length;
    const cleanRecords = totalAudited - (
        new Set([
            ...missingAttendance.map(x => x.id),
            ...missingIndustrySupervisor.map(x => x.id),
            ...missingUniversitySupervisor.map(x => x.id),
            ...missingDates.map(x => x.id)
        ]).size
    );

    const integrityScore = totalAudited > 0 ? Math.round((cleanRecords / totalAudited) * 100) : 100;

    return {
        integrityScore,
        totalAudited,
        cleanRecords,
        issuesCount: {
            missingAttendance: missingAttendance.length,
            missingIndustrySupervisor: missingIndustrySupervisor.length,
            missingUniversitySupervisor: missingUniversitySupervisor.length,
            missingDates: missingDates.length,
            draftPlacements: incompletePlacements.length
        },
        issues: {
            missingAttendance,
            missingIndustrySupervisor,
            missingUniversitySupervisor,
            missingDates,
            incompletePlacements
        }
    };
};

module.exports = {
    getInstitutionalAnalytics,
    getStudentPersonalAnalytics,
    performDataQualityAudit
};
