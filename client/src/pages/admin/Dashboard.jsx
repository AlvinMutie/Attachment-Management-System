import React from 'react';
import {
    Users,
    UserPlus,
    Calendar,
    Download,
    Settings,
    BarChart,
    School,
    Building2,
    TrendingUp,
    ShieldCheck,
    Search
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const StatCard = ({ label, value, trend, trendColor, icon: Icon }) => (
    <div className="glass-card p-8 bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 hover:border-blue-500/20 transition-all group overflow-hidden relative">
        <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{label}</p>
                <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
            </div>
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Icon size={26} />
            </div>
        </div>
        <div className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.15em] ${trendColor} mt-4 relative z-10`}>
            <div className="p-1 rounded bg-current opacity-20" />
            <span>{trend}</span>
        </div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-600/5 blur-2xl rounded-full" />
    </div>
);

const SchoolAdminDashboard = () => {
    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-12 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-blue-600/5 p-10 rounded-m3-xl border border-blue-600/10 backdrop-blur-md">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 ring-1 ring-white/20">
                            <School className="text-white" size={44} />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-70">Institutional Hub</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Admin <span className="text-blue-500">Center</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">Global administrative oversight & student compliance monitoring nodal point.</p>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-white/5 text-slate-300 px-6 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-white/10 transition-all shadow-lg">
                            <Download size={18} />
                            <span>Export Center</span>
                        </button>
                        <button className="btn-primary px-8 py-4 flex items-center space-x-3 text-xs font-black uppercase tracking-[0.2em] !rounded-2xl">
                            <UserPlus size={18} />
                            <span>Hire Staff</span>
                        </button>
                    </div>
                </div>

                {/* Core Institution Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard label="Total Students" value="1,240" trend="+12% growth" trendColor="text-green-500" icon={Users} />
                    <StatCard label="Partnerships" value="85" trend="4 new locally" trendColor="text-blue-500" icon={Building2} />
                    <StatCard label="Staff Count" value="42" trend="Active monitoring" trendColor="text-purple-500" icon={ShieldCheck} />
                    <StatCard label="Graduate Flow" value="88%" trend="8.2% vs last term" trendColor="text-green-500" icon={BarChart} />
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* User Directory Hub */}
                    <div className="lg:col-span-2 glass-card !rounded-m3-xl overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white tracking-tighter">Active Identities</h3>
                                <p className="text-[10px] text-slate-500 font-black tracking-[0.25em] uppercase">Student & Academic Peer Registry</p>
                            </div>
                            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20">Students</button>
                                <button className="px-6 py-2.5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Faculty</button>
                            </div>
                        </div>
                        <div className="p-10 space-y-6">
                            {[
                                { name: 'Alvin Mutie', dept: 'IT Systems', email: 'alvin@mut.edu', status: 'In Attachment' },
                                { name: 'Sarah Wilson', dept: 'CS Faculty', email: 'sarah@mut.edu', status: 'In Attachment' },
                                { name: 'John Peterson', dept: 'Software Eng', email: 'john@mut.edu', status: 'Pending Review' }
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-m3-large border border-white/5 group hover:border-blue-600/30 transition-all hover:bg-white/[0.05] cursor-pointer">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center font-black text-blue-500 border border-white/5 text-2xl group-hover:scale-105 transition-transform shadow-inner">
                                            {user.name[0]}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black text-white tracking-tighter">{user.name}</h4>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{user.dept} • {user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-8">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full ${user.status === 'In Attachment' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-orange-600/20 text-orange-400'}`}>
                                            {user.status}
                                        </span>
                                        <button className="text-slate-500 hover:text-white transition-all bg-white/5 p-3 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 shadow-lg">
                                            <Settings size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Calendar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-10 bg-gradient-to-br from-blue-600/10 to-transparent flex flex-col justify-between h-full border-l-4 border-l-blue-600">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white tracking-tighter uppercase tracking-[0.05em]">Attachment Cycle</h3>
                                    <Calendar className="text-blue-400" size={24} />
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Current Enrollment</p>
                                        <p className="text-2xl font-black text-white tracking-tight">Jan - April 2026</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Lifecycle Status</p>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                                            <p className="text-sm text-green-400 font-bold uppercase tracking-widest text-xs">Active Registry</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-500">Cohort Completion</span>
                                            <span className="text-white">38%</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden shadow-inner">
                                            <div className="bg-blue-600 h-full w-[38%] shadow-lg shadow-blue-600/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 space-y-4">
                                <button className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest">Reschedule Terms</button>
                                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/10 transition-all">Lock Submissions</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SchoolAdminDashboard;
