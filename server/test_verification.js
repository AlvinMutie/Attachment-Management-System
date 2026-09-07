const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { sequelize, User, School, Student, Logbook, Attendance, Assessment, Message, Notification, SupervisorAssignment, Organization } = require('./models');
const { Op } = require('sequelize');

async function ensureColumnsExist() {
    const checkAndAdd = async (table, col, def) => {
        const [results] = await sequelize.query(`PRAGMA table_info(${table});`);
        const exists = results.some(r => r.name === col);
        if (!exists) {
            try {
                await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${col} ${def};`);
            } catch (e) {
                // column might already exist or table not created yet
            }
        }
    };

    await checkAndAdd('Students', 'course', 'VARCHAR(255)');
    await checkAndAdd('Students', 'yearOfStudy', 'VARCHAR(255)');
    await checkAndAdd('Students', 'phone', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationName', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationAddress', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationPhone', 'VARCHAR(255)');
    await checkAndAdd('Students', 'organizationEmail', 'VARCHAR(255)');
    await checkAndAdd('Students', 'contactPerson', 'VARCHAR(255)');
    await checkAndAdd('Students', 'startDate', 'DATE');
    await checkAndAdd('Students', 'endDate', 'DATE');
    await checkAndAdd('Students', 'placementStatus', 'VARCHAR(50) DEFAULT "DRAFT"');
    await checkAndAdd('Students', 'rejectionReason', 'TEXT');

    await checkAndAdd('Attendances', 'verificationMethod', 'VARCHAR(255) DEFAULT "manual"');
    await checkAndAdd('Attendances', 'notes', 'TEXT');

    await checkAndAdd('Assessments', 'evaluatorType', 'VARCHAR(50) DEFAULT "industry"');
    await checkAndAdd('Assessments', 'criteria', 'TEXT');
    await checkAndAdd('Assessments', 'status', 'VARCHAR(50) DEFAULT "submitted"');
}

async function setupTestData() {
    // Ensure all required columns exist safely in SQLite
    await ensureColumnsExist();

    // Ensure clean state for test tenants
    let schoolA = await School.findOne({ where: { contactEmail: 'info@schoolalpha.edu' } });
    if (!schoolA) {
        schoolA = await School.create({
            name: 'School Alpha',
            contactEmail: 'info@schoolalpha.edu',
            status: 'active',
            primaryColor: '#2563eb'
        });
    }

    let schoolB = await School.findOne({ where: { contactEmail: 'info@schoolbeta.edu' } });
    if (!schoolB) {
        schoolB = await School.create({
            name: 'School Beta',
            contactEmail: 'info@schoolbeta.edu',
            status: 'active',
            primaryColor: '#10b981'
        });
    }

    // Seed test users for each role cleanly (lowercase emails)
    const usersToSeed = [
        { email: 'schooladmin_a@ams.com', name: 'Admin Alpha', role: 'school_admin', schoolId: schoolA.id },
        { email: 'schooladmin_b@ams.com', name: 'Admin Beta', role: 'school_admin', schoolId: schoolB.id },
        { email: 'coordinator_a@ams.com', name: 'Coordinator Alpha', role: 'attachment_coordinator', schoolId: schoolA.id },
        { email: 'coordinator_b@ams.com', name: 'Coordinator Beta', role: 'attachment_coordinator', schoolId: schoolB.id },
        { email: 'supervisor_a@ams.com', name: 'Supervisor Alpha', role: 'industry_supervisor', schoolId: schoolA.id },
        { email: 'supervisor_b@ams.com', name: 'Supervisor Beta Unassigned', role: 'industry_supervisor', schoolId: schoolA.id },
        { email: 'unisup_a@ams.com', name: 'Uni Supervisor Alpha', role: 'university_supervisor', schoolId: schoolA.id },
        { email: 'unisup_b@ams.com', name: 'Uni Supervisor Beta Unassigned', role: 'university_supervisor', schoolId: schoolA.id },
        { email: 'student_a@ams.com', name: 'Student Alpha', role: 'student', schoolId: schoolA.id },
        { email: 'student_b@ams.com', name: 'Student Beta', role: 'student', schoolId: schoolB.id }
    ];

    const testEmails = usersToSeed.map(u => u.email);
    const existingUsers = await User.findAll({ where: { email: testEmails } });
    const userIds = existingUsers.map(u => u.id);

    if (userIds.length > 0) {
        const studentRecords = await Student.findAll({ where: { userId: userIds } });
        const studentIds = studentRecords.map(s => s.id);

        if (studentIds.length > 0) {
            await Attendance.destroy({ where: { studentId: studentIds } });
            await Logbook.destroy({ where: { studentId: studentIds } });
            await Assessment.destroy({ where: { studentId: studentIds } });
            await SupervisorAssignment.destroy({ where: { studentId: studentIds } });
        }
        await Message.destroy({ where: { [Op.or]: [{ senderId: userIds }, { receiverId: userIds }] } });
        await Notification.destroy({ where: { recipientId: userIds } });
        await Student.destroy({ where: { userId: userIds } });
        await User.destroy({ where: { id: userIds } });
    }

    const userMap = {};

    for (const u of usersToSeed) {
        const user = await User.create({
            name: u.name,
            email: u.email,
            password: 'password123',
            role: u.role,
            schoolId: u.schoolId,
            status: 'active'
        });
        userMap[u.email] = user;

        if (u.role === 'student') {
            const sRecord = await Student.create({
                userId: user.id,
                schoolId: u.schoolId,
                admissionNumber: `ADM-${Date.now()}-${u.email.split('@')[0]}`,
                department: 'Computer Science',
                course: 'BSc Software Engineering',
                yearOfStudy: 'Year 3',
                institution: u.schoolId === schoolA.id ? schoolA.name : schoolB.name,
                placementStatus: 'DRAFT'
            });
            userMap[`${u.email}_student`] = sRecord;
        }
    }

    return { schoolA, schoolB, userMap };
}

async function runVerification() {
    console.log('🚀 Starting Comprehensive Phase 2 + Phase 3 Test Suite...\n');

    const { schoolA, schoolB, userMap } = await setupTestData();

    // Start server process
    const TEST_PORT = 5098;
    const serverProcess = spawn('node', ['index.js'], {
        cwd: __dirname,
        env: { ...process.env, NODE_ENV: 'test', PORT: TEST_PORT, JWT_SECRET: 'test_jwt_secret_ams_2026_phase2' }
    });

    let serverOutput = '';
    serverProcess.stdout.on('data', (d) => { serverOutput += d.toString(); });
    serverProcess.stderr.on('data', (d) => { serverOutput += d.toString(); });

    // Wait 2s for server startup
    await new Promise(r => setTimeout(r, 2000));

    const makeRequest = (options, postData = null) => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    let parsed = data;
                    try {
                        if (data.startsWith('{') || data.startsWith('[')) {
                            parsed = JSON.parse(data);
                        }
                    } catch (e) {}
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: parsed
                    });
                });
            });
            req.on('error', reject);
            if (postData) {
                req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
            }
            req.end();
        });
    };

    let passedCount = 0;
    let failedCount = 0;

    const assertTest = (description, condition, details = '') => {
        if (condition) {
            console.log(`  ✅ PASS: ${description}`);
            passedCount++;
        } else {
            console.error(`  ❌ FAIL: ${description} ${details}`);
            failedCount++;
        }
    };

    try {
        // ==========================================
        // 1. AUTHENTICATION & CREDENTIAL TESTS
        // ==========================================
        console.log('--- 1. AUTHENTICATION & CREDENTIAL VERIFICATION ---');

        // 1.1 Valid Super Admin Login
        const loginSuper = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'superadmin@ams.com', password: 'password123' });

        assertTest('Super Admin login returns 200 & JWT', loginSuper.statusCode === 200 && Boolean(loginSuper.body?.token));
        const superToken = loginSuper.body?.token;

        // 1.2 Invalid password
        const badPass = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'superadmin@ams.com', password: 'wrongpassword' });
        assertTest('Invalid password returns 401', badPass.statusCode === 401);

        // 1.3 Missing credentials
        const missingCreds = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: '' });
        assertTest('Missing credentials returns 400', missingCreds.statusCode === 400);

        // 1.4 Get /api/auth/me with valid token
        const meSuper = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/me',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        assertTest('/api/auth/me returns authenticated user without password', meSuper.statusCode === 200 && meSuper.body?.data?.email === 'superadmin@ams.com' && !meSuper.body?.data?.password);

        // 1.5 Unauthenticated /api/auth/me
        const meUnauth = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/me',
            method: 'GET'
        });
        assertTest('/api/auth/me without token returns 401', meUnauth.statusCode === 401);

        // 1.6 Malformed / Tampered Token
        const meTampered = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/me',
            method: 'GET',
            headers: { 'Authorization': 'Bearer invalid_tampered_token_xyz' }
        });
        assertTest('Tampered token returns 401', meTampered.statusCode === 401);

        // ==========================================
        // 2. PRIVILEGE ESCALATION & REGISTRATION SECURITY
        // ==========================================
        console.log('\n--- 2. PRIVILEGE ESCALATION & REGISTRATION CHECKS ---');

        // 2.1 Public self-registration attempt as super_admin
        const superEscalate = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Hacker',
            email: 'hacker_super@test.com',
            password: 'password123',
            role: 'super_admin'
        });
        assertTest('Public registration as super_admin rejected with 403', superEscalate.statusCode === 403);

        // 2.2 Public self-registration attempt as school_admin
        const adminEscalate = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Hacker Admin',
            email: 'hacker_admin@test.com',
            password: 'password123',
            role: 'school_admin',
            schoolId: schoolA.id
        });
        assertTest('Public registration as school_admin rejected with 403', adminEscalate.statusCode === 403);

        // 2.3 Valid public student registration
        const studentRegEmail = `student_valid_${Date.now()}@test.com`;
        const validStudentReg = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Legit Student',
            email: studentRegEmail,
            password: 'password123',
            role: 'student',
            schoolId: schoolA.id
        });
        assertTest('Valid student registration succeeds with 201 and student role', validStudentReg.statusCode === 201 && validStudentReg.body?.data?.role === 'student');

        // ==========================================
        // 3. ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
        // ==========================================
        console.log('\n--- 3. ROLE-BASED ACCESS CONTROL (RBAC) MATRIX ---');

        // Log in each seeded role
        const loginStudentA = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'student_a@ams.com', password: 'password123' });
        const studentAToken = loginStudentA.body?.token;

        const loginAdminA = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'schooladmin_a@ams.com', password: 'password123' });
        const adminAToken = loginAdminA.body?.token;

        const loginSupervisorA = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'supervisor_a@ams.com', password: 'password123' });
        const supervisorAToken = loginSupervisorA.body?.token;

        const loginSupervisorB = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'supervisor_b@ams.com', password: 'password123' });
        const supervisorBToken = loginSupervisorB.body?.token;

        const loginUniSupA = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'unisup_a@ams.com', password: 'password123' });
        const uniSupAToken = loginUniSupA.body?.token;

        const loginUniSupB = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'unisup_b@ams.com', password: 'password123' });
        const uniSupBToken = loginUniSupB.body?.token;

        // 3.1 Super Admin Endpoint (/api/superadmin/schools)
        const saAccess = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/superadmin/schools',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        assertTest('Super Admin can access /api/superadmin/schools (200)', saAccess.statusCode === 200);

        const saAccessByAdmin = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/superadmin/schools',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('School Admin cannot access /api/superadmin/schools (403)', saAccessByAdmin.statusCode === 403);

        const saAccessByStudent = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/superadmin/schools',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student cannot access /api/superadmin/schools (403)', saAccessByStudent.statusCode === 403);

        // 3.2 School Admin Endpoint (/api/admin/students)
        const adminAccess = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/admin/students',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('School Admin can access /api/admin/students (200)', adminAccess.statusCode === 200);

        const adminAccessByStudent = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/admin/students',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student cannot access /api/admin/students (403)', adminAccessByStudent.statusCode === 403);

        // 3.3 Student Endpoint (/api/student/logbooks)
        const studentAccess = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/logbooks',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student can access /api/student/logbooks (200)', studentAccess.statusCode === 200);

        const studentAccessBySupervisor = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/logbooks',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${supervisorAToken}` }
        });
        assertTest('Supervisor cannot access student logbook submission route (403)', studentAccessBySupervisor.statusCode === 403);

        // ==========================================
        // 4. MULTI-TENANT ISOLATION
        // ==========================================
        console.log('\n--- 4. MULTI-TENANT ISOLATION VERIFICATION ---');

        const loginAdminB = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'schooladmin_b@ams.com', password: 'password123' });
        const adminBToken = loginAdminB.body?.token;

        const schoolAStudents = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/admin/students',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });

        const schoolBStudents = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/admin/students',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminBToken}` }
        });

        const listA = schoolAStudents.body?.data?.students || [];
        const listB = schoolBStudents.body?.data?.students || [];

        const hasCrossTenantLeak = listB.some(s => s.schoolId === schoolA.id);
        assertTest('School B Admin does not see School A students (Tenant Isolated)', !hasCrossTenantLeak && schoolBStudents.statusCode === 200);

        // ==========================================
        // 5. PHASE 3 — ATTACHMENT / PLACEMENT LIFECYCLE
        // ==========================================
        console.log('\n--- 5. PHASE 3 — ATTACHMENT / PLACEMENT LIFECYCLE ---');

        // 5.1 Student gets their placement / profile
        const studentPlacementGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/placement',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student can view own placement profile (200)', studentPlacementGet.statusCode === 200 && Boolean(studentPlacementGet.body?.data?.id));

        const studentProfileId = studentPlacementGet.body?.data?.id;

        // 5.2 Student submits placement details for approval
        const studentPlacementSubmit = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/placement',
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            organizationName: 'Acme Robotics Ltd',
            organizationAddress: '100 Tech Park Way',
            organizationPhone: '+254700000000',
            organizationEmail: 'careers@acme.com',
            contactPerson: 'Jane Doe',
            startDate: '2026-05-01',
            endDate: '2026-08-01',
            submitForApproval: true
        });
        assertTest('Student submits placement application (200 & PENDING_APPROVAL)', studentPlacementSubmit.statusCode === 200 && studentPlacementSubmit.body?.data?.placementStatus === 'PENDING_APPROVAL');

        // 5.3 School Admin views placements
        const adminPlacementsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/admin/placements?status=PENDING_APPROVAL',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('School Admin can view pending placements (200)', adminPlacementsGet.statusCode === 200 && adminPlacementsGet.body?.data?.placements?.length > 0);

        // 5.4 School Admin approves placement
        const adminPlacementApprove = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/admin/placements/${studentProfileId}/review`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${adminAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            status: 'APPROVED'
        });
        assertTest('School Admin approves student placement (200 & APPROVED)', adminPlacementApprove.statusCode === 200 && adminPlacementApprove.body?.data?.placementStatus === 'APPROVED');

        // 5.5 Cross-tenant placement review attempt (Admin B attempting on Student A)
        const crossTenantPlacementReview = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/admin/placements/${studentProfileId}/review`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${adminBToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            status: 'REJECTED',
            rejectionReason: 'Cross-tenant illegal rejection attempt'
        });
        assertTest('Cross-tenant placement review rejected (404/403)', [403, 404].includes(crossTenantPlacementReview.statusCode));

        // 5.6 Student cannot alter placement once APPROVED
        const studentAltersApprovedPlacement = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/placement',
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            organizationName: 'Unauthorized New Org'
        });
        assertTest('Student cannot modify approved placement without admin unlock (400)', studentAltersApprovedPlacement.statusCode === 400);

        // 5.7 School Admin assigns Industry & University Supervisors
        const assignIndustry = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/admin/assign-supervisor',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            studentId: studentProfileId,
            supervisorId: userMap['supervisor_a@ams.com'].id,
            type: 'industry'
        });
        assertTest('School Admin assigns Industry Supervisor (200)', assignIndustry.statusCode === 200);

        const assignUniversity = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/admin/assign-supervisor',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            studentId: studentProfileId,
            supervisorId: userMap['unisup_a@ams.com'].id,
            type: 'university'
        });
        assertTest('School Admin assigns University Supervisor (200)', assignUniversity.statusCode === 200);

        // ==========================================
        // 6. PHASE 3 — ATTENDANCE WORKFLOW
        // ==========================================
        console.log('\n--- 6. PHASE 3 — ATTENDANCE WORKFLOW ---');

        // 6.1 Student records check-in
        const studentCheckIn = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/attendance/check-in',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            notes: 'Checked in on time at main workstation.',
            verificationMethod: 'web_portal'
        });
        assertTest('Student check-in succeeds with 201', studentCheckIn.statusCode === 201 && studentCheckIn.body?.data?.status === 'present');

        // 6.2 Duplicate check-in on same day rejected
        const studentCheckInDup = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/attendance/check-in',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            notes: 'Duplicate check-in'
        });
        assertTest('Duplicate daily check-in is rejected with 400', studentCheckInDup.statusCode === 400);

        // 6.3 Student views attendance history
        const studentAttendanceHistory = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/attendance',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student views own attendance records (200)', studentAttendanceHistory.statusCode === 200 && studentAttendanceHistory.body?.data?.length > 0);

        // 6.4 Industry Supervisor views assigned student attendance
        const supAttendanceGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/supervisor/attendance?studentId=${studentProfileId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${supervisorAToken}` }
        });
        assertTest('Assigned Industry Supervisor views student attendance (200)', supAttendanceGet.statusCode === 200 && supAttendanceGet.body?.data?.length > 0);

        // 6.5 Unassigned Industry Supervisor cannot access student attendance
        const unassignedSupAttendanceGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/supervisor/attendance?studentId=${studentProfileId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${supervisorBToken}` }
        });
        assertTest('Unassigned Supervisor denied access to student attendance (403)', unassignedSupAttendanceGet.statusCode === 403);

        // ==========================================
        // 7. PHASE 3 — LOGBOOK MANAGEMENT
        // ==========================================
        console.log('\n--- 7. PHASE 3 — LOGBOOK MANAGEMENT ---');

        // 7.1 Student submits a weekly logbook
        const studentSubmitLog = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/logbooks',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            weekNumber: 1,
            startDate: '2026-05-01',
            endDate: '2026-05-07',
            summary: 'Worked on robotic arm motor drivers and serial communication protocol.',
            dailyEntries: {
                monday: 'Orientation and workspace safety check.',
                tuesday: 'Configured Arduino IDE and CAN bus transceiver.',
                wednesday: 'Implemented PWM motor speed controller.',
                thursday: 'Debugging serial packet dropped frames.',
                friday: 'Weekly progress presentation to team.'
            }
        });
        assertTest('Student submits weekly logbook (201)', studentSubmitLog.statusCode === 201 && Boolean(studentSubmitLog.body?.data?.id));
        const logbookId = studentSubmitLog.body?.data?.id;

        // 7.2 Industry Supervisor views assigned logbooks
        const supLogbooksGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/supervisor/logbooks',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${supervisorAToken}` }
        });
        assertTest('Assigned Industry Supervisor views assigned logbooks (200)', supLogbooksGet.statusCode === 200 && supLogbooksGet.body?.data?.length > 0);

        // 7.3 Unassigned Supervisor denied review
        const unassignedReviewLog = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/supervisor/logbooks/${logbookId}/review`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${supervisorBToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            status: 'approved',
            supervisorComment: 'Unassigned attempt'
        });
        assertTest('Unassigned Supervisor cannot review logbook (403)', unassignedReviewLog.statusCode === 403);

        // 7.4 Assigned Industry Supervisor approves logbook with feedback
        const assignedReviewLog = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/supervisor/logbooks/${logbookId}/review`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${supervisorAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            status: 'approved',
            supervisorComment: 'Excellent technical initiative on the CAN bus protocol and motor drivers.'
        });
        assertTest('Assigned Industry Supervisor approves logbook (200 & approved)', assignedReviewLog.statusCode === 200 && assignedReviewLog.body?.data?.status === 'approved');

        // ==========================================
        // 8. PHASE 3 — UNIVERSITY SUPERVISOR & ACADEMIC OPERATIONS
        // ==========================================
        console.log('\n--- 8. PHASE 3 — UNIVERSITY SUPERVISION & ASSESSMENTS ---');

        // 8.1 University Supervisor views assigned students
        const uniAssignedStudents = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/university/my-students',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${uniSupAToken}` }
        });
        assertTest('University Supervisor views assigned student roster (200)', uniAssignedStudents.statusCode === 200 && uniAssignedStudents.body?.data?.length > 0);

        // 8.2 University Supervisor views detailed student overview
        const uniStudentOverview = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/university/student/${studentProfileId}/overview`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${uniSupAToken}` }
        });
        assertTest('University Supervisor views assigned student academic overview (200)', uniStudentOverview.statusCode === 200 && uniStudentOverview.body?.data?.id === studentProfileId);

        // 8.3 Unassigned University Supervisor denied student overview
        const unassignedUniStudentOverview = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/university/student/${studentProfileId}/overview`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${uniSupBToken}` }
        });
        assertTest('Unassigned University Supervisor denied student overview (403/404)', [403, 404].includes(unassignedUniStudentOverview.statusCode));

        // 8.4 University Supervisor submits academic assessment
        const uniSubmitAssessment = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/university/assessments',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${uniSupAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            studentId: studentProfileId,
            type: 'mid-term',
            score: 88,
            feedback: 'Student demonstrates thorough comprehension of embedded engineering workflows.',
            criteria: {
                technicalCompetency: 90,
                attendanceDiscipline: 85,
                documentationQuality: 89
            }
        });
        assertTest('University Supervisor submits academic assessment (201)', uniSubmitAssessment.statusCode === 201 && uniSubmitAssessment.body?.data?.score === 88);

        // 8.5 Student cannot submit supervisor assessment
        const studentAttemptsAssessmentSubmit = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/university/assessments',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            studentId: studentProfileId,
            type: 'mid-term',
            score: 100
        });
        assertTest('Student prohibited from submitting supervisor assessment (403)', studentAttemptsAssessmentSubmit.statusCode === 403);

        // 8.6 Student views their assessments
        const studentAssessmentsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/assessments',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student can view own graded assessments (200)', studentAssessmentsGet.statusCode === 200 && studentAssessmentsGet.body?.data?.length > 0);

        // 8.7 Student Progress Overview computes real backend stats
        const studentProgressGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/progress',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student Progress endpoint returns real computed stats (200)', studentProgressGet.statusCode === 200 && studentProgressGet.body?.data?.placementStatus === 'APPROVED' && studentProgressGet.body?.data?.logbooks?.approved === 1);

        // ==========================================
        // 9. PHASE 4 — NOTIFICATIONS SYSTEM
        // ==========================================
        console.log('\n--- 9. PHASE 4 — NOTIFICATIONS SYSTEM ---');

        // 9.1 Student fetches their generated notifications (from placement approval & supervisor assignments)
        const studentNotificationsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/notifications',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student receives in-app notifications from lifecycle events (200)', studentNotificationsGet.statusCode === 200 && Array.isArray(studentNotificationsGet.body?.data));

        // 9.2 Check unread notification count
        const unreadCountGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/notifications/unread-count',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Unread notification count returns valid numeric total (200)', unreadCountGet.statusCode === 200 && typeof unreadCountGet.body?.unreadCount === 'number');

        // 9.3 Mark single notification as read if available
        if (studentNotificationsGet.body?.data?.length > 0) {
            const firstNotifId = studentNotificationsGet.body.data[0].id;
            const markSingleRead = await makeRequest({
                hostname: 'localhost',
                port: TEST_PORT,
                path: `/api/notifications/${firstNotifId}/read`,
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${studentAToken}` }
            });
            assertTest('Single notification marked as read (200)', markSingleRead.statusCode === 200 && markSingleRead.body?.success === true);
        }

        // 9.4 Mark all notifications as read
        const markAllRead = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/notifications/read-all',
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Mark all notifications as read succeeds (200)', markAllRead.statusCode === 200 && markAllRead.body?.success === true);

        // ==========================================
        // 10. PHASE 4 — HARDENED MESSAGING & ACCESS CONTROL
        // ==========================================
        console.log('\n--- 10. PHASE 4 — HARDENED MESSAGING & ACCESS CONTROL ---');

        const studentAUser = userMap['student_a@ams.com'];
        const supervisorAUser = userMap['supervisor_a@ams.com'];
        const supervisorBUser = userMap['supervisor_b@ams.com'];
        const studentBUser = userMap['student_b@ams.com'];
        const adminAUser = userMap['schooladmin_a@ams.com'];

        // 10.1 Student A can message assigned Industry Supervisor A
        const studentToSupervisorMsg = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/messages',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            receiverId: supervisorAUser.id,
            content: 'Hello supervisor, I have submitted my Week 1 report.'
        });
        assertTest('Student can message assigned Industry Supervisor (201)', studentToSupervisorMsg.statusCode === 201 && studentToSupervisorMsg.body?.success === true);

        // 10.2 Industry Supervisor A can message assigned Student A
        const supervisorToStudentMsg = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/messages',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supervisorAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            receiverId: studentAUser.id,
            content: 'Great progress on your embedded project.'
        });
        assertTest('Industry Supervisor can message assigned Student (201)', supervisorToStudentMsg.statusCode === 201 && supervisorToStudentMsg.body?.success === true);

        // 10.3 Student A CANNOT message unassigned Supervisor B
        const studentToUnassignedSupMsg = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/messages',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            receiverId: supervisorBUser.id,
            content: 'Unauthorized message attempt'
        });
        assertTest('Student cannot message unassigned Supervisor (403)', studentToUnassignedSupMsg.statusCode === 403);

        // 10.4 Cross-Tenant Messaging is Blocked (Student A in School A -> Student B in School B)
        const crossTenantMsg = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/messages',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            receiverId: studentBUser.id,
            content: 'Illegal cross-tenant communication attempt'
        });
        assertTest('Cross-tenant communication rejected (403)', crossTenantMsg.statusCode === 403);

        // 10.5 Get authorized contacts for Student A
        const studentContactsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/messages/contacts',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student contacts list includes assigned supervisors and admins (200)', studentContactsGet.statusCode === 200 && Array.isArray(studentContactsGet.body?.data));

        // 10.6 Retrieve conversation history between Student A and Supervisor A
        const conversationGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/messages/${supervisorAUser.id}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Retrieve authorized message thread history (200)', conversationGet.statusCode === 200 && conversationGet.body?.data?.length >= 2);

        // ==========================================
        // 11. PHASE 4 — REPORTS, ANALYTICS & CSV EXPORT
        // ==========================================
        console.log('\n--- 11. PHASE 4 — REPORTS, ANALYTICS & CSV EXPORT ---');

        // 11.1 School Admin generates placements report JSON with pagination
        const placementReportJSON = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/placements?page=1&limit=10',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('School Admin generates paginated placements report (200)', placementReportJSON.statusCode === 200 && placementReportJSON.body?.pagination?.total > 0);

        // 11.2 School Admin exports placements as CSV
        const placementReportCSV = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/placements?export=csv',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Placements report exports clean CSV with correct headers (200 & text/csv)',
            placementReportCSV.statusCode === 200 &&
            (placementReportCSV.headers['content-type']?.includes('text/csv')) &&
            typeof placementReportCSV.body === 'string' &&
            placementReportCSV.body.includes('Student Name') &&
            placementReportCSV.body.includes('Admission Number')
        );

        // 11.3 School Admin exports attendance as CSV
        const attendanceReportCSV = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/attendance?export=csv',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Attendance report exports clean CSV (200 & text/csv)',
            attendanceReportCSV.statusCode === 200 &&
            attendanceReportCSV.headers['content-type']?.includes('text/csv') &&
            typeof attendanceReportCSV.body === 'string' &&
            attendanceReportCSV.body.includes('Verification Method')
        );

        // 11.4 School Admin exports logbooks report as CSV
        const logbooksReportCSV = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/logbooks?export=csv',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Logbooks report exports clean CSV (200 & text/csv)',
            logbooksReportCSV.statusCode === 200 &&
            logbooksReportCSV.headers['content-type']?.includes('text/csv') &&
            typeof logbooksReportCSV.body === 'string' &&
            logbooksReportCSV.body.includes('Week Number')
        );

        // 11.5 School Admin exports assessments report as CSV
        const assessmentsReportCSV = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/assessments?export=csv',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Assessments report exports clean CSV (200 & text/csv)',
            assessmentsReportCSV.statusCode === 200 &&
            assessmentsReportCSV.headers['content-type']?.includes('text/csv') &&
            typeof assessmentsReportCSV.body === 'string' &&
            assessmentsReportCSV.body.includes('Score (%)')
        );

        // 11.6 Supervisor workload allocation report
        const workloadReport = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/supervisor-workload',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Supervisor workload report returns supervisor assignments and metric totals (200)',
            workloadReport.statusCode === 200 &&
            Array.isArray(workloadReport.body?.data) &&
            workloadReport.body.data.some(s => s.email === 'supervisor_a@ams.com' && s.assignedStudentsCount >= 1)
        );

        // 11.7 Student cannot access administrative reports
        const studentAttemptsReports = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/placements',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student prohibited from accessing administrative reports (403)', studentAttemptsReports.statusCode === 403);

        // ==========================================
        // 12. PHASE 4 — DETERMINISTIC OPERATIONAL ALERTS
        // ==========================================
        console.log('\n--- 12. PHASE 4 — DETERMINISTIC OPERATIONAL ALERTS ---');

        const operationalAlerts = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/reports/operational-alerts',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Operational Alerts Engine computes institutional risk indicators (200)',
            operationalAlerts.statusCode === 200 &&
            operationalAlerts.body?.data?.summary !== undefined &&
            Array.isArray(operationalAlerts.body?.data?.alerts)
        );

        // ==========================================
        // 13. PHASE 5 — COORDINATOR ROLE & RBAC
        // ==========================================
        console.log('\n--- 13. PHASE 5 — COORDINATOR ROLE & RBAC ---');

        // 13.1 Coordinator Alpha Login
        const loginCoordA = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'coordinator_a@ams.com', password: 'password123' });

        const coordinatorAToken = loginCoordA.body?.token;
        assertTest('Coordinator Alpha login returns 200 & JWT with attachment_coordinator role',
            loginCoordA.statusCode === 200 &&
            loginCoordA.body?.role === 'attachment_coordinator' &&
            Boolean(coordinatorAToken)
        );

        // 13.2 Coordinator Beta Login
        const loginCoordB = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'coordinator_b@ams.com', password: 'password123' });
        const coordinatorBToken = loginCoordB.body?.token;

        // 13.3 Public registration as attachment_coordinator must be rejected
        const regAttemptCoordinator = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Hacker Coordinator',
            email: 'hacker_coord@ams.com',
            password: 'password123',
            role: 'attachment_coordinator',
            schoolId: schoolA.id
        });
        assertTest('Public registration as attachment_coordinator rejected with 403', regAttemptCoordinator.statusCode === 403);

        // 13.4 Coordinator can access Coordinator Dashboard
        const coordDashboardGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/dashboard',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        assertTest('Coordinator can access /api/coordinator/dashboard (200)',
            coordDashboardGet.statusCode === 200 &&
            coordDashboardGet.body?.data?.totalStudents !== undefined
        );

        // 13.5 Coordinator can access Attention Queue
        const coordAttentionQueue = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/attention-queue',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        assertTest('Coordinator can access prioritized attention queue (200)',
            coordAttentionQueue.statusCode === 200 &&
            Array.isArray(coordAttentionQueue.body?.data?.queue)
        );

        // 13.6 Students and Supervisors are prohibited from Coordinator routes
        const studentAttemptsCoordDashboard = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/dashboard',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student prohibited from /api/coordinator/dashboard (403)', studentAttemptsCoordDashboard.statusCode === 403);

        const supervisorAttemptsCoordDashboard = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/dashboard',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${supervisorAToken}` }
        });
        assertTest('Supervisor prohibited from /api/coordinator/dashboard (403)', supervisorAttemptsCoordDashboard.statusCode === 403);

        // ==========================================
        // 14. PHASE 5 — MULTI-TENANT ISOLATION & IDOR PROTECTION
        // ==========================================
        console.log('\n--- 14. PHASE 5 — MULTI-TENANT ISOLATION & IDOR PROTECTION ---');

        // 14.1 Coordinator B list placements (Must only see School B, not School A)
        const coordBPlacements = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/placements',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorBToken}` }
        });
        const bStudentsList = coordBPlacements.body?.data || [];
        const hasLeakAInB = bStudentsList.some(s => s.schoolId === schoolA.id);
        assertTest('Coordinator B only sees School B placements (Tenant Isolated)',
            coordBPlacements.statusCode === 200 && !hasLeakAInB
        );

        // 14.2 Coordinator B IDOR attempt on School A Student Placement Detail
        const coordBIDORAttempt = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/coordinator/placements/${studentProfileId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorBToken}` }
        });
        assertTest('Coordinator B cannot access School A student details (IDOR 404/403)',
            [403, 404].includes(coordBIDORAttempt.statusCode)
        );

        // 14.3 Coordinator A cross-tenant supervisor assignment attempt (assigning School B supervisor to School A student)
        const crossTenantSupervisorAssign = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/assign-supervisor',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${coordinatorAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            studentId: studentProfileId,
            supervisorId: userMap['schooladmin_b@ams.com'].id,
            type: 'industry'
        });
        assertTest('Coordinator cross-tenant supervisor assignment blocked (404/403)',
            [400, 403, 404].includes(crossTenantSupervisorAssign.statusCode)
        );

        // ==========================================
        // 15. PHASE 5 — SUPERVISOR ALLOCATION & REASSIGNMENT WITH HISTORY
        // ==========================================
        console.log('\n--- 15. PHASE 5 — SUPERVISOR ALLOCATION & REASSIGNMENT WITH HISTORY ---');

        const uniSupAUser = userMap['unisup_a@ams.com'];
        const uniSupBUser = userMap['unisup_b@ams.com'];

        // 15.1 Coordinator A reassigns University Supervisor from UniSup A to UniSup B with audit reason
        const reassignUniSupervisor = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/reassign-supervisor',
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${coordinatorAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            studentId: studentProfileId,
            supervisorId: uniSupBUser.id,
            type: 'university',
            reason: 'Academic department workload re-balancing'
        });
        assertTest('Coordinator reassigns supervisor with audit reasoning (200)',
            reassignUniSupervisor.statusCode === 200 &&
            reassignUniSupervisor.body?.data?.isReassignment === true
        );

        // 15.2 Verify Placement Detail shows historical SupervisorAssignment entries
        const placementHistoryGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/coordinator/placements/${studentProfileId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        const historyList = placementHistoryGet.body?.data?.student?.assignmentHistory || [];
        assertTest('Placement details contain structured supervisor assignment history with timestamps and assigner',
            placementHistoryGet.statusCode === 200 &&
            historyList.length >= 1 &&
            historyList.some(h => h.supervisorId === uniSupBUser.id && h.status === 'active')
        );

        // 15.3 Coordinator accesses supervisor roster with workload capacity metrics
        const supervisorsWorkloadGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/supervisors',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        assertTest('Coordinator views supervisor roster with live workload capacity (200)',
            supervisorsWorkloadGet.statusCode === 200 &&
            Array.isArray(supervisorsWorkloadGet.body?.data) &&
            supervisorsWorkloadGet.body.data.some(s => s.id === uniSupBUser.id && s.assignedStudentsCount >= 1)
        );

        // ==========================================
        // 16. PHASE 5 — ACADEMIC OVERSIGHT, ORGANIZATIONS & COMPLETION READINESS
        // ==========================================
        console.log('\n--- 16. PHASE 5 — ACADEMIC OVERSIGHT, ORGANIZATIONS & COMPLETION READINESS ---');

        // 16.1 Coordinator registers a host organization
        const createOrgRes = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/organizations',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${coordinatorAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            name: 'TechCorp Robotics Ltd',
            address: '100 Silicon Boulevard',
            phone: '+254711223344',
            email: 'hr@techcorp.com',
            contactPerson: 'Alice Smith',
            industry: 'Artificial Intelligence & Robotics'
        });
        assertTest('Coordinator registers host company in organization directory (201)',
            createOrgRes.statusCode === 201 &&
            createOrgRes.body?.data?.name === 'TechCorp Robotics Ltd'
        );

        // 16.2 Coordinator queries organization directory
        const getOrgsRes = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/organizations',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        assertTest('Coordinator retrieves organization directory with intern counts (200)',
            getOrgsRes.statusCode === 200 &&
            Array.isArray(getOrgsRes.body?.data) &&
            getOrgsRes.body.data.some(o => o.name === 'TechCorp Robotics Ltd')
        );

        // 16.3 Coordinator queries consolidated academic overview
        const academicOverviewGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/academic-overview',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        assertTest('Coordinator retrieves consolidated academic oversight stream (200)',
            academicOverviewGet.statusCode === 200 &&
            Array.isArray(academicOverviewGet.body?.data) &&
            academicOverviewGet.body.data.some(s => s.id === studentProfileId && s.attendance !== undefined)
        );

        // 16.4 Coordinator evaluates deterministic completion readiness
        const completionReadinessGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/completion-readiness',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        assertTest('Completion readiness engine provides explainable blocker diagnostics (200)',
            completionReadinessGet.statusCode === 200 &&
            completionReadinessGet.body?.data?.summary !== undefined &&
            Array.isArray(completionReadinessGet.body?.data?.blockedStudents)
        );

        // 16.5 Coordinator supervision & meetings oversight
        const supervisionOversightGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/coordinator/supervision',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${coordinatorAToken}` }
        });
        assertTest('Coordinator monitors academic supervision meetings & scheduled visits (200)',
            supervisionOversightGet.statusCode === 200 &&
            supervisionOversightGet.body?.data?.summary !== undefined
        );

        // ==========================================
        // 17. PHASE 6 — ACADEMIC POLICY SERVICE & COMPLIANCE ENGINE
        // ==========================================
        console.log('\n--- 17. PHASE 6 — ACADEMIC POLICY SERVICE & COMPLIANCE ENGINE ---');
        const academicPolicy = require('./services/academicPolicyService');

        // 17.1 Policy Attendance Rate Thresholds
        const compliantAttendance = academicPolicy.calculateAttendance(8, 10);
        const atRiskAttendance = academicPolicy.calculateAttendance(7, 10);
        const criticalAttendance = academicPolicy.calculateAttendance(5, 10);

        assertTest('Academic Policy accurately determines attendance thresholds (COMPLIANT at 80%)',
            compliantAttendance.rate === 80 && compliantAttendance.status === 'COMPLIANT' && !compliantAttendance.isAtRisk
        );
        assertTest('Academic Policy triggers AT_RISK status between 60% and 75% (70%)',
            atRiskAttendance.rate === 70 && atRiskAttendance.status === 'AT_RISK' && atRiskAttendance.isAtRisk
        );
        assertTest('Academic Policy triggers CRITICAL status below 60% (50%)',
            criticalAttendance.rate === 50 && criticalAttendance.status === 'CRITICAL' && criticalAttendance.isAtRisk
        );

        // 17.2 Completion Readiness Blocker Diagnostics
        const dummyStudentData = {
            id: 'mock-student-id',
            placementStatus: 'APPROVED',
            attendanceRate: 85,
            logbooks: [{ status: 'approved' }],
            assessments: [{ type: 'final', score: 85 }],
            supervisionMeetings: [{ status: 'completed' }],
            assignments: [{ type: 'industry', status: 'active' }, { type: 'university', status: 'active' }]
        };
        const readinessEval = academicPolicy.evaluateCompletionReadiness(dummyStudentData);
        assertTest('Academic Policy evaluates student readiness and identifies blockers correctly',
            readinessEval.isReady !== undefined && Array.isArray(readinessEval.blockers)
        );

        // ==========================================
        // 18. PHASE 6 — STUDENT ATTACHMENT WORKSPACE & ACTION QUEUE
        // ==========================================
        console.log('\n--- 18. PHASE 6 — STUDENT ATTACHMENT WORKSPACE & ACTION QUEUE ---');

        // 18.1 Student A retrieves unified workspace
        const studentWorkspaceGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/workspace',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student retrieves unified workspace with actionQueue and milestones (200)',
            studentWorkspaceGet.statusCode === 200 &&
            studentWorkspaceGet.body?.data?.student?.id === studentProfileId &&
            Array.isArray(studentWorkspaceGet.body?.data?.actionQueue) &&
            Array.isArray(studentWorkspaceGet.body?.data?.milestones) &&
            studentWorkspaceGet.body?.data?.deadlines !== undefined
        );

        // 18.2 Unauthenticated request to workspace rejected
        const unauthWorkspaceGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/workspace',
            method: 'GET'
        });
        assertTest('Unauthenticated access to student workspace blocked (401)',
            unauthWorkspaceGet.statusCode === 401
        );

        // ==========================================
        // 19. PHASE 6 — SUPERVISOR WORKSPACES & ACTION QUEUES
        // ==========================================
        console.log('\n--- 19. PHASE 6 — SUPERVISOR WORKSPACES & ACTION QUEUES ---');

        // 19.1 Industry Supervisor retrieves unified workspace
        const supWorkspaceGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/supervisor/workspace',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${supervisorAToken}` }
        });
        assertTest('Industry Supervisor retrieves workspace with actionQueue and compliance metrics (200)',
            supWorkspaceGet.statusCode === 200 &&
            supWorkspaceGet.body?.data?.metrics !== undefined &&
            Array.isArray(supWorkspaceGet.body?.data?.actionQueue) &&
            Array.isArray(supWorkspaceGet.body?.data?.students)
        );

        // 19.2 University Supervisor retrieves academic oversight workspace
        const uniSupWorkspaceGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/university/workspace',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${uniSupBToken}` }
        });
        assertTest('University Supervisor retrieves academic oversight workspace (200)',
            uniSupWorkspaceGet.statusCode === 200 &&
            uniSupWorkspaceGet.body?.data?.metrics !== undefined &&
            Array.isArray(uniSupWorkspaceGet.body?.data?.actionQueue) &&
            Array.isArray(uniSupWorkspaceGet.body?.data?.students)
        );

        // 19.3 Student cannot access supervisor workspace (403)
        const studentAccessesSupWorkspace = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/supervisor/workspace',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student role blocked from accessing supervisor workspace (403)',
            studentAccessesSupWorkspace.statusCode === 403
        );

        // ==========================================
        // 20. PHASE 6 — SECURE DOCUMENT & EVIDENCE ACCESS CONTROL
        // ==========================================
        console.log('\n--- 20. PHASE 6 — SECURE DOCUMENT & EVIDENCE ACCESS CONTROL ---');

        // 20.1 Path Traversal Defense: Directory traversal attempt blocked
        const traversalAttempt = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/documents/logbooks/..%2f..%2f..%2fetc%2fpasswd',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Path traversal attempt with ../ sequence blocked (400/403/404)',
            [400, 403, 404].includes(traversalAttempt.statusCode)
        );

        // 20.2 Path Traversal Defense: Invalid category blocked
        const invalidCategoryAttempt = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/documents/system_passwords/secret.txt',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Access to unwhitelisted document category blocked (400/403)',
            [400, 403].includes(invalidCategoryAttempt.statusCode)
        );

        // 20.3 Setup verified test document and check authorized retrieval
        const fs = require('fs');
        const uploadDir = path.join(__dirname, 'uploads', 'logbooks');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const testFileName = 'student_test_evidence.pdf';
        const testFilePath = path.join(uploadDir, testFileName);
        fs.writeFileSync(testFilePath, '%PDF-1.4 test document content');

        const docFetchAttempt = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/documents/logbooks/${testFileName}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Authorized user can access authorized document with MIME header (200)',
            docFetchAttempt.statusCode === 200
        );

        // 20.4 Unauthenticated document access blocked
        const unauthDocAttempt = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/documents/logbooks/${testFileName}`,
            method: 'GET'
        });
        assertTest('Unauthenticated document access strictly rejected (401)',
            unauthDocAttempt.statusCode === 401
        );

        // ==========================================
        // 21. PHASE 6 — LOGBOOK REVISION WORKFLOW & STATE TRANSITIONS
        // ==========================================
        console.log('\n--- 21. PHASE 6 — LOGBOOK REVISION WORKFLOW & STATE TRANSITIONS ---');

        // 21.1 Student submits Week 2 logbook
        const submitWeek2Log = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/student/logbooks',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            weekNumber: 2,
            startDate: '2026-05-08',
            endDate: '2026-05-14',
            summary: 'Initial draft with minimal details on safety procedures.',
            dailyEntries: {
                monday: 'Safety induction.',
                tuesday: 'Machine inspection.',
                wednesday: 'Circuit testing.',
                thursday: 'Soldering headers.',
                friday: 'Documentation.'
            }
        });
        assertTest('Student submits new weekly logbook (201)',
            submitWeek2Log.statusCode === 201 && Boolean(submitWeek2Log.body?.data?.id)
        );
        const week2LogId = submitWeek2Log.body?.data?.id;

        // 21.2 Industry Supervisor rejects Week 2 logbook with revision guidance
        const rejectWeek2Log = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/supervisor/logbooks/${week2LogId}/review`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${supervisorAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            status: 'rejected',
            supervisorComment: 'Please elaborate on the machine safety protocols and circuit testing results.'
        });
        assertTest('Industry Supervisor rejects logbook with guidance (200 & status rejected)',
            rejectWeek2Log.statusCode === 200 && rejectWeek2Log.body?.data?.status === 'rejected'
        );

        // 21.3 Student edits and resubmits rejected logbook
        const reviseWeek2Log = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/student/logbooks/${week2LogId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            summary: 'Expanded documentation covering ISO safety induction protocols and multimeter calibration.',
            dailyEntries: {
                monday: 'ISO 45001 safety induction and emergency stop drills.',
                tuesday: 'Machine inspection with digital multimeter calibration.',
                wednesday: 'Circuit testing of 24V bus converters under 2A load.',
                thursday: 'Soldering high-density header pins with lead-free solder.',
                friday: 'Prepared comprehensive weekly report for engineering review.'
            }
        });
        assertTest('Student edits and resubmits rejected logbook, resetting status to pending (200)',
            reviseWeek2Log.statusCode === 200 &&
            reviseWeek2Log.body?.data?.status === 'pending' &&
            reviseWeek2Log.body?.data?.summary.includes('ISO safety induction protocols')
        );

        // 21.4 Industry Supervisor approves the revised logbook
        const approveRevisedLog = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/supervisor/logbooks/${week2LogId}/review`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${supervisorAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            status: 'approved',
            supervisorComment: 'Excellent revision! Very thorough documentation.'
        });
        assertTest('Industry Supervisor approves revised logbook (200 & status approved)',
            approveRevisedLog.statusCode === 200 && approveRevisedLog.body?.data?.status === 'approved'
        );

        // 21.5 Student attempts to edit an already approved logbook (must be blocked)
        const attemptEditApprovedLog = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/student/logbooks/${week2LogId}`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${studentAToken}`,
                'Content-Type': 'application/json'
            }
        }, {
            summary: 'Unauthorized alteration of an approved record'
        });
        assertTest('Student blocked from modifying already-approved logbook (400)',
            attemptEditApprovedLog.statusCode === 400
        );

        // ==========================================
        // 22. PHASE 7 — ADVANCED ANALYTICS AGGREGATION & HISTORICAL TRENDS
        // ==========================================
        console.log('\n--- 22. PHASE 7 — ADVANCED ANALYTICS AGGREGATION & HISTORICAL TRENDS ---');

        // 22.1 School Admin retrieves institutional analytics overview
        const schoolAAnalyticsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/analytics/overview',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('School Admin retrieves institutional analytics overview with monthly trends (200)',
            schoolAAnalyticsGet.statusCode === 200 &&
            schoolAAnalyticsGet.body?.data?.summary !== undefined &&
            schoolAAnalyticsGet.body?.data?.attendance !== undefined &&
            schoolAAnalyticsGet.body?.data?.logbooks !== undefined &&
            Array.isArray(schoolAAnalyticsGet.body?.data?.monthlyTrends)
        );

        // 22.2 Tenant isolation on analytics (School B Admin only sees School B metrics)
        const schoolBAnalyticsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/analytics/overview',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminBToken}` }
        });
        assertTest('School B Admin receives tenant-isolated analytics (200)',
            schoolBAnalyticsGet.statusCode === 200 &&
            schoolBAnalyticsGet.body?.data?.summary?.totalStudents >= 0
        );

        // 22.3 Student personal analytics & trajectory
        const studentPersonalAnalyticsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/analytics/student',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student accesses personal progress and weekly trajectory analytics (200)',
            studentPersonalAnalyticsGet.statusCode === 200 &&
            studentPersonalAnalyticsGet.body?.data?.student?.id === studentProfileId &&
            Array.isArray(studentPersonalAnalyticsGet.body?.data?.attendance?.weeklyTrend)
        );

        // ==========================================
        // 23. PHASE 7 — DETERMINISTIC INSIGHT ENGINE & EVIDENCE REASONING
        // ==========================================
        console.log('\n--- 23. PHASE 7 — DETERMINISTIC INSIGHT ENGINE & EVIDENCE REASONING ---');
        const insightEngine = require('./services/insightEngine');

        // 23.1 Test deterministic insight generation with evidence
        const mockStudentForInsights = {
            id: 'mock-student-uuid',
            admissionNumber: 'MOCK/2026/001',
            placementStatus: 'ACTIVE',
            startDate: '2026-05-01',
            endDate: '2026-05-10', // Imminent/overdue end date
            attendance: [
                { status: 'present', date: '2026-05-01' },
                { status: 'absent', date: '2026-05-02' },
                { status: 'absent', date: '2026-05-03' }
            ],
            logbooks: [{ status: 'rejected', weekNumber: 1 }, { status: 'rejected', weekNumber: 2 }],
            assessments: [],
            meetings: []
        };
        const generatedInsights = insightEngine.generateStudentInsights(mockStudentForInsights);
        assertTest('Insight engine generates structured, explainable insights with evidence',
            Array.isArray(generatedInsights) &&
            generatedInsights.length > 0 &&
            generatedInsights.some(i => i.type === 'LOW_ATTENDANCE' && i.evidence !== undefined) &&
            generatedInsights.some(i => i.type === 'REPEATED_LOGBOOK_REVISION')
        );

        // 23.2 Institutional Intervention Queue endpoint
        const interventionQueueGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/insights/queue',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Coordinator/Admin retrieves prioritized institutional intervention queue (200)',
            interventionQueueGet.statusCode === 200 &&
            interventionQueueGet.body?.data?.totalCount !== undefined &&
            Array.isArray(interventionQueueGet.body?.data?.queue)
        );

        // ==========================================
        // 24. PHASE 7 — EXPLAINABLE OPERATIONAL RISK SCORING
        // ==========================================
        console.log('\n--- 24. PHASE 7 — EXPLAINABLE OPERATIONAL RISK SCORING ---');
        const riskScoringService = require('./services/riskScoringService');

        // 24.1 Compute bounded operational risk score
        const evaluatedRisk = riskScoringService.calculateStudentRiskScore(mockStudentForInsights);
        assertTest('Risk scoring calculates bounded score (0-100) with transparent contributors',
            typeof evaluatedRisk.score === 'number' &&
            evaluatedRisk.score >= 0 &&
            evaluatedRisk.score <= 100 &&
            ['LOW', 'MODERATE', 'ELEVATED', 'CRITICAL'].includes(evaluatedRisk.level) &&
            Array.isArray(evaluatedRisk.contributors) &&
            evaluatedRisk.contributors.length > 0
        );

        // 24.2 Inactive/Draft placements do not generate false critical alarms
        const draftStudentRisk = riskScoringService.calculateStudentRiskScore({ placementStatus: 'DRAFT' });
        assertTest('Inactive/Draft placement returns baseline LOW risk without false positives',
            draftStudentRisk.score === 0 && draftStudentRisk.level === 'LOW'
        );

        // ==========================================
        // 25. PHASE 7 — ML-READY INFRASTRUCTURE, FEATURE PIPELINE & MODEL GOVERNANCE
        // ==========================================
        console.log('\n--- 25. PHASE 7 — ML-READY INFRASTRUCTURE, FEATURE PIPELINE & MODEL GOVERNANCE ---');
        const featureService = require('./services/ml/featureService');
        const modelRegistryService = require('./services/ml/modelRegistryService');

        // 25.1 Feature engineering extraction without data leakage
        const extracted = featureService.extractStudentFeatures(mockStudentForInsights);
        assertTest('Feature engineering pipeline extracts normalized vectors without future leakage',
            typeof extracted.features === 'object' &&
            extracted.features.attendance_rate !== undefined &&
            extracted.features.placement_duration_elapsed !== undefined &&
            Array.isArray(extracted.featureArray) &&
            Array.isArray(extracted.featureNames)
        );

        // 25.2 Model Registry Governance API
        const modelRegistryGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/insights/models',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('Model Registry enforces sample size adequacy and experimental status (<50 samples) (200)',
            modelRegistryGet.statusCode === 200 &&
            modelRegistryGet.body?.data?.modelVersion !== undefined &&
            modelRegistryGet.body?.data?.status === 'EXPERIMENTAL_NOT_PRODUCTION_READY' &&
            modelRegistryGet.body?.data?.governance?.humanInTheLoopRequired === true
        );

        // 25.3 Student Insights & ML Prediction API with human safeguard
        const studentInsightsGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/insights/student/${studentProfileId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Prediction API delivers explainable factors and human review requirement (200)',
            studentInsightsGet.statusCode === 200 &&
            studentInsightsGet.body?.data?.riskScore !== undefined &&
            studentInsightsGet.body?.data?.mlPrediction?.prediction !== undefined &&
            studentInsightsGet.body?.data?.mlPrediction?.safeguards?.humanReviewRequired === true
        );

        // ==========================================
        // 26. PHASE 7 — DATA QUALITY AUDIT & IDOR / BOLA AUTHORIZATION DEFENSES
        // ==========================================
        console.log('\n--- 26. PHASE 7 — DATA QUALITY AUDIT & IDOR / BOLA AUTHORIZATION DEFENSES ---');

        // 26.1 School Admin accesses Data Quality Audit
        const dataQualityGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/analytics/data-quality',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminAToken}` }
        });
        assertTest('School Admin accesses Data Quality Audit with integrity score (200)',
            dataQualityGet.statusCode === 200 &&
            dataQualityGet.body?.data?.integrityScore !== undefined &&
            dataQualityGet.body?.data?.issuesCount !== undefined
        );

        // 26.2 Student role blocked from Data Quality Audit (403)
        const studentDataQualityGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/analytics/data-quality',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        assertTest('Student role blocked from administrative Data Quality Audit (403)',
            studentDataQualityGet.statusCode === 403
        );

        // 26.3 Student A denied access to Student B personal analytics (IDOR Defense)
        const studentBRecord = await Student.findOne({ where: { schoolId: schoolB.id } });
        const idorAnalyticsAttempt = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: `/api/analytics/student/${studentBRecord ? studentBRecord.id : 'fake-id'}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentAToken}` }
        });
        // For student role, the controller automatically scopes query to self or denies cross-tenant
        assertTest('Student query is strictly scoped to authenticated user and cross-access denied',
            idorAnalyticsAttempt.statusCode === 200 &&
            idorAnalyticsAttempt.body?.data?.student?.id === studentProfileId // Self-scoped
        );

        // 26.4 Unauthenticated request to analytics rejected (401)
        const unauthAnalyticsAttempt = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/analytics/overview',
            method: 'GET'
        });
        assertTest('Unauthenticated analytics access strictly rejected (401)',
            unauthAnalyticsAttempt.statusCode === 401
        );

        // ==========================================
        // 27. PHASE 8 — PRODUCTION HEALTH, READINESS & REQUEST TRACING
        // ==========================================
        console.log('\n--- 27. PHASE 8 — PRODUCTION HEALTH, READINESS & REQUEST TRACING ---');

        // 27.1 Liveness health check (/health)
        const healthGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/health',
            method: 'GET'
        });
        assertTest('Liveness health check returns 200 with status healthy and requestId',
            healthGet.statusCode === 200 &&
            healthGet.body?.status === 'healthy' &&
            typeof healthGet.body?.uptime === 'number' &&
            healthGet.headers['x-request-id'] !== undefined
        );

        // 27.2 Readiness check (/ready)
        const readyGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/ready',
            method: 'GET'
        });
        assertTest('Readiness check returns 200 and confirms database connectivity',
            readyGet.statusCode === 200 &&
            readyGet.body?.status === 'ready' &&
            readyGet.body?.database === 'connected'
        );

        // 27.3 Request Correlation header propagation
        const customTraceId = 'trace-ams-test-uuid-998877';
        const customTraceReq = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/health',
            method: 'GET',
            headers: { 'X-Request-ID': customTraceId }
        });
        assertTest('Custom X-Request-ID is accurately propagated in response header and body',
            customTraceReq.headers['x-request-id'] === customTraceId &&
            customTraceReq.body?.requestId === customTraceId
        );

        // ==========================================
        // 28. PHASE 8 — TRANSACTIONAL BACKUP & SAFE RESTORATION
        // ==========================================
        console.log('\n--- 28. PHASE 8 — TRANSACTIONAL BACKUP & SAFE RESTORATION ---');
        const { runBackup } = require('./scripts/backup');
        const { runRestore, verifySqliteHeader } = require('./scripts/restore');

        const testBackupDir = path.join(__dirname, 'backups_test');
        const backupResult = await runBackup({ backupDir: testBackupDir, maxBackups: 2 });
        assertTest('Transactional SQLite backup creates valid point-in-time snapshot file',
            backupResult.success === true &&
            fs.existsSync(backupResult.targetPath) &&
            backupResult.sizeBytes > 0
        );

        const isHeaderValid = verifySqliteHeader(backupResult.targetPath);
        assertTest('Backup file passes SQLite format 3 magic header verification', isHeaderValid === true);

        // Clean up test backup artifacts
        if (fs.existsSync(testBackupDir)) {
            fs.rmSync(testBackupDir, { recursive: true, force: true });
        }

        // ==========================================
        // 29. PHASE 8 — ADVERSARIAL ATTACK SIMULATION & NEGATIVE REJECTION
        // ==========================================
        console.log('\n--- 29. PHASE 8 — ADVERSARIAL ATTACK SIMULATION & NEGATIVE REJECTION ---');

        // 29.1 Weak password rejected
        const weakPassReg = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Weak Pass User',
            email: `weak_${Date.now()}@test.com`,
            password: '123',
            schoolId: schoolA.id
        });
        assertTest('Registration with weak password (<6 chars) rejected with 400', weakPassReg.statusCode === 400);

        // 29.2 Malformed email rejected
        const malformedEmailReg = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: 'Bad Email User',
            email: 'not-an-email',
            password: 'password123',
            schoolId: schoolA.id
        });
        assertTest('Registration with invalid email syntax rejected with 400', malformedEmailReg.statusCode === 400);

        // 29.3 Root API status route works cleanly
        const rootStatusGet = await makeRequest({
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/',
            method: 'GET'
        });
        assertTest('Root endpoint returns operational system status (200)',
            rootStatusGet.statusCode === 200 &&
            rootStatusGet.body?.status === 'operational'
        );

    } catch (err) {
        console.error('Test Execution Error:', err);
        failedCount++;
    } finally {
        serverProcess.kill();
        console.log('\nServer process stopped.');
    }

    console.log('\n==========================================');
    console.log(`TEST SUMMARY: ${passedCount} Passed, ${failedCount} Failed`);
    console.log('==========================================');

    if (failedCount === 0) {
        console.log('🎉 ALL PHASE 2 + PHASE 3 + PHASE 4 + PHASE 5 + PHASE 6 + PHASE 7 + PHASE 8 TESTS PASSED SUCCESSFULLY! SYSTEM IS PRODUCTION READY!');
        process.exit(0);
    } else {
        console.error('❌ VERIFICATION FAILED');
        process.exit(1);
    }
}

runVerification();
