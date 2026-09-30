/**
 * Phase 1 Backend Verification Suite:
 * Tests the 12 critical verification cases for Student Login (Email & Admission Number),
 * Dynamic QR Token Generation, Supervisor QR Verification, Security, Expiry, Anti-Replay,
 * Assignment Boundaries, and Existing Attendance flows.
 */
const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = require('./index');
const { User, Student, Attendance } = require('./models');

let server;
let baseUrl;

async function request(method, path, body = null, token = null) {
    const url = `${baseUrl}${path}`;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
}

async function runTests() {
    console.log('====================================================');
    console.log('  ATTACHPRO PHASE 1: BACKEND VERIFICATION SUITE');
    console.log('====================================================\n');

    let passed = 0;
    let failed = 0;

    function assert(testName, condition, details = '') {
        if (condition) {
            console.log(`✅ [PASS] ${testName}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${testName}: ${details}`);
            failed++;
        }
    }

    // Start ephemeral server
    await new Promise((resolve) => {
        server = app.listen(0, () => {
            const port = server.address().port;
            baseUrl = `http://127.0.0.1:${port}`;
            resolve();
        });
    });

    try {
        // Find or setup student and supervisor accounts
        const assignedStudent = await Student.findOne({
            include: [
                { model: User, as: 'user' },
                { model: User, as: 'industrySupervisor' }
            ],
            where: {
                industrySupervisorId: { [require('sequelize').Op.ne]: null }
            }
        });

        if (!assignedStudent) {
            throw new Error('No assigned student found in DB for test setup.');
        }

        const studentEmail = assignedStudent.user.email;
        const studentAdm = assignedStudent.admissionNumber;
        const supervisorId = assignedStudent.industrySupervisorId;
        const supervisorUser = await User.findByPk(supervisorId);
        const supervisorEmail = supervisorUser.email;

        // Find an unassigned supervisor
        const unassignedSupervisor = await User.findOne({
            where: {
                role: 'industry_supervisor',
                id: { [require('sequelize').Op.ne]: supervisorId }
            }
        });

        if (!unassignedSupervisor) {
            throw new Error('Need at least two industry supervisors in DB for assignment testing.');
        }

        // Clean up any attendance for today to ensure fresh test runs
        const todayStr = new Date().toISOString().split('T')[0];
        await Attendance.destroy({
            where: {
                studentId: assignedStudent.id,
                date: todayStr
            }
        });

        // ---------------------------------------------------------------------
        // TEST 1: Login using student email -> success
        // ---------------------------------------------------------------------
        const loginEmailRes = await request('POST', '/api/auth/login', {
            email: studentEmail,
            password: 'password123'
        });
        assert(
            'Test 1: Login using student email -> success',
            loginEmailRes.status === 200 && loginEmailRes.data.token && loginEmailRes.data.role === 'student',
            JSON.stringify(loginEmailRes.data)
        );
        const studentToken = loginEmailRes.data.token;

        // ---------------------------------------------------------------------
        // TEST 2: Login using student admission number -> success
        // ---------------------------------------------------------------------
        const loginAdmRes = await request('POST', '/api/auth/login', {
            admissionNumber: studentAdm,
            password: 'password123'
        });
        assert(
            'Test 2: Login using student admission number -> success',
            loginAdmRes.status === 200 && loginAdmRes.data.token && loginAdmRes.data.role === 'student' && loginAdmRes.data.email === studentEmail,
            JSON.stringify(loginAdmRes.data)
        );

        // Also test passing admission number in 'email' field or 'identifier' field (as input from form)
        const loginIdentifierRes = await request('POST', '/api/auth/login', {
            email: studentAdm,
            password: 'password123'
        });
        assert(
            'Test 2b: Login passing admission number in email/identifier field -> success',
            loginIdentifierRes.status === 200 && loginIdentifierRes.data.token,
            JSON.stringify(loginIdentifierRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 3: Invalid credentials -> rejected
        // ---------------------------------------------------------------------
        const invalidLoginRes = await request('POST', '/api/auth/login', {
            email: studentEmail,
            password: 'wrong_password_999'
        });
        assert(
            'Test 3: Invalid credentials -> rejected (401)',
            invalidLoginRes.status === 401 && invalidLoginRes.data.success === false,
            JSON.stringify(invalidLoginRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 4: Student requests QR -> valid token returned
        // ---------------------------------------------------------------------
        const qrRes = await request('GET', '/api/student/attendance/qr-token', null, studentToken);
        assert(
            'Test 4: Student requests QR -> valid token returned',
            qrRes.status === 200 &&
            qrRes.data.success === true &&
            qrRes.data.data.token &&
            qrRes.data.data.expiresInSeconds === 300 &&
            qrRes.data.data.securityHash,
            JSON.stringify(qrRes.data)
        );
        const dynamicQrToken = qrRes.data.data.token;

        // Verify token content matches minimal payload requirements
        const decodedToken = jwt.decode(dynamicQrToken);
        assert(
            'Test 4b: QR Token payload contains minimal required fields (sub, isid, exp, type)',
            decodedToken &&
            decodedToken.sub === assignedStudent.id &&
            decodedToken.isid === supervisorId &&
            decodedToken.type === 'ATTENDANCE_QR' &&
            decodedToken.exp > Math.floor(Date.now() / 1000),
            JSON.stringify(decodedToken)
        );

        // Login as assigned supervisor
        const supLoginRes = await request('POST', '/api/auth/login', {
            email: supervisorEmail,
            password: 'password123'
        });
        const assignedSupToken = supLoginRes.data.token;

        // Login as unassigned supervisor
        const unassignedSupLogin = await request('POST', '/api/auth/login', {
            email: unassignedSupervisor.email,
            password: 'password123'
        });
        const unassignedSupToken = unassignedSupLogin.data.token;

        // ---------------------------------------------------------------------
        // TEST 6: Expired token -> rejected
        // ---------------------------------------------------------------------
        const expiredPayload = {
            sub: assignedStudent.id,
            sid: assignedStudent.schoolId,
            isid: supervisorId,
            type: 'ATTENDANCE_QR',
            iat: Math.floor(Date.now() / 1000) - 400,
            exp: Math.floor(Date.now() / 1000) - 100, // expired 100s ago
            jti: 'expired-token-test-123'
        };
        const expiredToken = jwt.sign(expiredPayload, process.env.JWT_SECRET);

        const expiredScanRes = await request('POST', '/api/supervisor/attendance/scan-qr', {
            token: expiredToken
        }, assignedSupToken);
        assert(
            'Test 6: Expired token -> rejected (400, TOKEN_EXPIRED)',
            expiredScanRes.status === 400 && expiredScanRes.data.code === 'TOKEN_EXPIRED',
            JSON.stringify(expiredScanRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 7: Modified/tampered token -> rejected
        // ---------------------------------------------------------------------
        const tamperedToken = dynamicQrToken.slice(0, -6) + 'abcdef';
        const tamperedScanRes = await request('POST', '/api/supervisor/attendance/scan-qr', {
            token: tamperedToken
        }, assignedSupToken);
        assert(
            'Test 7: Modified/tampered token -> rejected (400, INVALID_TOKEN)',
            tamperedScanRes.status === 400 && tamperedScanRes.data.code === 'INVALID_TOKEN',
            JSON.stringify(tamperedScanRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 8: Wrong supervisor scans student's QR -> rejected
        // ---------------------------------------------------------------------
        const wrongSupScanRes = await request('POST', '/api/supervisor/attendance/scan-qr', {
            token: dynamicQrToken
        }, unassignedSupToken);
        assert(
            'Test 8: Wrong supervisor scans student\'s QR -> rejected (403, UNAUTHORIZED_SUPERVISOR)',
            wrongSupScanRes.status === 403 && wrongSupScanRes.data.code === 'UNAUTHORIZED_SUPERVISOR',
            JSON.stringify(wrongSupScanRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 5 & 9: Token within validity period scanned by correct supervisor -> attendance recorded
        // ---------------------------------------------------------------------
        const validScanRes = await request('POST', '/api/supervisor/attendance/scan-qr', {
            token: dynamicQrToken,
            notes: 'Test scan on-site'
        }, assignedSupToken);
        assert(
            'Test 5 & 9: Correct assigned supervisor scans valid QR -> attendance recorded (201)',
            validScanRes.status === 201 &&
            validScanRes.data.success === true &&
            validScanRes.data.data.attendance.status === 'present' &&
            validScanRes.data.data.attendance.verificationMethod === 'qr_scanner' &&
            validScanRes.data.data.attendance.scannedBy === supervisorId,
            JSON.stringify(validScanRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 10: Same student QR scanned again after successful verification -> rejected / already verified
        // ---------------------------------------------------------------------
        const duplicateScanRes = await request('POST', '/api/supervisor/attendance/scan-qr', {
            token: dynamicQrToken
        }, assignedSupToken);
        assert(
            'Test 10: Same student QR scanned again -> rejected as already verified (409, ALREADY_VERIFIED)',
            duplicateScanRes.status === 409 &&
            duplicateScanRes.data.code === 'ALREADY_VERIFIED' &&
            duplicateScanRes.data.success === false,
            JSON.stringify(duplicateScanRes.data)
        );

        // Check if student requests QR after verification -> reflects alreadyVerified: true
        const qrAfterVerifiedRes = await request('GET', '/api/student/attendance/qr-token', null, studentToken);
        assert(
            'Test 10b: Student QR endpoint indicates alreadyVerified: true after scan',
            qrAfterVerifiedRes.status === 200 && qrAfterVerifiedRes.data.data.alreadyVerified === true,
            JSON.stringify(qrAfterVerifiedRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 11: Existing manual supervisor attendance flow still works
        // ---------------------------------------------------------------------
        // Mark attendance for a past date using manual endpoint
        const manualDate = '2026-08-01';
        const manualRes = await request('POST', '/api/supervisor/attendance/mark', {
            studentId: assignedStudent.id,
            date: manualDate,
            status: 'present',
            notes: 'Manual entry verified'
        }, assignedSupToken);
        assert(
            'Test 11: Existing manual supervisor attendance mark endpoint works',
            manualRes.status === 200 &&
            manualRes.data.success === true &&
            manualRes.data.data.date === manualDate,
            JSON.stringify(manualRes.data)
        );

        // ---------------------------------------------------------------------
        // TEST 12: Existing student attendance history still works
        // ---------------------------------------------------------------------
        const historyRes = await request('GET', '/api/student/attendance', null, studentToken);
        assert(
            'Test 12: Existing student attendance history returns recorded records',
            historyRes.status === 200 &&
            Array.isArray(historyRes.data.data) &&
            historyRes.data.data.some(r => r.date === todayStr && r.verificationMethod === 'qr_scanner'),
            `Total history records: ${historyRes.data?.data?.length}`
        );

    } catch (err) {
        console.error('Test suite error:', err);
        failed++;
    } finally {
        if (server) {
            server.close();
        }
    }

    console.log('\n====================================================');
    console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
}

runTests();
