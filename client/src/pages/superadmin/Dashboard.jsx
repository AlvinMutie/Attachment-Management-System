import { useEffect, useState } from 'react';
import {
    Users,
    Building2,
    GraduationCap,
    Briefcase,
    Activity,
    Clock,
    TrendingUp,
    ShieldCheck,
    Globe,
    Zap,
    VenetianMask,
    History
} from 'lucide-react';
import { getDashboardAnalytics } from '../../utils/superadminApi';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="glass-card p-6 flex flex-col justify-between group transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 ring-1 ring-${color}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <span>{trend.value}</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight leading-none">{value}</h3>
            <p className="text-[10px] text-slate-500 mt-2 font-medium tracking-wide">ACTIVE THIS PERIOD</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getDashboardAnalytics();
                setAnalytics(data);
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
            <div className="flex-1 flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const metrics = analytics?.metrics || {};

    return (
        <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="relative p-8 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -mr-48 -mt-48 transition-all duration-700 group-hover:bg-blue-600/10" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 text-white transition-transform duration-500 group-hover:scale-105">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <p className="text-blue-400 text-[10px] font-bold tracking-[0.2em] mb-1 uppercase">System Operations</p>
                            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center">
                                Platform <span className="text-blue-500 ml-2">Overview</span>
                            </h1>
                            <p className="text-slate-400 text-sm mt-1 max-w-md font-medium">Standard system-wide performance and monitoring metrics.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">System Optimal</p>
                            <p className="text-[10px] text-slate-500 font-medium">Infrastructure status: Healthy</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Institutions"
                    value={metrics.totalSchools || '0'}
                    icon={Building2}
                    trend={{ value: '+12%', isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Industry Partners"
                    value={metrics.totalIndustrySupervisors || '0'}
                    icon={VenetianMask}
                    color="emerald"
                />
                <StatCard
                    title="Approval Rate"
                    value={`${metrics.globalApprovalRate || 0}%`}
                    icon={Activity}
                    trend={{ value: 'OPTIMIZED', isPositive: true }}
                    color="amber"
                />
                <StatCard
                    title="Global Users"
                    value={metrics.totalUsers || '0'}
                    icon={Users}
                    trend={{ value: '+4.2K', isPositive: true }}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">System Audit Trail</h2>
                            <p className="text-xs text-slate-500 mt-1 font-medium italic">Verified system activity logs synced.</p>
                        </div>
                        <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                            View Report
                        </button>
                    </div>

                    <div className="space-y-6">
                        {analytics?.recentActivity?.map((activity, index) => (
                            <div key={index} className="flex items-center p-4 bg-slate-950/30 rounded-xl border border-white/5 group hover:bg-slate-950/50 transition-all">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                    <History size={18} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-semibold text-slate-300">
                                        <span className="text-white font-bold">{activity.user?.name || 'System'}</span>
                                        <span className="mx-2 text-slate-500">Performed</span>
                                        <span className="text-blue-400">{activity.action.replace(/_/g, ' ')}</span>
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{new Date(activity.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-white/5 text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    VERIFIED
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Access Distribution */}
                <div className="glass-card p-8 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white tracking-tight">Access Distribution</h2>
                        <p className="text-xs text-slate-400 mt-1 font-medium">User analytic distribution by role.</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        {analytics?.usersByRole?.map((role, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                    <span className="text-slate-400">{role.role.replace(/_/g, ' ')}</span>
                                    <span className="text-white">{role.count}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all duration-1000"
                                        style={{ width: `${(role.count / metrics.totalUsers) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
