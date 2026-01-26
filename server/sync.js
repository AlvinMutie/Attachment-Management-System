const { sequelize, User, School } = require('./models');

const initDB = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced successfully.');

        // Create a sample school
        const school = await School.create({
            name: 'Modern University of Technology',
            contactEmail: 'admin@mut.edu',
            address: '123 Education Way'
        });
        console.log('Sample school created:', school.name);

        // Create a school admin for the sample school
        const schoolAdmin = await User.create({
            name: 'School Administrator',
            email: 'schooladmin@mut.edu',
            password: 'password123',
            role: 'school_admin',
            schoolId: school.id
        });
        console.log('School admin created:', schoolAdmin.email);

        // Create a Super Admin
        const superAdmin = await User.create({
            name: 'Global Admin',
            email: 'superadmin@ams.com',
            password: 'password123',
            role: 'super_admin'
        });
        console.log('Super admin created:', superAdmin.email);

        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

initDB();
