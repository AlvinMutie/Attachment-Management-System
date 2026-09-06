const http = require('http');
const { spawn } = require('child_process');
const { sequelize, User, School, Student, Logbook } = require('./models');

async function setupTestData() {
    // Ensure clean state for test tenant
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
        { email: 'student_a@ams.com', name: 'Student Alpha', role: 'student', schoolId: schoolA.id }
    ];

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

        if (u.role === 'student') {
            await Student.destroy({ where: { userId: user.id } });
            await Student.create({
                userId: user.id,
                schoolId: u.schoolId,
                admissionNumber: `ADM-${Date.now()}`,
                department: 'Computer Science',
                institution: schoolA.name
            });
        }
    }

    return { schoolA, schoolB };
}

async function runVerification() {
    console.log('🚀 Starting Comprehensive Phase 2 Authentication & RBAC Test Suite...\n');

    const { schoolA, schoolB } = await setupTestData();

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
        console.log('🎉 ALL PHASE 2 SECURITY & RBAC TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('❌ PHASE 2 VERIFICATION FAILED');
        process.exit(1);
    }
}

runVerification();
