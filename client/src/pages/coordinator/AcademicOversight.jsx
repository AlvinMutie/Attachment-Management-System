import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    Search,
    RefreshCw,
    ShieldAlert,
    X
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

export default function AcademicOversight() {
    const [loading, setLoading] = useState(true);
    const [academicData, setAcademicData] = useState([]);
    const [readinessData, setReadinessData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL_STUDENTS'); // 'ALL_STUDENTS' | 'COMPLETION_READINESS'
    const [selectedStudentForReadiness, setSelectedStudentForReadiness] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [overviewRes, readyRes] = await Promise.all([
                coordinatorApi.getAcademicOverview({ search: searchTerm }),
                coordinatorApi.getCompletionReadiness()
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

    const getAttendanceBadge = (rate) => {
        if (rate >= 80) return <Badge variant="success" size="sm">{rate}%</Badge>;
        if (rate >= 75) return <Badge variant="indigo" size="sm">{rate}%</Badge>;
        return <Badge variant="danger" size="sm">{rate}% (&lt;75%)</Badge>;
    };

    const readySummary = readinessData?.summary || {};

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-violet-600/15 border border-violet-500/25 rounded-lg flex items-center justify-center text-violet-300">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Quality Assurance</span>
                        <h1 className="text-xl font-semibold text-white tracking-tight">
                            Academic Oversight & Completion Readiness
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Attendance audits, logbook validation status, supervision visit logs, and completion blockers.
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    onClick={loadData}
                    className="flex items-center gap-1.5 text-xs py-1.5 px-3 self-start md:self-auto"
                >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Refresh Audit</span>
                </Button>
            </div>

            {/* Top Readiness Diagnostic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Cohort Completion Rate</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div className="kpi-metric-value text-violet-400 mt-2">
                        {readySummary.readinessRate || 0}%
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                        Deterministic milestone metric
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Completion Ready</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="kpi-metric-value text-emerald-400 mt-2">
                        {readySummary.ready || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                        All 6 criteria satisfied
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Blocked Students</span>
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div className="kpi-metric-value text-rose-400 mt-2">
                        {readySummary.blocked || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                        Outstanding prerequisites
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Audited Cohort</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="kpi-metric-value mt-2">
                        {readySummary.total || 0}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                        Total registered records
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#22242f]">
                <div className="segmented-tabs">
                    {[
                        { id: 'ALL_STUDENTS', label: 'Academic Stream Matrix' },
                        { id: 'COMPLETION_READINESS', label: `Completion Blockers (${readySummary.blocked || 0})` }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`segmented-tab-btn text-xs ${
                                activeTab === tab.id ? 'active' : ''
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'ALL_STUDENTS' && (
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                        <input
                            placeholder="Search student or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 font-sans"
                        />
                    </form>
                )}
            </div>

            {/* Tab 1: Academic Stream Matrix */}
            {activeTab === 'ALL_STUDENTS' && (
                <div>
                    {loading ? (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <LoadingSkeleton key={i} className="h-14 rounded-md" />
                            ))}
                        </div>
                    ) : academicData.length === 0 ? (
                        <div className="craft-card p-10 text-center space-y-1.5">
                            <CheckCircle2 className="w-8 h-8 text-slate-500 mx-auto mb-1 opacity-70" />
                            <h3 className="text-xs font-semibold text-white">No student records found</h3>
                            <p className="text-[11px] text-slate-400">Try updating your search query.</p>
                        </div>
                    ) : (
                        <div className="craft-card p-5 space-y-3">
                            <div className="overflow-x-auto -mx-5">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#12141c] text-slate-400 font-medium border-b border-[#22242f]">
                                        <tr>
                                            <th className="py-2.5 px-5">Student</th>
                                            <th className="py-2.5 px-5">Department & Org</th>
                                            <th className="py-2.5 px-5 text-center">Attendance</th>
                                            <th className="py-2.5 px-5 text-center">Logbooks (Appr / Total)</th>
                                            <th className="py-2.5 px-5 text-center">Industry Grade</th>
                                            <th className="py-2.5 px-5 text-center">Uni Grade</th>
                                            <th className="py-2.5 px-5 text-center">Site Visit</th>
                                            <th className="py-2.5 px-5 text-right">Readiness</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#22242f]">
                                        {academicData.map(s => {
                                            const att = s.attendance || {};
                                            const logs = s.logbooks || {};
                                            const assess = s.assessments || {};
                                            const isReady = s.readiness?.ready;

                                            return (
                                                <tr key={s.id} className="hover:bg-[#181a24] transition-colors">
                                                    <td className="py-2.5 px-5">
                                                        <div>
                                                            <p className="font-medium text-white">{s.user?.name || 'Student'}</p>
                                                            <p className="text-[10px] text-slate-500 font-mono">{s.admissionNumber}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-5 text-slate-300">
                                                        <div>{s.department || 'Undergraduate'}</div>
                                                        <div className="text-[10px] text-slate-500">{s.organizationName || 'No Host'}</div>
                                                    </td>
                                                    <td className="py-2.5 px-5 text-center">
                                                        {getAttendanceBadge(att.rate || 0)}
                                                    </td>
                                                    <td className="py-2.5 px-5 text-center font-mono">
                                                        <span className="text-emerald-400">{logs.approved || 0}</span> / <span className="text-slate-400">{logs.total || 0}</span>
                                                    </td>
                                                    <td className="py-2.5 px-5 text-center">
                                                        {assess.industrySubmitted ? (
                                                            <Badge variant="success" size="sm">{assess.industryScore} pts</Badge>
                                                        ) : (
                                                            <Badge variant="warning" size="sm">Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-5 text-center">
                                                        {assess.universitySubmitted ? (
                                                            <Badge variant="success" size="sm">{assess.universityScore} pts</Badge>
                                                        ) : (
                                                            <Badge variant="warning" size="sm">Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-5 text-center">
                                                        {s.supervisionVisitConducted ? (
                                                            <Badge variant="indigo" size="sm">Conducted</Badge>
                                                        ) : (
                                                            <Badge variant="neutral" size="sm">Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-5 text-right">
                                                        <button
                                                            onClick={() => setSelectedStudentForReadiness(s)}
                                                            className={`text-xs font-medium px-2 py-0.5 rounded border transition ${
                                                                isReady
                                                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                                                                    : 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                                                            }`}
                                                        >
                                                            {isReady ? 'Ready (100%)' : `${s.readiness?.blockers?.length || 0} Blockers`}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Completion Blockers & Diagnostics */}
            {activeTab === 'COMPLETION_READINESS' && readinessData && (
                <div className="space-y-4">
                    <div className="craft-card p-5 space-y-4">
                        <div className="pb-2 border-b border-[#22242f]">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-rose-400" />
                                Active Completion Blockers Diagnostic Stream
                            </h2>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                Students require 75%+ verified attendance, approved logbooks, faculty supervision visit, and both evaluation scores.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {readinessData.blockedStudents?.length === 0 ? (
                                <div className="text-center py-10">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1.5 opacity-80" />
                                    <h4 className="text-xs font-semibold text-white">All Clear!</h4>
                                    <p className="text-[11px] text-slate-400">All evaluated students have met attachment completion requirements.</p>
                                </div>
                            ) : (
                                readinessData.blockedStudents.map(student => (
                                    <div key={student.id} className="p-3.5 rounded-lg border border-rose-500/20 bg-rose-500/5 space-y-2.5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <h4 className="font-semibold text-white text-xs">{student.name}</h4>
                                                <p className="text-[11px] text-slate-400">{student.admissionNumber} • {student.department || 'General'} • {student.organizationName || 'No Company'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="danger" size="sm">
                                                    Score: {student.score}%
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setSelectedStudentForReadiness(student)}
                                                    className="text-[11px] py-1 px-2.5"
                                                >
                                                    Audit Checklist
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-[#12141c] p-2.5 rounded-md border border-rose-500/15">
                                            <p className="text-[11px] font-medium text-rose-300 mb-1">Unmet Academic Pre-conditions:</p>
                                            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                                                {student.blockers?.map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Readiness Checklist Dialog */}
            {selectedStudentForReadiness && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Completion Verification</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{selectedStudentForReadiness.name || selectedStudentForReadiness.user?.name}</p>
                            </div>
                            <button onClick={() => setSelectedStudentForReadiness(null)} className="text-slate-400 hover:text-white p-1">
                                <X size={15} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-2.5 bg-[#181a24] rounded-md border border-[#22242f]">
                                <p className="text-slate-300"><span className="text-slate-500">Admission:</span> {selectedStudentForReadiness.admissionNumber}</p>
                                <p className="text-slate-300 mt-0.5"><span className="text-slate-500">Readiness Score:</span> <span className="font-mono font-medium text-violet-400">{selectedStudentForReadiness.score || selectedStudentForReadiness.readiness?.score}%</span></p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-slate-300 uppercase tracking-wide text-[10px]">Milestone Requirements Audit:</h4>

                                {(selectedStudentForReadiness.blockers || selectedStudentForReadiness.readiness?.blockers)?.length === 0 ? (
                                    <div className="p-3 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                                        <span>All 6 mandatory graduation milestones verified. Student is eligible for final completion.</span>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        {(selectedStudentForReadiness.blockers || selectedStudentForReadiness.readiness?.blockers)?.map((b, idx) => (
                                            <div key={idx} className="p-2 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-start gap-2">
                                                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                                <span className="text-[11px]">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#22242f] flex justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setSelectedStudentForReadiness(null)}
                                className="text-xs py-1.5 px-3"
                            >
                                Close Audit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
