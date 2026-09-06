import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Auth & General (Lazy Loaded)
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Settings = lazy(() => import('./pages/Settings'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const CommunicationHub = lazy(() => import('./pages/CommunicationHub'));
const RequestAccess = lazy(() => import('./pages/RequestAccess'));

// Student (Lazy Loaded)
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));
const LogbookUpload = lazy(() => import('./pages/student/LogbookUpload'));

// Industry Supervisor (Lazy Loaded)
const IndustryDashboard = lazy(() => import('./pages/industry/Dashboard'));
const IndustryProfile = lazy(() => import('./pages/industry/Profile'));
const AttendanceMonitoring = lazy(() => import('./pages/industry/Attendance'));
const PresenceHub = lazy(() => import('./pages/industry/PresenceHub'));

// University Supervisor (Lazy Loaded)
const UniversityDashboard = lazy(() => import('./pages/university/Dashboard'));
const UniversityProfile = lazy(() => import('./pages/university/Profile'));
const AcademicAssessments = lazy(() => import('./pages/university/Assessments'));
const MeetingScheduler = lazy(() => import('./pages/university/MeetingScheduler'));

// School Admin (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProfile = lazy(() => import('./pages/school_admin/Profile'));
const UserDirectory = lazy(() => import('./pages/admin/Users'));
const InstitutionalAnalytics = lazy(() => import('./pages/school_admin/Analytics'));
const StudentRegistryManagement = lazy(() => import('./pages/school_admin/StudentManagement'));
const VisitPortal = lazy(() => import('./pages/VisitPortal'));

// Super Admin (Lazy Loaded)
const SuperadminLayout = lazy(() => import('./components/superadmin/SuperadminLayout'));
const SuperadminDashboard = lazy(() => import('./pages/superadmin/Dashboard'));
const SchoolManagement = lazy(() => import('./pages/superadmin/SchoolManagement'));
const UserManagement = lazy(() => import('./pages/superadmin/UserManagement'));
const AuditLogs = lazy(() => import('./pages/superadmin/AuditLogs'));
const SystemHealth = lazy(() => import('./pages/superadmin/SystemHealth'));

const RouteLoadingFallback = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6" role="status" aria-label="Loading page">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Loading AttachPro</span>
    </div>
);

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<RouteLoadingFallback />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/legal/:type" element={<LegalPage />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/request-access" element={<RequestAccess />} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
                    <Route path="/student/profile" element={<PrivateRoute roles={['student']}><StudentProfile /></PrivateRoute>} />
                    <Route path="/student/logbooks" element={<PrivateRoute roles={['student']}><LogbookUpload /></PrivateRoute>} />
                    <Route path="/student/visits" element={<PrivateRoute roles={['student']}><VisitPortal /></PrivateRoute>} />
                    <Route path="/student/messages" element={<PrivateRoute roles={['student']}><CommunicationHub /></PrivateRoute>} />

                    {/* Industry Supervisor Routes */}
                    <Route path="/industry/dashboard" element={<PrivateRoute roles={['industry_supervisor']}><IndustryDashboard /></PrivateRoute>} />
                    <Route path="/industry/profile" element={<PrivateRoute roles={['industry_supervisor']}><IndustryProfile /></PrivateRoute>} />
                    <Route path="/industry/presence" element={<PrivateRoute roles={['industry_supervisor']}><PresenceHub /></PrivateRoute>} />
                    <Route path="/industry/attendance" element={<PrivateRoute roles={['industry_supervisor']}><AttendanceMonitoring /></PrivateRoute>} />
                    <Route path="/industry/visits" element={<PrivateRoute roles={['industry_supervisor']}><VisitPortal /></PrivateRoute>} />
                    <Route path="/industry/messages" element={<PrivateRoute roles={['industry_supervisor']}><CommunicationHub /></PrivateRoute>} />

                    {/* University Supervisor Routes */}
                    <Route path="/university/dashboard" element={<PrivateRoute roles={['university_supervisor']}><UniversityDashboard /></PrivateRoute>} />
                    <Route path="/university/profile" element={<PrivateRoute roles={['university_supervisor']}><UniversityProfile /></PrivateRoute>} />
                    <Route path="/university/assessments" element={<PrivateRoute roles={['university_supervisor']}><AcademicAssessments /></PrivateRoute>} />
                    <Route path="/university/meetings" element={<PrivateRoute roles={['university_supervisor']}><MeetingScheduler /></PrivateRoute>} />
                    <Route path="/university/messages" element={<PrivateRoute roles={['university_supervisor']}><CommunicationHub /></PrivateRoute>} />

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

                    {/* 404 Fallback */}
                    <Route
                        path="*"
                        element={
                            <div className="flex flex-col items-center justify-center min-h-screen text-slate-400 p-6">
                                <h1 className="text-4xl font-black text-white mb-2">404</h1>
                                <p className="text-xs uppercase tracking-widest text-slate-500 mb-6">Page Not Found</p>
                                <a href="/" className="btn-primary text-xs uppercase tracking-widest px-6 py-2.5">Return Home</a>
                            </div>
                        }
                    />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen selection:bg-blue-600/30">
                    <AnimatedRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
