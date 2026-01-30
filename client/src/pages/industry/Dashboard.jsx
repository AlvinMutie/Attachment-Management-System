import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    Users,
    CheckCircle,
    XCircle,
    Camera,
    Clock,
    History,
    AlertCircle,
    BarChart3,
    ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-8 flex flex-col justify-between h-full bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 hover:border-blue-500/20 transition-all group rounded-m3-large overflow-hidden relative">
        <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{label}</p>
            <div className={`p-3 rounded-2xl bg-white/5 ${color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="text-4xl font-black text-white tracking-tighter relative z-10">{value}</p>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 blur-xl rounded-full" />
    </div>
);

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let scanner;
        if (isScanning) {
            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            });

            scanner.render((result) => {
                setScanResult(result);
                setIsScanning(false);
                scanner.clear();
            }, (error) => { });
        }

        return () => {
            if (scanner) scanner.clear();
        };
    }, [isScanning]);

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-12 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-blue-600/5 p-10 rounded-m3-xl border border-blue-600/10 backdrop-blur-md">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 ring-1 ring-white/20">
                            <Users className="text-white" size={44} />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-70">Industrial Management</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Industry <span className="text-blue-500">Supervisor</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">Overseeing student placements & verifying attendance compliance nodal point.</p>
                        </div>
                    </div>
                    <div className="flex bg-blue-600/10 p-2 rounded-2xl border border-blue-600/20 shadow-lg">
                        <div className="flex items-center gap-4 px-6 py-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                            <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Core Operational</span>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={Users} label="Total Students" value="12" color="text-blue-400" />
                    <StatCard icon={CheckCircle} label="Today's Present" value="10" color="text-green-400" />
                    <StatCard icon={AlertCircle} label="Pending Reviews" value="08" color="text-orange-400" />
                    <StatCard icon={Clock} label="Average Lateness" value="5m" color="text-purple-400" />
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* QR Attendance Scanner */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-10 flex flex-col items-center justify-center space-y-10 bg-gradient-to-br from-white/[0.04] to-transparent !rounded-m3-xl shadow-2xl">
                            <div className="text-center w-full space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Clock-in Student</h3>
                                <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">Presence Verification Node</p>
                            </div>

                            {!isScanning ? (
                                <div
                                    onClick={() => setIsScanning(true)}
                                    className="w-full aspect-square bg-white/[0.02] border-2 border-dashed border-white/10 rounded-m3-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-blue-500/30 transition-all group shadow-inner"
                                >
                                    <div className="w-24 h-24 bg-blue-600/10 text-blue-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                                        <Camera size={48} />
                                    </div>
                                    <span className="text-slate-500 font-black text-[11px] uppercase tracking-[0.25em] group-hover:text-blue-400">Initialize Camera</span>
                                </div>
                            ) : (
                                <div id="reader" className="w-full overflow-hidden rounded-m3-xl border-4 border-blue-600/50 shadow-2xl" />
                            )}

                            {scanResult && (
                                <div className="w-full bg-green-600/10 border border-green-600/20 p-6 rounded-[2rem] animate-fade-in text-center">
                                    <div className="flex items-center justify-center space-x-3 text-green-400 mb-2">
                                        <CheckCircle size={24} />
                                        <span className="font-black uppercase tracking-widest text-xs">Verified</span>
                                    </div>
                                    <p className="text-[10px] font-mono text-slate-500 truncate">{scanResult}</p>
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-4 hover:underline"
                                    >
                                        Log Another Student
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="glass-card p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Latest Entries</h3>
                                <History size={16} className="text-blue-400" />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: 'Alvin Mutie', time: '08:45 AM', status: 'On-time' },
                                    { name: 'Sarah Wilson', time: '09:12 AM', status: 'Late' },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-white tracking-tight">{log.name}</p>
                                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{log.time}</p>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${log.status === 'On-time' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-500'}`}>{log.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pending Reviews & Roster */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-white tracking-tighter">Action Required</h3>
                            <span className="bg-orange-600/20 text-orange-400 text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse tracking-widest">02 Pending</span>
                        </div>

                        <div className="space-y-6 px-2">
                            {[
                                { name: 'Alvin Mutie', week: 9, submissionDate: '24 Jan 2026', avatar: 'AM', school: 'School/Computing' },
                                { name: 'Sarah Wilson', week: 9, submissionDate: '25 Jan 2026', avatar: 'SW', school: 'Business/Mkt' },
                            ].map((sub, i) => (
                                <div key={i} className="glass-card p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-blue-600/30 transition-all bg-gradient-to-r from-blue-600/5 to-transparent !rounded-m3-xl">
                                    <div className="flex items-center space-x-8">
                                        <div className="w-20 h-20 bg-blue-600/20 rounded-[28px] flex items-center justify-center font-black text-blue-400 text-2xl border border-blue-600/20 shadow-inner group-hover:scale-105 transition-transform">
                                            {sub.avatar}
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black text-white tracking-tighter">{sub.name}</h4>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{sub.school} • Week {sub.week}</p>
                                            <div className="flex items-center space-x-3 pt-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                                                <Clock size={14} className="text-blue-500/50" />
                                                <span>Sent {sub.submissionDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center space-x-3">
                                            <span>Full Review</span>
                                            <ArrowUpRight size={20} />
                                        </button>
                                        <button className="p-4 rounded-2xl bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-lg">
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Student Watchlist */}
                        <div className="glass-card overflow-hidden">
                            <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs">Direct Supervision Roster</h3>
                                <button className="text-blue-500 text-xs font-black tracking-widest uppercase hover:underline">Full Analytics</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.02]">
                                        <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
                                            <th className="px-8 py-5">Managed Student</th>
                                            <th className="px-8 py-5">Attendance</th>
                                            <th className="px-8 py-5">Last Activity</th>
                                            <th className="px-8 py-5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium">
                                        {[
                                            { name: 'Alvin Mutie', id: 'BIT-2024-001', attendance: 98, last: 'Today, 08:45 AM', color: 'bg-green-500' },
                                            { name: 'Sarah Wilson', id: 'BIT-2024-005', attendance: 85, last: 'Yesterday', color: 'bg-blue-500' },
                                            { name: 'Mike Ross', id: 'BIT-2024-012', attendance: 72, last: '2 days ago', color: 'bg-orange-500' },
                                        ].map((student, i) => (
                                            <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full group-hover:h-8 transition-all" />
                                                        <div>
                                                            <p className="text-sm font-black text-white">{student.name}</p>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{student.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                            <div className={`h-full ${student.color}`} style={{ width: `${student.attendance}%` }} />
                                                        </div>
                                                        <span className="text-xs font-black text-white">{student.attendance}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-slate-400 text-xs font-bold">{student.last}</td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-[9px] font-black uppercase text-blue-400 px-3 py-1 bg-blue-600/10 rounded-full tracking-tighter">Overseen</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SupervisorDashboard;
