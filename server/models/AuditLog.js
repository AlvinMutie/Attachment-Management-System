const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true, // Null for system actions
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Action type (e.g., CREATE_SCHOOL, RESET_PASSWORD, UPDATE_USER)'
    },
    targetType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Entity type affected (e.g., School, User, Student)'
    },
    targetId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'ID of affected entity'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional context (IP address, changes made, etc.)'
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    updatedAt: false, // Audit logs should never be updated
    indexes: [
        { fields: ['userId'] },
        { fields: ['action'] },
        { fields: ['targetType', 'targetId'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = AuditLog;
