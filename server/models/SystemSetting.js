const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemSetting = sequelize.define('SystemSetting', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Setting identifier (e.g., QR_EXPIRY_MINUTES, MAX_FILE_SIZE)'
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Setting value (JSON stringified for complex values)'
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'general',
        comment: 'Grouping (e.g., security, features, email, storage)'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Human-readable explanation of the setting'
    },
    dataType: {
        type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
        defaultValue: 'string',
        comment: 'Type hint for parsing the value'
    },
    isEditable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this setting can be modified via UI'
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['key'], unique: true },
        { fields: ['category'] }
    ]
});

// Helper method to get parsed value
SystemSetting.prototype.getParsedValue = function () {
    switch (this.dataType) {
        case 'number':
            return parseFloat(this.value);
        case 'boolean':
            return this.value === 'true';
        case 'json':
            return JSON.parse(this.value);
        default:
            return this.value;
    }
};

module.exports = SystemSetting;
