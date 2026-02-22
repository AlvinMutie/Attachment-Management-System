import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    MapPin,
    UserCheck,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    User,
    ClipboardCheck,
    ChevronRight,
    Building2,
    Activity,
    History,
    FileSearch,
    GraduationCap,
    MessageCircle
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${active
            ? 'bg-blue-600/10 text-blue-400'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
    >
        {/* Active Indicator Line */}
        {active && (
            <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        )}

        <div className="flex items-center space-x-3 w-full">
            <div className={`transition-colors duration-200 ${active ? 'text-blue-400' : 'group-hover:text-blue-400'}`}>
                <Icon size={18} />
            </div>
            <span className={`font-semibold text-sm tracking-tight transition-all ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                {label}
            </span>
        </div>
    </button>
);

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const role = user?.role;

    const rolePrefixBoard = {
        'super_admin': 'superadmin',
        'school_admin': 'school_admin',
        'university_supervisor': 'university',
        'industry_supervisor': 'industry',
        'student': 'student'
    };

    const prefix = rolePrefixBoard[role] || 'student';

    return (
        <aside className={`
            fixed top-0 left-0 bottom-0 w-64 glass-sidebar z-[60] flex flex-col p-5 transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            {/* Branding */}
            <div className="flex items-center space-x-3 mb-10 px-2 cursor-pointer group" onClick={() => { navigate('/'); onClose(); }}>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white overflow-hidden">
                    {user?.schoolLogo ? (
                        <img
                            src={user.schoolLogo.startsWith('http') ? user.schoolLogo : `http://localhost:5000${user.schoolLogo}`}
                            alt="School Logo"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ShieldCheck size={24} />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white tracking-tight leading-none truncate max-w-[130px]">
                        {user?.schoolName?.split(' ')[0] || "Attach"}<span className="text-blue-500">{user?.schoolName?.split(' ')[1] || "Pro"}</span>
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">Management Console</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
                <div className="pb-4">
                    <p className="px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Navigation</p>
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={location.pathname.includes('/dashboard')}
                        onClick={() => { navigate(`/${prefix}/dashboard`); onClose(); }}
                    />
                    {role !== 'super_admin' && (
                        <SidebarItem
                            icon={User}
                            label="My Profile"
                            active={location.pathname.includes('/profile')}
                            onClick={() => { navigate(`/${prefix}/profile`); onClose(); }}
                        />
                    )}
                </div>

                <div className="py-4 border-t border-white/5">
                    <p className="px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Workspace</p>
                    {role === 'student' && (
                        <>
                            <SidebarItem
                                icon={BookOpen}
                                label="Weekly Logs"
                                active={location.pathname.includes('/logbooks')}
                                onClick={() => { navigate('/student/logbooks'); onClose(); }}
                            />
                            <SidebarItem
                                icon={MapPin}
                                label="My Visits"
                                active={location.pathname.includes('/student/visits')}
                                onClick={() => { navigate('/student/visits'); onClose(); }}
                            />
                            <SidebarItem
                                icon={MessageCircle}
                                label="Messages"
                                active={location.pathname.includes('/student/messages')}
                                onClick={() => { navigate('/student/messages'); onClose(); }}
                            />
                        </>
                    )}

                    {role === 'industry_supervisor' && (
                        <>
                            <SidebarItem
                                icon={Activity}
                                label="Presence Tracking"
                                active={location.pathname === '/industry/presence'}
                                onClick={() => { navigate('/industry/presence'); onClose(); }}
                            />
                            <SidebarItem
                                icon={UserCheck}
                                label="Attendance"
                                active={location.pathname === '/industry/attendance'}
                                onClick={() => { navigate('/industry/attendance'); onClose(); }}
                            />
                            <SidebarItem
                                icon={MapPin}
                                label="Site Visits"
                                active={location.pathname === '/industry/visits'}
                                onClick={() => { navigate('/industry/visits'); onClose(); }}
                            />
                            <SidebarItem
                                icon={MessageCircle}
                                label="Messages"
                                active={location.pathname === '/industry/messages'}
                                onClick={() => { navigate('/industry/messages'); onClose(); }}
                            />
                        </>
                    )}

                    {role === 'university_supervisor' && (
                        <>
                            <SidebarItem
                                icon={Users}
                                label="Student List"
                                active={location.pathname === '/university/dashboard'}
                                onClick={() => { navigate('/university/dashboard'); onClose(); }}
                            />
                            <SidebarItem
                                icon={ClipboardCheck}
                                label="Assessments"
                                active={location.pathname === '/university/assessments'}
                                onClick={() => { navigate('/university/assessments'); onClose(); }}
                            />
                            <SidebarItem
                                icon={MapPin}
                                label="Meetings"
                                active={location.pathname === '/university/meetings'}
                                onClick={() => { navigate('/university/meetings'); onClose(); }}
                            />
                            <SidebarItem
                                icon={MessageCircle}
                                label="Messages"
                                active={location.pathname === '/university/messages'}
                                onClick={() => { navigate('/university/messages'); onClose(); }}
                            />
                        </>
                    )}

                    {role === 'school_admin' && (
                        <>
                            <SidebarItem
                                icon={GraduationCap}
                                label="Student Registry"
                                active={location.pathname === '/school_admin/students'}
                                onClick={() => { navigate('/school_admin/students'); onClose(); }}
                            />
                            <SidebarItem
                                icon={Users}
                                label="User List"
                                active={location.pathname === '/school_admin/users'}
                                onClick={() => { navigate('/school_admin/users'); onClose(); }}
                            />
                            <SidebarItem
                                icon={Activity}
                                label="Performance Analytics"
                                active={location.pathname === '/school_admin/analytics'}
                                onClick={() => { navigate('/school_admin/analytics'); onClose(); }}
                            />
                        </>
                    )}

                    {role === 'super_admin' && (
                        <>
                            <SidebarItem
                                icon={Building2}
                                label="Institutions"
                                active={location.pathname.includes('/superadmin/schools')}
                                onClick={() => { navigate('/superadmin/schools'); onClose(); }}
                            />
                            <SidebarItem
                                icon={Users}
                                label="User Management"
                                active={location.pathname.includes('/superadmin/users')}
                                onClick={() => { navigate('/superadmin/users'); onClose(); }}
                            />
                            <SidebarItem
                                icon={History}
                                label="Audit Logs"
                                active={location.pathname.includes('/superadmin/audit-logs')}
                                onClick={() => { navigate('/superadmin/audit-logs'); onClose(); }}
                            />
                            <SidebarItem
                                icon={Activity}
                                label="System Status"
                                active={location.pathname.includes('/superadmin/system-health')}
                                onClick={() => { navigate('/superadmin/system-health'); onClose(); }}
                            />
                        </>
                    )}
                </div>

                <div className="py-4 border-t border-white/5">
                    <p className="px-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">General</p>
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={location.pathname === '/settings'}
                        onClick={() => { navigate('/settings'); onClose(); }}
                    />
                </div>
            </div>

            {/* User Profile Summary & Logout */}
            <div className="pt-5 border-t border-white/5">
                <div className="bg-slate-900/50 rounded-xl p-3 mb-3 flex items-center gap-3 border border-white/5">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center font-bold text-blue-400 text-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-semibold text-white truncate">{user?.name}</span>
                        <span className="text-[10px] font-medium text-slate-500 truncate uppercase tracking-widest">{role?.replace('_', ' ')}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors font-semibold text-xs uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside >
    );
};

export default Sidebar;
