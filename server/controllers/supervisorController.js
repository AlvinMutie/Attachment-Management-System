const { Student, User, Attendance, Logbook } = require('../models');
const { Op } = require('sequelize');

/**
 * Get live presence of students for an industry supervisor
 */
const getLivePresence = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Find students assigned to this industry supervisor
        const students = await Student.findAll({
            where: {
                industrySupervisorId: req.user.id
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                },
                {
                    model: Attendance,
                    as: 'attendance',
                    where: {
                        date: today
                    },
                    required: false,
                    attributes: ['status', 'timestamp']
                },
                {
                    model: Logbook,
                    as: 'logbooks',
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    attributes: ['weekNumber', 'status', 'attachments']
                }
            ]
        });

        res.json({
            success: true,
            data: students.map(student => ({
                id: student.id,
                name: student.user.name,
                email: student.user.email,
                course: student.course,
                admissionNumber: student.admissionNumber,
                photo: student.photo,
                presenceStatus: student.attendance.length > 0 ? student.attendance[0].status : 'not-scanned',
                lastSeen: student.attendance.length > 0 ? student.attendance[0].timestamp : null,
                latestLogbook: student.logbooks.length > 0 ? student.logbooks[0] : null
            }))
        });
    } catch (error) {
        console.error('Get live presence error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch presence data' });
    }
};

module.exports = {
    getLivePresence
};
