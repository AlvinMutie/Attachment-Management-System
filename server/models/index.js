const { sequelize } = require('../config/database');
const School = require('./School');
const User = require('./User');
const Student = require('./Student');
const Logbook = require('./Logbook');
const Attendance = require('./Attendance');
const Assessment = require('./Assessment');

// School - User
School.hasMany(User, { foreignKey: 'schoolId', as: 'users' });
User.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

// School - Student
School.hasMany(Student, { foreignKey: 'schoolId', as: 'students' });
Student.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

// School - Logbook
School.hasMany(Logbook, { foreignKey: 'schoolId', as: 'logbooks' });
Logbook.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

// School - Attendance
School.hasMany(Attendance, { foreignKey: 'schoolId', as: 'attendance' });
Attendance.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

// School - Assessment
School.hasMany(Assessment, { foreignKey: 'schoolId', as: 'assessments' });
Assessment.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });

// User - Student (Profile)
User.hasOne(Student, { foreignKey: 'userId', as: 'profile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Student - Industry Supervisor
User.hasMany(Student, { foreignKey: 'industrySupervisorId', as: 'industryStudents' });
Student.belongsTo(User, { foreignKey: 'industrySupervisorId', as: 'industrySupervisor' });

// Student - University Supervisor
User.hasMany(Student, { foreignKey: 'universitySupervisorId', as: 'universityStudents' });
Student.belongsTo(User, { foreignKey: 'universitySupervisorId', as: 'universitySupervisor' });

// Student - Logbook
Student.hasMany(Logbook, { foreignKey: 'studentId', as: 'logbooks' });
Logbook.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student - Attendance
Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendance' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Attendance - Scanned By (User)
User.hasMany(Attendance, { foreignKey: 'scannedBy', as: 'scannedAttendance' });
Attendance.belongsTo(User, { foreignKey: 'scannedBy', as: 'scanner' });

// Student - Assessment
Student.hasMany(Assessment, { foreignKey: 'studentId', as: 'assessments' });
Assessment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Assessment - Evaluator (User)
User.hasMany(Assessment, { foreignKey: 'evaluatorId', as: 'givenAssessments' });
Assessment.belongsTo(User, { foreignKey: 'evaluatorId', as: 'evaluator' });

module.exports = {
    sequelize,
    School,
    User,
    Student,
    Logbook,
    Attendance,
    Assessment
};
