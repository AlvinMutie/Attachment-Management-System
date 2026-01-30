import React from 'react';
import {
    Users,
    MapPin,
    ClipboardCheck,
    MessageSquare,
    FilePlus,
    ArrowUpRight,
    Filter,
    TrendingUp,
    Calendar,
    GraduationCap
} from 'lucide-react';
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

const UniversitySupervisorDashboard = () => {
    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-12 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-blue-600/5 p-10 rounded-m3-xl border border-blue-600/10 backdrop-blur-md">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 ring-1 ring-white/20">
                            <GraduationCap className="text-white" size={44} />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-70">Academic Oversight</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Academic <span className="text-blue-500">Supervisor</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">Monitoring student progress & verifying industry compliance nodal point.</p>
                        </div>
                    </div>
                    <div className="flex bg-blue-600/10 p-2 rounded-2xl border border-blue-600/20 shadow-lg">
                        <div className="flex items-center gap-4 px-6 py-3 cursor-pointer hover:bg-white/5 transition-all rounded-xl">
                            <Filter size={20} className="text-blue-400" />
                            <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Filter Peers</span>
                        </div>
                    </div>
                </div>

                {/* Academic Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={Users} label="Active Mentees" value="18" color="text-blue-400" />
                    <StatCard icon={MapPin} label="Visits Verified" value="12" color="text-purple-400" />
                    <StatCard icon={ClipboardCheck} label="Pending Assessments" value="45" color="text-orange-400" />
                    <StatCard icon={TrendingUp} label="Dept. Compliance" value="94%" color="text-green-400" />
                </div>

                {/* Main Table: Student Monitoring */}
                <div className="glass-card !rounded-m3-xl overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-5">
                            <GraduationCap className="text-blue-500" size={28} />
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Active Mentee Cohort</h3>
                        </div>
                        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shadow-inner">
                            Term: Jan - April 2026
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
                                    <th className="px-10 py-6">Mentee Identity</th>
                                    <th className="px-10 py-6">Industry Placement</th>
                                    <th className="px-10 py-6">Attendance Flux</th>
                                    <th className="px-10 py-6">Site Status</th>
                                    <th className="px-10 py-6 text-right">Review Hub</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {[
                                    { name: 'Alvin Mutie', institution: 'Safaricom PLC', attendance: 98, visit: 'Completed', color: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
                                    { name: 'Sarah Wilson', institution: 'KCB Bank', attendance: 85, visit: 'Pending', color: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
                                    { name: 'Michael Chen', institution: 'Oracle Kenya', attendance: 72, visit: 'Scheduled', color: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' },
                                    { name: 'Jane Doe', institution: 'Microsoft Africa', attendance: 100, visit: 'Completed', color: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
                                ].map((s, i) => (
                                    <tr key={i} className="hover:bg-white/[0.03] transition-all group cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                <div>
                                                    <p className="text-lg font-black text-white tracking-tighter group-hover:translate-x-1 transition-transform">{s.name}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mt-0.5">Computing Faculty</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-slate-400 text-sm font-extrabold uppercase tracking-widest">{s.institution}</td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden shadow-inner">
                                                    <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.attendance}%` }} />
                                                </div>
                                                <span className="text-xs font-black text-white tracking-widest">{s.attendance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full ${s.visit === 'Completed' ? 'bg-emerald-600/20 text-emerald-400 shadow-lg shadow-emerald-500/10' :
                                                s.visit === 'Scheduled' ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10' : 'bg-orange-600/20 text-orange-400 shadow-lg shadow-orange-500/10'
                                                }`}>
                                                {s.visit}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="p-3.5 bg-white/5 text-slate-400 hover:text-white rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all opacity-0 group-hover:opacity-100 shadow-xl">
                                                <ArrowUpRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reporting & Coordination Hub */}
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="glass-card p-10 bg-gradient-to-br from-blue-600/10 to-transparent flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-900/40">
                                <FilePlus size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tighter">Submit Visit Report</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">Capture industry feedback and certify compliance for assigned students.</p>
                            </div>
                        </div>
                        <button className="btn-primary mt-12 w-fit px-8 py-4 text-xs font-black uppercase tracking-widest">Initialize Report</button>
                    </div>

                    <div className="glass-card p-10 bg-gradient-to-br from-purple-600/10 to-transparent">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Peer Coordination</h3>
                            <MessageSquare className="text-purple-400" size={20} />
                        </div>
                        <div className="space-y-6">
                            {[
                                { user: 'Industry Mentor (Oracle)', msg: 'Michael is showing great progress in API design.', time: '2h ago' },
                                { user: 'Alvin Mutie (Student)', msg: 'Supervisor, I have re-uploaded the corrupted attachment.', time: '5h ago' }
                            ].map((c, i) => (
                                <div key={i} className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-black text-purple-400 uppercase tracking-widest">{c.user}</span>
                                        <span className="text-[10px] text-slate-600 font-black uppercase">{c.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium italic opacity-80 leading-relaxed">"{c.msg}"</p>
                                </div>
                            ))}
                        </div>
                        <button className="text-purple-400 text-xs font-black uppercase tracking-widest mt-8 hover:underline">Launch Hub</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UniversitySupervisorDashboard;
