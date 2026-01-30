const { Meeting, User, Student, School, AuditLog, sequelize } = require('../models');
const { logAudit } = require('../utils/auditLogger');
const { Op } = require('sequelize');

/**
 * Initiate a meeting request (University Supervisor Only)
 */
const createMeeting = async (req, res) => {
    if (req.user.role !== 'university_supervisor') {
        return res.status(403).json({ success: false, message: 'Only School Supervisors can initiate meetings' });
    }

    const transaction = await sequelize.transaction();
    try {
        const { studentId, industrySupervisorId, type, scheduledAt, purpose } = req.body;

        if (!studentId && !industrySupervisorId) {
            return res.status(400).json({ success: false, message: 'Must invite at least one participant' });
        }

        const meeting = await Meeting.create({
            schoolId: req.schoolId,
            initiatorId: req.user.id,
            studentId,
            industrySupervisorId,
            type,
            scheduledAt,
            purpose,
            status: 'pending'
        }, { transaction });

        // Create notification placeholder (future) & Log
        await logAudit(req.user.id, 'MEETING_INITIATED', `Initiated ${type} meeting for ${scheduledAt}`, { meetingId: meeting.id }, transaction);

        await transaction.commit();
        res.status(201).json({ success: true, message: 'Meeting request sent', data: meeting });

    } catch (error) {
        await transaction.rollback();
        console.error('Create meeting error:', error);
        res.status(500).json({ success: false, message: 'Failed to schedule meeting' });
    }
};

/**
 * Get meetings for the current user
 */
const getMeetings = async (req, res) => {
    try {
        let whereClause = { schoolId: req.schoolId };

        if (req.user.role === 'university_supervisor') {
            whereClause.initiatorId = req.user.id;
        } else if (req.user.role === 'industry_supervisor') {
            whereClause.industrySupervisorId = req.user.id;
        } else if (req.user.role === 'student') {
            const student = await Student.findOne({ where: { userId: req.user.id } });
            if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
            whereClause.studentId = student.id;
        } else if (req.user.role === 'school_admin') {
            // Admin sees confirmed meetings
            whereClause.status = 'confirmed';
        }

        const meetings = await Meeting.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'initiator', attributes: ['id', 'name', 'email'] },
                { model: Student, as: 'student', include: [{ model: User, as: 'user', attributes: ['name'] }] },
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name'] }
            ],
            order: [['scheduledAt', 'ASC']]
        });

        res.json({ success: true, data: meetings });
    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch meetings' });
    }
};

/**
 * Respond to meeting (Accept/Decline/Reschedule)
 */
const respondToMeeting = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status, responseNote, rescheduleProposal } = req.body;

        const meeting = await Meeting.findByPk(id);
        if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

        // Validate permissions
        let isParticipant = false;
        if (req.user.role === 'industry_supervisor' && meeting.industrySupervisorId === req.user.id) isParticipant = true;

        if (req.user.role === 'student') {
            const student = await Student.findOne({ where: { userId: req.user.id } });
            if (student && meeting.studentId === student.id) isParticipant = true;
        }

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: 'Not authorized to respond to this meeting' });
        }

        const updates = { responseNote };
        if (status === 'rescheduling') updates.rescheduleProposal = rescheduleProposal;

        if (req.user.role === 'industry_supervisor' && meeting.industrySupervisorId === req.user.id) {
            updates.industryStatus = status;
        } else if (req.user.role === 'student') {
            const student = await Student.findOne({ where: { userId: req.user.id } });
            if (student && meeting.studentId === student.id) {
                updates.studentStatus = status;
            } else {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }
        } else {
            return res.status(403).json({ success: false, message: 'Invalid role for response' });
        }

        await meeting.update(updates, { transaction });

        // Check for Consensus
        const updatedMeeting = await Meeting.findByPk(id, { transaction });
        const studentAgreed = !updatedMeeting.studentId || updatedMeeting.studentStatus === 'accepted';
        const industryAgreed = !updatedMeeting.industrySupervisorId || updatedMeeting.industryStatus === 'accepted';

        if (studentAgreed && industryAgreed) {
            await updatedMeeting.update({ status: 'confirmed' }, { transaction });
            await logAudit(req.user.id, 'MEETING_CONFIRMED', `Meeting ${meeting.id} fully confirmed`, { meetingId: meeting.id }, transaction);
        } else {
            await logAudit(req.user.id, `MEETING_${status.toUpperCase()}`, `User responded to meeting ${meeting.id}`, { status, note: responseNote }, transaction);
        }

        await transaction.commit();
        res.json({ success: true, message: `Response recorded: ${status}`, data: updatedMeeting });

    } catch (error) {
        await transaction.rollback();
        console.error('Meeting response error:', error);
        res.status(500).json({ success: false, message: 'Failed to update meeting status' });
    }
};

module.exports = {
    createMeeting,
    getMeetings,
    respondToMeeting
};
