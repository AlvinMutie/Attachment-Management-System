const { Student, User, School, Attendance, Logbook, Assessment, sequelize } = require('../models');
const { Op } = require('sequelize');
const { formatCSV } = require('../services/csvService');
const { getInstitutionalOperationalAlerts } = require('../utils/operationalAlerts');

/**
 * 1. Placements Summary & Comprehensive Report
 */
const getPlacementReport = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            status = '',
            department = '',
            export: exportFormat = ''
        } = req.query;

        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || null) : req.schoolId;
        const whereClause = {};
        if (schoolId) whereClause.schoolId = schoolId;
        if (status) whereClause.placementStatus = status;
        if (department) whereClause.department = department;

        const userWhereClause = {};
        if (search) {
            userWhereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const include = [
            {
                model: User,
                as: 'user',
                where: Object.keys(userWhereClause).length > 0 ? userWhereClause : undefined,
                attributes: ['id', 'name', 'email', 'status']
            },
            {
                model: User,
                as: 'industrySupervisor',
                attributes: ['id', 'name', 'email']
            },
            {
                model: User,
                as: 'universitySupervisor',
                attributes: ['id', 'name', 'email']
            },
            {
                model: School,
                as: 'school',
                attributes: ['id', 'name']
            }
        ];

        if (exportFormat === 'csv') {
            const students = await Student.findAll({
                where: whereClause,
                include,
                order: [['createdAt', 'DESC']]
            });

            const headers = [
                'Student Name',
                'Email',
                'Admission Number',
                'Department',
                'Course',
                'Placement Status',
                'Organization Name',
                'Contact Person',
                'Start Date',
                'End Date',
                'Industry Supervisor',
                'University Supervisor',
                'School'
            ];

            const fields = [
                r => r.user?.name || 'N/A',
                r => r.user?.email || 'N/A',
                r => r.admissionNumber || 'N/A',
                r => r.department || 'N/A',
                r => r.course || 'N/A',
                r => r.placementStatus || 'DRAFT',
                r => r.organizationName || 'N/A',
                r => r.contactPerson || 'N/A',
                r => r.startDate || 'N/A',
                r => r.endDate || 'N/A',
                r => r.industrySupervisor?.name || 'Unassigned',
                r => r.universitySupervisor?.name || 'Unassigned',
                r => r.school?.name || 'N/A'
            ];

            const csvData = formatCSV(headers, students, fields);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="placements-report-${Date.now()}.csv"`);
            return res.send(csvData);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Student.findAndCountAll({
            where: whereClause,
            include,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Placement report error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate placement report' });
    }
};

/**
 * 2. Attendance Oversight Report
 */
const getAttendanceReport = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status = '',
            dateFrom = '',
            dateTo = '',
            export: exportFormat = ''
        } = req.query;

        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || null) : req.schoolId;
        const whereClause = {};
        if (schoolId) whereClause.schoolId = schoolId;
        if (status) whereClause.status = status;

        if (dateFrom && dateTo) {
            whereClause.date = { [Op.between]: [dateFrom, dateTo] };
        } else if (dateFrom) {
            whereClause.date = { [Op.gte]: dateFrom };
        } else if (dateTo) {
            whereClause.date = { [Op.lte]: dateTo };
        }

        const include = [
            {
                model: Student,
                as: 'student',
                include: [
                    { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
                ],
                attributes: ['id', 'admissionNumber', 'department', 'organizationName']
            },
            {
                model: User,
                as: 'scanner',
                attributes: ['id', 'name', 'role']
            }
        ];

        if (exportFormat === 'csv') {
            const records = await Attendance.findAll({
                where: whereClause,
                include,
                order: [['date', 'DESC'], ['createdAt', 'DESC']]
            });

            const headers = [
                'Date',
                'Student Name',
                'Admission Number',
                'Department',
                'Organization',
                'Status',
                'Verification Method',
                'Recorded By',
                'Notes'
            ];

            const fields = [
                r => r.date,
                r => r.student?.user?.name || 'N/A',
                r => r.student?.admissionNumber || 'N/A',
                r => r.student?.department || 'N/A',
                r => r.student?.organizationName || 'N/A',
                r => r.status,
                r => r.verificationMethod || 'system',
                r => r.scanner?.name || 'Self',
                r => r.notes || ''
            ];

            const csvData = formatCSV(headers, records, fields);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="attendance-report-${Date.now()}.csv"`);
            return res.send(csvData);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Attendance.findAndCountAll({
            where: whereClause,
            include,
            limit: parseInt(limit),
            offset,
            order: [['date', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Attendance report error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate attendance report' });
    }
};

/**
 * 3. Logbook Submissions Report
 */
const getLogbookReport = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status = '',
            export: exportFormat = ''
        } = req.query;

        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || null) : req.schoolId;
        const whereClause = {};
        if (schoolId) whereClause.schoolId = schoolId;
        if (status) whereClause.status = status;

        const include = [
            {
                model: Student,
                as: 'student',
                include: [
                    { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                    { model: User, as: 'industrySupervisor', attributes: ['id', 'name'] }
                ],
                attributes: ['id', 'admissionNumber', 'department', 'organizationName']
            }
        ];

        if (exportFormat === 'csv') {
            const records = await Logbook.findAll({
                where: whereClause,
                include,
                order: [['createdAt', 'DESC']]
            });

            const headers = [
                'Week Number',
                'Student Name',
                'Admission Number',
                'Department',
                'Status',
                'Submission Date',
                'Supervisor',
                'Summary Preview'
            ];

            const fields = [
                r => `Week ${r.weekNumber}`,
                r => r.student?.user?.name || 'N/A',
                r => r.student?.admissionNumber || 'N/A',
                r => r.student?.department || 'N/A',
                r => r.status,
                r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A',
                r => r.student?.industrySupervisor?.name || 'Unassigned',
                r => (r.summary || '').substring(0, 100)
            ];

            const csvData = formatCSV(headers, records, fields);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="logbooks-report-${Date.now()}.csv"`);
            return res.send(csvData);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Logbook.findAndCountAll({
            where: whereClause,
            include,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Logbook report error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate logbook report' });
    }
};

/**
 * 4. Assessment Performance Report
 */
const getAssessmentReport = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            type = '',
            evaluatorType = '',
            export: exportFormat = ''
        } = req.query;

        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || null) : req.schoolId;
        const whereClause = {};
        if (schoolId) whereClause.schoolId = schoolId;
        if (type) whereClause.type = type;
        if (evaluatorType) whereClause.evaluatorType = evaluatorType;

        const include = [
            {
                model: Student,
                as: 'student',
                include: [
                    { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
                ],
                attributes: ['id', 'admissionNumber', 'department', 'organizationName']
            },
            {
                model: User,
                as: 'evaluator',
                attributes: ['id', 'name', 'role', 'email']
            }
        ];

        if (exportFormat === 'csv') {
            const records = await Assessment.findAll({
                where: whereClause,
                include,
                order: [['createdAt', 'DESC']]
            });

            const headers = [
                'Student Name',
                'Admission Number',
                'Department',
                'Assessment Type',
                'Evaluator Role',
                'Evaluator Name',
                'Score (%)',
                'Feedback',
                'Date Recorded'
            ];

            const fields = [
                r => r.student?.user?.name || 'N/A',
                r => r.student?.admissionNumber || 'N/A',
                r => r.student?.department || 'N/A',
                r => r.type,
                r => r.evaluatorType,
                r => r.evaluator?.name || 'N/A',
                r => r.score !== null ? r.score : 'N/A',
                r => r.feedback || '',
                r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'
            ];

            const csvData = formatCSV(headers, records, fields);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="assessments-report-${Date.now()}.csv"`);
            return res.send(csvData);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Assessment.findAndCountAll({
            where: whereClause,
            include,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Assessment report error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate assessment report' });
    }
};

/**
 * 5. Supervisor Workload & Allocation Report
 */
const getSupervisorWorkloadReport = async (req, res) => {
    try {
        const { export: exportFormat = '' } = req.query;
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || null) : req.schoolId;

        const whereClause = {
            role: { [Op.in]: ['industry_supervisor', 'university_supervisor'] }
        };
        if (schoolId) whereClause.schoolId = schoolId;

        const supervisors = await User.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'email', 'role', 'schoolId'],
            include: [
                {
                    model: School,
                    as: 'school',
                    attributes: ['id', 'name']
                }
            ],
            order: [['role', 'ASC'], ['name', 'ASC']]
        });

        const workloadData = [];

        for (const sup of supervisors) {
            const isUni = sup.role === 'university_supervisor';
            const studentCount = await Student.count({
                where: isUni ? { universitySupervisorId: sup.id } : { industrySupervisorId: sup.id }
            });

            const assessmentCount = await Assessment.count({
                where: { evaluatorId: sup.id }
            });

            workloadData.push({
                id: sup.id,
                name: sup.name,
                email: sup.email,
                role: sup.role,
                schoolName: sup.school?.name || 'N/A',
                assignedStudentsCount: studentCount,
                completedAssessmentsCount: assessmentCount
            });
        }

        if (exportFormat === 'csv') {
            const headers = [
                'Supervisor Name',
                'Email',
                'Supervisor Role',
                'Assigned Students',
                'Completed Evaluations',
                'Institution'
            ];

            const fields = [
                r => r.name,
                r => r.email,
                r => r.role.replace('_', ' ').toUpperCase(),
                r => r.assignedStudentsCount,
                r => r.completedAssessmentsCount,
                r => r.schoolName
            ];

            const csvData = formatCSV(headers, workloadData, fields);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="supervisor-workload-${Date.now()}.csv"`);
            return res.send(csvData);
        }

        res.json({
            success: true,
            data: workloadData
        });
    } catch (error) {
        console.error('Supervisor workload report error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate supervisor workload report' });
    }
};

/**
 * 6. Operational Alerts Intelligence Report
 */
const getOperationalAlertsReport = async (req, res) => {
    try {
        const schoolId = req.user.role === 'super_admin' ? req.query.schoolId : req.schoolId;

        if (!schoolId) {
            return res.status(400).json({ success: false, message: 'School ID required for operational alerts' });
        }

        const alertsData = await getInstitutionalOperationalAlerts(schoolId);

        res.json({
            success: true,
            data: alertsData
        });
    } catch (error) {
        console.error('Operational alerts report error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch operational alerts' });
    }
};

module.exports = {
    getPlacementReport,
    getAttendanceReport,
    getLogbookReport,
    getAssessmentReport,
    getSupervisorWorkloadReport,
    getOperationalAlertsReport
};
