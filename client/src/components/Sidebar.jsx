import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_NAVIGATION, ROLE_DEFINITIONS } from '../config/navigation';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 group relative select-none cursor-pointer ${
            active
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/25 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] font-medium'
        }`}
    >
        <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`transition-colors duration-150 ${active ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`}>
                {Icon && <Icon size={17} aria-hidden="true" />}
            </div>
            <span className="text-xs tracking-tight truncate">
                {label}
            </span>
        </div>
        {active && (
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
        )}
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
                fixed top-0 left-0 bottom-0 w-64 bg-[#0a0e1a] border-r border-[#192237] z-[60] flex flex-col p-4 transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
        >
            {/* Institution Branding */}
            <div
                className="flex items-center space-x-3 mb-5 px-2 py-2 cursor-pointer group rounded-xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-[#1f293d]"
                onClick={() => { navigate(roleDef.defaultPath); onClose?.(); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { navigate(roleDef.defaultPath); onClose?.(); } }}
            >
                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white overflow-hidden flex-shrink-0 border-t border-indigo-400/30">
                    {user?.schoolLogo ? (
                        <img
                            src={user.schoolLogo.startsWith('http') ? user.schoolLogo : `http://localhost:5000${user.schoolLogo}`}
                            alt={schoolName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ShieldCheck size={20} />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white tracking-tight leading-none truncate">
                        {firstWord} <span className="text-indigo-400">{secondWord}</span>
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">
                        {roleDef.label}
                    </span>
                </div>
            </div>

            {/* Role Navigation Menu */}
            <nav className="flex-1 space-y-3.5 overflow-y-auto pr-1" aria-label="Main Navigation">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className={sIdx > 0 ? 'pt-2.5 border-t border-[#192237]' : ''}>
                        {section.section && (
                            <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 select-none">
                                {section.section}
                            </p>
                        )}
                        <div className="space-y-0.5">
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
            <div className="pt-3 border-t border-[#192237] mt-auto">
                <div className="bg-[#101626] rounded-xl p-2.5 mb-2 flex items-center gap-2.5 border border-[#1f293d]">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white truncate">{user?.name || 'Authorized User'}</span>
                        <span className="text-[9px] font-medium text-slate-500 truncate uppercase tracking-wider">{roleDef.label}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors font-medium text-xs tracking-wider uppercase select-none cursor-pointer"
                >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
