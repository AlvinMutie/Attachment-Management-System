import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    Users,
    CheckCircle,
    Camera,
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
    UserCheck,
    RefreshCw,
    ArrowRight,
    TrendingUp,
    Layers
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
import { LoadingSkeleton } from '../../components/ui';

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

    const [selectedLogbook, setSelectedLogbook] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewing, setReviewing] = useState(false);

    const [quickMarkStudent, setQuickMarkStudent] = useState(null);
    const [quickStatus, setQuickStatus] = useState('present');
    const [quickMarking, setQuickMarking] = useState(false);

    const loadData = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
        try {
            const wsRes = await getSupervisorWorkspace().catch(() => null);
            if (wsRes?.data?.data) {
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

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        let scanner;
        if (isScanning) {
            scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 });
            scanner.render((result) => {
                setScanResult(result);
                setIsScanning(false);
                scanner.clear();
            }, () => { });
        }
        return () => { if (scanner) scanner.clear(); };
    }, [isScanning]);

    const handleReviewSubmit = async (status) => {
        if (!selectedLogbook) return;
        setReviewing(true);
        try {
            await reviewLogbook(selectedLogbook.id, { status, supervisorComment: reviewComment });
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
                <div className="space-y-4 max-w-7xl mx-auto">
                    <LoadingSkeleton className="h-20 rounded-2xl" />
                    <div className="grid grid-cols-4 gap-3.5">
                        {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} className="h-24 rounded-xl" />)}
                    </div>
                    <LoadingSkeleton className="h-96 rounded-2xl" />
                </div>
            </DashboardLayout>
        );
    }

    const presentCount = workspace?.metrics?.todayPresent ?? todayAttendance.filter(a => a.status === 'present').length;
    const totalAssigned = workspace?.metrics?.totalAssigned ?? students.length;
    const pendingCount = workspace?.metrics?.pendingLogbooksCount ?? pendingLogbooks.length;
    const atRiskCount = workspace?.metrics?.atRiskCount ?? students.filter(s => s.attendanceRate !== undefined && s.attendanceRate < 75).length;
    const presenceRate = totalAssigned > 0 ? Math.round((presentCount / totalAssigned) * 100) : 0;
    const today = new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="max-w-7xl mx-auto space-y-5 pb-16 font-sans">

                {/* ============================================================= */}
                {/* FIGMA WORKSPACE TOOLBAR                                         */}
                {/* ============================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                <span>Workspace</span>
                                <span>/</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Industry Supervisor Control</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-lg sm:text-xl font-black text-[#0a0d14] dark:text-white tracking-tight">
                                    Good morning, {user?.name?.split(' ')[0] || 'Supervisor'}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Session
                                </span>
                            </div>
                            <p className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">{today} · {user?.email}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <button
                                onClick={() => loadData(true)}
                                disabled={refreshing}
                                className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={13} className={`text-[#5b6276] dark:text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                                <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
                            </button>
                            <Link
                                to="/industry/presence"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                            >
                                <QrCode size={13} />
                                <span>Presence Terminal</span>
                            </Link>
                            <Link
                                to="/industry/attendance"
                                className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                            >
                                <Calendar size={13} />
                                <span>Attendance Ledger</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ============================================================= */}
                {/* CLEAN 4-KPI METRIC STRIP                                        */}
                {/* ============================================================= */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                        {
                            label: 'Assigned Interns',
                            value: totalAssigned,
                            sub: 'Active cohort',
                            color: 'text-[#0a0d14] dark:text-white',
                            pill: 'bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 border-violet-300 dark:border-violet-500/20',
                            pillText: '100% attached',
                            icon: Users,
                            iconColor: 'text-violet-600 dark:text-violet-400'
                        },
                        {
                            label: "Today's Presence",
                            value: presentCount,
                            sub: `of ${totalAssigned} checked-in`,
                            color: 'text-emerald-700 dark:text-emerald-400',
                            pill: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20',
                            pillText: `${presenceRate}% rate`,
                            icon: CheckCircle,
                            iconColor: 'text-emerald-600 dark:text-emerald-400',
                            bar: presenceRate
                        },
                        {
                            label: 'Pending Reviews',
                            value: pendingCount,
                            sub: 'Logbook submissions',
                            color: 'text-amber-700 dark:text-amber-400',
                            pill: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20',
                            pillText: 'Awaiting sign-off',
                            icon: FileText,
                            iconColor: 'text-amber-600 dark:text-amber-400'
                        },
                        {
                            label: 'Compliance Risk',
                            value: atRiskCount,
                            sub: 'Threshold < 75%',
                            color: atRiskCount > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400',
                            pill: atRiskCount > 0
                                ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20'
                                : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20',
                            pillText: atRiskCount > 0 ? 'Attention needed' : 'All compliant',
                            icon: ShieldAlert,
                            iconColor: atRiskCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }
                    ].map((m, i) => (
                        <div key={i} className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 shadow-2xs hover:border-emerald-500/40 transition-colors flex flex-col justify-between gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                    {m.label}
                                </span>
                                <m.icon size={14} className={m.iconColor} />
                            </div>
                            <div>
                                <span className={`text-2xl font-black font-mono tracking-tight ${m.color}`}>
                                    {m.value}
                                </span>
                                <p className="text-[10px] font-mono text-[#5b6276] dark:text-slate-500 mt-0.5">{m.sub}</p>
                            </div>
                            {m.bar !== undefined ? (
                                <div className="space-y-1">
                                    <div className="w-full h-1 bg-[#e5e0d5] dark:bg-[#1e2230] rounded-full overflow-hidden">
                                        <div className="h-1 bg-emerald-500 rounded-full transition-all" style={{ width: `${m.bar}%` }} />
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border self-start ${m.pill}`}>
                                        {m.pillText}
                                    </span>
                                </div>
                            ) : (
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border self-start ${m.pill}`}>
                                    {m.pillText}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Action Queue */}
                {actionQueue.length > 0 && (
                    <div className="bg-white dark:bg-[#11131a] border border-amber-300 dark:border-amber-500/25 rounded-2xl p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-amber-200 dark:border-amber-500/15">
                            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
                            <h3 className="text-xs font-mono font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                                Priority Action Queue ({actionQueue.length})
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2.5">
                            {actionQueue.map((item, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-amber-50 dark:bg-[#161822] border border-amber-200 dark:border-[#22242f] flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                                                item.priority === 'urgent'
                                                    ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20'
                                                    : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20'
                                            }`}>
                                                {item.priority}
                                            </span>
                                            <h4 className="text-xs font-bold text-[#0a0d14] dark:text-slate-200">{item.title}</h4>
                                        </div>
                                        <p className="text-[11px] text-[#5b6276] dark:text-slate-400">{item.description}</p>
                                    </div>
                                    <a href={item.actionUrl || '/industry/attendance'} className="shrink-0">
                                        <button className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] text-[#0a0d14] dark:text-slate-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer hover:border-emerald-500/40 transition-colors">
                                            <span>Resolve</span>
                                            <ArrowUpRight size={11} />
                                        </button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ============================================================= */}
                {/* MAIN GRID: 4 + 8 COLS                                           */}
                {/* ============================================================= */}
                <div className="grid lg:grid-cols-12 gap-5">

                    {/* LEFT COLUMN (4 cols): QR Scanner + Today's Check-ins */}
                    <div className="lg:col-span-4 space-y-5">

                        {/* QR Scanner Card */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <QrCode size={13} className="text-emerald-600 dark:text-emerald-400" />
                                    Presence Terminal
                                </h3>
                                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    10 FPS
                                </span>
                            </div>

                            {!isScanning ? (
                                <div
                                    onClick={() => setIsScanning(true)}
                                    className="w-full aspect-square max-w-[200px] mx-auto bg-[#faf9f6] dark:bg-[#161822] border-2 border-dashed border-[#d6d0c2] dark:border-[#2a2e40] hover:border-emerald-500/60 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
                                >
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-2.5 border border-emerald-300 dark:border-emerald-500/20 transition-colors">
                                        <Camera size={22} />
                                    </div>
                                    <span className="text-xs font-bold text-[#0a0d14] dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                        Activate Camera
                                    </span>
                                    <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-500 mt-0.5">
                                        Scan student QR code
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div id="reader" className="w-full overflow-hidden rounded-xl border border-emerald-500/40 bg-black" />
                                    <button
                                        onClick={() => setIsScanning(false)}
                                        className="w-full py-2 bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] border border-[#e2ddd3] dark:border-[#22242f] text-[#0a0d14] dark:text-slate-300 text-xs font-mono font-semibold rounded-xl cursor-pointer transition-colors"
                                    >
                                        Cancel Scanner
                                    </button>
                                </div>
                            )}

                            {scanResult && (
                                <div className="w-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/25 p-3 rounded-xl text-center space-y-2">
                                    <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-400 text-xs font-semibold">
                                        <CheckCircle size={13} />
                                        <span>Student Authenticated</span>
                                    </div>
                                    <p className="text-[11px] font-mono text-[#22283a] dark:text-slate-300 break-all bg-white dark:bg-[#11131a] p-2 rounded border border-emerald-300 dark:border-emerald-500/20">
                                        {scanResult}
                                    </p>
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="text-xs text-emerald-700 dark:text-emerald-400 font-bold underline cursor-pointer"
                                    >
                                        Ready for Next Scan
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Today's Check-ins Stream */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock size={13} className="text-violet-600 dark:text-violet-400" />
                                    Today's Check-ins
                                </h3>
                                <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                    {todayAttendance.length} records
                                </span>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
                                {todayAttendance.length > 0 ? (
                                    todayAttendance.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-2.5 bg-[#faf9f6] dark:bg-[#161822] rounded-xl border border-[#e2ddd3] dark:border-[#22242f] text-xs">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase">
                                                    {log.student?.user?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#0a0d14] dark:text-slate-200 text-xs">
                                                        {log.student?.user?.name || 'Intern'}
                                                    </p>
                                                    <p className="text-[10px] text-[#5b6276] dark:text-slate-400 font-mono">
                                                        {log.verificationMethod || 'QR Verified'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20 capitalize">
                                                {log.status || 'Present'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center space-y-1">
                                        <Clock size={20} className="text-[#d6d0c2] dark:text-slate-600 mx-auto" />
                                        <p className="text-xs font-medium text-[#5b6276] dark:text-slate-400">No check-ins yet today</p>
                                        <p className="text-[11px] text-[#a09d93] dark:text-slate-500">Activate scanner when students arrive</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (8 cols): Logbooks + Student Roster */}
                    <div className="lg:col-span-8 space-y-5">

                        {/* Pending Logbook Submissions */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div>
                                    <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                        <FileText size={15} className="text-amber-600 dark:text-amber-400" />
                                        Weekly Logbook Submissions
                                    </h3>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">
                                        Review student technical tasks and sign off
                                    </p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20">
                                    {pendingLogbooks.length} Pending
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                {pendingLogbooks.length > 0 ? (
                                    pendingLogbooks.map((log) => (
                                        <div key={log.id} className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] hover:border-amber-500/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                                            <div className="space-y-1.5 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-500/10 border border-violet-300 dark:border-violet-500/20 text-violet-800 dark:text-violet-400 text-[10px] font-mono font-bold">
                                                        W{log.weekNumber < 10 ? `0${log.weekNumber}` : log.weekNumber}
                                                    </span>
                                                    <span className="text-xs font-bold text-[#0a0d14] dark:text-slate-100">
                                                        {log.student?.user?.name || 'Intern'}
                                                    </span>
                                                    <span className="text-[10px] text-[#5b6276] dark:text-slate-500 font-mono">
                                                        {log.startDate} → {log.endDate}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#22283a] dark:text-slate-300 italic line-clamp-2 bg-white dark:bg-[#11131a] p-2.5 rounded-lg border border-[#e2ddd3] dark:border-[#22242f]">
                                                    "{log.summary || 'Summary submitted for supervisor evaluation.'}"
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedLogbook(log); setReviewComment(log.supervisorComment || ''); }}
                                                className="shrink-0 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                            >
                                                <span>Review</span>
                                                <ArrowRight size={12} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center space-y-1.5">
                                        <CheckCircle size={22} className="mx-auto text-emerald-500/60" />
                                        <p className="text-xs font-bold text-[#0a0d14] dark:text-slate-200">All logbooks up-to-date</p>
                                        <p className="text-[11px] text-[#5b6276] dark:text-slate-500">No pending student submissions waiting for sign-off.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assigned Interns Ledger */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330] gap-2">
                                <div>
                                    <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                        <Users size={15} className="text-emerald-600 dark:text-emerald-400" />
                                        Assigned Interns & Attendance Standing
                                    </h3>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">Compliance monitoring and instant check-in</p>
                                </div>
                                <Link to="/industry/attendance" className="text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors shrink-0">
                                    <span>Full Audit Ledger</span>
                                    <ChevronRight size={13} />
                                </Link>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-[#e5e0d5] dark:border-[#202330]">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#f0eee6] dark:bg-[#161822] border-b border-[#e5e0d5] dark:border-[#202330]">
                                        <tr>
                                            {['Intern', 'Adm. No.', 'Attendance', 'Status', 'Action'].map((h, i) => (
                                                <th key={i} className={`py-2.5 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400 ${i === 4 ? 'text-right' : ''}`}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e5e0d5] dark:divide-[#202330]">
                                        {students.length > 0 ? students.map((s) => {
                                            const rate = s.attendanceRate ?? 85;
                                            const atRisk = rate < 75;
                                            return (
                                                <tr key={s.id} className="hover:bg-[#f7f6f2] dark:hover:bg-[#161822] transition-colors">
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-7 h-7 rounded-lg bg-[#e5e0d5] dark:bg-[#22242f] border border-[#d6d0c2] dark:border-[#2a2e40] flex items-center justify-center font-bold text-[#5b6276] dark:text-slate-400 text-xs uppercase">
                                                                {s.user?.name?.charAt(0) || 'S'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#0a0d14] dark:text-slate-100">{s.user?.name || 'Intern'}</p>
                                                                <p className="text-[10px] text-[#5b6276] dark:text-slate-400 font-mono">{s.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3 text-[#5b6276] dark:text-slate-400 font-mono text-[11px]">
                                                        {s.admissionNumber || '—'}
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <div className="space-y-1">
                                                            <span className={`text-[11px] font-mono font-bold ${atRisk ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                                                                {rate}%
                                                            </span>
                                                            <div className="w-20 bg-[#e5e0d5] dark:bg-[#1e2230] rounded-full h-1 overflow-hidden">
                                                                <div
                                                                    className={`h-1 rounded-full ${atRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                                    style={{ width: `${Math.min(rate, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                                            atRisk
                                                                ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20'
                                                                : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20'
                                                        }`}>
                                                            {atRisk ? 'AT RISK' : 'COMPLIANT'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 text-right">
                                                        <button
                                                            onClick={() => { setQuickMarkStudent(s); setQuickStatus('present'); }}
                                                            className="px-2.5 py-1.5 rounded-lg bg-[#faf9f6] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] border border-[#e2ddd3] dark:border-[#22242f] text-[#0a0d14] dark:text-slate-300 text-xs font-mono font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                                        >
                                                            <UserCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
                                                            <span>Check-in</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-[#5b6276] dark:text-slate-500 text-xs">
                                                    No interns assigned to your supervision yet.
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

            {/* ============================================================= */}
            {/* LOGBOOK REVIEW MODAL                                            */}
            {/* ============================================================= */}
            {selectedLogbook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div className="space-y-0.5">
                                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 text-amber-800 dark:text-amber-400 text-[10px] font-mono font-bold">
                                    WEEK {selectedLogbook.weekNumber} REVIEW
                                </span>
                                <h3 className="text-sm font-black text-[#0a0d14] dark:text-white mt-1">
                                    {selectedLogbook.student?.user?.name || 'Intern Submission'}
                                </h3>
                                <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                    {selectedLogbook.startDate} — {selectedLogbook.endDate}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLogbook(null)}
                                className="text-[#5b6276] dark:text-slate-400 hover:text-[#0a0d14] dark:hover:text-white p-1 rounded-lg cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-3.5 text-xs">
                            <div className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] space-y-1">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                                    Weekly Reflection Summary
                                </span>
                                <p className="text-[#22283a] dark:text-slate-200 leading-relaxed">
                                    {selectedLogbook.summary}
                                </p>
                            </div>

                            {selectedLogbook.dailyEntries && typeof selectedLogbook.dailyEntries === 'object' && (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                        Daily Breakdown Log
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {Object.entries(selectedLogbook.dailyEntries).map(([day, text]) => (
                                            <div key={day} className="p-2.5 bg-[#faf9f6] dark:bg-[#161822] rounded-xl border border-[#e2ddd3] dark:border-[#22242f] space-y-1">
                                                <span className="font-mono font-bold uppercase text-[10px] text-emerald-700 dark:text-emerald-400 block">{day}</span>
                                                <span className="text-[#22283a] dark:text-slate-300 text-[11px] line-clamp-3">{text || 'No task logged'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">
                                    Supervisor Feedback
                                </label>
                                <textarea
                                    rows={3}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Add feedback on technical competency, work ethic, or required adjustments..."
                                    className="w-full p-3 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 resize-none outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e5e0d5] dark:border-[#202330]">
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewSubmit('rejected')}
                                className="px-4 py-2 rounded-xl bg-rose-100 dark:bg-rose-500/10 hover:bg-rose-200 dark:hover:bg-rose-500/20 border border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-400 text-xs font-mono font-semibold cursor-pointer transition-colors disabled:opacity-60"
                            >
                                Request Revision
                            </button>
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewSubmit('approved')}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
                            >
                                <Check size={13} />
                                <span>{reviewing ? 'Endorsing...' : 'Approve & Sign Off'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================= */}
            {/* QUICK CHECK-IN MODAL                                            */}
            {/* ============================================================= */}
            {quickMarkStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-5 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div>
                                <h3 className="text-sm font-black text-[#0a0d14] dark:text-white">Manual Check-in</h3>
                                <p className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 mt-0.5">
                                    {quickMarkStudent.user?.name} · {quickMarkStudent.admissionNumber}
                                </p>
                            </div>
                            <button onClick={() => setQuickMarkStudent(null)} className="text-[#5b6276] dark:text-slate-400 hover:text-[#0a0d14] dark:hover:text-white p-1 rounded cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    disabled
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-[#f0eee6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl px-3 py-2 text-xs text-[#5b6276] dark:text-slate-400 font-mono opacity-80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['present', 'late', 'absent'].map((st) => (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => setQuickStatus(st)}
                                            className={`py-2 rounded-xl text-xs font-mono font-bold capitalize border transition-all cursor-pointer ${
                                                quickStatus === st
                                                    ? st === 'present'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                                                        : st === 'late'
                                                            ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
                                                            : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
                                                    : 'bg-[#faf9f6] dark:bg-[#161822] border-[#e2ddd3] dark:border-[#22242f] text-[#5b6276] dark:text-slate-400'
                                            }`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e5e0d5] dark:border-[#202330]">
                            <button
                                type="button"
                                onClick={() => setQuickMarkStudent(null)}
                                className="px-4 py-2 rounded-xl bg-[#f6f5ee] dark:bg-[#181a24] border border-[#e2ddd3] dark:border-[#22242f] text-[#5b6276] dark:text-slate-400 text-xs font-mono font-semibold cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={quickMarking}
                                onClick={handleQuickMarkAttendance}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold cursor-pointer transition-colors disabled:opacity-60"
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
