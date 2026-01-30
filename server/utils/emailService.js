const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"AttachPro Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request - AttachPro',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>You requested a password reset for your AttachPro account. Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

/**
 * Send account locked notification
 * @param {Object} user - User object
 */
const sendAccountLockedEmail = async (user) => {
    const mailOptions = {
        from: `"AttachPro Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Account Locked - AttachPro',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #DC2626;">Account Locked</h2>
                <p>Hello ${user.name},</p>
                <p>Your AttachPro account has been locked by an administrator.</p>
                <p>If you believe this is an error, please contact your school administrator or support team.</p>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">AttachPro Support Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Failed to send account locked email:', error);
    }
};

/**
 * Send welcome email to new user
 * @param {Object} user - User object
 * @param {Object} school - School object
 * @param {string} temporaryPassword - Temporary password
 */
const sendWelcomeEmail = async (user, school, temporaryPassword) => {
    const loginUrl = `${process.env.CLIENT_URL}/login`;

    const mailOptions = {
        from: `"AttachPro Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Welcome to AttachPro',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Welcome to AttachPro!</h2>
                <p>Hello ${user.name},</p>
                <p>Your account has been created for <strong>${school.name}</strong>.</p>
                <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                    <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>
                    <p style="margin: 5px 0;"><strong>Role:</strong> ${user.role}</p>
                </div>
                <p style="color: #DC2626; font-weight: bold;">⚠️ Please change your password after first login.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to AttachPro</a>
                </div>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">AttachPro - Elevating Academic Standards through Technology</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendAccountLockedEmail,
    sendWelcomeEmail
};
