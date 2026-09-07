import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users,
    Briefcase,
    AlertTriangle,
    CheckCircle2,
    Clock,
    UserCheck,
    Building2,
    Calendar,
    ArrowRight,
    TrendingUp,
    ShieldAlert,
    RefreshCw,
    Compass
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
            <div className="space-y-6 p-6">
                <LoadingSkeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <LoadingSkeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <LoadingSkeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    const metrics = dashboardData || {};
    const readinessRate = metrics.readinessRate || 0;

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Compass className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        Attachment Coordinator Hub
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Academic oversight, placement lifecycle governance, and student risk intervention.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={loadData}
                        disabled={refreshing}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                    <Link to="/coordinator/placements">
                        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                            Coordinate Placements
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Key Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Students</p>
                                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{metrics.totalStudents || 0}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enrolled in cohort</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Attachments</p>
                                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{metrics.activeAttachments || 0}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Currently on-site</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Briefcase className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unassigned Students</p>
                                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{metrics.unassignedStudents || 0}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Require supervisor pairing</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <UserCheck className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completion Readiness</p>
                                <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-2">{readinessRate}%</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{metrics.readyForCompletion || 0} students fully ready</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Main Content Grid: Prioritized Attention Queue & Operations Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Prioritized Attention Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Prioritized Attention Queue
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Instant deterministic risk triage requiring academic coordinator intervention
                                </p>
                            </div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
                                {attentionQueue.length} Active Items
                            </Badge>
                        </div>

                        <div className="mt-4 space-y-3">
                            {attentionQueue.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">All Clear!</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No urgent placement or supervision blockers detected at this time.</p>
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
                                                    ? 'bg-rose-50/60 border-rose-200/80 dark:bg-rose-950/20 dark:border-rose-900/40'
                                                    : isWarning
                                                    ? 'bg-amber-50/60 border-amber-200/80 dark:bg-amber-950/20 dark:border-amber-900/40'
                                                    : 'bg-blue-50/60 border-blue-200/80 dark:bg-blue-950/20 dark:border-blue-900/40'
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={`text-[10px] uppercase font-bold px-2 py-0.5 ${
                                                            isCritical
                                                                ? 'bg-rose-600 text-white'
                                                                : isWarning
                                                                ? 'bg-amber-600 text-white'
                                                                : 'bg-blue-600 text-white'
                                                        }`}
                                                    >
                                                        {item.level}
                                                    </Badge>
                                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                                    {item.studentName} ({item.admissionNumber || 'Student'})
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link to={`/coordinator/placements`}>
                                                    <Button size="sm" variant="outline" className="text-xs bg-white dark:bg-slate-800">
                                                        Resolve <ArrowRight className="w-3.5 h-3.5 ml-1" />
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
                        <Link to="/coordinator/placements" className="block">
                            <Card className="p-4 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition group bg-white dark:bg-slate-900">
                                <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400 mb-2 group-hover:scale-110 transition" />
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Placement Coordination</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review student drafts, approvals, and pairing.</p>
                            </Card>
                        </Link>

                        <Link to="/coordinator/supervisors" className="block">
                            <Card className="p-4 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition group bg-white dark:bg-slate-900">
                                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition" />
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Supervisor Workload</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Rebalance allocations and supervisor capacity.</p>
                            </Card>
                        </Link>

                        <Link to="/coordinator/academic-oversight" className="block">
                            <Card className="p-4 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition group bg-white dark:bg-slate-900">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition" />
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Academic Oversight</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit logbooks, visits, and completion blocks.</p>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Stage Distribution & Operational Intelligence */}
                <div className="space-y-6">
                    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Cohort Placement Pipeline
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-slate-600 dark:text-slate-300">Pending Approvals</span>
                                    <span className="text-amber-600 font-bold">{metrics.pendingPlacements || 0}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.pendingPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-slate-600 dark:text-slate-300">Approved Placements</span>
                                    <span className="text-blue-600 font-bold">{metrics.approvedPlacements || 0}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.approvedPlacements || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-slate-600 dark:text-slate-300">Active Attachments</span>
                                    <span className="text-emerald-600 font-bold">{metrics.activeAttachments || 0}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.activeAttachments || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-slate-600 dark:text-slate-300">Upcoming Completions</span>
                                    <span className="text-purple-600 font-bold">{metrics.upcomingCompletions || 0}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: `${metrics.totalStudents ? ((metrics.upcomingCompletions || 0) / metrics.totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                            Host Organizations Directory
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Manage industry partners, host companies, and active intern allotments.
                        </p>
                        <Link to="/coordinator/organizations">
                            <Button variant="outline" className="w-full text-xs flex items-center justify-center gap-2">
                                <Building2 className="w-4 h-4 text-teal-600" />
                                View Host Organizations
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
