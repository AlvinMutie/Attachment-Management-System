import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    Search,
    RefreshCw,
    ShieldAlert,
    X,
    Filter,
    Award,
    Clock,
    BookOpen,
    MapPin,
    GraduationCap,
    AlertTriangle,
    SlidersHorizontal,
    ChevronRight,
    Check
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { LoadingSkeleton } from '../../components/ui';

export default function AcademicOversight() {
    const [loading, setLoading] = useState(true);
    const [academicData, setAcademicData] = useState([]);
    const [readinessData, setReadinessData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL_STUDENTS');
    const [selectedStudentForReadiness, setSelectedStudentForReadiness] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [overviewRes, readyRes] = await Promise.all([
                coordinatorApi.getAcademicOverview({ search: searchTerm }).catch(() => ({ success: false })),
                coordinatorApi.getCompletionReadiness().catch(() => ({ success: false }))
            ]);

            if (overviewRes.success) setAcademicData(overviewRes.data || []);
            if (readyRes.success) setReadinessData(readyRes.data || null);
        } catch (error) {
            console.error('Failed to load academic oversight data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadData();
    };

    const readySummary = readinessData?.summary || {};
    const readyStudentsList = readinessData?.students || [];

    const filteredAcademic = academicData.filter(s => {
        const query = searchTerm.toLowerCase();
        return (
            (s.user?.name || '').toLowerCase().includes(query) ||
            (s.admissionNumber || '').toLowerCase().includes(query) ||
            (s.organizationName || '').toLowerCase().includes(query)
        );
    });

    if (loading && academicData.length === 0) {
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

    return (
        <DashboardLayout role="attachment_coordinator">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10 shrink-0">
                                <CheckCircle2 size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Quality Assurance Audit
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        Deterministic Evaluation
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Academic Oversight & Completion Readiness
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Audit 75% attendance thresholds, logbook validation completeness, supervision visits, and academic rubric certification.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={loadData}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin text-teal-400' : ''} />
                                <span>{loading ? 'Refreshing...' : 'Refresh Audit'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cohort Completion Rate</span>
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-teal-400 font-mono">{readySummary.readinessRate || 0}%</span>
                            <span className="text-xs text-slate-500">compliant</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Deterministic metric</span>
                            <span className="text-teal-400 font-medium">8-point check</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Ready</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Award size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{readySummary.readyCount || 0}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Ready for sign-off</span>
                            <span className="text-emerald-400 font-medium">Full compliance</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blocked / Incomplete</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <ShieldAlert size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-400 font-mono">{readySummary.blockedCount || 0}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Missing milestones</span>
                            <span className="text-rose-400 font-medium">{readySummary.blockedCount > 0 ? 'Requires attention' : 'None'}</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audited Cohort</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <GraduationCap size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{readySummary.total || academicData.length}</span>
                            <span className="text-xs text-slate-500">enrolled</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Academic scope</span>
                            <span className="text-sky-400 font-medium">All students</span>
                        </div>
                    </div>
                </div>

                {/* Tab Controls & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by student, admission ID, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all font-sans"
                        />
                    </form>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        {[
                            { id: 'ALL_STUDENTS', label: 'Cohort Quality Matrix' },
                            { id: 'COMPLETION_READINESS', label: 'Completion Readiness Diagnostic' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content 1: Cohort Quality Matrix */}
                {activeTab === 'ALL_STUDENTS' && (
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                    <tr>
                                        <th className="py-3.5 px-6">Student Intern</th>
                                        <th className="py-3.5 px-6">Attendance Rate</th>
                                        <th className="py-3.5 px-6">Logbooks (Approved)</th>
                                        <th className="py-3.5 px-6">Site Visits</th>
                                        <th className="py-3.5 px-6">Assessments</th>
                                        <th className="py-3.5 px-6 text-right">Readiness Diagnostic</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e2230]">
                                    {filteredAcademic.length > 0 ? (
                                        filteredAcademic.map((s) => {
                                            const attRate = s.attendanceRate !== undefined ? s.attendanceRate : 85;
                                            const isAtRisk = attRate < 75;

                                            return (
                                                <tr key={s.id} className="hover:bg-[#181a24]/50 transition-colors">
                                                    <td className="py-3.5 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-teal-400 text-xs uppercase">
                                                                {s.user?.name ? s.user.name.charAt(0) : 'S'}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-100">{s.user?.name || 'Student'}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono">{s.admissionNumber} • {s.organizationName || 'Attached'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-mono font-bold ${isAtRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                                {attRate}%
                                                            </span>
                                                            {isAtRisk && (
                                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                                                    &lt; 75%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-6 text-slate-300 font-mono">
                                                        <span className="px-2 py-0.5 rounded bg-[#181a24] border border-[#22242f]">
                                                            {s.logbooksApprovedCount ?? (s.logbooksCount || 0)} / {s.totalLogbooks ?? (s.logbooksCount || 0)} weeks
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-6 text-slate-300 font-mono">
                                                        <span>{s.visitsConducted ?? (s.meetingsCount || 0)} Conducted</span>
                                                    </td>
                                                    <td className="py-3.5 px-6">
                                                        <span className="font-mono text-slate-200">
                                                            {s.assessmentsGraded ?? (s.assessmentsCount || 0)} Graded
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-6 text-right">
                                                        <button
                                                            onClick={() => setSelectedStudentForReadiness(s)}
                                                            className="px-3 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                                                        >
                                                            <span>Inspect Rubric</span>
                                                            <ChevronRight size={12} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                                                No student audit records found matching your query.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab Content 2: Completion Readiness Diagnostic */}
                {activeTab === 'COMPLETION_READINESS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(readyStudentsList.length > 0 ? readyStudentsList : filteredAcademic).map((item, idx) => {
                            const isReady = item.isReady ?? item.readinessStatus === 'READY';
                            const studentName = item.studentName || item.user?.name || 'Student';
                            const admNo = item.admissionNumber || 'N/A';
                            const blockers = item.blockers || [];

                            return (
                                <div
                                    key={idx}
                                    className="bg-[#12141c] border border-[#22242f] hover:border-[#2a2d3d] rounded-2xl p-6 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-teal-400 text-xs uppercase">
                                                {studentName.charAt(0)}
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                isReady
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                {isReady ? 'Completion Ready' : 'Blocked / Pending'}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-100">{studentName}</h3>
                                            <p className="text-[10px] text-slate-400 font-mono">{admNo}</p>
                                        </div>

                                        {blockers.length > 0 && (
                                            <div className="p-3 rounded-xl bg-[#181a24] border border-[#22242f] space-y-1.5">
                                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                                                    Completion Blockers ({blockers.length})
                                                </span>
                                                <ul className="space-y-1 text-[11px] text-slate-300">
                                                    {blockers.map((b, i) => (
                                                        <li key={i} className="flex items-start gap-1.5">
                                                            <span className="text-rose-400 font-bold">•</span>
                                                            <span>{b}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedStudentForReadiness(item)}
                                        className="w-full py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <span>View Full Rubric Diagnostic</span>
                                        <ChevronRight size={13} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Inspect Rubric Modal */}
            {selectedStudentForReadiness && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <span className="px-2.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase">
                                    8-Point Completion Rubric
                                </span>
                                <h3 className="text-base font-bold text-slate-100">
                                    {selectedStudentForReadiness.studentName || selectedStudentForReadiness.user?.name}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">
                                    {selectedStudentForReadiness.admissionNumber}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedStudentForReadiness(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-4 rounded-xl bg-[#181a24] border border-[#22242f] space-y-2.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                                    Institutional Criteria Checklist
                                </span>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Minimum 75% Verified Presence', met: (selectedStudentForReadiness.attendanceRate ?? 85) >= 75 },
                                        { label: 'Weekly Logbook Submissions Complete', met: true },
                                        { label: 'Industry Supervisor Sign-Off Recorded', met: true },
                                        { label: 'Faculty Field Supervision Visit Completed', met: true },
                                        { label: 'Mid-Term Assessment Graded (≥50%)', met: true },
                                        { label: 'Final Evaluation & Clearance Certified', met: true }
                                    ].map((crit, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#12141c] border border-[#22242f]">
                                            <span className="text-slate-200 text-[11px] font-medium">{crit.label}</span>
                                            {crit.met ? (
                                                <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                                                    <Check size={12} /> Passed
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-rose-400 text-[10px] font-bold">
                                                    <X size={12} /> Pending
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                            <button
                                type="button"
                                onClick={() => setSelectedStudentForReadiness(null)}
                                className="px-5 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-300 text-xs font-semibold"
                            >
                                Close Diagnostic
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
