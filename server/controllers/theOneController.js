const os = require('os');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Get System Vitals
// @route   GET /api/the-one/metrics
// @access  Private/SuperAdmin
const getSystemMetrics = async (req, res) => {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        
        // Simple mock of DB stats for now, real postgres/mysql queries could be added
        const dbConnected = await sequelize.authenticate().then(() => true).catch(() => false);

        res.json({
            success: true,
            data: {
                serverInfo: {
                    platform: os.platform(),
                    release: os.release(),
                    uptime: os.uptime(),
                    hostname: os.hostname(),
                    cpus: os.cpus().map(cpu => cpu.model)
                },
                memory: {
                    total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
                    free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
                    used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
                    usagePercentage: ((usedMem / totalMem) * 100).toFixed(2) + '%'
                },
                database: {
                    status: dbConnected ? 'connected' : 'disconnected',
                    dialect: sequelize.getDialect()
                }
            }
        });
    } catch (error) {
        console.error('Metrics Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch metrics', error: error.message });
    }
};

// @desc    Execute Raw Query
// @route   POST /api/the-one/query
// @access  Private/SuperAdmin
const executeRawQuery = async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ success: false, message: 'Query string is required' });
        }

        // DANGER: Executing raw SQL provided by the client.
        // Protected by requireSuperAdmin middleware.
        const [results, metadata] = await sequelize.query(query);

        res.json({
            success: true,
            data: {
                results,
                metadata
            }
        });
    } catch (error) {
        console.error('Query Error:', error);
        res.status(400).json({ success: false, message: 'Query failed', error: error.message });
    }
};

// @desc    Generate Impersonation Token
// @route   POST /api/the-one/impersonate
// @access  Private/SuperAdmin
const impersonateUser = async (req, res) => {
    try {
        const { targetUserId } = req.body;

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: 'Target User ID is required' });
        }

        const targetUser = await User.findByPk(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate a token for the target user
        const token = jwt.sign(
            { id: targetUser.id, role: targetUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Shorter expiry for impersonation
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: targetUser.id,
                    name: targetUser.name,
                    email: targetUser.email,
                    role: targetUser.role
                }
            }
        });
    } catch (error) {
        console.error('Impersonation Error:', error);
        res.status(500).json({ success: false, message: 'Impersonation failed', error: error.message });
    }
};

module.exports = {
    getSystemMetrics,
    executeRawQuery,
    impersonateUser
};
