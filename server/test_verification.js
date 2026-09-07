const http = require('http');
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
        console.log('🎉 ALL PHASE 2 + PHASE 3 + PHASE 4 + PHASE 5 SECURITY, RBAC, COORDINATOR & ACADEMIC OVERSIGHT TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('❌ VERIFICATION FAILED');
        process.exit(1);
    }
}

runVerification();
