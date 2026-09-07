const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
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
    industrySupervisorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    universitySupervisorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    admissionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institution: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course: {
        type: DataTypes.STRING,
        allowNull: true
    },
    yearOfStudy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    organizationName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    organizationAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    organizationPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    organizationEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    placementStatus: {
        type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
        defaultValue: 'DRAFT'
    },
    rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Student;
