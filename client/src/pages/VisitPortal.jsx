import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import MeetingResponse from '../components/MeetingResponse';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, MapPin, Video } from 'lucide-react';

const VisitPortal = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout role={user?.role || 'student'}>
            <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
                {/* Header Cockpit */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-300 shadow-inner">
                                <CalendarCheck size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                    Supervision & Assessment
                                </span>
                                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                                    Field Supervision Visits
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Manage scheduled on-site inspections, remote check-ins, and faculty supervisor evaluations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Meetings Container */}
                <MeetingResponse role={user?.role || 'student'} />
            </div>
        </DashboardLayout>
    );
};

export default VisitPortal;

