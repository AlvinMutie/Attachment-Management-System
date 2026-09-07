const { Notification } = require('../models');

/**
 * Get notifications for authenticated user
 */
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            recipientId: req.user.id,
            schoolId: req.schoolId
        };

        if (unreadOnly === 'true') {
            whereClause.isRead = false;
        }

        const { count, rows } = await Notification.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            notifications: rows,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
};

/**
 * Get unread notifications count
 */
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.count({
            where: {
                recipientId: req.user.id,
                schoolId: req.schoolId,
                isRead: false
            }
        });

        res.json({
            success: true,
            unreadCount: count,
            data: { unreadCount: count }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
    }
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOne({
            where: {
                id,
                recipientId: req.user.id,
                schoolId: req.schoolId
            }
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        await notification.update({
            isRead: true,
            readAt: new Date()
        });

        res.json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({ success: false, message: 'Failed to update notification' });
    }
};

/**
 * Mark all notifications as read for current user
 */
const markAllAsRead = async (req, res) => {
    try {
        await Notification.update(
            { isRead: true, readAt: new Date() },
            {
                where: {
                    recipientId: req.user.id,
                    schoolId: req.schoolId,
                    isRead: false
                }
            }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark all as read' });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};
