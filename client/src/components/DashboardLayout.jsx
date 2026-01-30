import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 bg-mesh relative overflow-x-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-sidebar z-[70] flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <span className="text-white font-black">A</span>
                    </div>
                    <span className="font-black tracking-tighter text-lg">AttachPro</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className={`
                lg:ml-64 min-h-screen p-4 md:p-8 lg:p-12 pt-24 lg:pt-12 transition-all duration-500
                ${sidebarOpen ? 'blur-sm lg:blur-none' : ''}
            `}>
                <div className="max-w-[1400px] mx-auto animate-fade-in">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
