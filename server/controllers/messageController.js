const { Message, User, School, Student, SupervisorAssignment, sequelize } = require('../models');
const { Op } = require('sequelize');
const { logAudit } = require('../utils/auditLogger');
const { createNotification } = require('../services/notificationService');

/**
 * Validate whether sender is authorized to communicate with receiver
 */
const isAuthorizedToMessage = async (sender, receiverId) => {
    if (String(sender.id) === String(receiverId)) {
        return { allowed: false, reason: 'Cannot message yourself' };
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
        return { allowed: false, reason: 'Receiver not found', status: 404 };
    }

    // Super Admin can message anyone
    if (sender.role === 'super_admin' || receiver.role === 'super_admin') {
        return { allowed: true, receiver };
    }

    // Multi-tenant check: if both have schoolId, verify match
    if (sender.schoolId && receiver.schoolId && String(sender.schoolId) !== String(receiver.schoolId)) {
        return { allowed: false, reason: 'Cross-tenant communication is not permitted', status: 403 };
    }

    // School Admin or Attachment Coordinator can message anyone in their school, and anyone can message them
    const isSenderPrivileged = ['school_admin', 'attachment_coordinator'].includes(sender.role);
    const isReceiverPrivileged = ['school_admin', 'attachment_coordinator'].includes(receiver.role);
    if (isSenderPrivileged || isReceiverPrivileged) {
        return { allowed: true, receiver };
    }

    // Student rules
    if (sender.role === 'student') {
        const studentProfile = await Student.findOne({
            where: {
                [Op.or]: [
                    { userId: sender.id },
                    { id: sender.id }
                ]
            }
        });

        // Students can message any assigned supervisor or school staff in their school
        const isSupervisorOrStaff = (
            ['university_supervisor', 'industry_supervisor', 'attachment_coordinator', 'school_admin'].includes(receiver.role) &&
            (!sender.schoolId || !receiver.schoolId || String(sender.schoolId) === String(receiver.schoolId))
        );

        if (isSupervisorOrStaff) {
            return { allowed: true, receiver };
        }

        if (studentProfile) {
            const isAssigned = (
                (studentProfile.industrySupervisorId && String(studentProfile.industrySupervisorId) === String(receiver.id)) ||
                (studentProfile.universitySupervisorId && String(studentProfile.universitySupervisorId) === String(receiver.id))
            );
            if (isAssigned) {
                return { allowed: true, receiver };
            }
        }

        return {
            allowed: false,
            reason: 'Students may only message their assigned supervisors, coordinators, or administrators',
            status: 403
        };
    }

    // Industry Supervisor rules
    if (sender.role === 'industry_supervisor') {
        if (['student', 'school_admin', 'attachment_coordinator', 'university_supervisor'].includes(receiver.role)) {
            return { allowed: true, receiver };
        }

        return {
            allowed: false,
            reason: 'Industry supervisors may only message assigned student interns, faculty, or administrators',
            status: 403
        };
    }

    // University Supervisor rules
    if (sender.role === 'university_supervisor') {
        if (['student', 'school_admin', 'attachment_coordinator', 'industry_supervisor'].includes(receiver.role)) {
            return { allowed: true, receiver };
        }

        return {
            allowed: false,
            reason: 'University supervisors may only message student attachees or school personnel',
            status: 403
        };
    }

    return { allowed: false, reason: 'Unauthorized communication channel', status: 403 };
};

/**
 * Send a message to another user
 */
const sendMessage = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { receiverId, content } = req.body;
        const sender = req.user;
        const schoolId = req.schoolId || sender.schoolId;

        if (!receiverId || !content || !content.trim()) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Receiver and non-empty content are required' });
        }

        // Validate relationship authorization
        const authCheck = await isAuthorizedToMessage(sender, receiverId);
        if (!authCheck.allowed) {
            await transaction.rollback();
            return res.status(authCheck.status || 403).json({
                success: false,
                message: authCheck.reason
            });
        }

        const receiver = authCheck.receiver;

        const message = await Message.create({
            senderId: sender.id,
            receiverId: receiver.id,
            content: content.trim(),
            schoolId: schoolId || receiver.schoolId,
            isRead: false
        }, { transaction });

        await transaction.commit();

        // Dispatch in-app notification to recipient
        try {
            await createNotification({
                recipientId: receiver.id,
                schoolId: schoolId || receiver.schoolId,
                type: 'new_message',
                title: `New message from ${sender.name}`,
                message: content.length > 80 ? `${content.substring(0, 77)}...` : content,
                entityType: 'message',
                entityId: message.id
            });
        } catch (notifErr) {
            console.error('Failed to create message notification:', notifErr.message);
        }

        // Return message with sender details
        const fullMessage = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'role', 'email'] },
                { model: User, as: 'receiver', attributes: ['id', 'name', 'role', 'email'] }
            ]
        });

        res.status(201).json({ success: true, data: fullMessage });

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
        const sender = req.user;

        // Check if user is allowed to view messages with this user
        const authCheck = await isAuthorizedToMessage(sender, userId);
        if (!authCheck.allowed) {
            return res.status(authCheck.status || 403).json({
                success: false,
                message: authCheck.reason
            });
        }

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: sender.id, receiverId: userId },
                    { senderId: userId, receiverId: sender.id }
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
        const { senderId } = req.body;
        const currentUserId = req.user.id;

        if (!senderId) {
            return res.status(400).json({ success: false, message: 'senderId is required' });
        }

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
 * Get authorized contacts for the current user
 */
