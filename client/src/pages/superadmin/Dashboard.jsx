import { useEffect, useState } from 'react';
import {
    Users,
    School,
    GraduationCap,
    Briefcase,
    Activity,
    Clock,
    TrendingUp,
    ShieldCheck,
    Globe,
    Zap
} from 'lucide-react';
import { getDashboardAnalytics } from '../../utils/superadminApi';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="glass-card p-8 group overflow-hidden relative border-white/5 hover:border-indigo-500/30 transition-all duration-500 rounded-m3-large bg-gradient-to-br from-white/[0.04] to-transparent">
        <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{title}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 text-white flex items-center justify-center shadow-2xl ring-1 ring-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <Icon size={26} />
            </div>
        </div>
        {trend && (
            <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-400 relative z-10">
                <div className="p-1 rounded-md bg-emerald-500/10">
                    <TrendingUp size={12} />
                </div>
                <span>{trend} system flux</span>
            </div>
        )}
        <div className={`absolute -right-6 -bottom-6 w-32 h-32 ${color} opacity-[0.05] blur-3xl rounded-full group-hover:opacity-[0.1] transition-opacity`} />
    </div>
);

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await getDashboardAnalytics();
                setAnalytics(response.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldCheck className="text-indigo-500 animate-pulse" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-fade-in bg-indigo-600/5 p-10 rounded-m3-xl border border-indigo-600/10 backdrop-blur-md">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 ring-1 ring-white/20">
                        <ShieldCheck className="text-white" size={44} />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400 opacity-70">Security Operations</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Control <span className="text-indigo-500">Center</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">Universal platform-wide performance monitoring node.</p>
                    </div>
                </div>
                <div className="flex bg-white/[0.05] p-2 rounded-2xl border border-white/5 shadow-inner">
                    <div className="flex items-center gap-3 px-6 py-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                        <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase">System Optimal</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Institutions"
                    value={analytics?.metrics?.totalSchools || 0}
                    icon={School}
                    color="bg-indigo-600"
                    trend="+12%"
                />
                <StatCard
                    title="Global Users"
                    value={analytics?.metrics?.totalUsers || 0}
                    icon={Users}
                    color="bg-blue-600"
                    trend="+4.2k"
                />
                <StatCard
                    title="Active Students"
                    value={analytics?.metrics?.totalStudents || 0}
                    icon={GraduationCap}
                    color="bg-purple-600"
                    trend="+18%"
                />
                <StatCard
                    title="Live Attachments"
                    value={analytics?.metrics?.activeAttachments || 0}
                    icon={Briefcase}
                    color="bg-rose-600"
                    trend="vibrant"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 glass-card p-10 !rounded-m3-xl bg-gradient-to-br from-white/[0.02] to-transparent">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4 uppercase">
                                <Zap className="text-indigo-500" size={28} />
                                Audit Stream
                            </h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">Real-time infrastructure events</p>
                        </div>
                        <button onClick={() => window.location.href = '/superadmin/audit-logs'} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all border border-white/5 shadow-lg">History Access</button>
                    </div>
                    <div className="space-y-8">
                        {analytics?.recentActivity?.slice(0, 5).map((activity, idx) => (
                            <div key={idx} className="flex gap-8 group">
                                <div className="relative flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-500 shadow-inner">
                                        <Clock size={20} />
                                    </div>
                                    {idx !== (Math.min(analytics?.recentActivity?.length || 0, 5) - 1) && (
                                        <div className="w-[2px] h-full bg-gradient-to-b from-white/5 to-transparent mt-3 mb-1" />
                                    )}
                                </div>
                                <div className="flex-1 pb-8 border-b border-white/5 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-extrabold text-slate-100 tracking-tight text-lg group-hover:translate-x-1 transition-transform">{activity.action.replace(/_/g, ' ')}</p>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">
                                            {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                        Security Target: <span className="text-indigo-400 font-bold uppercase text-[11px] tracking-widest">{activity.targetType}</span> • {activity.user?.name || 'Kernel Process'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribution Overview */}
                <div className="space-y-8">
                    {/* Schools Distribution */}
                    <div className="glass-card p-8 border-l-4 border-l-indigo-500">
                        <h3 className="text-xl font-black text-white tracking-tight mb-6">Institution Health</h3>
                        <div className="space-y-4">
                            {analytics?.schoolsByStatus?.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest transition-all">
                                        <span className="text-slate-400">{item.status}</span>
                                        <span className="text-white">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${item.status === 'active' ? 'bg-indigo-500' :
                                                item.status === 'suspended' ? 'bg-rose-500' : 'bg-amber-500'
                                                }`}
                                            style={{ width: `${(item.count / (analytics.metrics?.totalSchools || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Role Distribution */}
                    <div className="glass-card p-8 border-l-4 border-l-blue-500">
                        <h3 className="text-xl font-black text-white tracking-tight mb-6">Identity Metrics</h3>
                        <div className="space-y-4">
                            {analytics?.usersByRole?.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest transition-all">
                                        <span className="text-slate-400">{item.role.replace(/_/g, ' ')}</span>
                                        <span className="text-white">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(item.count / (analytics.metrics?.totalUsers || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
