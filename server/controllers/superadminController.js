const { School, User, Student, Logbook, Attendance, Assessment, AuditLog, sequelize } = require('../models');
const { Op } = require('sequelize');
const { logAudit } = require('../utils/auditLogger');
const { sendPasswordResetEmail, sendAccountLockedEmail, sendWelcomeEmail } = require('../utils/emailService');
const bcrypt = require('bcryptjs');

/**
 * Get platform-wide dashboard analytics
 */
const getDashboardAnalytics = async (req, res) => {
    try {
        const [
            totalSchools,
            totalUsers,
            totalStudents,
            activeAttachments,
            recentActivity
        ] = await Promise.all([
            School.count(),
            User.count(),
            Student.count(),
            Student.count({
                include: [{
                    model: Attendance,
                    as: 'attendance',
                    where: {
                        createdAt: {
                            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                        }
                    },
                    required: true
                }],
                distinct: true
            }),
            AuditLog.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'role']
                }]
            })
        ]);

        // Get school distribution by status
        const schoolsByStatus = await School.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        // Get user distribution by role
        const usersByRole = await User.findAll({
            attributes: [
                'role',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['role']
        });

        res.json({
            success: true,
            data: {
                metrics: {
                    totalSchools,
                    totalUsers,
                    totalStudents,
                    activeAttachments
                },
                schoolsByStatus,
                usersByRole,
                recentActivity
            }
        });
    } catch (error) {
        console.error('Dashboard analytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard analytics' });
    }
};

/**
 * Get all schools with pagination and search
 */
const getAllSchools = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { contactEmail: { [Op.like]: `%${search}%` } }
            ];
        }
        if (status) {
            where.status = status;
        }

        const { count, rows: schools } = await School.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'users',
                attributes: ['id'],
                separate: true
            }]
        });

        // Add user count to each school
        const schoolsWithCounts = schools.map(school => ({
            ...school.toJSON(),
            userCount: school.users.length
        }));

        res.json({
            success: true,
            data: {
                schools: schoolsWithCounts,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get schools error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch schools' });
    }
};

/**
 * Create a new school
 */
const createSchool = async (req, res) => {
    try {
        const { name, logo, address, contactEmail, primaryColor, adminName, adminEmail, adminPassword } = req.body;
        let finalLogo = logo;

        // Handle uploaded file if present
        if (req.file) {
            finalLogo = `/uploads/logos/${req.file.filename}`;
        }

        // Validate required fields
        if (!name || !contactEmail || !adminName || !adminEmail || !adminPassword) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check if school email already exists
        const existingSchool = await School.findOne({ where: { contactEmail } });
        if (existingSchool) {
            return res.status(400).json({ success: false, message: 'School with this email already exists' });
        }

        // Check if admin email already exists
        const existingUser = await User.findOne({ where: { email: adminEmail } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Create school and admin user in a transaction
        const result = await sequelize.transaction(async (t) => {
            // Create school
            const school = await School.create({
                name,
                logo: finalLogo,
                address,
                contactEmail,
                primaryColor: primaryColor || '#2563eb',
                status: 'trial',
                subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
            }, { transaction: t });

            // Create school admin user
            const adminUser = await User.create({
                schoolId: school.id,
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'school_admin',
                status: 'active'
            }, { transaction: t });

            return { school, adminUser };
        });

        // Log audit
        await logAudit({
            userId: req.user.id,
            action: 'CREATE_SCHOOL',
            targetType: 'School',
            targetId: result.school.id,
            metadata: { schoolName: name, adminEmail },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        // Send welcome email
        await sendWelcomeEmail(result.adminUser, result.school, adminPassword);

        res.status(201).json({
            success: true,
            message: 'School created successfully',
            data: result.school
        });
    } catch (error) {
        console.error('Create school error:', error);
        res.status(500).json({ success: false, message: 'Failed to create school' });
    }
};

/**
 * Update school details
 */
const updateSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, logo, address, contactEmail, primaryColor, maxUsers, settings } = req.body;
        let finalLogo = logo;

        // Handle uploaded file if present
        if (req.file) {
            finalLogo = `/uploads/logos/${req.file.filename}`;
        }

        const school = await School.findByPk(id);
        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        const oldData = { ...school.toJSON() };

        await school.update({
            name: name || school.name,
            logo: finalLogo !== undefined ? finalLogo : school.logo,
            address: address || school.address,
            contactEmail: contactEmail || school.contactEmail,
            primaryColor: primaryColor || school.primaryColor,
            maxUsers: maxUsers !== undefined ? maxUsers : school.maxUsers,
            settings: settings || school.settings
        });

        // Log audit
        await logAudit({
            userId: req.user.id,
            action: 'UPDATE_SCHOOL',
            targetType: 'School',
            targetId: school.id,
            metadata: { oldData, newData: school.toJSON() },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'School updated successfully',
            data: school
        });
    } catch (error) {
        console.error('Update school error:', error);
        res.status(500).json({ success: false, message: 'Failed to update school' });
    }
};

/**
 * Toggle school status (activate/suspend)
 */
const toggleSchoolStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'suspended', 'trial'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const school = await School.findByPk(id);
        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        const oldStatus = school.status;
        await school.update({ status });

        // Log audit
        await logAudit({
            userId: req.user.id,
            action: 'TOGGLE_SCHOOL_STATUS',
            targetType: 'School',
            targetId: school.id,
            metadata: { oldStatus, newStatus: status },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: `School ${status === 'suspended' ? 'suspended' : 'activated'} successfully`,
            data: school
        });
    } catch (error) {
        console.error('Toggle school status error:', error);
        res.status(500).json({ success: false, message: 'Failed to toggle school status' });
    }
};

