import React, { useState, useEffect } from 'react';
import {
    Users,
    ClipboardCheck,
    TrendingUp,
    GraduationCap,
    AlertTriangle,
    ShieldAlert,
    ArrowUpRight,
    Calendar,
    MapPin,
    BookOpen,
    CheckCircle2,
    RefreshCw,
    Plus,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { getUniversityWorkspace, getMyStudents, getUniversityAssessments } from '../../utils/universityApi';
import { LoadingSkeleton } from '../../components/ui';

const UniversitySupervisorDashboard = () => {
    const { user } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [students, setStudents] = useState([]);
    const [actionQueue, setActionQueue] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadDashboard = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const wsRes = await getUniversityWorkspace().catch(() => null);
            if (wsRes && wsRes.data?.data) {
                const data = wsRes.data.data;
                setWorkspace(data);
                setStudents(data.students || []);
                setActionQueue(data.actionQueue || []);
                setAssessments(data.assessments || []);
            } else {
                const [studRes, assRes] = await Promise.all([
                    getMyStudents().catch(() => ({ data: { data: [] } })),
                    getUniversityAssessments().catch(() => ({ data: { data: [] } }))
                ]);
                setStudents(studRes.data?.data || []);
                setAssessments(assRes.data?.data || []);
            }
        } catch (err) {
            console.error('Failed to load academic dashboard data', err);
        } finally {
            setLoading(false);
            if (isManual) setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <DashboardLayout role="university_supervisor">
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

    const totalStudents = workspace?.metrics?.totalAssigned ?? students.length;
    const activePlacements = workspace?.metrics?.activePlacements ?? students.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus)).length;
    const totalAssessments = workspace?.metrics?.completedAssessments ?? assessments.length;
    const atRiskCount = workspace?.metrics?.atRiskCount ?? students.filter(s => (s.attendanceRate !== undefined && s.attendanceRate < 75)).length;

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Hero Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10 shrink-0">
                                <GraduationCap size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Faculty Academic Oversight
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {user?.email || 'faculty@university.edu'}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    University Supervisor Cockpit
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Assess student industrial competencies, coordinate field supervision site visits, and certify academic milestones.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => loadDashboard(true)}
                                disabled={refreshing}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={refreshing ? 'animate-spin text-purple-400' : ''} />
                                <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
                            </button>
                            <a
                                href="/university/meetings"
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <MapPin size={14} className="text-purple-400" />
                                <span>Schedule Visit</span>
                            </a>
                            <a
                                href="/university/assessments"
                                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all"
                            >
                                <ClipboardCheck size={14} />
                                <span>Evaluate Mentee</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Assigned */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Mentees</span>
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalStudents}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Faculty allocation</span>
                            <span className="text-purple-400 font-medium">{totalStudents} cohort</span>
                        </div>
                    </div>

                    {/* Active Placements */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Placements</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <BookOpen size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{activePlacements}</span>
                            <span className="text-xs text-slate-500">in-progress</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Placement rate</span>
                            <span className="text-emerald-400 font-mono font-semibold">
                                {totalStudents > 0 ? `${Math.round((activePlacements / totalStudents) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    {/* Evaluations Completed */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluations Graded</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">{totalAssessments}</span>
                            <span className="text-xs text-slate-500">reports</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Midterm & Final</span>
                            <span className="text-sky-400 font-medium">Official grades</span>
                        </div>
                    </div>

                    {/* Academic Deficiencies */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academic Risk</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <ShieldAlert size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-400 font-mono">{atRiskCount}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Intervention required</span>
                            <span className="text-rose-400 font-medium">{atRiskCount > 0 ? 'Action needed' : '0 at risk'}</span>
                        </div>
                    </div>
                </div>

                {/* Priority Action Queue */}
                {actionQueue.length > 0 && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/05 border border-amber-500/25 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                        Supervision Action Queue ({actionQueue.length})
                                    </h3>
                                    <p className="text-[11px] text-slate-400">Pending academic milestone evaluations and site visit sign-offs.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 pt-1">
                            {actionQueue.map((item, idx) => (
                                <div key={idx} className="p-3.5 rounded-xl bg-[#12141c]/90 border border-[#22242f] flex items-start justify-between gap-3 hover:border-amber-500/30 transition-all">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                item.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                item.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                            }`}>
                                                {item.priority}
                                            </span>
                                            <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
                                    </div>
                                    <a
                                        href={item.actionUrl || '/university/assessments'}
                                        className="shrink-0"
                                    >
                                        <button className="px-2.5 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-200 text-xs font-medium flex items-center gap-1">
                                            <span>Action</span>
                                            <ArrowUpRight size={12} />
                                        </button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Supervised Student Cohort Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1e2230] gap-2">
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <Users size={16} className="text-purple-400" />
                                <span>Supervised Student Cohort Dossier</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">Institutional progress, host organization links, and attendance compliance</p>
                        </div>
                        <a href="/university/assessments" className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center gap-1 self-start sm:self-auto">
                            <span>Open Assessment Suite</span>
                            <ChevronRight size={14} />
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3 px-4 rounded-l-xl">Student Mentee</th>
                                    <th className="py-3 px-4">Host Employer / Org</th>
                                    <th className="py-3 px-4">Attendance Rate</th>
                                    <th className="py-3 px-4">Logbooks</th>
                                    <th className="py-3 px-4">Placement Status</th>
                                    <th className="py-3 px-4 text-right rounded-r-xl">Quick Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {students.length > 0 ? (
                                    students.map((s) => {
                                        const attRate = s.attendanceRate !== undefined ? s.attendanceRate : 85;
                                        const isAtRisk = attRate < 75;

                                        return (
                                            <tr key={s.id} className="hover:bg-[#181a24]/60 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-xs uppercase">
                                                            {s.user?.name ? s.user.name.charAt(0) : 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-100">{s.user?.name || 'Student'}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">
                                                                {s.admissionNumber} • {s.course || 'BSc Computer Science'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-300">
                                                    <span className="font-medium text-slate-200">{s.organizationName || 'Tech Corp International'}</span>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-300">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                                                            <span className={isAtRisk ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                                                                {attRate}%
                                                            </span>
                                                            {isAtRisk && (
                                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                                                    AT RISK
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="w-20 bg-[#181a24] rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className={`h-1.5 rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                                style={{ width: `${Math.min(attRate, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                                                    <span className="px-2 py-0.5 rounded bg-[#181a24] border border-[#22242f] text-slate-300">
                                                        {s.logbooksCount !== undefined ? `${s.logbooksCount} entries` : `${s.logbooks?.length || 0} entries`}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'
                                                        }`} />
                                                        {s.placementStatus || 'ACTIVE'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <a
                                                        href="/university/assessments"
                                                        className="px-2.5 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
                                                    >
                                                        <ClipboardCheck size={12} className="text-purple-400" />
                                                        <span>Grade</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                                            No students currently allocated to your academic supervision.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UniversitySupervisorDashboard;
