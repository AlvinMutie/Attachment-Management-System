const { Logbook, Student } = require('../models');
const path = require('path');

/**
 * Submit a weekly logbook
 */
const submitLogbook = async (req, res) => {
    try {
        const { weekNumber, startDate, endDate, summary } = req.body;
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // Process attachments
        const attachments = req.files ? req.files.map(file => ({
            url: `/uploads/logbooks/${file.filename}`,
            name: file.originalname,
            type: file.mimetype
        })) : [];

        const logbook = await Logbook.create({
            studentId: student.id,
            schoolId: req.schoolId,
            weekNumber,
            startDate,
            endDate,
            summary,
            attachments,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Logbook submitted successfully',
            data: logbook
        });
    } catch (error) {
        console.error('Submit logbook error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit logbook' });
    }
};

/**
 * Get student's logbooks
 */
const getMyLogbooks = async (req, res) => {
    try {
        const student = await Student.findOne({ where: { userId: req.user.id } });

        const logbooks = await Logbook.findAll({
            where: { studentId: student.id },
            order: [['weekNumber', 'DESC']]
        });

        res.json({
            success: true,
            data: logbooks
        });
    } catch (error) {
        console.error('Get my logbooks error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch logbooks' });
    }
};

const { refineSummary } = require('../services/aiService');

/**
 * AI Refine a logbook summary
 */
const refineLogbookSummary = async (req, res) => {
    try {
        const { summary } = req.body;
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const refinedDraft = await refineSummary(summary, { department: student.department });

        res.json({
            success: true,
            data: {
                original: summary,
                refined: refinedDraft
            }
        });
    } catch (error) {
        console.error('Refine summary error detailed:', {
            error: error.message,
            stack: error.stack,
            userId: req.user.id
        });
        res.status(500).json({ success: false, message: `AI Refinement failed: ${error.message}` });
    }
};

module.exports = {
    submitLogbook,
    getMyLogbooks,
    refineLogbookSummary
};
