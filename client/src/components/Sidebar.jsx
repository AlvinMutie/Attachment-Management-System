import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_NAVIGATION, ROLE_DEFINITIONS } from '../config/navigation';
import ThemeToggle from './ui/ThemeToggle';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 group relative select-none cursor-pointer font-sans ${
            active
                ? 'bg-[#1a1c26] dark:bg-[#1a1c26] bg-[#eae6dc] text-slate-900 dark:text-white font-bold border border-[#2e3244] dark:border-[#2e3244] border-[#cfc8b8] shadow-xs'
                : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] font-semibold'
        }`}
    >
        <div className="flex items-center space-x-2.5 min-w-0">
            <div className={`transition-colors duration-150 ${active ? 'text-violet-600 dark:text-violet-400' : 'group-hover:text-slate-950 dark:group-hover:text-slate-300'}`}>
                {Icon && <Icon size={16} aria-hidden="true" />}
            </div>
            <span className="text-xs tracking-tight truncate">
                {label}
            </span>
        </div>
        {active && (
            <div className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
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
                fixed top-0 left-0 bottom-0 w-60 bg-[#101218] dark:bg-[#101218] bg-[#fbfbfa] border-r border-[#22242f] dark:border-[#22242f] border-[#e5e0d5] z-[60] flex flex-col p-3.5 transition-all duration-200 ease-in-out font-sans shadow-sm
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
        >
            {/* Institution Branding */}
            <div
                className="flex items-center space-x-2.5 mb-4 px-2 py-2 cursor-pointer group rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors border border-transparent hover:border-[#e5e0d5] dark:hover:border-[#22242f]"
                onClick={() => { navigate(roleDef.defaultPath); onClose?.(); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { navigate(roleDef.defaultPath); onClose?.(); } }}
            >
                <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm text-white overflow-hidden flex-shrink-0">
                    {user?.schoolLogo ? (
                        <img
                            src={user.schoolLogo.startsWith('http') ? user.schoolLogo : `http://localhost:5000${user.schoolLogo}`}
                            alt={schoolName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ShieldCheck size={18} />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                        {firstWord} <span className="text-violet-600 dark:text-violet-400">{secondWord}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                        {roleDef.label}
                    </span>
                </div>
            </div>

            {/* Role Navigation Menu */}
            <nav className="flex-1 space-y-3 overflow-y-auto pr-1" aria-label="Main Navigation">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className={sIdx > 0 ? 'pt-2 border-t border-[#e5e0d5] dark:border-[#1a1c26]' : ''}>
                        {section.section && (
                            <p className="px-3 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1 select-none">
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
            <div className="pt-3 border-t border-[#e5e0d5] dark:border-[#1a1c26] mt-auto space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Appearance</span>
                    <ThemeToggle variant="pill" showLabel={true} />
                </div>

                <div className="bg-white dark:bg-[#151720] rounded-lg p-2.5 flex items-center gap-2.5 border border-[#e5e0d5] dark:border-[#22242f] shadow-2xs">
                    <div className="w-7 h-7 rounded-md bg-violet-600/15 text-violet-600 dark:text-violet-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Authorized User'}</span>
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate">{user?.email || roleDef.label}</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all font-bold text-xs tracking-tight select-none cursor-pointer shadow-2xs"
                >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
