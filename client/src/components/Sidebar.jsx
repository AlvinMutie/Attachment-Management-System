import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    UserCheck,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    User,
    ClipboardCheck
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
    >
        <Icon size={22} className={active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
        <span className="font-bold tracking-tight">{label}</span>
    </button>
);

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const role = user?.role;

    // Path mapping to handle role-to-URL translation consistently
    const rolePrefixBoard = {
        'super_admin': 'super_admin',
        'school_admin': 'school_admin',
        'university_supervisor': 'university',
        'industry_supervisor': 'industry',
        'student': 'student'
    };

    const prefix = rolePrefixBoard[role] || 'student';

    return (
        <div className="glass-sidebar flex flex-col p-6">
            <div className="flex items-center space-x-3 mb-12 px-2 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform text-white">
                    <ShieldCheck size={28} fill="currentColor" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">AttachPro</span>
            </div>

            <div className="flex-1 space-y-3">
                <SidebarItem
                    icon={LayoutDashboard}
                    label="Dashboard Overview"
                    active={location.pathname.includes('/dashboard')}
                    onClick={() => navigate(`/${prefix}/dashboard`)}
                />

                {/* Profile Link for ALL roles */}
                <SidebarItem
                    icon={User}
                    label="My Account"
                    active={location.pathname.includes('/profile')}
                    onClick={() => navigate(`/${prefix}/profile`)}
                />

                {role === 'student' && (
                    <>
                        <SidebarItem
                            icon={BookOpen}
                            label="Weekly Logbooks"
                            active={location.pathname.includes('/logbooks')}
                            onClick={() => navigate('/student/logbooks')}
                        />
                    </>
                )}

                {role === 'industry_supervisor' && (
                    <>
                        <SidebarItem
                            icon={UserCheck}
                            label="Attendance Radar"
                            active={location.pathname === '/industry/attendance'}
                            onClick={() => navigate('/industry/attendance')}
                        />
                        <SidebarItem
                            icon={BookOpen}
                            label="Logbook Review"
                            active={location.pathname === '/industry/dashboard'}
                            onClick={() => navigate('/industry/dashboard')}
                        />
                    </>
                )}

                {role === 'university_supervisor' && (
                    <>
                        <SidebarItem
                            icon={Users}
                            label="Student Cohort"
                            active={location.pathname === '/university/dashboard'}
                            onClick={() => navigate('/university/dashboard')}
                        />
                        <SidebarItem
                            icon={ClipboardCheck}
                            label="Academic Assessments"
                            active={location.pathname === '/university/assessments'}
                            onClick={() => navigate('/university/assessments')}
                        />
                    </>
                )}

                {role === 'school_admin' && (
                    <>
                        <SidebarItem
                            icon={Users}
                            label="Identity Registry"
                            active={location.pathname === '/school_admin/users'}
                            onClick={() => navigate('/school_admin/users')}
                        />
                    </>
                )}

                <SidebarItem
                    icon={Settings}
                    label="System Settings"
                    active={location.pathname === '/settings'}
                    onClick={() => navigate('/settings')}
                />
            </div>

            <div className="pt-6 border-t border-white/10">
                <SidebarItem icon={LogOut} label="Sign Out" onClick={handleLogout} />
            </div>
        </div>
    );
};

export default Sidebar;
