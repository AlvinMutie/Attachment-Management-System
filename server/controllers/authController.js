const { User, School } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    const { name, email, password, role, schoolId } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Role-based validation
        if (role !== 'super_admin' && !schoolId) {
            return res.status(400).json({ message: 'School ID is required for this role' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            schoolId: role === 'super_admin' ? null : schoolId
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                token: generateToken({ id: user.id, schoolId: user.schoolId, role: user.role }),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            include: [{ model: School, as: 'school', attributes: ['name'] }]
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                schoolName: user.school ? user.school.name : 'Super Admin Portal',
                token: generateToken({ id: user.id, schoolId: user.schoolId, role: user.role }),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: School, as: 'school', attributes: ['name'] }]
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
