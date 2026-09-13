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
    X,
    QrCode,
    Calendar,
    Clock,
    FileText,
    ChevronRight,
    Sparkles,
    UserCheck,
    Search,
    ExternalLink,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import {
    getSupervisorWorkspace,
    getAssignedStudents,
    getSupervisorLogbooks,
    reviewLogbook,
    getSupervisorAttendance,
    markSupervisorAttendance
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
    const [refreshing, setRefreshing] = useState(false);

    // Modal state for reviewing logbook
    const [selectedLogbook, setSelectedLogbook] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewing, setReviewing] = useState(false);

    // Quick attendance mark modal
    const [quickMarkStudent, setQuickMarkStudent] = useState(null);
    const [quickStatus, setQuickStatus] = useState('present');
    const [quickMarking, setQuickMarking] = useState(false);

    const loadData = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
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
            if (isManualRefresh) setRefreshing(false);
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

    const handleQuickMarkAttendance = async () => {
        if (!quickMarkStudent) return;
        setQuickMarking(true);
        try {
            await markSupervisorAttendance({
                studentId: quickMarkStudent.id,
                date: new Date().toISOString().split('T')[0],
                status: quickStatus,
                notes: 'Manual verification from Supervisor Dashboard'
            });
            setQuickMarkStudent(null);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record attendance');
        } finally {
            setQuickMarking(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="industry_supervisor">
                <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                    <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                    </div>
                    <LoadingSkeleton className="h-96 rounded-2xl bg-[#12141c]" />
                </div>
            </DashboardLayout>
        );
    }

    const presentCount = workspace?.metrics?.todayPresent ?? todayAttendance.filter(a => a.status === 'present').length;
    const totalAssigned = workspace?.metrics?.totalAssigned ?? students.length;
    const pendingCount = workspace?.metrics?.pendingLogbooksCount ?? pendingLogbooks.length;
    const atRiskCount = workspace?.metrics?.atRiskCount ?? students.filter(s => (s.attendanceRate !== undefined && s.attendanceRate < 75)).length;
    const presencePercentage = totalAssigned > 0 ? Math.round((presentCount / totalAssigned) * 100) : 0;

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Hero Header Dossier */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/05 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
                                <Briefcase size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold tracking-wide uppercase">
                                        Workplace Mentorship
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {user?.email || 'supervisor@company.com'}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Industry Supervisor Cockpit
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Authenticate daily student attendance, review reflective logbooks, and monitor on-site workplace milestones.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => loadData(true)}
                                disabled={refreshing}
                                className="px-3.5 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={refreshing ? 'animate-spin text-emerald-400' : ''} />
                                <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
                            </button>
                            <a
                                href="/industry/presence"
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
                            >
                                <QrCode size={14} />
                                <span>Presence Terminal</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Assigned */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Interns</span>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalAssigned}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Active cohort</span>
                            <span className="text-violet-400 font-medium">100% attached</span>
                        </div>
                    </div>

                    {/* Today's Presence */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Presence</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{presentCount}</span>
                            <span className="text-xs text-slate-500">/ {totalAssigned} checked-in</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <div className="w-full bg-[#181a24] rounded-full h-1.5 mr-2 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${presencePercentage}%` }}
                                />
                            </div>
                            <span className="text-emerald-400 font-mono font-semibold shrink-0">{presencePercentage}%</span>
                        </div>
                    </div>

                    {/* Pending Logbooks */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Reviews</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <FileText size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{pendingCount}</span>
                            <span className="text-xs text-slate-500">submissions</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Awaiting sign-off</span>
                            <span className="text-amber-400 font-medium">Weekly logbooks</span>
                        </div>
                    </div>

                    {/* At-Risk Alerts */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Risk</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <ShieldAlert size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-400 font-mono">{atRiskCount}</span>
                            <span className="text-xs text-slate-500">interns flagged</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Threshold: &lt; 75%</span>
                            <span className="text-rose-400 font-medium">{atRiskCount > 0 ? 'Requires attention' : 'All compliant'}</span>
                        </div>
                    </div>
                </div>

                {/* Supervisor Action Queue */}
                {actionQueue.length > 0 && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/05 border border-amber-500/25 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                        Priority Action Queue ({actionQueue.length})
                                    </h3>
                                    <p className="text-[11px] text-slate-400">Items requiring immediate supervisor endorsement or resolution.</p>
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
                                                'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                            }`}>
                                                {item.priority}
                                            </span>
                                            <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
                                    </div>
                                    <a
                                        href={item.actionUrl || '/industry/attendance'}
                                        className="shrink-0"
                                    >
                                        <button className="px-2.5 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-200 text-xs font-medium flex items-center gap-1">
                                            <span>Resolve</span>
                                            <ArrowUpRight size={12} />
                                        </button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main 2-Column Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column: QR Quick Scanner & Today's Stream */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* QR Scanner Module */}
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                        <QrCode size={16} className="text-emerald-400" />
                                        <span>Presence Terminal</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400">Scan student's dynamic QR code</p>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            </div>

                            {!isScanning ? (
                                <div
                                    onClick={() => setIsScanning(true)}
                                    className="w-full aspect-square max-w-[220px] mx-auto bg-[#181a24] border-2 border-dashed border-[#262a3a] hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
                                >
                                    <div className="w-14 h-14 bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-3 transition-all border border-emerald-500/20">
                                        <Camera size={26} />
                                    </div>
                                    <span className="text-slate-300 text-xs font-semibold group-hover:text-emerald-300">Activate Camera</span>
                                    <span className="text-slate-500 text-[10px] mt-1 font-mono">10 FPS Real-time</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div id="reader" className="w-full overflow-hidden rounded-xl border border-emerald-500/40 bg-black" />
                                    <button
                                        onClick={() => setIsScanning(false)}
                                        className="w-full py-2 bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold rounded-xl"
                                    >
                                        Cancel Scanner
                                    </button>
                                </div>
                            )}

                            {scanResult && (
                                <div className="w-full bg-emerald-500/10 border border-emerald-500/25 p-3.5 rounded-xl text-center space-y-2">
                                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold">
                                        <CheckCircle size={15} />
                                        <span>Authenticated Student Node</span>
                                    </div>
                                    <p className="text-[11px] font-mono text-slate-300 break-all bg-[#12141c] p-2 rounded border border-[#22242f]">
                                        {scanResult}
                                    </p>
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1 block mx-auto underline"
                                    >
                                        Ready for Next Scan
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Today's Check-ins Stream */}
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-violet-400" />
                                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Today's Check-ins</h3>
                                </div>
                                <span className="text-[11px] font-mono text-slate-400">{todayAttendance.length} records</span>
                            </div>

                            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                {todayAttendance.length > 0 ? (
                                    todayAttendance.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-3 bg-[#181a24] rounded-xl border border-[#22242f] text-xs hover:border-[#2a2d3d] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                                                    {log.student?.user?.name ? log.student.user.name.charAt(0) : 'S'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-100">{log.student?.user?.name || 'Intern'}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{log.verificationMethod || 'Verified QR'}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                {log.status || 'Present'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-slate-500 text-xs space-y-1">
                                        <p>No check-in entries logged today yet.</p>
                                        <p className="text-[11px] text-slate-600">Activate scanner when students arrive.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pending Logbook Reviews & Student Roster */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Pending Reviews Box */}
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                        <FileText size={16} className="text-amber-400" />
                                        <span>Weekly Logbook Submissions</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400">Review student technical tasks and sign off</p>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    {pendingLogbooks.length} Pending
                                </span>
                            </div>

                            <div className="space-y-3">
                                {pendingLogbooks.length > 0 ? (
                                    pendingLogbooks.map((log) => (
                                        <div key={log.id} className="p-4 rounded-xl bg-[#181a24] border border-[#22242f] hover:border-[#2a2d3d] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-1.5 max-w-lg">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold font-mono">
                                                        WEEK {log.weekNumber}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-slate-100">{log.student?.user?.name || 'Intern'}</h4>
                                                    <span className="text-[10px] text-slate-500 font-mono">• {log.startDate} to {log.endDate}</span>
                                                </div>
                                                <p className="text-slate-300 text-xs italic line-clamp-2 bg-[#12141c] p-2.5 rounded-lg border border-[#22242f]">
                                                    "{log.summary || 'Summary submitted for supervisor evaluation.'}"
                                                </p>
                                            </div>
                                            <div className="shrink-0">
                                                <button
                                                    onClick={() => { setSelectedLogbook(log); setReviewComment(log.supervisorComment || ''); }}
                                                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 flex items-center justify-center gap-1.5 transition-all"
                                                >
                                                    <span>Review Entry</span>
                                                    <ArrowUpRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-slate-500 text-xs space-y-1">
                                        <CheckCircle size={24} className="mx-auto text-emerald-500/40 mb-2" />
                                        <p className="text-slate-300 font-medium">All logbook submissions are up-to-date.</p>
                                        <p className="text-[11px] text-slate-500">No pending student submissions waiting for sign-off.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assigned Interns Ledger */}
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1e2230] gap-2">
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                        <Users size={16} className="text-emerald-400" />
                                        <span>Assigned Interns & Attendance Standing</span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400">Institutional compliance monitoring and instant check-in</p>
                                </div>
                                <a href="/industry/attendance" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 self-start sm:self-auto">
                                    <span>Full Audit Ledger</span>
                                    <ChevronRight size={14} />
                                </a>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                        <tr>
                                            <th className="py-3 px-4 rounded-l-xl">Student Intern</th>
                                            <th className="py-3 px-4">Adm Number</th>
                                            <th className="py-3 px-4">Attendance Rate</th>
                                            <th className="py-3 px-4">Compliance</th>
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
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-slate-300 text-xs">
                                                                    {s.user?.name ? s.user.name.charAt(0) : 'S'}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-100">{s.user?.name || 'Intern'}</p>
                                                                    <p className="text-[10px] text-slate-400 font-mono">{s.user?.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{s.admissionNumber || 'N/A'}</td>
                                                        <td className="py-3 px-4 text-slate-300">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between text-[11px] font-mono">
                                                                    <span className={isAtRisk ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                                                                        {attRate}%
                                                                    </span>
                                                                </div>
                                                                <div className="w-20 bg-[#181a24] rounded-full h-1.5 overflow-hidden">
                                                                    <div
                                                                        className={`h-1.5 rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                                        style={{ width: `${Math.min(attRate, 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {isAtRisk ? (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                                    AT RISK
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                    COMPLIANT
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <button
                                                                onClick={() => { setQuickMarkStudent(s); setQuickStatus('present'); }}
                                                                className="px-2.5 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
                                                            >
                                                                <UserCheck size={12} className="text-emerald-400" />
                                                                <span>Check-in</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-slate-500 text-xs">
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-xl bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold font-mono">
                                    WEEK {selectedLogbook.weekNumber} REVIEW
                                </span>
                                <h3 className="text-base font-bold text-slate-100">
                                    {selectedLogbook.student?.user?.name || 'Intern Submission'}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono">{selectedLogbook.startDate} — {selectedLogbook.endDate}</p>
                            </div>
                            <button
                                onClick={() => setSelectedLogbook(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-xl bg-[#181a24] border border-[#22242f] space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Weekly Reflection Summary</span>
                                <p className="text-slate-200 leading-relaxed text-xs">{selectedLogbook.summary}</p>
                            </div>

                            {selectedLogbook.dailyEntries && typeof selectedLogbook.dailyEntries === 'object' && (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Breakdown Log</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {Object.entries(selectedLogbook.dailyEntries).map(([day, text]) => (
                                            <div key={day} className="p-3 bg-[#181a24] rounded-xl border border-[#22242f] space-y-1">
                                                <span className="font-bold uppercase text-[10px] text-emerald-400 block">{day}</span>
                                                <span className="text-slate-300 text-[11px] line-clamp-3">{text || 'No task logged'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300">Supervisor Feedback & Guidance</label>
                                <textarea
                                    rows={3}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Add feedback on technical competency, work ethic, or required adjustments..."
                                    className="w-full p-3 rounded-xl bg-[#181a24] border border-[#22242f] text-xs text-slate-100 placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewSubmit('rejected')}
                                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all"
                            >
                                Request Revision
                            </button>
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewSubmit('approved')}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                            >
                                <Check size={14} />
                                <span>{reviewing ? 'Endorsing...' : 'Approve & Sign Off'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Mark Attendance Modal */}
            {quickMarkStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Manual Check-in</h3>
                                <p className="text-xs text-slate-400">{quickMarkStudent.user?.name} ({quickMarkStudent.admissionNumber})</p>
                            </div>
                            <button
                                onClick={() => setQuickMarkStudent(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                                <input
                                    type="date"
                                    disabled
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 select-none opacity-80"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['present', 'late', 'absent'].map((st) => (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => setQuickStatus(st)}
                                            className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                                                quickStatus === st
                                                    ? st === 'present'
                                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                                        : st === 'late'
                                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                                            : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                                    : 'bg-[#181a24] border-[#22242f] text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                            <button
                                type="button"
                                onClick={() => setQuickMarkStudent(null)}
                                className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={quickMarking}
                                onClick={handleQuickMarkAttendance}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20"
                            >
                                {quickMarking ? 'Saving...' : 'Record Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default SupervisorDashboard;
