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
    SlidersHorizontal,
    TrendingUp,
    MapPin,
    ShieldAlert,
    ChevronRight,
    Award
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { LoadingSkeleton } from '../../components/ui';

export default function CoordinatorDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [attentionQueue, setAttentionQueue] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            setRefreshing(true);
            const [dashRes, queueRes] = await Promise.all([
                coordinatorApi.getDashboard().catch(() => ({ success: false })),
                coordinatorApi.getAttentionQueue().catch(() => ({ success: false }))
            ]);
            if (dashRes.success) setDashboardData(dashRes.data);
            if (queueRes.success) setAttentionQueue(queueRes.data?.queue || []);
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
            <DashboardLayout role="attachment_coordinator">
                <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                    <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                    </div>
                    <LoadingSkeleton className="h-96 rounded-2xl bg-[#12141c]" />
                </div>
            </DashboardLayout>
        );
    }

    const metrics = dashboardData || {};
    const readinessRate = metrics.readinessRate || 0;

    return (
        <DashboardLayout role="attachment_coordinator">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10 shrink-0">
                                <SlidersHorizontal size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Academic Operations Command
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        Executive Attachment Portal
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Attachment Coordinator Hub
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Placement lifecycle governance, faculty supervisor balancing, risk queue triaging, and institutional compliance.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={loadData}
                                disabled={refreshing}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={refreshing ? 'animate-spin text-teal-400' : ''} />
                                <span>{refreshing ? 'Syncing...' : 'Refresh Matrix'}</span>
                            </button>
                            <Link
                                to="/coordinator/placements"
                                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all"
                            >
                                <span>Manage Placements</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Cohort */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cohort</span>
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{metrics.totalStudents || 0}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Enrolled attachment pool</span>
                            <span className="text-teal-400 font-mono font-medium">100% registered</span>
                        </div>
                    </div>

                    {/* Active Placements */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Placements</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Briefcase size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{metrics.activeAttachments || 0}</span>
                            <span className="text-xs text-slate-500">on-site</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Verified in industry</span>
                            <span className="text-emerald-400 font-mono font-medium">
                                {metrics.totalStudents ? `${Math.round(((metrics.activeAttachments || 0) / metrics.totalStudents) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    {/* Unassigned Students */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unassigned Cohort</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <UserCheck size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{metrics.unassignedStudents || 0}</span>
                            <span className="text-xs text-slate-500">pending</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Require supervisor allocation</span>
                            <span className="text-amber-400 font-medium">{metrics.unassignedStudents > 0 ? 'Pending match' : '0 unassigned'}</span>
                        </div>
                    </div>

                    {/* Completion Readiness */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Readiness Rate</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">{readinessRate}%</span>
                            <span className="text-xs text-slate-500">completion rate</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Ready for sign-off</span>
                            <span className="text-sky-400 font-mono font-medium">{metrics.readyForCompletion || 0} students</span>
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Grid: Prioritized Risk Attention Queue & Operations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Attention Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-xl">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <div className="space-y-0.5">
                                    <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                                        <span>Prioritized Risk & Attention Queue</span>
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        Automated detection of placement roadblocks, missing supervisors, and attendance deficiencies
                                    </p>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    {attentionQueue.length} Active Items
                                </span>
                            </div>

                            <div className="space-y-3">
                                {attentionQueue.length === 0 ? (
                                    <div className="text-center py-10 space-y-2">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                                        <h3 className="text-sm font-bold text-slate-200">Queue Completely Clear</h3>
                                        <p className="text-xs text-slate-500">No urgent placement bottlenecks or supervision risks detected across the cohort.</p>
                                    </div>
                                ) : (
                                    attentionQueue.slice(0, 6).map((item, idx) => {
                                        const isCritical = item.level === 'CRITICAL';
                                        const isWarning = item.level === 'WARNING';

                                        return (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                                                    isCritical
                                                        ? 'bg-rose-500/05 border-rose-500/25 hover:border-rose-500/40'
                                                        : isWarning
                                                        ? 'bg-amber-500/05 border-amber-500/25 hover:border-amber-500/40'
                                                        : 'bg-[#181a24] border-[#22242f] hover:border-[#2a2d3d]'
                                                }`}
                                            >
                                                <div className="space-y-1 max-w-lg">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                                            isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                            isWarning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                            'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                                        }`}>
                                                            {item.level}
                                                        </span>
                                                        <h3 className="text-xs font-bold text-slate-100">{item.title}</h3>
                                                    </div>
                                                    <p className="text-xs text-slate-300 font-medium">
                                                        {item.studentName} <span className="text-slate-500 font-mono text-[11px]">({item.admissionNumber || 'Student'})</span>
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.detail}</p>
                                                </div>

                                                <div className="shrink-0">
                                                    <Link to="/coordinator/placements">
                                                        <button className="px-3 py-1.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all">
                                                            <span>Resolve</span>
                                                            <ArrowRight size={12} />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Quick Action Navigation Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link to="/coordinator/placements" className="block group">
                                <div className="bg-[#12141c] border border-[#22242f] group-hover:border-teal-500/40 rounded-2xl p-5 h-full flex flex-col justify-between transition-all">
                                    <div className="space-y-2">
                                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                            <BookOpen size={18} />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-100">Placement Coordination</h3>
                                        <p className="text-[11px] text-slate-400">Review student placement applications and assign supervisors.</p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-xs text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                        <span>Manage</span>
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </Link>

                            <Link to="/coordinator/supervisors" className="block group">
                                <div className="bg-[#12141c] border border-[#22242f] group-hover:border-sky-500/40 rounded-2xl p-5 h-full flex flex-col justify-between transition-all">
                                    <div className="space-y-2">
                                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                            <Users size={18} />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-100">Supervisor Workload</h3>
                                        <p className="text-[11px] text-slate-400">Monitor mentee allocations and rebalance faculty capacity.</p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-xs text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                        <span>Rebalance</span>
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </Link>

                            <Link to="/coordinator/academic-oversight" className="block group">
                                <div className="bg-[#12141c] border border-[#22242f] group-hover:border-emerald-500/40 rounded-2xl p-5 h-full flex flex-col justify-between transition-all">
                                    <div className="space-y-2">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-100">Academic Oversight</h3>
                                        <p className="text-[11px] text-slate-400">Audit attendance compliance, logbooks, and rubric readiness.</p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                        <span>Audit</span>
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Placement Pipeline & Partner Directory */}
                    <div className="space-y-6">
                        {/* Placement Pipeline Status */}
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-xl">
                            <div className="space-y-0.5 pb-3 border-b border-[#1e2230]">
                                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                                    Placement Pipeline Breakdown
                                </h2>
                                <p className="text-[11px] text-slate-400">Cohort progression across attachment phases</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                                        <span className="text-slate-300">Pending Approvals</span>
                                        <span className="text-amber-400 font-mono font-bold">{metrics.pendingPlacements || 0}</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                        <div
                                            className="h-full bg-amber-500 rounded-full transition-all"
                                            style={{ width: `${metrics.totalStudents ? ((metrics.pendingPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                                        <span className="text-slate-300">Approved Placements</span>
                                        <span className="text-teal-400 font-mono font-bold">{metrics.approvedPlacements || 0}</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                        <div
                                            className="h-full bg-teal-500 rounded-full transition-all"
                                            style={{ width: `${metrics.totalStudents ? ((metrics.approvedPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                                        <span className="text-slate-300">Active Attachments</span>
                                        <span className="text-emerald-400 font-mono font-bold">{metrics.activeAttachments || 0}</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all"
                                            style={{ width: `${metrics.totalStudents ? ((metrics.activeAttachments || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                                        <span className="text-slate-300">Ready for Completion</span>
                                        <span className="text-sky-400 font-mono font-bold">{metrics.readyForCompletion || 0}</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                        <div
                                            className="h-full bg-sky-500 rounded-full transition-all"
                                            style={{ width: `${metrics.totalStudents ? ((metrics.readyForCompletion || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partner Organizations Directory Quick Box */}
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4 shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-100">
                                        Host Organizations
                                    </h2>
                                    <p className="text-[11px] text-slate-400">Corporate & public partners</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Manage institutional corporate partners, vetted employer host sites, and student placement quotas.
                            </p>
                            <Link to="/coordinator/organizations" className="block pt-1">
                                <button className="w-full py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                                    <span>Browse Organization Directory</span>
                                    <ArrowRight size={13} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
