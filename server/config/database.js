const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseStorage = process.env.DATABASE_PATH || './database.sqlite';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: databaseStorage, // Store the database locally or in configured persistent storage
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const ensureSchemaColumns = async () => {
    const checkAndAdd = async (table, col, def) => {
        try {
            const [results] = await sequelize.query(`PRAGMA table_info(${table});`);
            const exists = results.some(r => r.name === col);
            if (!exists) {
                await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${col} ${def};`);
            }
        } catch (e) {
            // Table might not exist yet or other dialect
        }
    };

    await checkAndAdd('Students', 'course', 'VARCHAR(255)');
    await checkAndAdd('Students', 'yearOfStudy', 'VARCHAR(255)');
    await checkAndAdd('Students', 'phone', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationName', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationAddress', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationPhone', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationEmail', 'VARCHAR(255)');
    await checkAndAdd('Students', 'contactPerson', 'VARCHAR(255)');
    await checkAndAdd('Students', 'startDate', 'DATE');
    await checkAndAdd('Students', 'endDate', 'DATE');
    await checkAndAdd('Students', 'placementStatus', 'VARCHAR(50) DEFAULT "DRAFT"');
    await checkAndAdd('Students', 'rejectionReason', 'TEXT');

    await checkAndAdd('Attendances', 'verificationMethod', 'VARCHAR(255) DEFAULT "manual"');
    await checkAndAdd('Attendances', 'notes', 'TEXT');

    await checkAndAdd('Assessments', 'evaluatorType', 'VARCHAR(50) DEFAULT "industry"');
    await checkAndAdd('Assessments', 'criteria', 'TEXT');
    await checkAndAdd('Assessments', 'status', 'VARCHAR(50) DEFAULT "submitted"');

    try {
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Notifications (
                id VARCHAR(36) PRIMARY KEY,
                recipientId VARCHAR(36) NOT NULL REFERENCES Users(id),
                schoolId VARCHAR(36) NOT NULL REFERENCES Schools(id),
                type VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                entityType VARCHAR(255),
                entityId VARCHAR(36),
                isRead BOOLEAN DEFAULT 0,
                readAt DATETIME,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL
            );
        `);

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS SupervisorAssignments (
                id VARCHAR(36) PRIMARY KEY,
                schoolId VARCHAR(36) NOT NULL REFERENCES Schools(id),
                studentId VARCHAR(36) NOT NULL REFERENCES Students(id),
                supervisorId VARCHAR(36) NOT NULL REFERENCES Users(id),
                supervisorType VARCHAR(50) NOT NULL,
                assignedBy VARCHAR(36) NOT NULL REFERENCES Users(id),
                assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                endedAt DATETIME,
                reason TEXT,
                status VARCHAR(50) DEFAULT 'active',
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL
            );
        `);

        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Organizations (
                id VARCHAR(36) PRIMARY KEY,
                schoolId VARCHAR(36) NOT NULL REFERENCES Schools(id),
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255),
                phone VARCHAR(255),
                email VARCHAR(255),
                contactPerson VARCHAR(255),
                industry VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL
            );
        `);
    } catch (e) {
        // Ignored if already exists
    }
};

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to SQLite has been established successfully.');
        await ensureSchemaColumns();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, testConnection, ensureSchemaColumns };
