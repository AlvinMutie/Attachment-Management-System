const { Notification, User } = require('../models');

/**
 * Base helper to create a database notification safely
 */
const createNotification = async ({
    recipientId,
    schoolId,
    type,
    title,
    message,
    entityType = null,
    entityId = null
}) => {
    try {
        if (!recipientId || !schoolId || !type || !title || !message) {
            return null;
        }

        return await Notification.create({
            recipientId,
            schoolId,
            type,
            title,
            message,
            entityType,
            entityId,
            isRead: false
        });
    } catch (error) {
        console.error('Create notification error:', error);
        return null;
    }
};

/**
 * Notify school admins when a student submits an attachment placement application
 */
const notifyPlacementSubmitted = async (student, schoolId) => {
    try {
        const admins = await User.findAll({
            where: { schoolId, role: 'school_admin' },
            attributes: ['id']
        });

        const studentName = student.user?.name || 'A student';
        const promises = admins.map(admin =>
            createNotification({
                recipientId: admin.id,
                schoolId,
                type: 'placement_submitted',
                title: 'New Placement Submission',
                message: `${studentName} has submitted an attachment placement application for approval.`,
                entityType: 'placement',
                entityId: student.id
            })
        );
        await Promise.all(promises);
    } catch (err) {
        console.error('Notify placement submitted error:', err);
    }
};

/**
 * Notify student when placement application is approved
 */
const notifyPlacementApproved = async (student) => {
    if (!student?.userId) return;
    await createNotification({
        recipientId: student.userId,
        schoolId: student.schoolId,
        type: 'placement_approved',
        title: 'Placement Approved',
        message: `Your attachment placement at ${student.organizationName || 'your organization'} has been approved!`,
        entityType: 'placement',
        entityId: student.id
    });
};

/**
 * Notify student when placement application is rejected
 */
const notifyPlacementRejected = async (student, reason) => {
    if (!student?.userId) return;
    await createNotification({
        recipientId: student.userId,
        schoolId: student.schoolId,
        type: 'placement_rejected',
        title: 'Placement Revision Requested',
        message: `Your attachment application was rejected: ${reason || 'Please review and update your placement details.'}`,
        entityType: 'placement',
        entityId: student.id
    });
};

/**
 * Notify student and supervisor when a supervisor is assigned
 */
const notifySupervisorAssigned = async (student, supervisor, supervisorType) => {
    const typeLabel = supervisorType === 'industry' ? 'Industry Supervisor' : 'University Academic Supervisor';

    // Notify student
    if (student?.userId) {
        await createNotification({
            recipientId: student.userId,
            schoolId: student.schoolId,
            type: 'supervisor_assigned',
            title: `${typeLabel} Assigned`,
            message: `${supervisor.name} has been assigned as your ${typeLabel.toLowerCase()}.`,
            entityType: 'placement',
            entityId: student.id
        });
    }

    // Notify supervisor
    if (supervisor?.id) {
        await createNotification({
            recipientId: supervisor.id,
            schoolId: student.schoolId,
            type: 'student_assigned',
            title: 'New Mentee Assigned',
            message: `You have been assigned to supervise ${student.user?.name || 'a student'} (${student.admissionNumber}).`,
            entityType: 'placement',
            entityId: student.id
        });
    }
};

/**
 * Notify assigned industry supervisor when student submits weekly logbook
 */
const notifyLogbookSubmitted = async (student, logbook) => {
    if (student?.industrySupervisorId) {
        await createNotification({
            recipientId: student.industrySupervisorId,
            schoolId: student.schoolId,
            type: 'logbook_submitted',
            title: `Week ${logbook.weekNumber} Logbook Submitted`,
            message: `${student.user?.name || 'A student'} submitted their logbook report for Week ${logbook.weekNumber}.`,
            entityType: 'logbook',
            entityId: logbook.id
        });
    }
};

/**
 * Notify student when logbook is reviewed/approved/rejected
 */
const notifyLogbookReviewed = async (student, logbook) => {
    if (student?.userId) {
        const isApproved = logbook.status === 'approved';
        await createNotification({
            recipientId: student.userId,
            schoolId: student.schoolId,
            type: isApproved ? 'logbook_approved' : 'logbook_revision',
            title: isApproved ? `Week ${logbook.weekNumber} Logbook Approved` : `Week ${logbook.weekNumber} Revision Requested`,
            message: isApproved
                ? `Your Week ${logbook.weekNumber} logbook was approved by your industry supervisor.`
                : `Your industry supervisor requested corrections on Week ${logbook.weekNumber}: "${logbook.supervisorComment || 'Check supervisor comments'}"`,
            entityType: 'logbook',
            entityId: logbook.id
        });
    }
};

/**
 * Notify student when assessment is submitted
 */
const notifyAssessmentSubmitted = async (student, assessment) => {
    if (student?.userId) {
        await createNotification({
            recipientId: student.userId,
            schoolId: student.schoolId,
            type: 'assessment_submitted',
            title: `Assessment Recorded (${assessment.type})`,
            message: `An evaluation was recorded with score ${assessment.score}/100.`,
            entityType: 'assessment',
            entityId: assessment.id
        });
    }
};

/**
 * Notify student and supervisors when supervisor is reassigned
 */
const notifySupervisorReassigned = async ({
    studentUserId,
    studentName,
    oldSupervisorUserId,
    newSupervisorUserId,
    supervisorRole,
    newSupervisorName,
    reason,
    schoolId
}) => {
    const roleLabel = supervisorRole === 'industry_supervisor' ? 'Industry' : 'University';

    // 1. Notify Student
    if (studentUserId) {
        await createNotification({
            recipientId: studentUserId,
            schoolId,
            type: 'supervisor_reassigned',
            title: `${roleLabel} Supervisor Updated`,
            message: `Your ${roleLabel.toLowerCase()} supervisor has been changed to ${newSupervisorName}. Reason: ${reason || 'Administrative reassignment'}.`,
            entityType: 'user',
            entityId: newSupervisorUserId
        });
    }

    // 2. Notify New Supervisor
    if (newSupervisorUserId) {
        await createNotification({
            recipientId: newSupervisorUserId,
            schoolId,
            type: 'student_assigned',
            title: 'New Student Supervised',
            message: `Student ${studentName} has been assigned to your supervision roster.`,
            entityType: 'student',
            entityId: studentUserId
        });
    }

    // 3. Notify Previous Supervisor
    if (oldSupervisorUserId) {
        await createNotification({
            recipientId: oldSupervisorUserId,
            schoolId,
            type: 'student_reassigned',
            title: 'Supervision Assignment Concluded',
            message: `Supervision of student ${studentName} has been reassigned to ${newSupervisorName}.`,
            entityType: 'student',
            entityId: studentUserId
        });
    }
};

module.exports = {
    createNotification,
    notifyPlacementSubmitted,
    notifyPlacementApproved,
    notifyPlacementRejected,
    notifySupervisorAssigned,
    notifySupervisorReassigned,
    notifyLogbookSubmitted,
    notifyLogbookReviewed,
    notifyAssessmentSubmitted
};
