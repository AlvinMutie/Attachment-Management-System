const { sequelize } = require('../config/database');
const models = require('../models');

async function seedDemoAccounts() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database. Ensuring standard demo accounts exist...');

        // Ensure School A exists
        let schoolA = await models.School.findOne({ where: { name: 'Kirinyaga University (School A)' } });
        if (!schoolA) {
            schoolA = await models.School.create({
                name: 'Kirinyaga University (School A)',
                adminEmail: 'schooladmin_a@ams.com',
                contactEmail: 'attachments@kyu.ac.ke',
                address: 'Main Campus, Kerugoya',
                status: 'active'
            });
        }

        const accounts = [
            {
                name: 'System Super Admin',
                email: 'superadmin@ams.com',
                role: 'super_admin',
                schoolId: null
            },
            {
                name: 'Dr. Sarah Mwangi (School Admin)',
                email: 'schooladmin_a@ams.com',
                role: 'school_admin',
                schoolId: schoolA.id
            },
            {
                name: 'Prof. David Kariuki (Coordinator)',
                email: 'coordinator_a@ams.com',
                role: 'attachment_coordinator',
                schoolId: schoolA.id
            },
            {
                name: 'Dr. James Okoth (Uni Supervisor)',
                email: 'unisup_a@ams.com',
                role: 'university_supervisor',
                schoolId: schoolA.id
            },
            {
                name: 'Eng. Sarah Jenkins (Industry Mentor)',
                email: 'supervisor_a@ams.com',
                role: 'industry_supervisor',
                schoolId: schoolA.id
            },
            {
                name: 'Alvin Mutie (Student)',
                email: 'student_a@ams.com',
                role: 'student',
                schoolId: schoolA.id
            }
        ];

        for (const acc of accounts) {
            let user = await models.User.findOne({ where: { email: acc.email } });
            if (!user) {
                user = await models.User.create({
                    ...acc,
                    password: 'password123',
                    status: 'active',
                    failedLoginAttempts: 0
                });
                console.log(`✅ Created ${acc.role}: ${acc.email}`);
            } else {
                user.password = 'password123';
                user.status = 'active';
                user.failedLoginAttempts = 0;
                user.role = acc.role;
                if (acc.schoolId) user.schoolId = acc.schoolId;
                await user.save();
                console.log(`🔄 Reset password for ${acc.role}: ${acc.email}`);
            }

            // If student, ensure student record exists
            if (acc.role === 'student') {
                let studentProfile = await models.Student.findOne({ where: { userId: user.id } });
                if (!studentProfile) {
                    await models.Student.create({
                        userId: user.id,
                        schoolId: schoolA.id,
                        admissionNumber: 'CT201/0042/22',
                        course: 'BSc Software Engineering',
                        department: 'Computing',
                        organizationName: 'Safaricom PLC HQ',
                        organizationAddress: 'Waiyaki Way, Nairobi',
                        placementStatus: 'APPROVED'
                    });
                }
            }
        }

        console.log('🎉 All 6 demo accounts verified and ready (password: password123)!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed demo accounts:', error);
        process.exit(1);
    }
}

seedDemoAccounts();
