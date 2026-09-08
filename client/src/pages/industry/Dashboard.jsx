import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    Users,
    CheckCircle,
    Camera,
    History,
    AlertCircle,
    ArrowUpRight,
    Check,
    Briefcase,
    ShieldAlert,
    AlertTriangle,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import {
    getSupervisorWorkspace,
    getAssignedStudents,
    getSupervisorLogbooks,
    reviewLogbook,
    getSupervisorAttendance
} from '../../utils/supervisorApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [students, setStudents] = useState([]);
    const [pendingLogbooks, setPendingLogbooks] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState([]);
    const [actionQueue, setActionQueue] = useState([]);
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(true);

    // Modal state for reviewing logbook
    const [selectedLogbook, setSelectedLogbook] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewing, setReviewing] = useState(false);

    const loadData = async () => {
        try {
            const wsRes = await getSupervisorWorkspace().catch(() => null);
            if (wsRes && wsRes.data?.data) {
                const data = wsRes.data.data;
                setWorkspace(data);
                setStudents(data.students || []);
                setActionQueue(data.actionQueue || []);
                setTodayAttendance(data.todayAttendance || []);
                setPendingLogbooks((data.students || []).flatMap(s => (s.logbooks || []).filter(l => l.status === 'pending')));
            } else {
                const today = new Date().toISOString().split('T')[0];
                const [studRes, logRes, attRes] = await Promise.all([
                    getAssignedStudents().catch(() => ({ data: { data: [] } })),
                    getSupervisorLogbooks({ status: 'pending' }).catch(() => ({ data: { data: [] } })),
                    getSupervisorAttendance({ date: today }).catch(() => ({ data: { data: [] } }))
                ]);
                setStudents(studRes.data?.data || []);
                setPendingLogbooks(logRes.data?.data || []);
                setTodayAttendance(attRes.data?.data || []);
            }
        } catch (err) {
            console.error('Failed to load supervisor data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let scanner;
        if (isScanning) {
            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 220, height: 220 },
                aspectRatio: 1.0
            });

            scanner.render((result) => {
                setScanResult(result);
                setIsScanning(false);
                scanner.clear();
            }, () => { });
        }

        return () => {
            if (scanner) scanner.clear();
        };
    }, [isScanning]);

    const handleReviewSubmit = async (status) => {
        if (!selectedLogbook) return;
        setReviewing(true);
        try {
            await reviewLogbook(selectedLogbook.id, {
                status,
                supervisorComment: reviewComment
            });
            setSelectedLogbook(null);
            setReviewComment('');
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to review logbook');
        } finally {
            setReviewing(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="industry_supervisor">
                <div className="space-y-4 p-6 sm:p-8 max-w-7xl mx-auto">
                    <LoadingSkeleton className="h-20 rounded-lg" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <LoadingSkeleton className="h-24 rounded-lg" />
                        <LoadingSkeleton className="h-24 rounded-lg" />
                        <LoadingSkeleton className="h-24 rounded-lg" />
                        <LoadingSkeleton className="h-24 rounded-lg" />
                    </div>
                    <LoadingSkeleton className="h-80 rounded-lg" />
                </div>
            </DashboardLayout>
        );
    }

    const presentCount = workspace?.metrics?.todayPresent ?? todayAttendance.filter(a => a.status === 'present').length;
    const totalAssigned = workspace?.metrics?.totalAssigned ?? students.length;
    const pendingCount = workspace?.metrics?.pendingLogbooksCount ?? pendingLogbooks.length;
    const atRiskCount = workspace?.metrics?.atRiskCount ?? 0;

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-5 p-6 sm:p-8 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="craft-card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium mb-1">
                                Workplace Mentorship
                            </div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                                Industry Supervisor Workspace
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                On-site presence validation, weekly logbook reviews, and intern assessments.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="success" dot={true}>
                            Active Industry Host
                        </Badge>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Assigned Interns</span>
                            <Users className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="kpi-metric-value mt-2">{totalAssigned}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Supervised cohort</span>
                            <span className="font-mono text-slate-300">{totalAssigned} active</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Today's Check-ins</span>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="kpi-metric-value text-emerald-400 mt-2">{presentCount}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Verified present</span>
                            <span className="font-mono text-emerald-400">{presentCount} / {totalAssigned}</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Pending Logbooks</span>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="kpi-metric-value text-amber-400 mt-2">{pendingCount}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Require review</span>
                            <span className="font-mono text-amber-300">{pendingCount} submissions</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">At-Risk Alerts</span>
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        </div>
                        <div className="kpi-metric-value text-rose-400 mt-2">{atRiskCount}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Attendance &lt; 75%</span>
                            <span className="font-mono text-rose-300">{atRiskCount} flagged</span>
                        </div>
                    </div>
                </div>

                {/* Supervisor Action Queue */}
                {actionQueue.length > 0 && (
                    <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-3 h-3" />
                                </div>
                                <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                                    Pending Actions ({actionQueue.length})
                                </h3>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2.5">
                            {actionQueue.map((item, idx) => (
                                <div key={idx} className="p-3 rounded-md bg-[#12141c] border border-[#22242f] flex items-start justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <Badge
                                                variant={item.priority === 'urgent' ? 'danger' : item.priority === 'high' ? 'warning' : 'indigo'}
                                                size="sm"
                                            >
                                                {item.priority}
                                            </Badge>
                                            <h4 className="text-xs font-medium text-slate-200">{item.title}</h4>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
                                    </div>
                                    <a
                                        href={item.actionUrl || '/industry/attendance'}
                                        className="shrink-0"
                                    >
                                        <Button size="sm" variant="outline" className="text-[11px] py-1 px-2.5">
                                            <span>Resolve</span>
                                            <ArrowUpRight size={11} className="ml-1" />
                                        </Button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-5">
                    {/* Left Column: QR Verification & Today Check-ins */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="craft-card p-5 flex flex-col items-center justify-center space-y-4">
                            <div className="text-center space-y-1">
                                <h3 className="text-sm font-semibold text-white">QR Presence Verification</h3>
                                <p className="text-[11px] text-slate-400">Scan student's daily rotating token</p>
                            </div>

                            {!isScanning ? (
                                <div
                                    onClick={() => setIsScanning(true)}
                                    className="w-full aspect-square max-w-[200px] bg-[#181a24] border border-dashed border-[#22242f] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-violet-500/50 transition-all"
                                >
                                    <div className="w-12 h-12 bg-violet-600/10 text-violet-400 rounded-lg flex items-center justify-center mb-2">
                                        <Camera size={24} />
                                    </div>
                                    <span className="text-slate-400 text-xs font-medium">Activate Scanner</span>
                                </div>
                            ) : (
                                <div id="reader" className="w-full overflow-hidden rounded-lg border border-violet-500/40" />
                            )}

                            {scanResult && (
                                <div className="w-full bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-md text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-medium mb-1">
                                        <CheckCircle size={14} />
                                        <span>Verified</span>
                                    </div>
                                    <p className="text-[10px] font-mono text-slate-400 truncate">{scanResult}</p>
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="text-[11px] text-violet-400 hover:text-violet-300 font-medium mt-2 block mx-auto"
                                    >
                                        Scan Next Student
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Today's Check-ins */}
                        <div className="craft-card p-4 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Today's Check-Ins</h3>
                                <History size={14} className="text-slate-400" />
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {todayAttendance.length > 0 ? (
                                    todayAttendance.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-2.5 bg-[#181a24] rounded-md border border-[#22242f] text-xs">
                                            <div>
                                                <p className="font-medium text-white">{log.student?.user?.name || 'Student'}</p>
                                                <p className="text-[10px] text-slate-500">{log.verificationMethod || 'Verified Portal'}</p>
                                            </div>
                                            <Badge variant="success" size="sm" dot={true}>
                                                {log.status}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 text-center py-4">No check-ins recorded today yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pending Logbook Reviews & Student Roster */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Pending Reviews */}
                        <div className="craft-card p-5 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Pending Logbook Reviews</h3>
                                <Badge variant="warning" dot={true}>
                                    {pendingLogbooks.length} Pending
                                </Badge>
                            </div>

                            <div className="space-y-2.5">
                                {pendingLogbooks.length > 0 ? (
                                    pendingLogbooks.map((log) => (
                                        <div key={log.id} className="p-3.5 rounded-md bg-[#181a24] border border-[#22242f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <h4 className="text-xs font-semibold text-white">{log.student?.user?.name || 'Student'}</h4>
                                                <p className="text-slate-400 text-[11px]">Week {log.weekNumber} • {log.startDate} to {log.endDate}</p>
                                                <p className="text-slate-300 text-xs italic line-clamp-2">"{log.summary}"</p>
                                            </div>
                                            <div className="shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => { setSelectedLogbook(log); setReviewComment(log.supervisorComment || ''); }}
                                                    className="text-xs py-1.5 px-3"
                                                >
                                                    <span>Review</span>
                                                    <ArrowUpRight size={12} className="ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-6 text-center text-slate-500 text-xs">
                                        All submitted logbooks have been reviewed.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Student Watchlist Table */}
                        <div className="craft-card p-5 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-[#22242f]">
                                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Assigned Interns & Attendance Standing</h3>
                                <a href="/industry/attendance" className="text-violet-400 text-xs font-medium hover:underline">Attendance Hub →</a>
                            </div>
                            <div className="overflow-x-auto -mx-5">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#12141c] text-slate-400 font-medium border-b border-[#22242f]">
                                        <tr>
                                            <th className="py-2.5 px-5">Student</th>
                                            <th className="py-2.5 px-5">Admission No</th>
                                            <th className="py-2.5 px-5">Attendance</th>
                                            <th className="py-2.5 px-5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#22242f]">
                                        {students.length > 0 ? (
                                            students.map((s) => (
                                                <tr key={s.id} className="hover:bg-[#181a24] transition-colors">
                                                    <td className="py-2.5 px-5">
                                                        <div>
                                                            <p className="font-medium text-white">{s.user?.name}</p>
                                                            <p className="text-[10px] text-slate-500">{s.user?.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-5 text-slate-300 font-mono text-[11px]">{s.admissionNumber}</td>
                                                    <td className="py-2.5 px-5 text-slate-300">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-mono">{s.attendanceRate !== undefined ? `${s.attendanceRate}%` : 'N/A'}</span>
                                                            {s.complianceStatus?.status === 'CRITICAL' && (
                                                                <Badge variant="danger" size="sm">Critical</Badge>
                                                            )}
                                                            {s.complianceStatus?.status === 'AT_RISK' && (
                                                                <Badge variant="warning" size="sm">At Risk</Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-5 text-right">
                                                        <Badge variant="success" size="sm">
                                                            {s.placementStatus || 'ACTIVE'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-6 text-slate-500 text-xs">
                                                    No students assigned to your supervision yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logbook Review Modal */}
            {selectedLogbook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl bg-[#12141c] border border-[#22242f] rounded-xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Review Week {selectedLogbook.weekNumber} Logbook</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Student: {selectedLogbook.student?.user?.name}</p>
                            </div>
                            <button onClick={() => setSelectedLogbook(null)} className="text-slate-400 hover:text-white p-1">
                                <X size={15} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 rounded-md bg-[#181a24] border border-[#22242f] space-y-1">
                                <span className="text-[10px] font-medium uppercase text-violet-400">Weekly Reflection Summary</span>
                                <p className="text-slate-200 leading-relaxed text-[11px]">{selectedLogbook.summary}</p>
                            </div>

                            {selectedLogbook.dailyEntries && typeof selectedLogbook.dailyEntries === 'object' && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-medium uppercase text-slate-400">Daily Breakdown</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                        {Object.entries(selectedLogbook.dailyEntries).map(([day, text]) => (
                                            <div key={day} className="p-2 bg-[#181a24] rounded border border-[#22242f]">
                                                <span className="font-semibold uppercase text-[9px] text-violet-400 block">{day}</span>
                                                <span className="text-slate-300 text-[11px] line-clamp-2">{text || 'No tasks logged'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Supervisor Feedback & Recommendations</label>
                                <textarea
                                    rows={3}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Provide feedback on technical performance or required revisions..."
                                    className="w-full p-2.5 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#22242f]">
                            <Button
                                type="button"
                                disabled={reviewing}
                                variant="danger"
                                onClick={() => handleReviewSubmit('rejected')}
                                className="text-xs py-1.5 px-3"
                            >
                                Request Revision
                            </Button>
                            <Button
                                type="button"
                                disabled={reviewing}
                                variant="primary"
                                onClick={() => handleReviewSubmit('approved')}
                                className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                            >
                                <Check size={14} />
                                <span>{reviewing ? 'Saving...' : 'Approve Logbook'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default SupervisorDashboard;
