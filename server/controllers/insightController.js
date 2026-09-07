const insightEngine = require('../services/insightEngine');
const riskScoringService = require('../services/riskScoringService');
const modelRegistryService = require('../services/ml/modelRegistryService');
const academicPolicyService = require('../services/academicPolicyService');
const { Student, User, Attendance, Logbook, Assessment, Meeting } = require('../models');

/**
 * Insight & Risk Controller
 * Serves explainable deterministic insights, risk scores, intervention queues, and model governance metadata.
 */

/**
 * Get insights, risk score, and ML prediction for a specific student
 */
const getStudentInsightsAndRisk = async (req, res) => {
    try {
        let studentId = req.params.id;

        // If requester is student, force their own ID
        if (req.user.role === 'student') {
            const student = await Student.findOne({ where: { userId: req.user.id } });
            if (!student) {
                return res.status(404).json({ success: false, message: 'Student profile not found' });
            }
            studentId = student.id;
        }

        const student = await Student.findOne({
            where: { id: studentId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Attendance, as: 'attendance' },
                { model: Logbook, as: 'logbooks' },
                { model: Assessment, as: 'assessments' },
                { model: Meeting, as: 'meetings' }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Tenant Isolation Check
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

        const policy = academicPolicyService.getAcademicPolicy(student.schoolId);

        // 1. Generate Deterministic Insights
        const insights = insightEngine.generateStudentInsights(student, policy);

        // 2. Generate Explainable Risk Score
        const riskScore = riskScoringService.calculateStudentRiskScore(student, policy);

        // 3. Generate ML Prediction / Fallback Object
        const mlPrediction = modelRegistryService.predictInterventionRisk(student, policy);

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    name: student.user?.name,
                    admissionNumber: student.admissionNumber,
                    placementStatus: student.placementStatus
                },
                riskScore,
                insights,
                mlPrediction
            }
        });
    } catch (error) {
        console.error('Get student insights and risk error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve insights and risk score' });
    }
};

/**
 * Get institutional intervention queue
 */
const getInterventionQueue = async (req, res) => {
    try {
        const allowedRoles = ['school_admin', 'attachment_coordinator', 'super_admin'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied: Administrative privileges required' });
        }

        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;
        const policy = academicPolicyService.getAcademicPolicy(schoolId);

        const students = await Student.findAll({
            where: { schoolId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Attendance, as: 'attendance' },
                { model: Logbook, as: 'logbooks' },
                { model: Assessment, as: 'assessments' },
                { model: Meeting, as: 'meetings' }
            ]
        });

        // Compute risk scores and gather elevated/critical cases
        const interventionQueue = [];
        students.forEach(student => {
            const risk = riskScoringService.calculateStudentRiskScore(student, policy);
            const insights = insightEngine.generateStudentInsights(student, policy);

            if (risk.score >= 30 || insights.some(i => i.severity === 'CRITICAL')) {
                interventionQueue.push({
                    studentId: student.id,
                    name: student.user?.name || 'Student',
                    admissionNumber: student.admissionNumber,
                    course: student.course || student.department,
                    organizationName: student.organizationName,
                    placementStatus: student.placementStatus,
                    riskScore: risk.score,
                    riskLevel: risk.level,
                    topInsight: insights[0] || null,
                    recommendation: risk.recommendations[0] || 'Review student case'
                });
            }
        });

        // Sort by riskScore descending
        interventionQueue.sort((a, b) => b.riskScore - a.riskScore);

        res.json({
            success: true,
            data: {
                totalCount: interventionQueue.length,
                queue: interventionQueue
            }
        });
    } catch (error) {
        console.error('Get intervention queue error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate intervention queue' });
    }
};

/**
 * Get Model Registry & Governance metadata
 */
const getModelRegistry = async (req, res) => {
    try {
        const allowedRoles = ['school_admin', 'attachment_coordinator', 'super_admin'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const status = modelRegistryService.getModelRegistryStatus();
        res.json({ success: true, data: status });
    } catch (error) {
        console.error('Get model registry error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve model registry status' });
    }
};

module.exports = {
    getStudentInsightsAndRisk,
    getInterventionQueue,
    getModelRegistry
};
