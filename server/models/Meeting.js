const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Meeting = sequelize.define('Meeting', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Schools',
            key: 'id'
        }
    },
    initiatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'University Supervisor ID',
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Students',
            key: 'id'
        }
    },
    industrySupervisorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('physical', 'remote'),
        allowNull: false
    },
    scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    purpose: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
        comment: 'Global meeting status'
    },
    studentStatus: {
        type: DataTypes.ENUM('pending', 'accepted', 'declined', 'rescheduling'),
        defaultValue: 'pending'
    },
    industryStatus: {
        type: DataTypes.ENUM('pending', 'accepted', 'declined', 'rescheduling'),
        defaultValue: 'pending'
    },
    responseNote: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for decline or reschedule'
    },
    rescheduleProposal: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Proposed new time by participant'
    }
});

module.exports = Meeting;
