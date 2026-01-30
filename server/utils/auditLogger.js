const { AuditLog } = require('../models');

/**
 * Create an audit log entry
 * @param {Object} params - Audit log parameters
 * @param {string} params.userId - ID of user performing action
 * @param {string} params.action - Action type (e.g., 'CREATE_SCHOOL')
 * @param {string} params.targetType - Type of entity affected
 * @param {string} params.targetId - ID of affected entity
 * @param {Object} params.metadata - Additional context
 * @param {string} params.ipAddress - IP address of request
 * @param {string} params.userAgent - User agent string
 */
const logAudit = async ({
    userId,
    action,
    targetType = null,
    targetId = null,
    metadata = {},
    ipAddress = null,
    userAgent = null
}) => {
    try {
        await AuditLog.create({
            userId,
            action,
            targetType,
            targetId,
            metadata,
            ipAddress,
            userAgent
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw - audit logging should not break the main operation
    }
};

module.exports = { logAudit };
