const { School, AuditLog } = require('../models');
const { logAudit } = require('../utils/auditLogger');

/**
 * Get current school details
 */
const getMySchool = async (req, res) => {
    try {
        const school = await School.findByPk(req.schoolId);

        if (!school) {
            return res.status(404).json({ success: false, message: 'School context not found' });
        }

        res.json({
            success: true,
            data: school
        });
    } catch (error) {
        console.error('Get my school error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch institutional data' });
    }
};

/**
 * Update my school details (Branding, etc.)
 */
const updateMySchool = async (req, res) => {
    try {
        const { name, logo, address, contactEmail, primaryColor } = req.body;
        let finalLogo = logo;

        // Handle uploaded file if present
        if (req.file) {
            finalLogo = `/uploads/logos/${req.file.filename}`;
        }

        const school = await School.findByPk(req.schoolId);

        if (!school) {
            return res.status(404).json({ success: false, message: 'School context not found' });
        }

        const oldData = { ...school.toJSON() };

        await school.update({
            name: name || school.name,
            logo: finalLogo !== undefined ? finalLogo : school.logo,
            address: address || school.address,
            contactEmail: contactEmail || school.contactEmail,
            primaryColor: primaryColor || school.primaryColor
        });

        // Log audit
        await logAudit({
            userId: req.user.id,
            action: 'UPDATE_SCHOOL_BRANDING',
            targetType: 'School',
            targetId: school.id,
            metadata: { oldData, newData: school.toJSON() },
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.json({
            success: true,
            message: 'Institutional branding updated successfully',
            data: school
        });
    } catch (error) {
        console.error('Update my school error:', error);
        res.status(500).json({ success: false, message: 'Failed to update institutional data' });
    }
};

module.exports = {
    getMySchool,
    updateMySchool
};
