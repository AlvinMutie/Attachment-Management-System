import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_DEFINITIONS } from '../config/navigation';
import NotificationDropdown from './NotificationDropdown';

export const DashboardLayout = ({ children, role: propRole }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const activeRole = propRole || user?.role || 'student';
    const roleDef = ROLE_DEFINITIONS[activeRole] || ROLE_DEFINITIONS.student;

    return (
        <div className="min-h-screen bg-[#080c14] font-sans text-slate-100 relative overflow-x-hidden">
            {/* Ambient Lighting Mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[160px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-sky-600/08 rounded-full blur-[160px]" />
            </div>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0e1a]/90 backdrop-blur-md z-[70] flex items-center justify-between px-4 border-b border-[#192237]">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-600/30">
                        <ShieldCheck size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold tracking-tight text-xs text-white">AttachPro</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest">{roleDef.label}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <NotificationDropdown />
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300 hover:text-white transition-colors border border-white/10"
                        aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={sidebarOpen}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </header>

            {/* Application Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Desktop Top Header Bar */}
            <div className="hidden lg:flex fixed top-3 right-6 z-[50] items-center gap-3">
                <NotificationDropdown />
            </div>

            {/* Main Content Area */}
            <main
                id="main-content"
                className={`
                    lg:ml-64 min-h-screen p-4 sm:p-6 md:p-8 pt-18 lg:pt-6 transition-all duration-300
                    ${sidebarOpen ? 'blur-sm lg:blur-none pointer-events-none lg:pointer-events-auto' : ''}
                `}
            >
                <div className="max-w-[1400px] mx-auto animate-fade-in">
                    {children ? children : <Outlet />}
                </div>
            </main>

            {/* Mobile Backdrop Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-[#080c14]/80 backdrop-blur-sm z-[55] animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default DashboardLayout;
