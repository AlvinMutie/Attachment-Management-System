const { sequelize } = require('./config/database');
const models = require('./models');

async function syncDatabase() {
    try {
        console.log('Starting database synchronization...');

        // Sync all models
        await sequelize.sync({ alter: true });

        console.log('✅ Database synchronized successfully!');
        console.log('All models have been updated with new fields.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Database synchronization failed:', error);
        process.exit(1);
    }
}

syncDatabase();
