const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    schoolId: {
        type: DataTypes.UUID,
        allowNull: true, // Null for Super Admin
        references: {
            model: 'Schools',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'industry_supervisor', 'university_supervisor', 'school_admin', 'super_admin'),
        defaultValue: 'student'
    },
    status: {
        type: DataTypes.ENUM('active', 'locked', 'pending'),
        defaultValue: 'active',
        comment: 'Account status'
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last successful login timestamp'
    },
    failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Counter for failed login attempts'
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Temporary token for password reset'
    },
    passwordResetExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Token expiration time'
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpiry = new Date(Date.now() + 3600000); // 1 hour
    return resetToken;
};

module.exports = User;
