import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    TrendingUp,
    AlertTriangle,
    GraduationCap,
    Briefcase,
    ArrowRight,
    RefreshCw,
    ShieldCheck,
    Check,
    AlertCircle,
    UserCheck,
    QrCode,
    Sparkles,
    Mail,
    ChevronRight,
    MapPin,
    ExternalLink,
    Copy,
    Building2,
    Send,
    Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { getStudentWorkspace, recordCheckIn } from '../../utils/studentApi';
import { Button, LoadingSkeleton } from '../../components/ui';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [qrToken, setQrToken] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [workspaceData, setWorkspaceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInMsg, setCheckInMsg] = useState(null);
    const [copiedToken, setCopiedToken] = useState(false);

    const loadWorkspace = async () => {
        try {
            setLoading(true);
            const res = await getStudentWorkspace();
            if (res.data?.data) {
                setWorkspaceData(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load student workspace', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWorkspace();
    }, []);

    // 30s rotating secure QR token with live countdown
    useEffect(() => {
        const generateToken = () => {
            const token = btoa(JSON.stringify({
                studentId: user?.id,
                schoolId: user?.schoolId,
                timestamp: Date.now(),
                expires: Date.now() + 60000
            }));
            setQrToken(token);
            setSecondsLeft(30);
        };

        generateToken();
        const interval = setInterval(generateToken, 30000);
        const countdown = setInterval(() => {
            setSecondsLeft(prev => (prev > 1 ? prev - 1 : 30));
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(countdown);
        };
    }, [user]);

    const handleCheckIn = async () => {
        setCheckInLoading(true);
        setCheckInMsg(null);
        try {
            const res = await recordCheckIn({ notes: 'Daily web portal check-in' });
            setCheckInMsg({ type: 'success', text: res.data?.message || 'Check-in recorded successfully for today.' });
            loadWorkspace();
        } catch (err) {
            setCheckInMsg({ type: 'error', text: err.response?.data?.message || 'Check-in failed' });
        } finally {
            setCheckInLoading(false);
        }
    };

    const handleCopyToken = () => {
        if (!qrToken) return;
        navigator.clipboard.writeText(qrToken);
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="space-y-5 max-w-7xl mx-auto py-2">
                    <LoadingSkeleton className="h-24 rounded-xl bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {[1, 2, 3, 4].map(i => (
                            <LoadingSkeleton key={i} className="h-28 rounded-xl bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f]" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        <LoadingSkeleton className="lg:col-span-8 h-96 rounded-xl bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f]" />
                        <LoadingSkeleton className="lg:col-span-4 h-96 rounded-xl bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f]" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const {
        student = {},
        dates = {},
        attendance = {},
        readiness = {},
        actionQueue = [],
        timeline = [],
        logbooksSummary = {}
    } = workspaceData || {};

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCheckedIn = (student.attendance || []).some(a => a.date === todayStr);

    const getPlacementBadge = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Placement Active
                    </span>
                );
            case 'PENDING_APPROVAL':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending Approval
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Placement Rejected
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/20">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                        Completed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Draft Profile
                    </span>
                );
        }
    };

    const attendanceRate = attendance.rate ?? 0;
    const isAttendanceCompliant = attendanceRate >= 75;
    const approvedLogbooksCount = logbooksSummary.approved || 0;
    const totalWeeksTarget = 12;

    // 12-week matrix helper
    const weeksMatrix = Array.from({ length: 12 }, (_, i) => {
        const weekNum = i + 1;
        const matchingLog = (student.logbooks || []).find(l => l.weekNumber === weekNum);
        return {
            week: weekNum,
            log: matchingLog,
            status: matchingLog ? matchingLog.status : (weekNum <= (dates.daysCompleted ? Math.ceil(dates.daysCompleted / 7) : 1) ? 'due' : 'upcoming')
        };
    });

    return (
        <DashboardLayout role="student">
            <div className="space-y-5 max-w-7xl mx-auto pb-16 font-sans">
                
                {/* ========================================================================= */}
                {/* 1. FIGMA WORKSPACE TOOLBAR & BREADCRUMBS                                  */}
                {/* ========================================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        
                        {/* Student Identity & Breadcrumbs */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                <span>Workspace</span>
                                <span>/</span>
                                <span>Attachment 2026</span>
                                <span>/</span>
                                <span className="text-violet-600 dark:text-violet-400 font-bold">
                                    ATT-{student.admissionNumber || student.id || '2026-01'}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-lg sm:text-xl font-black text-[#0a0d14] dark:text-white tracking-tight">
                                    {user?.name || 'Student Portal'}
                                </h1>
                                {getPlacementBadge(student.placementStatus)}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#5b6276] dark:text-slate-400 font-medium">
                                <span>{student.course || student.department || 'Undergraduate Internship'}</span>
                                <span>•</span>
                                <span className="text-[#0a0d14] dark:text-slate-200 font-semibold flex items-center gap-1">
                                    <Building2 size={13} className="text-violet-600 dark:text-violet-400" />
                                    {student.organizationName || 'Host Organization Unassigned'}
                                </span>
                                {student.admissionNumber && (
                                    <>
                                        <span>•</span>
                                        <span className="font-mono">{student.admissionNumber}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Top Action Utility Cluster */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={loadWorkspace}
                                className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Refresh workspace data"
                            >
                                <RefreshCw size={13} className="text-[#5b6276] dark:text-slate-400" />
                                <span>Sync</span>
                            </button>

                            <Link to="/student/logbooks">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="text-xs font-semibold px-3 py-1.5 shadow-xs flex items-center gap-1.5"
                                >
                                    <FileText size={13} />
                                    <span>Logbooks</span>
                                </Button>
                            </Link>

                            <Link to="/student/visits">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 border-[#e2ddd3] dark:border-[#2a2e40]"
                                >
                                    <Calendar size={13} />
                                    <span>Supervision</span>
                                </Button>
                            </Link>

                            <Link to="/student/messages">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 border-[#e2ddd3] dark:border-[#2a2e40]"
                                >
                                    <Mail size={13} />
                                    <span>Messages</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. PRIORITY ACTION QUEUE (Clean Inline Notification)                      */}
                {/* ========================================================================= */}
                {actionQueue.length > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-3.5 sm:p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                                    Pending Actions ({actionQueue.length})
                                </span>
                            </div>
                            <span className="text-[10px] font-mono font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                                Immediate Clearance Steps
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {actionQueue.map((action) => (
                                <div
                                    key={action.id}
                                    className="bg-white dark:bg-[#141620] border border-[#e2ddd3] dark:border-[#262a3a] rounded-lg p-3 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-[#0a0d14] dark:text-white leading-tight">
                                            {action.title}
                                        </p>
                                        <p className="text-[11px] text-[#5b6276] dark:text-slate-400 line-clamp-1">
                                            {action.description}
                                        </p>
                                    </div>
                                    <Link to={action.link === '/student/logbook' ? '/student/logbooks' : (action.link || '/student/logbooks')}>
                                        <button className="shrink-0 px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-500/15 hover:bg-amber-200 dark:hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 font-mono font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer">
                                            <span>{action.actionText || 'Resolve'}</span>
                                            <ArrowRight size={11} />
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 3. MINIMAL CLEAN INFOGRAPHIC KPI STRIP (4 Figma-Style Metric Tiles)       */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    
                    {/* Metric 01: Attendance Rate */}
                    <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-violet-500/40 transition-colors">
                        <div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-[11px] text-[#5b6276] dark:text-slate-400 font-semibold uppercase tracking-wider">
                                    Attendance Rate
                                </span>
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    isAttendanceCompliant 
                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400' 
                                        : 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400'
                                }`}>
                                    {isAttendanceCompliant ? '≥75% Compliant' : '<75% Below Target'}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className={`text-2xl font-black font-mono tracking-tight ${
                                    isAttendanceCompliant ? 'text-[#0a0d14] dark:text-white' : 'text-rose-600 dark:text-rose-400'
                                }`}>
                                    {attendanceRate}%
                                </span>
                                <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                    ({attendance.presentCount || 0}/{attendance.totalRecords || 0} days)
                                </span>
                            </div>
                        </div>

                        {/* Minimal Thin Progress Bar */}
                        <div className="mt-3 pt-2.5 border-t border-[#e5e0d5] dark:border-[#1e2230]">
                            <div className="w-full bg-[#f0eee6] dark:bg-[#1c202d] h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        isAttendanceCompliant ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metric 02: Approved Weekly Logbooks */}
                    <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-violet-500/40 transition-colors">
                        <div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-[11px] text-[#5b6276] dark:text-slate-400 font-semibold uppercase tracking-wider">
                                    Weekly Logbooks
                                </span>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400">
                                    {logbooksSummary.pending || 0} In Review
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-black font-mono tracking-tight text-[#0a0d14] dark:text-white">
                                    {approvedLogbooksCount}
                                </span>
                                <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                    / {totalWeeksTarget} Weeks Signed
                                </span>
                            </div>
                        </div>

                        {/* Segmented 12-block Infographic Bar */}
                        <div className="mt-3 pt-2.5 border-t border-[#e5e0d5] dark:border-[#1e2230]">
                            <div className="grid grid-cols-12 gap-1">
                                {Array.from({ length: 12 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-xs transition-colors ${
                                            idx < approvedLogbooksCount
                                                ? 'bg-emerald-500'
                                                : idx < (logbooksSummary.total || 0)
                                                ? 'bg-amber-400'
                                                : 'bg-[#f0eee6] dark:bg-[#1c202d]'
                                        }`}
                                        title={`Week ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Metric 03: Attachment Duration */}
                    <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-violet-500/40 transition-colors">
                        <div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-[11px] text-[#5b6276] dark:text-slate-400 font-semibold uppercase tracking-wider">
                                    Term Period
                                </span>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-500/10 text-sky-800 dark:text-sky-400">
                                    {dates.percentElapsed || 0}% Elapsed
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-black font-mono tracking-tight text-[#0a0d14] dark:text-white">
                                    {dates.daysRemaining ?? 0}
                                </span>
                                <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                    Days Remaining
                                </span>
                            </div>
                        </div>

                        {/* Minimal Thin Progress Bar */}
                        <div className="mt-3 pt-2.5 border-t border-[#e5e0d5] dark:border-[#1e2230]">
                            <div className="w-full bg-[#f0eee6] dark:bg-[#1c202d] h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-sky-500 transition-all duration-500"
                                    style={{ width: `${Math.min(dates.percentElapsed || 0, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metric 04: Academic Readiness Score */}
                    <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:border-violet-500/40 transition-colors">
                        <div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-mono text-[11px] text-[#5b6276] dark:text-slate-400 font-semibold uppercase tracking-wider">
                                    Clearance Readiness
                                </span>
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400">
                                    {readiness.ready ? 'Eligible' : 'In Progress'}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-black font-mono tracking-tight text-violet-600 dark:text-violet-400">
                                    {readiness.score ?? 0}%
                                </span>
                                <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                    Audit Standard
                                </span>
                            </div>
                        </div>

                        {/* Minimal Thin Progress Bar */}
                        <div className="mt-3 pt-2.5 border-t border-[#e5e0d5] dark:border-[#1e2230]">
                            <div className="w-full bg-[#f0eee6] dark:bg-[#1c202d] h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                                    style={{ width: `${Math.min(readiness.score || 0, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 4. FIGMA-STYLE TWO-COLUMN WORKSTATION (8 Cols Left / 4 Cols Right)        */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* --------------------------------------------------------------------- */}
                    {/* LEFT COLUMN: Dominant Workstream (8 Cols)                             */}
                    {/* --------------------------------------------------------------------- */}
                    <div className="lg:col-span-8 space-y-5">
                        
                        {/* 12-WEEK LOGBOOK PROGRESSION MATRIX (Interactive Minimalist Infographic) */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div>
                                    <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                        <FileText size={15} className="text-violet-600 dark:text-violet-400" />
                                        <span>12-Week Logbook Progression Matrix</span>
                                    </h3>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">
                                        Weekly submission cycle requiring dual mentor approval for credit clearance
                                    </p>
                                </div>

                                <Link to="/student/logbooks">
                                    <span className="text-xs font-mono font-bold text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1">
                                        <span>Open Logbook Hub</span>
                                        <ArrowRight size={12} />
                                    </span>
                                </Link>
                            </div>

                            {/* 12-Tile Interactive Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {weeksMatrix.map((item) => {
                                    const isApproved = item.status === 'approved';
                                    const isPending = item.status === 'pending';
                                    const isDue = item.status === 'due';

                                    return (
                                        <Link
                                            key={item.week}
                                            to="/student/logbooks"
                                            className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[72px] ${
                                                isApproved
                                                    ? 'bg-emerald-500/[0.04] border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                                                    : isPending
                                                    ? 'bg-amber-500/[0.05] border-amber-500/30 text-amber-900 dark:text-amber-300'
                                                    : isDue
                                                    ? 'bg-violet-500/[0.06] border-violet-500/30 text-violet-900 dark:text-violet-300'
                                                    : 'bg-[#faf9f6] dark:bg-[#141620] border-[#e2ddd3] dark:border-[#22242f] text-[#5b6276] dark:text-slate-400 opacity-60'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                                                    W{item.week < 10 ? `0${item.week}` : item.week}
                                                </span>
                                                {isApproved ? (
                                                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                        <Check size={10} />
                                                    </span>
                                                ) : isPending ? (
                                                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                                        <Clock size={10} />
                                                    </span>
                                                ) : isDue ? (
                                                    <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 font-mono">—</span>
                                                )}
                                            </div>

                                            <div className="mt-1">
                                                <span className="text-[11px] font-semibold block leading-tight">
                                                    {isApproved
                                                        ? 'Signed'
                                                        : isPending
                                                        ? 'In Review'
                                                        : isDue
                                                        ? 'Due Now'
                                                        : 'Upcoming'}
                                                </span>
                                                <span className="text-[9px] font-mono text-[#5b6276] dark:text-slate-400 block mt-0.5">
                                                    Week {item.week}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#5b6276] dark:text-slate-400 border-t border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>Signed ({approvedLogbooksCount})</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                                        <span>In Review ({logbooksSummary.pending || 0})</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-[#cbd5e1] dark:bg-slate-700" />
                                        <span>Upcoming</span>
                                    </span>
                                </div>

                                <Link to="/student/logbooks" className="text-violet-700 dark:text-violet-400 font-bold hover:underline">
                                    + Submit Weekly Entry
                                </Link>
                            </div>
                        </div>

                        {/* HOST ORGANIZATION & PLACEMENT CONTEXT (Structured Data Grid) */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} className="text-violet-600 dark:text-violet-400" />
                                    <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white">
                                        Placement Specification
                                    </h3>
                                </div>
                                <Link to="/student/profile" className="text-xs font-mono text-violet-700 dark:text-violet-400 font-bold hover:underline">
                                    Edit Details
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#141620] border border-[#e2ddd3] dark:border-[#22242f] space-y-1">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                        Host Facility
                                    </span>
                                    <p className="font-bold text-[#0a0d14] dark:text-white text-xs">
                                        {student.organizationName || 'Acme Tech Solutions Ltd'}
                                    </p>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                        {student.organizationAddress || 'Enterprise Technology Park'}
                                    </p>
                                </div>

                                <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#141620] border border-[#e2ddd3] dark:border-[#22242f] space-y-1">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                        Assigned Industry Mentor
                                    </span>
                                    <p className="font-bold text-[#0a0d14] dark:text-white text-xs">
                                        {student.industrySupervisor?.name || 'Michael Anderson'}
                                    </p>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                        {student.industrySupervisor?.email || 'michael.anderson@acme.tech'}
                                    </p>
                                </div>

                                <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#141620] border border-[#e2ddd3] dark:border-[#22242f] space-y-1">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                        University Faculty Lead
                                    </span>
                                    <p className="font-bold text-[#0a0d14] dark:text-white text-xs">
                                        {student.universitySupervisor?.name || 'Dr. Jane Doe'}
                                    </p>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                        {student.universitySupervisor?.email || 'j.doe@university.ac.ke'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 8-POINT INSTITUTIONAL CLEARANCE RUBRIC (Checklist Data Table) */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div>
                                    <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-violet-600 dark:text-violet-400" />
                                        <span>Academic Clearance Rubric</span>
                                    </h3>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">
                                        Institutional benchmarks required for final attachment grading & clearance
                                    </p>
                                </div>
                                <span className="font-mono text-xs font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-md border border-violet-300 dark:border-violet-500/20">
                                    {readiness.score ?? 0}% Complete
                                </span>
                            </div>

                            <div className="divide-y divide-[#e5e0d5] dark:divide-[#202330]">
                                {[
                                    { label: 'Host Organization Placement Approved', passed: readiness.checklist?.placementApproved, link: '/student/profile' },
                                    { label: 'Industry Workplace Supervisor Assigned', passed: readiness.checklist?.industrySupervisorAssigned, link: '/student/profile' },
                                    { label: 'University Academic Supervisor Assigned', passed: readiness.checklist?.universitySupervisorAssigned, link: '/student/profile' },
                                    { label: 'Attendance Verified (≥75% presence met)', passed: readiness.checklist?.attendanceThresholdMet, link: null },
                                    { label: 'Weekly Logbook Submissions Reviewed & Signed', passed: readiness.checklist?.logbooksSubmittedAndReviewed, link: '/student/logbooks' },
                                    { label: 'Academic Supervision Site Visit Conducted', passed: readiness.checklist?.supervisionCompleted, link: '/student/visits' },
                                    { label: 'Industry Supervisor Evaluation Submitted', passed: readiness.checklist?.industryAssessmentCompleted, link: null },
                                    { label: 'Faculty Academic Assessment Graded', passed: readiness.checklist?.universityAssessmentCompleted, link: null }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="py-2.5 flex items-center justify-between text-xs gap-3"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                                item.passed 
                                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                                    : 'bg-[#f0eee6] dark:bg-[#1a1d2b] text-[#5b6276] dark:text-slate-500'
                                            }`}>
                                                {item.passed ? <Check size={10} /> : <span className="text-[9px] font-mono">{idx + 1}</span>}
                                            </div>
                                            <span className={`font-medium ${
                                                item.passed ? 'text-[#0a0d14] dark:text-white' : 'text-[#5b6276] dark:text-slate-400'
                                            }`}>
                                                {item.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {item.passed ? (
                                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-[11px] bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="font-mono text-[10px] text-[#5b6276] dark:text-slate-400 bg-[#f0eee6] dark:bg-[#181a24] px-2 py-0.5 rounded border border-[#e2ddd3] dark:border-[#2a2e40]">
                                                    Pending
                                                </span>
                                            )}

                                            {item.link && !item.passed && (
                                                <Link to={item.link}>
                                                    <span className="text-[11px] font-mono text-violet-700 dark:text-violet-400 hover:underline">
                                                        Fix →
                                                    </span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LIFECYCLE MILESTONE TIMELINE */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                    <Calendar size={15} className="text-violet-600 dark:text-violet-400" />
                                    <span>Milestone Lifecycle Progress</span>
                                </h3>
                                <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                    Academic Term 2026
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                {timeline.slice(0, 4).map((step, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-xl border flex flex-col justify-between ${
                                            step.completed
                                                ? 'bg-emerald-500/[0.03] border-emerald-500/30'
                                                : step.current
                                                ? 'bg-violet-500/[0.05] border-violet-500/30'
                                                : 'bg-[#faf9f6] dark:bg-[#141620] border-[#e2ddd3] dark:border-[#22242f] opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold text-[#5b6276] dark:text-slate-400">
                                                0{idx + 1}
                                            </span>
                                            {step.completed ? (
                                                <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                                            ) : step.current ? (
                                                <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-slate-400" />
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="text-xs font-bold text-[#0a0d14] dark:text-white leading-tight">
                                                {step.title}
                                            </h4>
                                            <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400 block mt-0.5">
                                                {step.completed ? 'Completed' : step.current ? 'Current Stage' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --------------------------------------------------------------------- */}
                    {/* RIGHT COLUMN: Operational Rail (4 Cols)                               */}
                    {/* --------------------------------------------------------------------- */}
                    <div className="lg:col-span-4 space-y-5">
                        
                        {/* DAILY ATTENDANCE VERIFICATION TERMINAL (Compact Utilitarian Widget) */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div>
                                    <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-violet-700 dark:text-violet-400">
                                        <QrCode size={13} />
                                        <span>Attendance Terminal</span>
                                    </div>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">
                                        Dynamic cryptographic token
                                    </p>
                                </div>

                                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-[#f0eee6] dark:bg-[#1c202d] px-2 py-0.5 rounded">
                                    {secondsLeft}s
                                </span>
                            </div>

                            {/* Clean Framed QR Code */}
                            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-white rounded-xl border border-[#d6d0c2] dark:border-[#2a2e40] shadow-2xs">
                                <QRCodeSVG
                                    value={qrToken}
                                    size={140}
                                    level="M"
                                    includeMargin={false}
                                />
                            </div>

                            {/* Rotating Timer & Token Copy */}
                            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs font-mono text-[#5b6276] dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px]">Auto-regenerating</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyToken}
                                    className="text-[10px] text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                                >
                                    <Copy size={11} />
                                    <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>

                            {/* Today's Check-In Status or Action */}
                            <div className="pt-1">
                                {todayCheckedIn ? (
                                    <div className="w-full py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/25 text-emerald-900 dark:text-emerald-300 text-center font-mono font-bold text-xs flex items-center justify-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                                        <span>Check-In Recorded Today</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={checkInLoading}
                                        variant="primary"
                                        className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                                    >
                                        <UserCheck size={14} />
                                        <span>{checkInLoading ? 'Recording Session...' : 'Record Web Check-In'}</span>
                                    </Button>
                                )}

                                {checkInMsg && (
                                    <div className={`mt-2 p-2 rounded-lg text-[11px] text-center font-mono font-medium border ${
                                        checkInMsg.type === 'success'
                                            ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-400'
                                            : 'bg-rose-100 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20 text-rose-900 dark:text-rose-400'
                                    }`}>
                                        {checkInMsg.text}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SUPERVISORY TEAM ROSTER (Compact Profile Cards) */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                    <GraduationCap size={14} className="text-violet-600 dark:text-violet-400" />
                                    <span>Supervisory Roster</span>
                                </h3>
                                <Link to="/student/messages" className="text-[11px] font-mono text-violet-700 dark:text-violet-400 font-bold hover:underline">
                                    All Chats
                                </Link>
                            </div>

                            <div className="space-y-2.5">
                                {/* Industry Mentor */}
                                <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                                                Industry Mentor
                                            </span>
                                            <h4 className="text-xs font-bold text-[#0a0d14] dark:text-white mt-0.5">
                                                {student.industrySupervisor?.name || 'Michael Anderson'}
                                            </h4>
                                            <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                                {student.industrySupervisor?.email || 'michael.anderson@acme.tech'}
                                            </p>
                                        </div>

                                        <Link to="/student/messages">
                                            <button className="p-1.5 rounded-lg bg-white dark:bg-[#202330] border border-[#e2ddd3] dark:border-[#2a2e40] text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer">
                                                <Mail size={13} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* University Supervisor */}
                                <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-violet-800 dark:text-violet-400 uppercase tracking-wider">
                                                Faculty Advisor
                                            </span>
                                            <h4 className="text-xs font-bold text-[#0a0d14] dark:text-white mt-0.5">
                                                {student.universitySupervisor?.name || 'Dr. Jane Doe'}
                                            </h4>
                                            <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                                {student.universitySupervisor?.email || 'j.doe@university.ac.ke'}
                                            </p>
                                        </div>

                                        <Link to="/student/messages">
                                            <button className="p-1.5 rounded-lg bg-white dark:bg-[#202330] border border-[#e2ddd3] dark:border-[#2a2e40] text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer">
                                                <Mail size={13} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QUICK NAVIGATION SHORTCUTS */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 shadow-xs space-y-2">
                            <span className="text-[10px] font-mono font-bold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider block mb-2">
                                Quick Shortcuts
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <Link
                                    to="/student/logbooks"
                                    className="p-2.5 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] hover:border-violet-500/40 font-semibold text-[#0a0d14] dark:text-slate-200 flex items-center justify-between transition-colors"
                                >
                                    <span>Logbooks</span>
                                    <ChevronRight size={13} className="text-[#5b6276] dark:text-slate-400" />
                                </Link>

                                <Link
                                    to="/student/visits"
                                    className="p-2.5 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] hover:border-violet-500/40 font-semibold text-[#0a0d14] dark:text-slate-200 flex items-center justify-between transition-colors"
                                >
                                    <span>Visits</span>
                                    <ChevronRight size={13} className="text-[#5b6276] dark:text-slate-400" />
                                </Link>

                                <Link
                                    to="/student/profile"
                                    className="p-2.5 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] hover:border-violet-500/40 font-semibold text-[#0a0d14] dark:text-slate-200 flex items-center justify-between transition-colors"
                                >
                                    <span>Profile</span>
                                    <ChevronRight size={13} className="text-[#5b6276] dark:text-slate-400" />
                                </Link>

                                <Link
                                    to="/student/messages"
                                    className="p-2.5 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] hover:border-violet-500/40 font-semibold text-[#0a0d14] dark:text-slate-200 flex items-center justify-between transition-colors"
                                >
                                    <span>Messages</span>
                                    <ChevronRight size={13} className="text-[#5b6276] dark:text-slate-400" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
