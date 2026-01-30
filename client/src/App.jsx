import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Auth & General
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import LandingPage from './pages/LandingPage';
import Settings from './pages/Settings';
import LegalPage from './pages/LegalPage';

// Student
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import LogbookUpload from './pages/student/LogbookUpload';

// Industry Supervisor
import IndustryDashboard from './pages/industry/Dashboard';
import IndustryProfile from './pages/industry/Profile';
import AttendanceMonitoring from './pages/industry/Attendance';
import PresenceHub from './pages/industry/PresenceHub';

// University Supervisor
import UniversityDashboard from './pages/university/Dashboard';
import UniversityProfile from './pages/university/Profile';
import AcademicAssessments from './pages/university/Assessments';
import MeetingScheduler from './pages/university/MeetingScheduler';

// School Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/school_admin/Profile';
import UserDirectory from './pages/admin/Users';
import InstitutionalAnalytics from './pages/school_admin/Analytics';
import StudentRegistryManagement from './pages/school_admin/StudentManagement';
import VisitPortal from './pages/VisitPortal';

// Super Admin
import SuperadminLayout from './components/superadmin/SuperadminLayout';
import SuperadminDashboard from './pages/superadmin/Dashboard';
import SchoolManagement from './pages/superadmin/SchoolManagement';
import UserManagement from './pages/superadmin/UserManagement';
import AuditLogs from './pages/superadmin/AuditLogs';
import SystemHealth from './pages/superadmin/SystemHealth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen selection:bg-blue-600/30">
          <Routes>
            {/* HMR Reset: 2026-01-26 19:10 */}
            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
            <Route path="/student/profile" element={<PrivateRoute roles={['student']}><StudentProfile /></PrivateRoute>} />
            <Route path="/student/logbooks" element={<PrivateRoute roles={['student']}><LogbookUpload /></PrivateRoute>} />
            <Route path="/student/visits" element={<PrivateRoute roles={['student']}><VisitPortal /></PrivateRoute>} />

            {/* Industry Supervisor */}
            <Route path="/industry/dashboard" element={<PrivateRoute roles={['industry_supervisor']}><IndustryDashboard /></PrivateRoute>} />
            <Route path="/industry/profile" element={<PrivateRoute roles={['industry_supervisor']}><IndustryProfile /></PrivateRoute>} />
            <Route path="/industry/presence" element={<PrivateRoute roles={['industry_supervisor']}><PresenceHub /></PrivateRoute>} />
            <Route path="/industry/attendance" element={<PrivateRoute roles={['industry_supervisor']}><AttendanceMonitoring /></PrivateRoute>} />
            <Route path="/industry/visits" element={<PrivateRoute roles={['industry_supervisor']}><VisitPortal /></PrivateRoute>} />

            {/* University Supervisor */}
            <Route path="/university/dashboard" element={<PrivateRoute roles={['university_supervisor']}><UniversityDashboard /></PrivateRoute>} />
            <Route path="/university/profile" element={<PrivateRoute roles={['university_supervisor']}><UniversityProfile /></PrivateRoute>} />
            <Route path="/university/assessments" element={<PrivateRoute roles={['university_supervisor']}><AcademicAssessments /></PrivateRoute>} />
            <Route path="/university/meetings" element={<PrivateRoute roles={['university_supervisor']}><MeetingScheduler /></PrivateRoute>} />

            {/* School Admin Routes */}
            <Route path="/school_admin/dashboard" element={<PrivateRoute roles={['school_admin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/school_admin/profile" element={<PrivateRoute roles={['school_admin']}><AdminProfile /></PrivateRoute>} />
            <Route path="/school_admin/users" element={<PrivateRoute roles={['school_admin']}><UserDirectory /></PrivateRoute>} />
            <Route path="/school_admin/analytics" element={<PrivateRoute roles={['school_admin']}><InstitutionalAnalytics /></PrivateRoute>} />
            <Route path="/school_admin/students" element={<PrivateRoute roles={['school_admin']}><StudentRegistryManagement /></PrivateRoute>} />

            {/* Super Admin Routes */}
            <Route path="/superadmin" element={<PrivateRoute roles={['super_admin']}><SuperadminLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<SuperadminDashboard />} />
              <Route path="schools" element={<SchoolManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="system-health" element={<SystemHealth />} />
            </Route>

            <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-slate-500 font-black uppercase tracking-widest">404 - Terminal Failure</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
