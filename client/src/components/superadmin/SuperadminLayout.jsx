import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../Sidebar';
import { Menu, X } from 'lucide-react';

const SuperadminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans relative overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Mobile Nav Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-sidebar z-50 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <span className="text-white font-black">A</span>
                    </div>
                    <span className="font-black tracking-tighter text-lg text-white">AttachPro <span className="text-indigo-500 text-xs uppercase font-black">HQ</span></span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl hover:bg-indigo-600/30 transition-all border border-indigo-500/20"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className={`
                lg:ml-64 min-h-screen relative z-10 p-4 md:p-8 lg:p-12 pt-24 lg:pt-12 transition-all duration-500
                ${sidebarOpen ? 'blur-sm lg:blur-none' : ''}
            `}>
                <div className="max-w-[1400px] mx-auto animate-fade-in">
                    <Outlet />
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

export default SuperadminLayout;