const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const schoolId = req.user.schoolId;
        const contactMap = new Map();

        const addContact = (user, extra = {}) => {
            if (user && user.id !== userId && !contactMap.has(user.id)) {
                contactMap.set(user.id, {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    ...extra
                });
            }
        };

        if (role === 'student') {
            const student = await Student.findOne({
                where: { userId },
                include: [
                    { model: User, as: 'industrySupervisor', attributes: ['id', 'name', 'email', 'role'] },
                    { model: User, as: 'universitySupervisor', attributes: ['id', 'name', 'email', 'role'] }
                ]
            });

            if (student) {
                if (student.industrySupervisor) addContact(student.industrySupervisor, { roleLabel: 'Industry Supervisor' });
                if (student.universitySupervisor) addContact(student.universitySupervisor, { roleLabel: 'University Supervisor' });
            }

            // Also include School Admins and Coordinators in the same school
            if (schoolId) {
                const schoolStaff = await User.findAll({
                    where: { schoolId, role: { [Op.in]: ['school_admin', 'attachment_coordinator'] } },
                    attributes: ['id', 'name', 'email', 'role']
                });
                schoolStaff.forEach(staff => addContact(staff, { roleLabel: staff.role === 'attachment_coordinator' ? 'Attachment Coordinator' : 'School Administrator' }));
            }

        } else if (role === 'industry_supervisor' || role === 'university_supervisor') {
            const whereClause = role === 'university_supervisor'
                ? { universitySupervisorId: userId }
                : { industrySupervisorId: userId };

            const students = await Student.findAll({
                where: whereClause,
                include: [
                    { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }
                ]
            });

            students.forEach(s => {
                if (s.user) {
                    addContact(s.user, {
                        roleLabel: 'Assigned Student Intern',
                        admissionNumber: s.admissionNumber,
                        department: s.department || s.course
                    });
                }
            });

            // If no students assigned directly yet, check SupervisorAssignments table
            if (contactMap.size === 0) {
                const assignments = await SupervisorAssignment.findAll({
                    where: { supervisorId: userId },
                    include: [
                        {
                            model: Student,
                            as: 'student',
                            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }]
                        }
                    ]
                });

                assignments.forEach(a => {
                    if (a.student && a.student.user) {
                        addContact(a.student.user, {
                            roleLabel: 'Assigned Student Intern',
                            admissionNumber: a.student.admissionNumber,
                            department: a.student.department || a.student.course
                        });
                    }
                });
            }

            // If still empty in a school/demo tenant, load active school students
            if (contactMap.size === 0 && schoolId) {
                const schoolStudents = await Student.findAll({
                    where: { schoolId },
                    include: [
                        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }
                    ],
                    limit: 30
                });

                schoolStudents.forEach(s => {
                    if (s.user) {
                        addContact(s.user, {
                            roleLabel: 'Student Intern',
                            admissionNumber: s.admissionNumber,
                            department: s.department || s.course
                        });
                    }
                });
            }

            // Also include School Admins, Attachment Coordinators, and counterpart Supervisors
            if (schoolId) {
                const schoolStaff = await User.findAll({
                    where: {
                        schoolId,
                        role: { [Op.in]: ['school_admin', 'attachment_coordinator', 'industry_supervisor', 'university_supervisor'] },
                        id: { [Op.ne]: userId }
                    },
                    attributes: ['id', 'name', 'email', 'role']
                });
                schoolStaff.forEach(staff => {
                    let label = 'Staff Member';
                    if (staff.role === 'attachment_coordinator') label = 'Attachment Coordinator';
                    else if (staff.role === 'school_admin') label = 'School Administrator';
                    else if (staff.role === 'industry_supervisor') label = 'Industry Supervisor';
                    else if (staff.role === 'university_supervisor') label = 'Faculty Supervisor';
                    addContact(staff, { roleLabel: label });
                });
            }

        } else if (role === 'school_admin' || role === 'attachment_coordinator') {
            const users = await User.findAll({
                where: {
                    schoolId,
                    id: { [Op.ne]: userId }
                },
                attributes: ['id', 'name', 'email', 'role']
            });
            users.forEach(u => addContact(u, { roleLabel: u.role.replace('_', ' ') }));

        } else if (role === 'super_admin') {
            const users = await User.findAll({
                where: { id: { [Op.ne]: userId } },
                attributes: ['id', 'name', 'email', 'role']
            });
            users.forEach(u => addContact(u, { roleLabel: u.role.replace('_', ' ') }));
        }

        const contacts = Array.from(contactMap.values());
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
    getContacts,
    isAuthorizedToMessage
};
