const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Schools',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'e.g. placement_submitted, placement_approved, supervisor_assigned, logbook_submitted, logbook_reviewed, attendance_alert, assessment_submitted, meeting_scheduled'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    entityType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'e.g. placement, logbook, attendance, assessment, meeting'
    },
    entityId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['recipientId'] },
        { fields: ['schoolId'] },
        { fields: ['isRead'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = Notification;
