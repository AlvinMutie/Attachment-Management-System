import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Search,
    BookOpen,
    UserCheck,
    ClipboardCheck,
    MapPin,
    RefreshCw,
    Filter,
    ShieldAlert,
    HelpCircle
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Card, Badge, Button, Input, Modal, LoadingSkeleton } from '../../components/ui';

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
        if (rate >= 80) return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">{rate}% (Pass)</Badge>;
        if (rate >= 75) return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">{rate}% (Borderline)</Badge>;
        return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">{rate}% (Deficient &lt;75%)</Badge>;
    };

    const readySummary = readinessData?.summary || {};

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        Academic Oversight & Completion Readiness
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Unified student logbook verification, attendance compliance, supervision tracking, and explainable completion blockers.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadData}
                    className="flex items-center gap-2 self-start md:self-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Academic Audit
                </Button>
            </div>

            {/* Top Readiness Diagnostic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Completion Rate</p>
                    <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">
                        {readySummary.readinessRate || 0}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Deterministic milestone compliance</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Ready</p>
                    <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {readySummary.ready || 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">All criteria 100% fulfilled</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blocked Students</p>
                    <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                        {readySummary.blocked || 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Actionable academic blockers</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audited</p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {readySummary.total || 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Active student records</p>
                </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('ALL_STUDENTS')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                            activeTab === 'ALL_STUDENTS'
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                    >
                        Academic Stream Matrix
                    </button>
                    <button
                        onClick={() => setActiveTab('COMPLETION_READINESS')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                            activeTab === 'COMPLETION_READINESS'
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                    >
                        Completion Blockers & Diagnostics ({readySummary.blocked || 0})
                    </button>
                </div>

                {activeTab === 'ALL_STUDENTS' && (
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-72">
                        <Input
                            placeholder="Search student or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-xs"
                        />
                        <Button type="submit" size="sm" variant="outline">
                            <Search className="w-4 h-4" />
                        </Button>
                    </form>
                )}
            </div>

            {/* Tab 1: Academic Stream Matrix */}
            {activeTab === 'ALL_STUDENTS' && (
                <div>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <LoadingSkeleton key={i} className="h-16 rounded-xl" />
                            ))}
                        </div>
                    ) : academicData.length === 0 ? (
                        <Card className="p-12 text-center border border-dashed">
                            <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No student records found</h3>
                            <p className="text-xs text-slate-500 mt-1">Try updating search query.</p>
                        </Card>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">Student</th>
                                            <th className="p-4">Department & Org</th>
                                            <th className="p-4 text-center">Attendance %</th>
                                            <th className="p-4 text-center">Logbooks (Appr / Total)</th>
                                            <th className="p-4 text-center">Industry Assessment</th>
                                            <th className="p-4 text-center">Uni Assessment</th>
                                            <th className="p-4 text-center">Supervision Visit</th>
                                            <th className="p-4 text-right">Readiness</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                        {academicData.map(s => {
                                            const att = s.attendance || {};
                                            const logs = s.logbooks || {};
                                            const assess = s.assessments || {};
                                            const isReady = s.readiness?.ready;

                                            return (
                                                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                                    <td className="p-4">
                                                        <div className="font-semibold text-slate-900 dark:text-white">{s.user?.name || 'Student'}</div>
                                                        <div className="text-[11px] text-slate-500">{s.admissionNumber}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">{s.department || 'Computer Science'}</div>
                                                        <div className="text-[11px] text-slate-500">{s.organizationName || 'No Org'}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {getAttendanceBadge(att.rate || 0)}
                                                    </td>
                                                    <td className="p-4 text-center font-semibold">
                                                        <span className="text-emerald-600">{logs.approved || 0}</span> / <span className="text-slate-600">{logs.total || 0}</span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {assess.industrySubmitted ? (
                                                            <Badge className="bg-emerald-100 text-emerald-800">Submitted ({assess.industryScore} pts)</Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {assess.universitySubmitted ? (
                                                            <Badge className="bg-emerald-100 text-emerald-800">Submitted ({assess.universityScore} pts)</Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {s.supervisionVisitConducted ? (
                                                            <Badge className="bg-purple-100 text-purple-800">Conducted</Badge>
                                                        ) : (
                                                            <Badge className="bg-slate-100 text-slate-700">Scheduled / Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => setSelectedStudentForReadiness(s)}
                                                            className={`text-xs font-semibold px-2 py-1 rounded border transition ${
                                                                isReady
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
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
                <div className="space-y-6">
                    <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-rose-500" />
                            Active Completion Blockers Diagnostic Stream
                        </h2>
                        <p className="text-xs text-slate-500 mb-6">
                            Deterministic validation guarantees students only transition to COMPLETED when all academic criteria (75%+ attendance, logbook sign-offs, faculty supervision visit, and both evaluation scores) are satisfied.
                        </p>

                        <div className="space-y-4">
                            {readinessData.blockedStudents?.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Zero Academic Blockers!</h4>
                                    <p className="text-xs text-slate-500">All evaluated students have met attachment requirements.</p>
                                </div>
                            ) : (
                                readinessData.blockedStudents.map(student => (
                                    <div key={student.id} className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/40 dark:bg-rose-950/20 dark:border-rose-900/40">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{student.name}</h4>
                                                <p className="text-xs text-slate-500">{student.admissionNumber} • {student.department || 'General'} • {student.organizationName || 'No Company'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-rose-600 text-white font-mono text-xs">
                                                    Score: {student.score}%
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelectedStudentForReadiness(student)}
                                                    className="text-xs"
                                                >
                                                    Audit Checklist
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30">
                                            <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 mb-1">Unmet Academic Pre-conditions:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs text-rose-700 dark:text-rose-400">
                                                {student.blockers?.map((b, i) => (
                                                    <li key={i}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* Readiness Checklist Dialog */}
            {selectedStudentForReadiness && (
                <Modal
                    isOpen={Boolean(selectedStudentForReadiness)}
                    onClose={() => setSelectedStudentForReadiness(null)}
                    title={`Academic Completion Verification — ${selectedStudentForReadiness.name || selectedStudentForReadiness.user?.name}`}
                    maxWidth="max-w-lg"
                >
                    <div className="space-y-4 text-xs">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="font-semibold text-slate-900 dark:text-white">{selectedStudentForReadiness.name || selectedStudentForReadiness.user?.name}</p>
                            <p className="text-slate-500">{selectedStudentForReadiness.admissionNumber} • Score: {selectedStudentForReadiness.score || selectedStudentForReadiness.readiness?.score}%</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Milestone Requirements Audit:</h4>

                            {(selectedStudentForReadiness.blockers || selectedStudentForReadiness.readiness?.blockers)?.length === 0 ? (
                                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                                    <span>All 6 mandatory graduation milestones verified. Student is eligible for final completion sign-off.</span>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {(selectedStudentForReadiness.blockers || selectedStudentForReadiness.readiness?.blockers)?.map((b, idx) => (
                                        <div key={idx} className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                            <span>{b}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedStudentForReadiness(null)}
                            >
                                Close Audit
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
