import React, { useState } from 'react';
import {
    Clock,
    Calendar,
    Search,
    Download,
    Filter,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    Users,
    History
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const AttendanceMonitoring = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const attendanceData = [
        { name: 'Alvin Mutie', id: 'BIT-2024-001', date: '26 Jan 2026', clockIn: '08:45 AM', clockOut: '---', status: 'Present', lateness: 'On-time' },
        { name: 'Sarah Wilson', id: 'BIT-2024-005', date: '26 Jan 2026', clockIn: '09:12 AM', clockOut: '---', status: 'Present', lateness: 'Late (12m)' },
        { name: 'Maria Garcia', id: 'BIT-2024-012', date: '26 Jan 2026', clockIn: '---', clockOut: '---', status: 'Absent', lateness: '---' },
        { name: 'David Smith', id: 'BIT-2024-015', date: '25 Jan 2026', clockIn: '08:30 AM', clockOut: '05:00 PM', status: 'Present', lateness: 'On-time' },
        { name: 'Alvin Mutie', id: 'BIT-2024-001', date: '25 Jan 2026', clockIn: '08:50 AM', clockOut: '05:15 PM', status: 'Present', lateness: 'On-time' },
    ];

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-12 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <span className="section-label">Ops Tracking</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Attendance Registry</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">Daily verification logs for your assigned students.</p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-white/5 text-slate-300 px-6 py-3.5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 hover:bg-white/10 transition-all">
                            <Download size={18} />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Today's Presence</p>
                            <p className="text-3xl font-black text-white tracking-tighter">84%</p>
                        </div>
                        <div className="w-12 h-12 bg-green-600/10 text-green-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Average Clock-in</p>
                            <p className="text-3xl font-black text-white tracking-tighter">08:52 AM</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Flagged Absences</p>
                            <p className="text-3xl font-black text-white tracking-tighter">02</p>
                        </div>
                        <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search student history..."
                            className="input-field pl-12 h-14"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="glass-card flex items-center justify-center space-x-3 text-slate-400 hover:text-white transition-all border border-white/5 h-14 text-[10px] font-black uppercase tracking-widest">
                        <Filter size={18} />
                        <span>Filter by Date Range</span>
                    </button>
                </div>

                {/* Log Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <th className="px-8 py-6">Student Account</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Entry / Exit</th>
                                    <th className="px-8 py-6">Lateness Status</th>
                                    <th className="px-8 py-6 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {attendanceData.map((log, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-blue-500 border border-white/5 uppercase tracking-tighter">
                                                    {log.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white tracking-tight">{log.name}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 text-xs font-bold leading-tight flex items-center space-x-2">
                                            <Calendar size={14} className="text-slate-600" />
                                            <span>{log.date}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <span className={`text-xs font-black ${log.clockIn === '---' ? 'text-slate-600' : 'text-blue-400'}`}>{log.clockIn}</span>
                                                <ArrowRight size={12} className="text-slate-700" />
                                                <span className={`text-xs font-black ${log.clockOut === '---' ? 'text-slate-600' : 'text-blue-400'}`}>{log.clockOut}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${log.status === 'Absent' ? 'bg-red-600/20 text-red-400' :
                                                log.lateness === 'On-time' ? 'bg-green-600/20 text-green-400' : 'bg-orange-600/20 text-orange-400'
                                                }`}>
                                                {log.status === 'Absent' ? 'Marked Absent' : log.lateness}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-slate-500 hover:text-white transition-all bg-white/5 p-2.5 rounded-xl border border-white/5">
                                                <History size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legend/Info */}
                <div className="p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-600/10 border-dashed">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <Users size={24} className="text-blue-500" />
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Attendance Policy</h4>
                                <p className="text-xs text-slate-500 font-medium">Clock-ins after 09:00 AM are automatically flagged as late submissions.</p>
                            </div>
                        </div>
                        <button className="bg-blue-600/10 text-blue-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-600/20 transition-all">Request Policy Update</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AttendanceMonitoring;
