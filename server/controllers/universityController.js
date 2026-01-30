const { Student, User } = require('../models');

/**
 * Get students assigned to the university supervisor
 */
const getMyStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: {
                universitySupervisorId: req.user.id,
                schoolId: req.schoolId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'industrySupervisor',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Get my students error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch assigned students' });
    }
};

module.exports = {
    getMyStudents
};
