const { Inquiry } = require('../models');

/**
 * @desc  Submit a school registration inquiry (public)
 * @route POST /api/inquiry
 */
const submitInquiry = async (req, res) => {
    try {
        const { schoolName, contactEmail, adminName, phoneNumber, address, message } = req.body;

        if (!schoolName || !contactEmail || !adminName) {
            return res.status(400).json({
                success: false,
                message: 'School name, contact email, and administrator name are required.'
            });
        }

        const inquiry = await Inquiry.create({
            schoolName,
            contactEmail,
            adminName,
            phoneNumber,
            address,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Your inquiry has been received. Our team will contact you within 1-2 business days.',
            data: { id: inquiry.id }
        });
    } catch (error) {
        console.error('Inquiry submission failed:', error);
        res.status(500).json({ success: false, message: 'Failed to submit inquiry.' });
    }
};

/**
 * @desc  Get all inquiries (super admin only)
 * @route GET /api/inquiry
 */
const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: inquiries });
    } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch inquiries.' });
    }
};

module.exports = { submitInquiry, getInquiries };
