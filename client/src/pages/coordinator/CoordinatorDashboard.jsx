import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Briefcase,
    AlertTriangle,
    CheckCircle2,
    UserCheck,
    Building2,
    ArrowRight,
    RefreshCw,
    BookOpen,
    Layers,
    SlidersHorizontal
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

export default function CoordinatorDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [attentionQueue, setAttentionQueue] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            setRefreshing(true);
            const [dashRes, queueRes] = await Promise.all([
                coordinatorApi.getDashboard(),
                coordinatorApi.getAttentionQueue()
            ]);
            if (dashRes.success) setDashboardData(dashRes.data);
            if (queueRes.success) setAttentionQueue(queueRes.data.queue || []);
        } catch (error) {
            console.error('Failed to load coordinator dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 p-6 sm:p-8 max-w-7xl mx-auto">
                <LoadingSkeleton className="h-10 w-60 rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <LoadingSkeleton key={i} className="h-24 rounded-md" />
                    ))}
                </div>
                <LoadingSkeleton className="h-80 rounded-md" />
            </div>
        );
    }

    const metrics = dashboardData || {};
    const readinessRate = metrics.readinessRate || 0;

    return (
        <div className="space-y-6 p-6 sm:p-8 max-w-7xl mx-auto pb-16 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium mb-1.5">
                        <SlidersHorizontal size={12} className="text-violet-400" />
                        Academic Command Center
                    </div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                        Attachment Coordinator Hub
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Placement lifecycle management, supervisor assignments, and cohort compliance.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="secondary"
                        onClick={loadData}
                        disabled={refreshing}
                        className="flex items-center gap-1.5 text-xs py-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </Button>
                    <Link to="/coordinator/placements">
                        <Button variant="primary" className="text-xs flex items-center gap-1.5 py-2">
                            <span>Manage Placements</span>
                            <ArrowRight size={13} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Key Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Total Cohort</span>
                        <Users className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div className="kpi-metric-value mt-2">{metrics.totalStudents || 0}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>Enrolled Students</span>
                        <span className="font-mono text-slate-300">{metrics.totalStudents || 0} active</span>
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Active Placements</span>
                        <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="kpi-metric-value text-emerald-400 mt-2">{metrics.activeAttachments || 0}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>On-site interns</span>
                        <span className="font-mono text-emerald-400">{metrics.activeAttachments || 0} verified</span>
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Unassigned Students</span>
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="kpi-metric-value text-amber-400 mt-2">{metrics.unassignedStudents || 0}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>Require supervisor</span>
                        <span className="font-mono text-amber-300">{metrics.unassignedStudents || 0} pending</span>
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Readiness Rate</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <div className="kpi-metric-value text-sky-400 mt-2">{readinessRate}%</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>Ready for completion</span>
                        <span className="font-mono text-sky-300">{metrics.readyForCompletion || 0} students</span>
                    </div>
                </div>
            </div>

            {/* Main Grid: Prioritized Attention Queue & Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Prioritized Attention Queue */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="craft-card p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#22242f]">
                            <div>
                                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                                    Prioritized Risk Attention Queue
                                </h2>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Placement and supervision blockers requiring coordinator review
                                </p>
                            </div>
                            <Badge variant="warning" dot={true}>
                                {attentionQueue.length} items
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            {attentionQueue.length === 0 ? (
                                <div className="text-center py-10">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1.5 opacity-80" />
                                    <h3 className="text-xs font-semibold text-white">Queue Clear</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">No urgent placement or supervision blockers detected.</p>
                                </div>
                            ) : (
                                attentionQueue.slice(0, 6).map((item, idx) => {
                                    const isCritical = item.level === 'CRITICAL';
                                    const isWarning = item.level === 'WARNING';
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                                isCritical
                                                    ? 'bg-rose-500/5 border-rose-500/20'
                                                    : isWarning
                                                    ? 'bg-amber-500/5 border-amber-500/20'
                                                    : 'bg-[#12141c] border-[#22242f]'
                                            }`}
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={isCritical ? 'danger' : isWarning ? 'warning' : 'indigo'}
                                                        dot={true}
                                                    >
                                                        {item.level}
                                                    </Badge>
                                                    <h3 className="text-xs font-medium text-slate-200">{item.title}</h3>
                                                </div>
                                                <p className="text-xs text-slate-300 font-medium">
                                                    {item.studentName} <span className="text-slate-500 font-normal">({item.admissionNumber || 'Student'})</span>
                                                </p>
                                                <p className="text-[11px] text-slate-400">{item.detail}</p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link to={`/coordinator/placements`}>
                                                    <Button size="sm" variant="secondary" className="text-[11px] py-1 px-2.5">
                                                        <span>Resolve</span>
                                                        <ArrowRight className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Quick Coordination Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Link to="/coordinator/placements" className="block group">
                            <div className="craft-card p-4 h-full flex flex-col justify-between hover:border-slate-600 transition-all">
                                <div>
                                    <div className="w-7 h-7 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-2.5">
                                        <BookOpen className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-semibold text-white">Placements</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Review drafts and approvals.</p>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-[11px] text-violet-400 font-medium group-hover:translate-x-0.5 transition-transform">
                                    <span>Manage</span>
                                    <ArrowRight size={11} />
                                </div>
                            </div>
                        </Link>

                        <Link to="/coordinator/supervisors" className="block group">
                            <div className="craft-card p-4 h-full flex flex-col justify-between hover:border-slate-600 transition-all">
                                <div>
                                    <div className="w-7 h-7 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-2.5">
                                        <Users className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-semibold text-white">Supervisor Load</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Rebalance faculty allocations.</p>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-[11px] text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform">
                                    <span>Rebalance</span>
                                    <ArrowRight size={11} />
                                </div>
                            </div>
                        </Link>

                        <Link to="/coordinator/academic-oversight" className="block group">
                            <div className="craft-card p-4 h-full flex flex-col justify-between hover:border-slate-600 transition-all">
                                <div>
                                    <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-xs font-semibold text-white">Oversight Audit</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Audit logbooks and visits.</p>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                                    <span>Audit</span>
                                    <ArrowRight size={11} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Stage Distribution & Host Organizations */}
                <div className="space-y-4">
                    <div className="craft-card p-5 space-y-4">
                        <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                            Placement Pipeline
                        </h2>

                        <div className="space-y-3.5">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-normal">Pending Approvals</span>
                                    <span className="text-amber-400 font-mono font-medium">{metrics.pendingPlacements || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                    <div
                                        className="h-full bg-amber-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.pendingPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-normal">Approved Placements</span>
                                    <span className="text-violet-400 font-mono font-medium">{metrics.approvedPlacements || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                    <div
                                        className="h-full bg-violet-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.approvedPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-normal">Active Attachments</span>
                                    <span className="text-emerald-400 font-mono font-medium">{metrics.activeAttachments || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.activeAttachments || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-normal">Upcoming Completions</span>
                                    <span className="text-sky-400 font-mono font-medium">{metrics.upcomingCompletions || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                    <div
                                        className="h-full bg-sky-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.upcomingCompletions || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="craft-card p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <Building2 size={15} />
                            </div>
                            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                                Partner Organizations
                            </h2>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">
                            Manage institutional corporate partners, industry hosts, and student allotments.
                        </p>
                        <Link to="/coordinator/organizations" className="block pt-1">
                            <Button variant="secondary" className="w-full text-xs flex items-center justify-center gap-1.5 py-2">
                                <span>Directory</span>
                                <ArrowRight size={12} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
