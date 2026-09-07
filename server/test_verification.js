const http = require('http');
const { spawn } = require('child_process');
const { sequelize, User, School, Student, Logbook, Attendance, Assessment } = require('./models');

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
        { email: 'supervisor_a@ams.com', name: 'Supervisor Alpha', role: 'industry_supervisor', schoolId: schoolA.id },
        { email: 'supervisor_b@ams.com', name: 'Supervisor Beta Unassigned', role: 'industry_supervisor', schoolId: schoolA.id },
        { email: 'unisup_a@ams.com', name: 'Uni Supervisor Alpha', role: 'university_supervisor', schoolId: schoolA.id },
        { email: 'unisup_b@ams.com', name: 'Uni Supervisor Beta Unassigned', role: 'university_supervisor', schoolId: schoolA.id },
        { email: 'student_a@ams.com', name: 'Student Alpha', role: 'student', schoolId: schoolA.id },
        { email: 'student_b@ams.com', name: 'Student Beta', role: 'student', schoolId: schoolB.id }
    ];

    const userMap = {};

    for (const u of usersToSeed) {
        await User.destroy({ where: { email: u.email } });
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
            await Student.destroy({ where: { userId: user.id } });
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
        env: { ...process.env, PORT: TEST_PORT, JWT_SECRET: 'test_jwt_secret_ams_2026_phase2' }
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
        console.log('🎉 ALL PHASE 2 + PHASE 3 SECURITY, RBAC & WORKFLOW TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('❌ VERIFICATION FAILED');
        process.exit(1);
    }
}

runVerification();
