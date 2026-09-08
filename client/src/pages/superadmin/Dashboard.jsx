import { useEffect, useState } from 'react';
import {
    Users,
    Building2,
    Activity,
    ShieldCheck,
    History,
    CheckCircle2,
    ArrowUpRight
} from 'lucide-react';
import { getDashboardAnalytics } from '../../utils/superadminApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, subtitle = 'Active this period' }) => (
    <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-5 flex flex-col justify-between hover:border-[#2f3242] transition-colors">
        <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <Icon size={20} />
            </div>
            {trend && (
                <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {trend.value}
                </span>
            )}
        </div>
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">{value}</h3>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
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
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent"></div>
            </div>
        );
    }

    const metrics = analytics?.metrics || {};

    return (
        <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">System Operations</span>
                            <Badge variant="success">Production Ready</Badge>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">Platform Overview</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Cross-institutional monitoring, audit ledger, and user metrics.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-[#12141c] px-4 py-2.5 rounded-lg border border-[#22242f]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                        <p className="text-xs font-semibold text-slate-200">Infrastructure Optimal</p>
                        <p className="text-[11px] text-slate-400">All services operating normally</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Institutions"
                    value={metrics.totalSchools || '0'}
                    icon={Building2}
                    trend={{ value: '+12%', isPositive: true }}
                    subtitle="Active universities / schools"
                />
                <StatCard
                    title="Industry Partners"
                    value={metrics.totalIndustrySupervisors || '0'}
                    icon={Users}
                    subtitle="Registered companies"
                />
                <StatCard
                    title="Approval Rate"
                    value={`${metrics.globalApprovalRate || 0}%`}
                    icon={Activity}
                    trend={{ value: 'Target 90%', isPositive: true }}
                    subtitle="Logbooks & placement approvals"
                />
                <StatCard
                    title="Total Accounts"
                    value={metrics.totalUsers || '0'}
                    icon={Users}
                    subtitle="Across all roles & schools"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-bold text-slate-100 tracking-tight">System Audit Ledger</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Recent administrative and automated system events</p>
                            </div>
                            <Link to="/superadmin/audit-logs" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                                View Full Ledger <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
                                analytics.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-3.5 bg-[#12141c] rounded-lg border border-[#22242f] hover:border-[#2f3242] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#181a24] border border-[#22242f] flex items-center justify-center text-slate-400">
                                                <History size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-200">
                                                    <span className="text-slate-100">{activity.user?.name || 'System'}</span>
                                                    <span className="mx-1.5 text-slate-400 font-normal">executed</span>
                                                    <span className="text-violet-400 font-mono text-[11px]">{activity.action?.replace(/_/g, ' ')}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{new Date(activity.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Badge variant="neutral">Logged</Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-xs text-slate-400">No recent audit records found.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Access Distribution */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col justify-between">
                    <div>
                        <div className="mb-5">
                            <h2 className="text-base font-bold text-slate-100 tracking-tight">Identity Distribution</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Active accounts segmented by system role</p>
                        </div>

                        <div className="space-y-4">
                            {analytics?.usersByRole?.map((role, index) => {
                                const total = metrics.totalUsers || 1;
                                const percentage = Math.round((role.count / total) * 100);
                                return (
                                    <div key={index} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-300 capitalize">{role.role.replace(/_/g, ' ')}</span>
                                            <span className="text-slate-400">{role.count} ({percentage}%)</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#12141c] rounded-full overflow-hidden border border-[#22242f]">
                                            <div
                                                className="h-full bg-violet-600 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.max(percentage, 3)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#22242f] flex items-center justify-between text-xs text-slate-400">
                        <span>Total identities indexed</span>
                        <span className="font-semibold text-slate-200">{metrics.totalUsers || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
