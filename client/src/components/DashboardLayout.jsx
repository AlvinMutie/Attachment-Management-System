import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans flex text-slate-100 bg-mesh overflow-x-hidden">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 transition-all">
                <div className="max-w-[1400px] mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
