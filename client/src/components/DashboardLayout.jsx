import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_DEFINITIONS } from '../config/navigation';

export const DashboardLayout = ({ children, role: propRole }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    const activeRole = propRole || user?.role || 'student';
    const roleDef = ROLE_DEFINITIONS[activeRole] || ROLE_DEFINITIONS.student;

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 bg-mesh relative overflow-x-hidden">
            {/* Ambient Lighting Effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-600/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-indigo-600/5 rounded-full blur-[140px]" />
            </div>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-sidebar z-[70] flex items-center justify-between px-4 sm:px-6 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 text-white font-bold text-sm">
                        <ShieldCheck size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold tracking-tight text-sm text-white">AttachPro</span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">{roleDef.label}</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white transition-colors focus-visible:outline-blue-500"
                    aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={sidebarOpen}
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {/* Application Shell Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Landmark */}
            <main
                id="main-content"
                className={`
                    lg:ml-64 min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 pt-20 lg:pt-8 transition-all duration-300
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
                    className="lg:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[55] animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default DashboardLayout;
