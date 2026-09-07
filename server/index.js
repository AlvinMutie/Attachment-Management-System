const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { validateEnv } = require('./config/envValidator');
const { sequelize, testConnection } = require('./config/database');
const { requestCorrelation } = require('./middleware/requestCorrelation');
const { requestLogger } = require('./middleware/logger');
const { apiRateLimiter } = require('./middleware/rateLimiter');

// Fail-fast environment validation
validateEnv();

const app = express();

// Request Correlation (X-Request-ID)
app.use(requestCorrelation);

// Structured Request Logger
app.use(requestLogger);

// Security Middleware (Helmet)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : false)
        : true,
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// General API Rate Limiting
app.use('/api/', apiRateLimiter({ maxAttempts: 300, windowMs: 60 * 1000 }));

// Health & Liveness Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        requestId: req.id
    });
});

// Readiness Check Endpoint (Validates Database Connectivity)
app.get('/ready', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({
            status: 'ready',
            database: 'connected',
            timestamp: new Date().toISOString(),
            requestId: req.id
        });
    } catch (err) {
        res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: process.env.NODE_ENV === 'production' ? 'Database connection failure' : err.message,
            timestamp: new Date().toISOString(),
            requestId: req.id
        });
    }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/superadmin', require('./routes/superadminRoutes'));
app.use('/api/school', require('./routes/schoolRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/supervisor', require('./routes/supervisorRoutes'));
app.use('/api/university', require('./routes/universityRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/coordinator', require('./routes/coordinatorRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/insights', require('./routes/insightRoutes'));
app.use('/api/the-one', require('./routes/theOneRoutes'));
app.use('/api/inquiry', require('./routes/inquiryRoutes'));

// Root Status Route
app.get('/', (req, res) => {
    res.json({
        name: 'Attachment Management System API',
        version: '1.0.0',
        status: 'operational',
        healthCheck: '/health',
        readinessCheck: '/ready'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    if (status >= 500) {
        console.error(`[${req.id || 'GLOBAL_ERR'}] Error:`, err);
    }

    res.status(status).json({
        success: false,
        requestId: req.id,
        message: isProduction
            ? (status === 500 ? 'An unexpected internal server error occurred' : err.message)
            : err.message
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

let server;

// Start Server after verifying schema
const startServer = async () => {
    try {
        await testConnection();
        await sequelize.sync();
        console.log('✅ Database schema verified');

        server = app.listen(PORT, () => {
            console.log(`🚀 AMS Server listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
        });
    } catch (err) {
        console.error('❌ Fatal server startup error:', err);
        process.exit(1);
    }
};

startServer();

// Graceful Shutdown Handling
const gracefulShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown sequence...`);

    if (server) {
        server.close(async () => {
            console.log('  1. HTTP server connections closed.');
            try {
                await sequelize.close();
                console.log('  2. Database connection closed safely.');
                console.log('✅ Graceful shutdown completed.');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error during database teardown:', err);
                process.exit(1);
            }
        });

        // Force shutdown if cleanup takes too long
        setTimeout(() => {
            console.error('⚠️  Forced shutdown after 10s timeout.');
            process.exit(1);
        }, 10000).unref();
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Process-level unhandled rejection/exception safety
process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception thrown:', err);
    gracefulShutdown('uncaughtException');
});

module.exports = app;
