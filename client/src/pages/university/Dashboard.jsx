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
    <div className="glass-card p-6 flex flex-col justify-between h-full bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="flex justify-between items-center mb-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
            <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
                <Icon size={18} />
            </div>
        </div>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
    </div>
);

const UniversitySupervisorDashboard = () => {
    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-12 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <span className="section-label">Academic Oversight</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Academic Supervisor</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">Monitoring student progress and institutional alignment.</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-blue-600/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-600/20 shadow-inner group cursor-pointer hover:bg-blue-600/20 transition-all">
                        <Filter size={20} />
                        <span className="text-sm font-black uppercase tracking-widest">Filter Schools</span>
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
                <div className="glass-card overflow-hidden">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <GraduationCap className="text-blue-500" size={24} />
                            <h3 className="text-xl font-black text-white tracking-tight">Active Student Cohort</h3>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Term: Jan - Mar 2026
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
                                    <th className="px-8 py-5">Mentee Name</th>
                                    <th className="px-8 py-5">Placement Institution</th>
                                    <th className="px-8 py-5">Attendance</th>
                                    <th className="px-8 py-5">Visit Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {[
                                    { name: 'Alvin Mutie', institution: 'Safaricom PLC', attendance: 98, visit: 'Completed', color: 'bg-green-500' },
                                    { name: 'Sarah Wilson', institution: 'KCB Bank', attendance: 85, visit: 'Pending', color: 'bg-blue-500' },
                                    { name: 'Michael Chen', institution: 'Oracle Kenya', attendance: 72, visit: 'Scheduled', color: 'bg-orange-500' },
                                    { name: 'Jane Doe', institution: 'Microsoft Africa', attendance: 100, visit: 'Completed', color: 'bg-green-500' },
                                ].map((s, i) => (
                                    <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-1.5 h-6 bg-blue-600 rounded-full group-hover:h-8 transition-all" />
                                                <div>
                                                    <p className="text-sm font-black text-white tracking-tight">{s.name}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comp. Science</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 text-sm font-bold">{s.institution}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${s.color}`} style={{ width: `${s.attendance}%` }} />
                                                </div>
                                                <span className="text-xs font-black text-white">{s.attendance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${s.visit === 'Completed' ? 'bg-green-600/20 text-green-400' :
                                                    s.visit === 'Scheduled' ? 'bg-blue-600/20 text-blue-400' : 'bg-orange-600/20 text-orange-400'
                                                }`}>
                                                {s.visit}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 hover:border-blue-500/30 transition-all opacity-0 group-hover:opacity-100">
                                                <ArrowUpRight size={18} />
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
