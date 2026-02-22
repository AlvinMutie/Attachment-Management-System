const { sequelize } = require('./config/database');
const models = require('./models');

async function syncDatabase() {
    try {
        console.log('Starting database synchronization...');

        // Sync all models
        await sequelize.sync({ force: true });

        // Seed super admin
        const superAdminExists = await models.User.findOne({ where: { role: 'super_admin' } });
        if (!superAdminExists) {
            await models.User.create({
                name: 'System Administrator',
                email: 'superadmin@ams.com',
                password: 'password123',
                role: 'super_admin'
            });
            console.log('✅ Super admin created (superadmin@ams.com / password123)');
        }

        console.log('✅ Database synchronized successfully!');
        console.log('All models have been updated with new fields.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Database synchronization failed:', error);
        process.exit(1);
    }
}

syncDatabase();
