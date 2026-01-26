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

// University Supervisor
import UniversityDashboard from './pages/university/Dashboard';
import UniversityProfile from './pages/university/Profile';
import AcademicAssessments from './pages/university/Assessments';

// School Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/school_admin/Profile';
import UserDirectory from './pages/admin/Users';

// Super Admin
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import SuperAdminProfile from './pages/admin/Profile';

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

            {/* Industry Supervisor */}
            <Route path="/industry/dashboard" element={<PrivateRoute roles={['industry_supervisor']}><IndustryDashboard /></PrivateRoute>} />
            <Route path="/industry/profile" element={<PrivateRoute roles={['industry_supervisor']}><IndustryProfile /></PrivateRoute>} />
            <Route path="/industry/attendance" element={<PrivateRoute roles={['industry_supervisor']}><AttendanceMonitoring /></PrivateRoute>} />

            {/* University Supervisor */}
            <Route path="/university/dashboard" element={<PrivateRoute roles={['university_supervisor']}><UniversityDashboard /></PrivateRoute>} />
            <Route path="/university/profile" element={<PrivateRoute roles={['university_supervisor']}><UniversityProfile /></PrivateRoute>} />
            <Route path="/university/assessments" element={<PrivateRoute roles={['university_supervisor']}><AcademicAssessments /></PrivateRoute>} />

            {/* School Admin Routes */}
            <Route path="/school_admin/dashboard" element={<PrivateRoute roles={['school_admin']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/school_admin/profile" element={<PrivateRoute roles={['school_admin']}><AdminProfile /></PrivateRoute>} />
            <Route path="/school_admin/users" element={<PrivateRoute roles={['school_admin']}><UserDirectory /></PrivateRoute>} />

            {/* Super Admin Routes */}
            <Route path="/super_admin/dashboard" element={<PrivateRoute roles={['super_admin']}><SuperAdminDashboard /></PrivateRoute>} />
            <Route path="/super_admin/profile" element={<PrivateRoute roles={['super_admin']}><SuperAdminProfile /></PrivateRoute>} />

            <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-slate-500 font-black uppercase tracking-widest">404 - Terminal Failure</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
