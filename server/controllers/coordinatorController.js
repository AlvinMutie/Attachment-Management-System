const { Student, User, School, Attendance, Logbook, Assessment, Meeting, SupervisorAssignment, Organization, sequelize } = require('../models');
const { Op } = require('sequelize');
const coordinatorService = require('../services/coordinatorService');

/**
 * 1. Get Coordinator Executive Dashboard Metrics
 */
const getDashboard = async (req, res) => {
    try {
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        if (!schoolId) {
            return res.status(400).json({ success: false, message: 'School tenant context required' });
        }

        const metrics = await coordinatorService.getCoordinatorDashboardMetrics(schoolId);

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        console.error('Coordinator getDashboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch coordinator dashboard metrics' });
    }
};

/**
 * 2. Get Prioritized Attention Queue
 */
const getAttentionQueue = async (req, res) => {
    try {
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        if (!schoolId) {
            return res.status(400).json({ success: false, message: 'School tenant context required' });
        }

        const queueData = await coordinatorService.getPrioritizedAttentionQueue(schoolId);

        res.json({
            success: true,
            data: queueData
        });
    } catch (error) {
        console.error('Coordinator getAttentionQueue error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attention queue' });
    }
};

/**
 * 3. Get Placements List with Filters & Pagination
 */
const getPlacements = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            status = '',
            course = '',
            department = '',
            supervisorId = '',
            organization = ''
        } = req.query;

        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;
        const whereClause = { schoolId };

        if (status) whereClause.placementStatus = status;
        if (course) whereClause.course = course;
        if (department) whereClause.department = department;
        if (organization) whereClause.organizationName = { [Op.like]: `%${organization}%` };
        if (supervisorId) {
            whereClause[Op.or] = [
                { industrySupervisorId: supervisorId },
                { universitySupervisorId: supervisorId }
            ];
        }

        const userWhere = {};
        if (search) {
            userWhere[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Student.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
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
                }
            ],
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
        console.error('Coordinator getPlacements error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch placements' });
    }
};

/**
 * 4. Get Placement Detail with Complete Assignment History
 */
const getPlacementById = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        const student = await Student.findOne({
            where: { id, schoolId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'status'] },
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'universitySupervisor', attributes: ['id', 'name', 'email'] },
                {
                    model: SupervisorAssignment,
                    as: 'assignmentHistory',
                    include: [
                        { model: User, as: 'supervisor', attributes: ['id', 'name', 'role', 'email'] },
                        { model: User, as: 'assigner', attributes: ['id', 'name', 'role'] }
                    ],
                    order: [['assignedAt', 'DESC']]
                },
                { model: Attendance, as: 'attendance', attributes: ['id', 'status', 'date'] },
                { model: Logbook, as: 'logbooks', attributes: ['id', 'weekNumber', 'status', 'createdAt'] },
                { model: Assessment, as: 'assessments', attributes: ['id', 'type', 'evaluatorType', 'score'] },
                { model: Meeting, as: 'meetings', attributes: ['id', 'type', 'scheduledAt', 'status'] }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Placement record not found in this school' });
        }

        const readiness = coordinatorService.evaluateCompletionReadiness(student);

        res.json({
            success: true,
            data: {
                student,
                readiness
            }
        });
    } catch (error) {
        console.error('Coordinator getPlacementById error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch placement detail' });
    }
};

/**
 * 5. Assign or Reassign Supervisor
 */
const assignOrReassignSupervisor = async (req, res) => {
    try {
        const { studentId, supervisorId, type, reason } = req.body;
        const schoolId = req.user.role === 'super_admin' ? (req.body.schoolId || req.schoolId) : req.schoolId;
        const assignedBy = req.user.id;

        if (!studentId || !supervisorId || !type) {
            return res.status(400).json({ success: false, message: 'studentId, supervisorId, and type are required' });
        }

        const result = await coordinatorService.assignSupervisorWithHistory({
            schoolId,
            studentId,
            supervisorId,
            type,
            assignedBy,
            reason: reason || 'Coordinator supervisor assignment'
        });

        res.json({
            success: true,
            message: result.isReassignment
                ? `${type.charAt(0).toUpperCase() + type.slice(1)} supervisor reassigned successfully.`
                : `${type.charAt(0).toUpperCase() + type.slice(1)} supervisor assigned successfully.`,
            data: result
        });
    } catch (error) {
        console.error('Coordinator assignOrReassignSupervisor error:', error);
        res.status(error.status || 500).json({ success: false, message: error.message || 'Failed to assign supervisor' });
    }
};

/**
 * 6. Get Supervisors Roster with Workload Metrics
 */
