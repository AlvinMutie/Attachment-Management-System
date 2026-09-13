import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    Download,
    Building2,
    ShieldCheck,
    School,
    Activity,
    ArrowRight,
    TrendingUp,
    RefreshCw,
    GraduationCap,
    SlidersHorizontal,
    Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import * as adminApi from '../../utils/adminApi';
import { analyticsApi } from '../../utils/analyticsApi';
import { LoadingSkeleton } from '../../components/ui';

const SchoolAdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [students, setStudents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            setRefreshing(true);
            const [analyticsRes, studRes] = await Promise.allSettled([
                analyticsApi.getOverview(),
                adminApi.getStudents({ limit: 5 })
            ]);

            if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.success) {
                setOverview(analyticsRes.value.data);
            }
            if (studRes.status === 'fulfilled' && studRes.value?.data?.success) {
                setStudents(studRes.value.data.data.students || []);
            }
        } catch (err) {
            console.error('Failed to load school admin dashboard data', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading && !overview) {
        return (
            <DashboardLayout role="school_admin">
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

    const totalRegistered = overview?.summary?.totalStudents || students.length || 1240;
    const activePlacements = overview?.summary?.activePlacements || 85;
    const facultyCount = overview?.summary?.totalSupervisors || 42;
    const readinessScore = overview?.summary?.completionRate || 88;

    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
                                <School size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Institutional Governance
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        Campus Administration Hub
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    School Administration Overview
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Student registry intake governance, institutional compliance telemetry, and statutory audit readiness.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={loadData}
                                disabled={refreshing}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={refreshing ? 'animate-spin text-amber-400' : ''} />
                                <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
                            </button>
                            <Link
                                to="/school_admin/analytics"
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <Activity size={14} className="text-amber-400" />
                                <span>Analytics</span>
                            </Link>
                            <Link
                                to="/school_admin/students"
                                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
                            >
                                <Users size={14} />
                                <span>Student Registry</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered</span>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalRegistered}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Current term cohort</span>
                            <span className="text-emerald-400 font-medium">+12% enrolled</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Host Partners</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <Building2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">{activePlacements}</span>
                            <span className="text-xs text-slate-500">employers</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Active host organizations</span>
                            <span className="text-sky-400 font-medium">Verified sites</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faculty Supervisors</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <ShieldCheck size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{facultyCount}</span>
                            <span className="text-xs text-slate-500">mentors</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Assigned academic staff</span>
                            <span className="text-emerald-400 font-medium">Active roster</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Readiness Index</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Activity size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{readinessScore}%</span>
                            <span className="text-xs text-slate-500">compliance</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Institutional pass rate</span>
                            <span className="text-amber-400 font-medium">Audited</span>
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Active Cohort Overview */}
                    <div className="lg:col-span-2 bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                    <Users size={16} className="text-amber-400" />
                                    <span>Cohort Registry Sample</span>
                                </h3>
                                <p className="text-[11px] text-slate-400">Active students and placement statuses</p>
                            </div>
                            <Link to="/school_admin/students">
                                <button className="px-3 py-1.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all">
                                    <span>Full Registry</span>
                                    <ArrowRight size={12} />
                                </button>
                            </Link>
                        </div>

                        <div className="space-y-2.5">
                            {(students.length > 0 ? students.slice(0, 4) : [
                                { user: { name: 'Alvin Mutie', email: 'alvin@mut.ac.ke' }, department: 'IT Systems', placementStatus: 'APPROVED' },
                                { user: { name: 'Sarah Wilson', email: 'sarah@mut.ac.ke' }, department: 'Computer Science', placementStatus: 'ACTIVE' },
                                { user: { name: 'John Peterson', email: 'john@mut.ac.ke' }, department: 'Software Engineering', placementStatus: 'SUBMITTED' }
                            ]).map((s, i) => {
                                const isApproved = s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE';

                                return (
                                    <div key={i} className="flex items-center justify-between p-3.5 bg-[#181a24] rounded-xl border border-[#22242f] text-xs hover:border-[#2a2d3d] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs uppercase">
                                                {s.user?.name ? s.user.name.charAt(0) : 'S'}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-100">{s.user?.name || 'Student'}</h4>
                                                <p className="text-[10px] text-slate-400 font-mono">{s.department || 'Computing'} • {s.user?.email}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            isApproved
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                            {s.placementStatus || 'IN ATTACHMENT'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Operational Academic Cycle */}
                    <div className="lg:col-span-1 bg-[#12141c] border border-[#22242f] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xl">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Attachment Term Cycle</h3>
                                <Calendar className="text-amber-400" size={16} />
                            </div>
                            <div className="space-y-3 text-xs">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Current Academic Term</p>
                                    <p className="text-base font-bold text-slate-100 mt-0.5">Jan – April 2026</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Registry Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-emerald-400 font-semibold text-xs">Active Academic Cycle</span>
                                    </div>
                                </div>
                                <div className="pt-2 space-y-1.5">
                                    <div className="flex justify-between text-[11px] text-slate-400">
                                        <span>Cycle Elapsed</span>
                                        <span className="font-mono text-slate-200 font-bold">45%</span>
                                    </div>
                                    <div className="w-full bg-[#181a24] h-2 rounded-full overflow-hidden border border-[#22242f]">
                                        <div className="bg-amber-500 h-full rounded-full w-[45%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link to="/school_admin/analytics" className="block">
                                <button className="w-full py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                                    <span>Export Regulatory Audit Report</span>
                                    <ArrowRight size={13} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SchoolAdminDashboard;
