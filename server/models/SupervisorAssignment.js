const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SupervisorAssignment = sequelize.define('SupervisorAssignment', {
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
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Students',
            key: 'id'
        }
    },
    supervisorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    supervisorType: {
        type: DataTypes.ENUM('industry', 'university'),
        allowNull: false
    },
    assignedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    assignedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    endedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for assignment or reassignment'
    },
    status: {
        type: DataTypes.ENUM('active', 'reassigned', 'completed'),
        defaultValue: 'active'
    }
}, {
    indexes: [
        { fields: ['schoolId'] },
        { fields: ['studentId'] },
        { fields: ['supervisorId'] },
        { fields: ['status'] }
    ]
});

module.exports = SupervisorAssignment;
