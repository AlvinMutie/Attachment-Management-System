const { User, School, Student } = require('../models');
const jwt = require('jsonwebtoken');
const { logAudit } = require('../utils/auditLogger');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * Public User Registration
 * Enforces role boundaries: only student and supervisor roles can self-register.
 * Privileged roles (super_admin, school_admin) cannot be created through public registration.
 */
exports.register = async (req, res) => {
    const { name, email, password, role = 'student', schoolId, admissionNumber, department } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email address format' });
        }

        // Prevent privileged role self-registration
        const forbiddenRoles = ['super_admin', 'school_admin'];
        if (forbiddenRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: `Privileged role '${role}' cannot be self-registered. Contact system administration.`
            });
        }

        const allowedPublicRoles = ['student', 'industry_supervisor', 'university_supervisor'];
        const assignedRole = allowedPublicRoles.includes(role) ? role : 'student';

        // Validate School existence if schoolId provided
        let school = null;
        if (schoolId) {
            school = await School.findByPk(schoolId);
            if (!school) {
                return res.status(400).json({ success: false, message: 'Specified institution does not exist' });
            }
        } else if (assignedRole === 'student') {
            return res.status(400).json({ success: false, message: 'School selection is required for student registration' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ where: { email: email.toLowerCase().trim() } });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
        }

        // Create new user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: assignedRole,
            schoolId: school ? school.id : null,
            status: 'active'
        });

        // Auto-provision Student profile if student role
        if (assignedRole === 'student') {
            await Student.create({
                userId: user.id,
                schoolId: school.id,
                admissionNumber: admissionNumber || `ADM-${Date.now().toString().slice(-6)}`,
                department: department || 'General Studies',
                institution: school.name
            });
        }

        await logAudit({
            userId: user.id,
            action: 'USER_REGISTERED',
            targetType: 'User',
            targetId: user.id,
            metadata: { role: assignedRole, schoolId: user.schoolId },
            ipAddress: req.ip
        }).catch(err => console.error('Audit log error:', err));

        const token = generateToken({ id: user.id, schoolId: user.schoolId, role: user.role });

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                schoolName: school ? school.name : null,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed due to an internal server error' });
    }
};

/**
 * User Login
 * Enforces password verification, account lock checks, and failed attempt tracking
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase().trim() },
            include: [{ model: School, as: 'school', attributes: ['name', 'logo', 'primaryColor', 'status'] }]
        });

        // Check if user is locked
        if (user && user.status === 'locked') {
            return res.status(403).json({
                success: false,
                message: 'Account is locked due to security policy or excessive failed logins. Contact administrator.'
            });
        }

        // Verify password
        const isMatch = user ? await user.comparePassword(password) : false;

        if (!user || !isMatch) {
            if (user) {
                user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
                if (user.failedLoginAttempts >= 5) {
                    user.status = 'locked';
                }
                await user.save();

                logAudit({
                    userId: user.id,
                    action: 'LOGIN_FAILED',
                    targetType: 'User',
                    targetId: user.id,
                    metadata: { failedAttempts: user.failedLoginAttempts, locked: user.status === 'locked' },
                    ipAddress: req.ip
                }).catch(err => console.error('Audit log error:', err));
            }

            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Reset failed login count and record last login
        user.failedLoginAttempts = 0;
        user.lastLogin = new Date();
        await user.save();

        logAudit({
            userId: user.id,
            action: 'LOGIN_SUCCESS',
            targetType: 'User',
            targetId: user.id,
            metadata: { role: user.role, schoolId: user.schoolId },
            ipAddress: req.ip
        }).catch(err => console.error('Audit log error:', err));

        const token = generateToken({ id: user.id, schoolId: user.schoolId, role: user.role });

        res.json({
            success: true,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            schoolName: user.school ? user.school.name : 'Super Admin Portal',
            schoolLogo: user.school ? user.school.logo : null,
            schoolPrimaryColor: user.school ? user.school.primaryColor : '#2563eb',
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Authentication failed due to an internal server error' });
    }
};

/**
 * Get Authenticated User Identity (/api/auth/me)
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role', 'schoolId', 'status', 'lastLogin', 'createdAt'],
            include: [
                { model: School, as: 'school', attributes: ['id', 'name', 'logo', 'primaryColor', 'status'] },
                { model: Student, as: 'profile', attributes: ['id', 'admissionNumber', 'department', 'institution'] }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve user profile' });
    }
};
