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
    GraduationCap
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 rounded-full transition-all duration-300 group relative overflow-hidden ${active
            ? 'text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
    >
        {/* M3 Active Indicator Pill */}
        {active && (
            <div className="absolute inset-0 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)] animate-in fade-in zoom-in-95 duration-300" />
        )}

        <div className="relative flex items-center space-x-4 z-10 w-full">
            <div className={`p-1.5 transition-all duration-500 ${active ? 'scale-110' : 'group-hover:text-blue-400'}`}>
                <Icon size={20} />
            </div>
            <span className={`font-bold tracking-tight text-xs uppercase tracking-[0.1em] transition-all ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                {label}
            </span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
            )}
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
            fixed top-0 left-0 bottom-0 w-64 glass-sidebar z-[60] flex flex-col p-6 transition-all duration-500 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            {/* Branding */}
            <div className="flex items-center space-x-3 mb-12 px-2 cursor-pointer group" onClick={() => { navigate('/'); onClose(); }}>
                <div className="w-12 h-12 bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 group-hover:scale-110 transition-transform text-white ring-1 ring-white/20 overflow-hidden">
                    {user?.schoolLogo ? (
                        <img
                            src={user.schoolLogo.startsWith('http') ? user.schoolLogo : `http://localhost:5000${user.schoolLogo}`}
                            alt="School Logo"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ShieldCheck size={28} />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-white tracking-tighter uppercase leading-none truncate max-w-[120px]">
                        {user?.schoolName?.split(' ')[0] || "Attach"}<span className="text-blue-500">{user?.schoolName?.split(' ')[1] || "Pro"}</span>
                    </span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 ml-0.5">Control Grid</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pr-2">
                <div className="pb-4">
                    <p className="px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-4 opacity-50">Core Interface</p>
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={location.pathname.includes('/dashboard')}
                        onClick={() => { navigate(`/${prefix}/dashboard`); onClose(); }}
                    />
                    {role !== 'super_admin' && (
                        <SidebarItem
                            icon={User}
                            label="Identity Profile"
                            active={location.pathname.includes('/profile')}
                            onClick={() => { navigate(`/${prefix}/profile`); onClose(); }}
                        />
                    )}
                </div>

                <div className="py-4 border-t border-white/5">
                    <p className="px-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Active Operations</p>
                    {role === 'student' && (
                        <SidebarItem
                            icon={BookOpen}
                            label="Weekly Logs"
                            active={location.pathname.includes('/logbooks')}
                            onClick={() => { navigate('/student/logbooks'); onClose(); }}
                        />
                    )}
                    {role === 'student' && (
                        <SidebarItem
                            icon={MapPin}
                            label="My Visits"
                            active={location.pathname.includes('/student/visits')}
                            onClick={() => { navigate('/student/visits'); onClose(); }}
                        />
                    )}

                    {role === 'industry_supervisor' && (
                        <>
                            <SidebarItem
                                icon={Activity}
                                label="Live Presence"
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
                        </>
                    )}

                    {role === 'university_supervisor' && (
                        <>
                            <SidebarItem
                                icon={Users}
                                label="Students"
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
                                label="Meeting Scheduler"
                                active={location.pathname === '/university/meetings'}
                                onClick={() => { navigate('/university/meetings'); onClose(); }}
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
                                label="Member Directory"
                                active={location.pathname === '/school_admin/users'}
                                onClick={() => { navigate('/school_admin/users'); onClose(); }}
                            />
                            <SidebarItem
                                icon={Activity}
                                label="Analytics Hub"
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
                                label="User Registry"
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
                                label="System Health"
                                active={location.pathname.includes('/superadmin/system-health')}
                                onClick={() => { navigate('/superadmin/system-health'); onClose(); }}
                            />
                        </>
                    )}
                </div>

                <div className="py-4 border-t border-white/5">
                    <p className="px-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Support</p>
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={location.pathname === '/settings'}
                        onClick={() => { navigate('/settings'); onClose(); }}
                    />
                </div>
            </div>

            {/* User Profile Summary & Logout */}
            <div className="pt-6 border-t border-white/5">
                <div className="bg-white/5 rounded-2xl p-4 mb-4 flex items-center gap-3 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-blue-400">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-white truncate">{user?.name}</span>
                        <span className="text-[10px] font-medium text-slate-500 truncate uppercase tracking-widest">{role?.replace('_', ' ')}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-sm uppercase tracking-widest"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
