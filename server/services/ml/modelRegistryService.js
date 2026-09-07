const { extractStudentFeatures } = require('./featureService');
const riskScoringService = require('../riskScoringService');
const academicPolicyService = require('../academicPolicyService');

/**
 * Model Registry & Governance Service
 * Manages ML model versioning, sample adequacy verification, transparent prediction explainability,
 * and human-in-the-loop safeguards.
 */

// Model Registry Metadata
const MODEL_REGISTRY = {
    modelVersion: 'v1.0.0-baseline',
    modelType: 'Interpretable Academic Risk Predictor (Operational Random Forest Baseline)',
    target: 'Probability that an active student will require academic intervention before completion',
    minProductionSampleSize: 50,
    currentTrainingSampleSize: 22,
    validationSampleSize: 0,
    metrics: {
        accuracy: null,
        precision: null,
        recall: null,
        f1: null
    },
    // In compliance with Section 4 & 45: Not enough historical completed outcomes (<50)
    status: 'EXPERIMENTAL_NOT_PRODUCTION_READY',
    featureSet: [
        'attendance_rate',
        'attendance_trend',
        'days_remaining',
        'placement_duration_elapsed',
        'deadline_pressure',
        'total_logbooks',
        'approved_logbooks',
        'logbook_revision_count',
        'overdue_logbooks',
        'assessment_completion_rate',
        'supervision_completed'
    ],
    governance: {
        prohibitedUses: [
            'Automated academic failure / pass decisions',
            'Automated grade modification',
            'Disciplinary actions',
            'Placement rejection'
        ],
        authoritativeSource: 'academicPolicyService.js',
        humanInTheLoopRequired: true
    }
};

/**
 * Get current model registry status
 * @returns {Object}
 */
const getModelRegistryStatus = () => {
    return { ...MODEL_REGISTRY };
};

/**
 * Predict intervention risk for a student with transparent explainability
 * @param {Object} student - Student instance with associations
 * @param {Object} [policy] - Academic policy object
 * @returns {Object} Prediction object with explainable factors and human oversight safeguard
 */
const predictInterventionRisk = (student, policy = academicPolicyService.DEFAULT_ACADEMIC_POLICY) => {
    // 1. Extract clean, leakage-free features
    const { features } = extractStudentFeatures(student, new Date(), policy);

    // 2. Deterministic baseline scoring (governed fallback)
    const riskEval = riskScoringService.calculateStudentRiskScore(student, policy);
    const interventionProbability = parseFloat((riskEval.score / 100).toFixed(2));

    // 3. Extract Top Contributing Factors for Explainability
    const contributingFactors = [];

    if (features.attendance_rate < policy.minAttendancePercentage) {
        contributingFactors.push(`Attendance rate is ${features.attendance_rate}% (below ${policy.minAttendancePercentage}% standard).`);
    }
    if (features.attendance_trend < -10) {
        contributingFactors.push(`Attendance velocity dropped by ${Math.abs(features.attendance_trend)}% recently.`);
    }
    if (features.logbook_revision_count > 0) {
        contributingFactors.push(`${features.logbook_revision_count} logbook submission(s) require revisions.`);
    }
    if (features.overdue_logbooks > 0) {
        contributingFactors.push('Zero weekly logbooks submitted despite 25%+ elapsed attachment time.');
    }
    if (features.deadline_pressure > 0.5 && features.assessment_completion_rate < 100) {
        contributingFactors.push('Imminent attachment end date with pending final assessments.');
    }
    if (features.placement_duration_elapsed >= 50 && features.supervision_completed === 0) {
        contributingFactors.push('Supervision site visit remains unscheduled at mid-placement.');
    }

    if (contributingFactors.length === 0) {
        contributingFactors.push('All operational signals are currently within compliant parameters.');
    }

    return {
        modelInfo: {
            version: MODEL_REGISTRY.modelVersion,
            status: MODEL_REGISTRY.status,
            isProductionReady: MODEL_REGISTRY.status === 'VALIDATED',
            sampleAdequacyNote: 'Dataset currently has limited historical outcomes (< 50). Operating in deterministic heuristic mode.'
        },
        prediction: {
            interventionRisk: riskEval.level,
            interventionProbability,
            riskScore: riskEval.score,
            contributingFactors,
            recommendation: riskEval.recommendations[0] || 'Review student operational progress.',
            features
        },
        safeguards: {
            humanReviewRequired: true,
            authoritativeRule: 'Academic decisions are determined exclusively by institutional policy, not AI predictions.'
        }
    };
};

module.exports = {
    getModelRegistryStatus,
    predictInterventionRisk
};
