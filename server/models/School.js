const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const School = sequelize.define('School', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'suspended', 'trial'),
        defaultValue: 'active',
        comment: 'School account status'
    },
    subscriptionExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Trial or subscription end date'
    },
    maxUsers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 100,
        comment: 'Maximum number of users allowed for this school'
    },
    primaryColor: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '#2563eb',
        comment: 'Primary brand color for institutional identity'
    },
    settings: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
        comment: 'School-specific configuration overrides'
    }
});

module.exports = School;
