import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Compass,
    BookOpen,
    ShieldAlert,
    Sparkles
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Card, Badge, Button, LoadingSkeleton } from '../../components/ui';

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
            <div className="space-y-6 p-6 sm:p-8 max-w-7xl mx-auto">
                <LoadingSkeleton className="h-12 w-72 rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => (
                        <LoadingSkeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
                <LoadingSkeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    const metrics = dashboardData || {};
    const readinessRate = metrics.readinessRate || 0;

    return (
        <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto pb-16 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
                        <Sparkles size={13} className="text-teal-400" />
                        Academic Command & Oversight
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        Attachment Coordinator Hub
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Academic governance, placement lifecycle triage, and student risk intervention.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={loadData}
                        disabled={refreshing}
                        className="flex items-center gap-2 text-xs"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh Pipeline</span>
                    </Button>
                    <Link to="/coordinator/placements">
                        <Button variant="primary" className="text-xs flex items-center gap-2">
                            <span>Coordinate Placements</span>
                            <ArrowRight size={14} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Key Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="kpi-metric-tile">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Total Cohort</span>
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="kpi-metric-value mt-2">{metrics.totalStudents || 0}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                        <span>Enrolled Students</span>
                        <span className="font-mono text-slate-300 font-semibold">{metrics.totalStudents || 0} active</span>
                    </div>
                </div>

                <div className="kpi-metric-tile">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Active Attachments</span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Briefcase className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="kpi-metric-value text-emerald-400 mt-2">{metrics.activeAttachments || 0}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                        <span>On-Site Placements</span>
                        <span className="font-mono text-emerald-400 font-semibold">{metrics.activeAttachments || 0} verified</span>
                    </div>
                </div>

                <div className="kpi-metric-tile">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Unassigned Students</span>
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="kpi-metric-value text-amber-400 mt-2">{metrics.unassignedStudents || 0}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                        <span>Require Allocation</span>
                        <span className="font-mono text-amber-300 font-semibold">{metrics.unassignedStudents || 0} pending</span>
                    </div>
                </div>

                <div className="kpi-metric-tile">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">Readiness Rate</span>
                        <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="kpi-metric-value text-teal-400 mt-2">{readinessRate}%</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                        <span>Completion Ready</span>
                        <span className="font-mono text-teal-300 font-semibold">{metrics.readyForCompletion || 0} students</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Prioritized Attention Queue & Operations Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                {/* Prioritized Attention Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <Card variant="stripe" className="p-6 space-y-5">
                        <div className="flex items-center justify-between pb-4 border-b border-[#1f293d]">
                            <div>
                                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                                    Prioritized Risk Attention Queue
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Deterministic triage requiring academic coordinator resolution
                                </p>
                            </div>
                            <Badge variant="warning" dot={true}>
                                {attentionQueue.length} Active Items
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {attentionQueue.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                                    <h3 className="text-sm font-semibold text-white">All Clear!</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">No urgent placement or supervision blockers detected across cohorts.</p>
                                </div>
                            ) : (
                                attentionQueue.slice(0, 6).map((item, idx) => {
                                    const isCritical = item.level === 'CRITICAL';
                                    const isWarning = item.level === 'WARNING';
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                                isCritical
                                                    ? 'bg-rose-500/5 border-rose-500/25'
                                                    : isWarning
                                                    ? 'bg-amber-500/5 border-amber-500/25'
                                                    : 'bg-indigo-500/5 border-indigo-500/25'
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={isCritical ? 'danger' : isWarning ? 'warning' : 'indigo'}
                                                        dot={true}
                                                    >
                                                        {item.level}
                                                    </Badge>
                                                    <h3 className="text-xs sm:text-sm font-bold text-slate-200">{item.title}</h3>
                                                </div>
                                                <p className="text-xs text-slate-300 font-medium">
                                                    {item.studentName} <span className="text-slate-500 font-normal">({item.admissionNumber || 'Student'})</span>
                                                </p>
                                                <p className="text-xs text-slate-400">{item.detail}</p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link to={`/coordinator/placements`}>
                                                    <Button size="sm" variant="secondary" className="text-xs">
                                                        <span>Resolve</span>
                                                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>

                    {/* Quick Coordination Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link to="/coordinator/placements" className="block group">
                            <Card variant="stripe" className="p-5 hover:border-slate-500 transition-all h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Placement Coordination</h3>
                                    <p className="text-xs text-slate-400 mt-1 leading-snug">Review student drafts, approvals, and pairing.</p>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-xs text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                    <span>Manage</span>
                                    <ArrowRight size={12} />
                                </div>
                            </Card>
                        </Link>

                        <Link to="/coordinator/supervisors" className="block group">
                            <Card variant="stripe" className="p-5 hover:border-slate-500 transition-all h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Supervisor Workload</h3>
                                    <p className="text-xs text-slate-400 mt-1 leading-snug">Rebalance allocations and supervisor capacity.</p>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                    <span>Rebalance</span>
                                    <ArrowRight size={12} />
                                </div>
                            </Card>
                        </Link>

                        <Link to="/coordinator/academic-oversight" className="block group">
                            <Card variant="stripe" className="p-5 hover:border-slate-500 transition-all h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Academic Oversight</h3>
                                    <p className="text-xs text-slate-400 mt-1 leading-snug">Audit logbooks, visits, and completion blocks.</p>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                    <span>Audit</span>
                                    <ArrowRight size={12} />
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Stage Distribution & Operational Intelligence */}
                <div className="space-y-6">
                    <Card variant="stripe" className="p-6 space-y-5">
                        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Cohort Placement Pipeline
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-slate-300">Pending Approvals</span>
                                    <span className="text-amber-400 font-bold font-mono">{metrics.pendingPlacements || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#080c14] rounded-full overflow-hidden border border-[#1f293d]">
                                    <div
                                        className="h-full bg-amber-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.pendingPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-slate-300">Approved Placements</span>
                                    <span className="text-indigo-400 font-bold font-mono">{metrics.approvedPlacements || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#080c14] rounded-full overflow-hidden border border-[#1f293d]">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.approvedPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-slate-300">Active Attachments</span>
                                    <span className="text-emerald-400 font-bold font-mono">{metrics.activeAttachments || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#080c14] rounded-full overflow-hidden border border-[#1f293d]">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.activeAttachments || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-slate-300">Upcoming Completions</span>
                                    <span className="text-sky-400 font-bold font-mono">{metrics.upcomingCompletions || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#080c14] rounded-full overflow-hidden border border-[#1f293d]">
                                    <div
                                        className="h-full bg-sky-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.upcomingCompletions || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card variant="stripe" className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <Building2 size={16} />
                            </div>
                            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Host Organizations
                            </h2>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Manage institutional industry partners, corporate hosts, and live student allotments.
                        </p>
                        <Link to="/coordinator/organizations" className="block pt-1">
                            <Button variant="secondary" className="w-full text-xs flex items-center justify-center gap-2">
                                <span>View Organizations Directory</span>
                                <ArrowRight size={13} />
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}

