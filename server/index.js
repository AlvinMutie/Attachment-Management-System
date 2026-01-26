const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize, testConnection } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test DB Connection
testConnection();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('AMS API is running...');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
