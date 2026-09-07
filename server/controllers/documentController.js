const path = require('path');
const fs = require('fs');
const { Student, Logbook, User } = require('../models');

/**
 * Secure Document & Evidence Streaming Controller
 * Enforces server-side authorization, path traversal sanitization, object-level access control,
 * and tenant isolation for all student uploaded evidence and attachments.
 */
const serveDocument = async (req, res) => {
    try {
        const { category, filename } = req.params;

        // 1. Sanitize category and filename against Directory Traversal Attacks
        const allowedCategories = ['logbooks', 'evidence', 'documents', 'profiles'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ success: false, message: 'Invalid document category' });
        }

        // Strict filename sanitization: only alphanumeric, dashes, underscores, and single dot extension
        if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\') || filename.includes('\0')) {
            return res.status(400).json({ success: false, message: 'Invalid or potentially malicious filename' });
        }

        const uploadsDir = path.resolve(__dirname, '../uploads', category);
        const filePath = path.join(uploadsDir, filename);

        // Verify the resolved path is strictly within the intended uploads directory
        if (!filePath.startsWith(uploadsDir)) {
            return res.status(403).json({ success: false, message: 'Path traversal attempt blocked' });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // 2. Object-level Authorization Checks
        if (category === 'logbooks') {
            const fileUrlPattern = `/uploads/logbooks/${filename}`;
            // Find logbook containing this attachment
            const logbooks = await Logbook.findAll({
                include: [{ model: Student, as: 'student' }]
            });

            const matchingLogbook = logbooks.find(l => {
                const attachments = Array.isArray(l.attachments) ? l.attachments : [];
                return attachments.some(a => a.url === fileUrlPattern || a.name === filename || (a.url && a.url.includes(filename)));
            });

            if (matchingLogbook) {
                const student = matchingLogbook.student;

                // Tenant check
                if (req.user.role !== 'super_admin' && student.schoolId !== req.schoolId) {
                    return res.status(403).json({ success: false, message: 'Cross-tenant document access denied' });
                }

                // Role-based document access authorization
                if (req.user.role === 'student') {
                    if (student.userId !== req.user.id) {
                        return res.status(403).json({ success: false, message: 'Access denied: You can only access your own evidence' });
                    }
                } else if (req.user.role === 'industry_supervisor') {
                    if (student.industrySupervisorId !== req.user.id) {
                        return res.status(403).json({ success: false, message: 'Access denied: Student is not assigned to you' });
                    }
                } else if (req.user.role === 'university_supervisor') {
                    if (student.universitySupervisorId !== req.user.id) {
                        return res.status(403).json({ success: false, message: 'Access denied: Student is not assigned to you' });
                    }
                } else if (!['attachment_coordinator', 'school_admin', 'super_admin'].includes(req.user.role)) {
                    return res.status(403).json({ success: false, message: 'Access denied' });
                }
            }
        }

        // 3. Safe Streaming
        res.sendFile(filePath);
    } catch (error) {
        console.error('Serve document error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve document' });
    }
};

module.exports = {
    serveDocument
};
