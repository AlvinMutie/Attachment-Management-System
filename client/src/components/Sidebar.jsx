import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_NAVIGATION, ROLE_DEFINITIONS } from '../config/navigation';
import { Badge } from './ui/Badge';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-150 group relative select-none ${
            active
                ? 'bg-blue-600/15 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 font-medium'
        }`}
    >
        {/* Active Indicator Line */}
        {active && (
            <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        )}

        <div className="flex items-center space-x-3 w-full">
            <div className={`transition-colors duration-150 ${active ? 'text-blue-400' : 'group-hover:text-blue-400'}`}>
                {Icon && <Icon size={18} aria-hidden="true" />}
            </div>
            <span className="text-sm tracking-tight truncate">
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

    const role = user?.role || 'student';
    const roleDef = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.student;
    const sections = ROLE_NAVIGATION[role] || ROLE_NAVIGATION.student;

    const schoolName = user?.schoolName || 'AttachPro';
    const firstWord = schoolName.split(' ')[0] || 'Attach';
    const secondWord = schoolName.split(' ').slice(1).join(' ') || 'Pro';

    return (
        <aside
            aria-label="Sidebar navigation"
            className={`
                fixed top-0 left-0 bottom-0 w-64 glass-sidebar z-[60] flex flex-col p-4 transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
        >
            {/* Institution / Platform Branding */}
            <div
                className="flex items-center space-x-3 mb-6 px-2 py-2 cursor-pointer group rounded-xl hover:bg-white/[0.02] transition-colors"
                onClick={() => { navigate(roleDef.defaultPath); onClose?.(); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { navigate(roleDef.defaultPath); onClose?.(); } }}
            >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 text-white overflow-hidden flex-shrink-0">
                    {user?.schoolLogo ? (
                        <img
                            src={user.schoolLogo.startsWith('http') ? user.schoolLogo : `http://localhost:5000${user.schoolLogo}`}
                            alt={schoolName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ShieldCheck size={22} />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-white tracking-tight leading-none truncate">
                        {firstWord} <span className="text-blue-500">{secondWord}</span>
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">
                        {roleDef.label}
                    </span>
                </div>
            </div>

            {/* Role Navigation Menu */}
            <nav className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-1" aria-label="Main Navigation">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className={sIdx > 0 ? 'pt-3 border-t border-white/5' : ''}>
                        {section.section && (
                            <p className="px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 select-none">
                                {section.section}
                            </p>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item, iIdx) => {
                                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

                                return (
                                    <SidebarItem
                                        key={iIdx}
                                        icon={item.icon}
                                        label={item.label}
                                        active={isActive}
                                        onClick={() => {
                                            navigate(item.path);
                                            onClose?.();
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile Summary & Logout */}
            <div className="pt-3 border-t border-white/5 mt-auto">
                <div className="bg-slate-900/60 rounded-xl p-2.5 mb-2 flex items-center gap-3 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white truncate">{user?.name || 'Authorized User'}</span>
                        <span className="text-[9px] font-medium text-slate-500 truncate uppercase tracking-widest">{roleDef.label}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors font-semibold text-xs tracking-wider uppercase select-none"
                >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