/**
 * Get global user directory
 */
const getGlobalUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '', schoolId = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        if (role) where.role = role;
        if (schoolId) where.schoolId = schoolId;
        if (status) where.status = status;

        const { count, rows: users } = await User.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [{
                model: School,
                as: 'school',
                attributes: ['id', 'name']
            }],
            attributes: { exclude: ['password', 'passwordResetToken'] }
        });

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

/**
 * Update user role
 */
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ['student', 'industry_supervisor', 'university_supervisor', 'school_admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent changing super_admin role
        if (user.role === 'super_admin') {
            return res.status(403).json({ success: false, message: 'Cannot modify super admin role' });
        }

        const oldRole = user.role;
        await user.update({ role });

        // Log audit
        await logAudit({
            userId: req.user.id,
            action: 'UPDATE_USER_ROLE',
            targetType: 'User',
            targetId: user.id,
            metadata: { oldRole, newRole: role, userEmail: user.email },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ success: false, message: 'Failed to update user role' });
    }
};

/**
 * Reset user password
 */
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(user, resetToken);

        // Log audit
        await logAudit({
            userId: req.user.id,
            action: 'RESET_USER_PASSWORD',
            targetType: 'User',
            targetId: user.id,
            metadata: { userEmail: user.email },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Password reset email sent successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
};

/**
 * Lock/unlock user account
 */
const toggleUserLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { locked } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent locking super_admin
        if (user.role === 'super_admin') {
            return res.status(403).json({ success: false, message: 'Cannot lock super admin account' });
        }

        const newStatus = locked ? 'locked' : 'active';
        await user.update({ status: newStatus, failedLoginAttempts: 0 });

        if (locked) {
            await sendAccountLockedEmail(user);
        }

        // Log audit
        await logAudit({
            userId: req.user.id,
            action: locked ? 'LOCK_USER' : 'UNLOCK_USER',
            targetType: 'User',
            targetId: user.id,
            metadata: { userEmail: user.email },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: `User account ${locked ? 'locked' : 'unlocked'} successfully`,
            data: user
        });
    } catch (error) {
        console.error('Toggle user lock error:', error);
        res.status(500).json({ success: false, message: 'Failed to toggle user lock' });
    }
};

/**
 * Get audit logs with filtering
 */
const getAuditLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            userId = '',
            action = '',
            targetType = '',
            startDate = '',
            endDate = ''
        } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (targetType) where.targetType = targetType;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        const { count, rows: logs } = await AuditLog.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email', 'role']
            }]
        });

        res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
    }
};

/**
 * Get system health status
 */
const getSystemHealth = async (req, res) => {
    try {
        // Check database connection
        let dbStatus = 'healthy';
        let dbLatency = 0;
        try {
            const start = Date.now();
            await sequelize.authenticate();
            dbLatency = Date.now() - start;
        } catch (error) {
            dbStatus = 'unhealthy';
        }

        // Get database size (approximate)
        const tableStats = await sequelize.query(
            "SELECT table_schema AS 'database', SUM(data_length + index_length) AS 'size' FROM information_schema.tables WHERE table_schema = DATABASE() GROUP BY table_schema",
            { type: sequelize.QueryTypes.SELECT }
        );

        // Get recent errors from audit logs (if we log errors there)
        const recentErrors = await AuditLog.findAll({
            where: {
                action: { [Op.like]: '%ERROR%' },
                createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            },
            limit: 10,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                database: {
                    status: dbStatus,
                    latency: `${dbLatency}ms`,
                    size: tableStats[0]?.size || 0
                },
                server: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    nodeVersion: process.version
                },
                recentErrors
            }
        });
    } catch (error) {
        console.error('System health error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch system health' });
    }
};

module.exports = {
    getDashboardAnalytics,
    getAllSchools,
    createSchool,
    updateSchool,
    toggleSchoolStatus,
    getGlobalUsers,
    updateUserRole,
    resetUserPassword,
    toggleUserLock,
    getAuditLogs,
    getSystemHealth
};
