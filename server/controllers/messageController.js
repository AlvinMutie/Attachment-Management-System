const { Message, User, School, Student, sequelize } = require('../models');
const { Op } = require('sequelize');
const { logAudit } = require('../utils/auditLogger');

/**
 * Send a message to another user
 */
const sendMessage = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;
        const schoolId = req.schoolId;

        if (!receiverId || !content) {
            return res.status(400).json({ success: false, message: 'Receiver and content are required' });
        }

        // Verify receiver exists
        const receiver = await User.findOne({ where: { id: receiverId, schoolId } });
        if (!receiver) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Receiver not found' });
        }

        const message = await Message.create({
            senderId,
            receiverId,
            content,
            schoolId,
            isRead: false
        }, { transaction });

        // Log the action? Maybe too verbose for every message. Let's skip audit log for chat messages to save space,
        // or log only high level info.

        await transaction.commit();
        res.status(201).json({ success: true, data: message });

    } catch (error) {
        await transaction.rollback();
        console.error('Send message error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};

/**
 * Get messages between current user and another user
 */
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: userId },
                    { senderId: userId, receiverId: currentUserId }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'role'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'role'] }
            ]
        });

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

/**
 * Mark messages as read
 */
const markAsRead = async (req, res) => {
    try {
        const { senderId } = req.body; // Mark messages sent by this user as read
        const currentUserId = req.user.id;

        await Message.update(
            { isRead: true },
            {
                where: {
                    senderId: senderId,
                    receiverId: currentUserId,
                    isRead: false
                }
            }
        );

        res.json({ success: true, message: 'Messages marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
    }
};

/**
 * Get contacts (Students for Supervisors, Supervisors for Students)
 */
const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let contacts = [];

        if (role === 'student') {
            const student = await Student.findOne({
                where: { userId },
                include: [
                    { model: User, as: 'industrySupervisor', attributes: ['id', 'name', 'email', 'role'] },
                    { model: User, as: 'universitySupervisor', attributes: ['id', 'name', 'email', 'role'] }
                ]
            });

            if (student) {
                if (student.industrySupervisor) contacts.push(student.industrySupervisor);
                if (student.universitySupervisor) contacts.push(student.universitySupervisor);
            }
        } else if (['university_supervisor', 'industry_supervisor'].includes(role)) {
            const whereClause = role === 'university_supervisor'
                ? { universitySupervisorId: userId }
                : { industrySupervisorId: userId };

            const students = await Student.findAll({
                where: whereClause,
                include: [
                    { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }
                ]
            });

            contacts = students.map(s => s.user).filter(Boolean);
        }

        // Add last message info for each contact (optional, but good for UI)
        // For now, let's keep it simple and just return the users.

        res.json({ success: true, data: contacts });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markAsRead,
    getContacts
};
