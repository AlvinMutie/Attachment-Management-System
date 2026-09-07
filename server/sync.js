const { sequelize } = require('./config/database');
const models = require('./models');

async function syncDatabase() {
    try {
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ SAFETY ABORT: Database reset (force: true) is strictly prohibited in production mode.');
            process.exit(1);
        }

        console.log('Starting development database synchronization...');

        // Sync all models (development reset only)
        await sequelize.sync({ force: true });

        // Seed default super admin for initial development bootstrap
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

        console.log('✅ Development database synchronized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database synchronization failed:', error);
        process.exit(1);
    }
}

syncDatabase();
