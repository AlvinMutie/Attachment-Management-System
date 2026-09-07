const analyticsService = require('../services/analyticsService');
const { Student, User, Attendance, Logbook, Assessment } = require('../models');

/**
 * Analytics Controller
 * Serves aggregated operational analytics, student personal metrics, and data quality audits.
 */

/**
 * Get institutional overview analytics
 */
const getOverviewAnalytics = async (req, res) => {
    try {
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        if (!schoolId && req.user.role !== 'super_admin') {
            return res.status(400).json({ success: false, message: 'School identification required' });
        }

        const analytics = await analyticsService.getInstitutionalAnalytics(schoolId);
        res.json({ success: true, data: analytics });
    } catch (error) {
        console.error('Get overview analytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate overview analytics' });
    }
};

/**
 * Get student personal analytics & trend
 */
const getStudentAnalytics = async (req, res) => {
    try {
        let studentId = req.params.id;

        // If requester is student, force their own ID
        if (req.user.role === 'student') {
            const student = await Student.findOne({ where: { userId: req.user.id } });
            if (!student) {
                return res.status(404).json({ success: false, message: 'Student profile not found' });
            }
            studentId = student.id;
        } else if (req.params.id) {
            // Verify student belongs to supervisor or school
            const student = await Student.findOne({ where: { id: studentId } });
            if (!student) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }

            // Tenant Check
            if (req.user.role !== 'super_admin' && student.schoolId !== req.schoolId) {
                return res.status(403).json({ success: false, message: 'Access denied: Cross-tenant query' });
            }

            // Supervisor Authorization Check
            if (req.user.role === 'industry_supervisor' && student.industrySupervisorId !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Access denied: Student is not assigned to you' });
            }
            if (req.user.role === 'university_supervisor' && student.universitySupervisorId !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Access denied: Student is not assigned to you' });
            }
        }

        const analytics = await analyticsService.getStudentPersonalAnalytics(studentId, req.schoolId);
        if (!analytics) {
            return res.status(404).json({ success: false, message: 'Analytics data unavailable' });
        }

        res.json({ success: true, data: analytics });
    } catch (error) {
        console.error('Get student analytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve student analytics' });
    }
};

/**
 * Get supervisor cohort analytics
 */
const getSupervisorAnalytics = async (req, res) => {
    try {
        const isIndustry = req.user.role === 'industry_supervisor';
        const isUniversity = req.user.role === 'university_supervisor';

        if (!isIndustry && !isUniversity) {
            return res.status(403).json({ success: false, message: 'Access denied: Supervisor role required' });
        }

        const filter = isIndustry ? { industrySupervisorId: req.user.id } : { universitySupervisorId: req.user.id };
        const students = await Student.findAll({
            where: { ...filter, schoolId: req.schoolId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Attendance, as: 'attendance' },
                { model: Logbook, as: 'logbooks' },
                { model: Assessment, as: 'assessments' }
            ]
        });

        const totalMentees = students.length;
        const totalLogbooks = students.flatMap(s => s.logbooks || []);
        const pendingReviews = totalLogbooks.filter(l => l.status === 'pending').length;
        const approvedReviews = totalLogbooks.filter(l => l.status === 'approved').length;

        res.json({
            success: true,
            data: {
                totalMentees,
                totalLogbooks: totalLogbooks.length,
                pendingReviews,
                approvedReviews,
                studentsCount: totalMentees
            }
        });
    } catch (error) {
        console.error('Get supervisor analytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate supervisor analytics' });
    }
};

/**
 * Perform Data Quality Audit for Administrators
 */
const getDataQualityAudit = async (req, res) => {
    try {
        const allowedRoles = ['school_admin', 'attachment_coordinator', 'super_admin'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied: Administrative privileges required' });
        }

        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;
        const audit = await analyticsService.performDataQualityAudit(schoolId);

        res.json({ success: true, data: audit });
    } catch (error) {
        console.error('Data quality audit error:', error);
        res.status(500).json({ success: false, message: 'Failed to execute data quality audit' });
    }
};

module.exports = {
    getOverviewAnalytics,
    getStudentAnalytics,
    getSupervisorAnalytics,
    getDataQualityAudit
};
