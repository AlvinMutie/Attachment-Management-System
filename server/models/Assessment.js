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
    score: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 100
        }
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Assessment;
