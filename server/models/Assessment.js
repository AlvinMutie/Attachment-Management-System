const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Assessment = sequelize.define('Assessment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Students',
            key: 'id'
        }
    },
    evaluatorId: {
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
        type: DataTypes.ENUM('mid-term', 'end-of-attachment'),
        allowNull: false
    },
    evaluatorType: {
        type: DataTypes.ENUM('industry', 'university'),
        allowNull: false,
        defaultValue: 'industry'
    },
    score: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 100
        }
    },
    criteria: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('draft', 'submitted', 'finalized'),
        defaultValue: 'submitted'
    }
});

module.exports = Assessment;
