const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize, testConnection } = require('./config/database');

const app = express();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images from other origins
}));

// Tightened CORS for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : true,
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test DB Connection
testConnection();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/superadmin', require('./routes/superadminRoutes'));
app.use('/api/school', require('./routes/schoolRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/supervisor', require('./routes/supervisorRoutes'));
app.use('/api/university', require('./routes/universityRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/the-one', require('./routes/theOneRoutes'));
app.use('/api/inquiry', require('./routes/inquiryRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('AMS API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'An internal server error occurred'
            : err.message
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Sync database (creates missing tables only, never alters existing ones) then start server
sequelize.sync().then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('❌ Database sync failed:', err);
    process.exit(1);
});