const getSupervisors = async (req, res) => {
    try {
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        if (!schoolId) {
            return res.status(400).json({ success: false, message: 'School tenant context required' });
        }

        const supervisors = await coordinatorService.getSupervisorWorkloadMatrix(schoolId);

        res.json({
            success: true,
            data: supervisors
        });
    } catch (error) {
        console.error('Coordinator getSupervisors error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch supervisors workload' });
    }
};

/**
 * 7. Get Organizations Directory
 */
const getOrganizations = async (req, res) => {
    try {
        const { search = '' } = req.query;
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        const whereClause = { schoolId };
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        const organizations = await Organization.findAll({
            where: whereClause,
            order: [['name', 'ASC']]
        });

        // Also query active student counts for each organization
        const orgList = [];
        for (const org of organizations) {
            const activeCount = await Student.count({
                where: {
                    schoolId,
                    organizationName: org.name,
                    placementStatus: { [Op.in]: ['APPROVED', 'ACTIVE'] }
                }
            });

            const totalCount = await Student.count({
                where: {
                    schoolId,
                    organizationName: org.name
                }
            });

            orgList.push({
                ...org.toJSON(),
                activeInternsCount: activeCount,
                totalHistoricalPlacements: totalCount
            });
        }

        // If no organizations registered yet, discover from student placement records
        if (orgList.length === 0) {
            const studentOrgs = await Student.findAll({
                where: {
                    schoolId,
                    organizationName: { [Op.ne]: null }
                },
                attributes: ['organizationName', 'organizationAddress', 'organizationPhone', 'organizationEmail', 'contactPerson'],
                group: ['organizationName']
            });

            for (const s of studentOrgs) {
                if (s.organizationName) {
                    const count = await Student.count({
                        where: { schoolId, organizationName: s.organizationName }
                    });
                    orgList.push({
                        id: `discovered-${s.organizationName}`,
                        name: s.organizationName,
                        address: s.organizationAddress,
                        phone: s.organizationPhone,
                        email: s.organizationEmail,
                        contactPerson: s.contactPerson,
                        status: 'active',
                        activeInternsCount: count,
                        totalHistoricalPlacements: count,
                        isDiscovered: true
                    });
                }
            }
        }

        res.json({
            success: true,
            data: orgList
        });
    } catch (error) {
        console.error('Coordinator getOrganizations error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch organizations directory' });
    }
};

/**
 * 8. Create Host Organization
 */
const createOrganization = async (req, res) => {
    try {
        const { name, address, phone, email, contactPerson, industry } = req.body;
        const schoolId = req.user.role === 'super_admin' ? (req.body.schoolId || req.schoolId) : req.schoolId;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Organization name is required' });
        }

        const org = await Organization.create({
            schoolId,
            name: name.trim(),
            address: address || null,
            phone: phone || null,
            email: email || null,
            contactPerson: contactPerson || null,
            industry: industry || null,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Organization registered successfully',
            data: org
        });
    } catch (error) {
        console.error('Coordinator createOrganization error:', error);
        res.status(500).json({ success: false, message: 'Failed to create organization' });
    }
};

/**
 * 9. Get Academic Oversight Overview Table
 */
const getAcademicOverview = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', department = '', completionStatus = '' } = req.query;
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        const whereClause = { schoolId };
        if (department) whereClause.department = department;

        const userWhere = {};
        if (search) {
            userWhere[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Student.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
                    attributes: ['id', 'name', 'email', 'status']
                },
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'universitySupervisor', attributes: ['id', 'name', 'email'] },
                { model: Attendance, as: 'attendance', attributes: ['id', 'status', 'date'] },
                { model: Logbook, as: 'logbooks', attributes: ['id', 'weekNumber', 'status'] },
                { model: Assessment, as: 'assessments', attributes: ['id', 'type', 'evaluatorType', 'score'] },
                { model: Meeting, as: 'meetings', attributes: ['id', 'status'] }
            ],
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        const studentOverviews = rows.map(student => {
            const readiness = coordinatorService.evaluateCompletionReadiness(student);
            const totalAttendance = student.attendance?.length || 0;
            const presentCount = student.attendance?.filter(a => ['present', 'late'].includes(a.status)).length || 0;
            const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

            const totalLogbooks = student.logbooks?.length || 0;
            const approvedLogbooks = student.logbooks?.filter(l => l.status === 'approved').length || 0;
            const pendingLogbooks = student.logbooks?.filter(l => l.status === 'pending').length || 0;

            const industryAssessments = student.assessments?.filter(a => a.evaluatorType === 'industry') || [];
            const universityAssessments = student.assessments?.filter(a => a.evaluatorType === 'university') || [];

            return {
                id: student.id,
                studentId: student.id,
                userId: student.userId,
                name: student.user?.name || 'Unknown',
                email: student.user?.email || 'N/A',
                admissionNumber: student.admissionNumber,
                department: student.department,
                course: student.course,
                placementStatus: student.placementStatus,
                organizationName: student.organizationName,
                startDate: student.startDate,
                endDate: student.endDate,
                industrySupervisor: student.industrySupervisor?.name || 'Unassigned',
                universitySupervisor: student.universitySupervisor?.name || 'Unassigned',
                attendance: {
                    total: totalAttendance,
                    rate: attendanceRate
                },
                logbooks: {
                    total: totalLogbooks,
                    approved: approvedLogbooks,
                    pending: pendingLogbooks
                },
                assessments: {
                    industryCompleted: industryAssessments.length > 0,
                    universityCompleted: universityAssessments.length > 0,
                    industryScore: industryAssessments[0]?.score ?? null,
                    universityScore: universityAssessments[0]?.score ?? null
                },
                readiness
            };
        });

        const filteredOverviews = completionStatus
            ? studentOverviews.filter(s => completionStatus === 'READY' ? s.readiness.ready : !s.readiness.ready)
            : studentOverviews;

        res.json({
            success: true,
            data: filteredOverviews,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Coordinator getAcademicOverview error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch academic overview' });
    }
};

/**
 * 10. Get Completion Readiness Intelligence
 */
const getCompletionReadiness = async (req, res) => {
    try {
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        const students = await Student.findAll({
            where: { schoolId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name'] },
                { model: User, as: 'universitySupervisor', attributes: ['id', 'name'] },
                { model: Attendance, as: 'attendance', attributes: ['status'] },
                { model: Logbook, as: 'logbooks', attributes: ['status'] },
                { model: Assessment, as: 'assessments', attributes: ['evaluatorType', 'score'] },
                { model: Meeting, as: 'meetings', attributes: ['status'] }
            ]
        });

        const readyList = [];
        const blockedList = [];

        students.forEach(student => {
            const evalResult = coordinatorService.evaluateCompletionReadiness(student);
            const studentData = {
                id: student.id,
                name: student.user?.name || 'Unknown',
                admissionNumber: student.admissionNumber,
                department: student.department,
                placementStatus: student.placementStatus,
                organizationName: student.organizationName,
                endDate: student.endDate,
                readinessScore: evalResult.score,
                checklist: evalResult.checklist,
                blockers: evalResult.blockers
            };

            if (evalResult.ready) {
                readyList.push(studentData);
            } else {
                blockedList.push(studentData);
            }
        });

        res.json({
            success: true,
            data: {
                summary: {
                    total: students.length,
                    ready: readyList.length,
                    blocked: blockedList.length,
                    readinessRate: students.length > 0 ? Math.round((readyList.length / students.length) * 100) : 0
                },
                readyStudents: readyList,
                blockedStudents: blockedList
            }
        });
    } catch (error) {
        console.error('Coordinator getCompletionReadiness error:', error);
        res.status(500).json({ success: false, message: 'Failed to evaluate completion readiness' });
    }
};

/**
 * 11. Supervision & Meeting Oversight
 */
const getSupervisionOversight = async (req, res) => {
    try {
        const schoolId = req.user.role === 'super_admin' ? (req.query.schoolId || req.schoolId) : req.schoolId;

        const meetings = await Meeting.findAll({
            where: { schoolId },
            include: [
                { model: User, as: 'initiator', attributes: ['id', 'name', 'email', 'role'] },
                { model: User, as: 'industrySupervisor', attributes: ['id', 'name', 'email'] },
                {
                    model: Student,
                    as: 'student',
                    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
                }
            ],
            order: [['scheduledAt', 'DESC']]
        });

        const now = new Date();
        const upcoming = meetings.filter(m => new Date(m.scheduledAt) >= now && m.status !== 'cancelled');
        const completed = meetings.filter(m => ['confirmed', 'completed'].includes(m.status));
        const pending = meetings.filter(m => m.status === 'pending');
        const overdue = meetings.filter(m => new Date(m.scheduledAt) < now && m.status === 'pending');

        res.json({
            success: true,
            data: {
                summary: {
                    total: meetings.length,
                    upcomingCount: upcoming.length,
                    completedCount: completed.length,
                    pendingCount: pending.length,
                    overdueCount: overdue.length
                },
                meetings
            }
        });
    } catch (error) {
        console.error('Coordinator getSupervisionOversight error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch supervision oversight' });
    }
};

module.exports = {
    getDashboard,
    getAttentionQueue,
    getPlacements,
    getPlacementById,
    assignOrReassignSupervisor,
    getSupervisors,
    getOrganizations,
    createOrganization,
    getAcademicOverview,
    getCompletionReadiness,
    getSupervisionOversight
};
