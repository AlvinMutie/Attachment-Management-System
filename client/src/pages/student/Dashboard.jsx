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
    Info,
    CalendarCheck,
    CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { getStudentWorkspace, recordCheckIn } from '../../utils/studentApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [qrToken, setQrToken] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [workspaceData, setWorkspaceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInMsg, setCheckInMsg] = useState(null);

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

    // 30s rotating QR token with live countdown
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

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="space-y-6 max-w-7xl mx-auto py-2">
                    <LoadingSkeleton className="h-32 rounded-xl bg-[#15171f] border border-[#22242f]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LoadingSkeleton className="h-28 rounded-xl bg-[#15171f] border border-[#22242f]" />
                        <LoadingSkeleton className="h-28 rounded-xl bg-[#15171f] border border-[#22242f]" />
                        <LoadingSkeleton className="h-28 rounded-xl bg-[#15171f] border border-[#22242f]" />
                        <LoadingSkeleton className="h-28 rounded-xl bg-[#15171f] border border-[#22242f]" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <LoadingSkeleton className="lg:col-span-5 h-96 rounded-xl bg-[#15171f] border border-[#22242f]" />
                        <LoadingSkeleton className="lg:col-span-7 h-96 rounded-xl bg-[#15171f] border border-[#22242f]" />
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
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Placement
                    </span>
                );
            case 'PENDING_APPROVAL':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Pending Approval
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Placement Rejected
                    </span>
                );
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                        Attachment Completed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Draft Profile
                    </span>
                );
        }
    };

    const attendanceRate = attendance.rate ?? 0;
    const isAttendanceCompliant = attendanceRate >= 75;

    return (
        <DashboardLayout role="student">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* 1. Header Overview Cockpit */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        {/* Student Meta */}
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center text-xl font-bold text-violet-300 shadow-inner">
                                    {user?.name?.charAt(0) || 'S'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f1117]" title="Portal Active" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                        {user?.name || 'Student Portal'}
                                    </h1>
                                    {getPlacementBadge(student.placementStatus)}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                    <span className="text-slate-300 font-medium">
                                        {student.course || student.department || 'Undergraduate Internship'}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-violet-400 font-medium">
                                        {student.organizationName ? (
                                            <span className="inline-flex items-center gap-1">
                                                <Briefcase className="w-3 h-3 text-violet-400" />
                                                {student.organizationName}
                                            </span>
                                        ) : (
                                            <Link to="/student/profile" className="text-amber-400 hover:underline flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> Set Host Organization
                                            </Link>
                                        )}
                                    </span>
                                    {student.regNumber && (
                                        <>
                                            <span className="text-slate-600">•</span>
                                            <span className="font-mono text-slate-400">{student.regNumber}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Jump Action Cluster */}
                        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={loadWorkspace}
                                className="px-3 py-2 rounded-lg bg-[#1a1d28] hover:bg-[#232736] text-slate-300 hover:text-white border border-[#2a2e40] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                                title="Refresh workspace state"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                                <span>Sync</span>
                            </button>

                            <Link to="/student/logbooks" className="flex-1 sm:flex-none">
                                <Button
                                    variant="primary"
                                    className="w-full text-xs font-semibold py-2 px-4 shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Logbook Hub</span>
                                </Button>
                            </Link>

                            <Link to="/student/visits" className="flex-1 sm:flex-none">
                                <Button
                                    variant="secondary"
                                    className="w-full text-xs font-medium py-2 px-3.5 flex items-center justify-center gap-1.5 border border-[#2a2e40]"
                                >
                                    <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Supervision</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Prioritized Action Required Queue */}
                {actionQueue.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-xl bg-amber-500/[0.06] border border-amber-500/25 space-y-3.5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                        Action Required ({actionQueue.length})
                                    </h2>
                                    <p className="text-[11px] text-slate-400">Items pending your immediate intervention for institutional compliance</p>
                                </div>
                            </div>
                            <span className="hidden sm:inline-block text-[11px] text-amber-400/80 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                High Priority
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {actionQueue.map(action => (
                                <div
                                    key={action.id}
                                    className="p-3.5 rounded-lg bg-[#10121a] border border-[#222533] flex items-start justify-between gap-3 hover:border-amber-500/40 transition-all"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${action.priority === 'CRITICAL' ? 'bg-rose-500' : action.priority === 'HIGH' ? 'bg-amber-500' : 'bg-violet-500'}`} />
                                            <h3 className="text-xs font-semibold text-white">{action.title}</h3>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">{action.description}</p>
                                    </div>
                                    <Link to={action.link === '/student/logbook' ? '/student/logbooks' : action.link} className="shrink-0">
                                        <Button size="sm" variant="outline" className="text-[11px] font-medium text-amber-300 border-amber-500/30 hover:bg-amber-500/15 py-1 px-3 rounded-md flex items-center gap-1">
                                            <span>{action.actionText}</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Linear-Style 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Attendance Rate */}
                    <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-4.5 hover:border-slate-700 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-semibold text-slate-300">Attendance Rate</span>
                                <div className={`p-1.5 rounded-md ${isAttendanceCompliant ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className={`text-2xl font-bold tracking-tight ${isAttendanceCompliant ? 'text-white' : 'text-rose-400'}`}>
                                    {attendanceRate}%
                                </span>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isAttendanceCompliant ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {isAttendanceCompliant ? '≥75% Compliant' : '<75% Below Target'}
                                </span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-full bg-[#1e2230] h-1.5 rounded-full overflow-hidden mt-3">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isAttendanceCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                    style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1e2230] text-[11px] text-slate-400">
                            <span>Presence Records</span>
                            <span className="font-mono text-slate-200">{attendance.presentCount || 0} / {attendance.totalRecords || 0} days</span>
                        </div>
                    </div>

                    {/* Approved Logbooks */}
                    <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-4.5 hover:border-slate-700 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-semibold text-slate-300">Approved Logbooks</span>
                                <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                                    <FileText className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-bold tracking-tight text-emerald-400">
                                    {logbooksSummary.approved || 0}
                                </span>
                                <span className="text-xs text-slate-400">
                                    / {logbooksSummary.total || 0} submitted
                                </span>
                            </div>
                            <div className="w-full bg-[#1e2230] h-1.5 rounded-full overflow-hidden mt-3">
                                <div
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${logbooksSummary.total ? Math.min((logbooksSummary.approved / logbooksSummary.total) * 100, 100) : 0}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1e2230] text-[11px] text-slate-400">
                            <span>Pending Review</span>
                            <span className="font-mono text-amber-400 font-medium">{logbooksSummary.pending || 0} entries</span>
                        </div>
                    </div>

                    {/* Days Remaining */}
                    <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-4.5 hover:border-slate-700 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-semibold text-slate-300">Attachment Duration</span>
                                <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-400">
                                    <Clock className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-bold tracking-tight text-white">
                                    {dates.daysRemaining ?? 0}
                                </span>
                                <span className="text-xs text-slate-400">days left</span>
                            </div>
                            <div className="w-full bg-[#1e2230] h-1.5 rounded-full overflow-hidden mt-3">
                                <div
                                    className="h-full rounded-full bg-sky-500 transition-all duration-500"
                                    style={{ width: `${Math.min(dates.percentElapsed || 0, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1e2230] text-[11px] text-slate-400">
                            <span>Elapsed Period</span>
                            <span className="font-mono text-slate-200">{dates.percentElapsed || 0}% completed</span>
                        </div>
                    </div>

                    {/* Readiness Score */}
                    <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-4.5 hover:border-slate-700 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-semibold text-slate-300">Academic Readiness</span>
                                <div className="p-1.5 rounded-md bg-violet-500/10 text-violet-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-bold tracking-tight text-violet-400">
                                    {readiness.score ?? 0}%
                                </span>
                                <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                                    {readiness.ready ? 'Clearance Eligible' : 'In Progress'}
                                </span>
                            </div>
                            <div className="w-full bg-[#1e2230] h-1.5 rounded-full overflow-hidden mt-3">
                                <div
                                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                                    style={{ width: `${Math.min(readiness.score || 0, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1e2230] text-[11px] text-slate-400">
                            <span>Credit Clearance</span>
                            <span className="text-violet-300 font-medium">{readiness.ready ? 'Ready for Grading' : 'Criteria Pending'}</span>
                        </div>
                    </div>
                </div>

                {/* 4. Split Cockpit: QR Terminal & Supervisors (Left) vs Academic Rubric & Timeline (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* QR Attendance Verification Terminal */}
                        <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-5 flex flex-col items-center justify-between shadow-md">
                            <div className="text-center space-y-1 w-full">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-semibold">
                                    <QrCode size={12} className="text-violet-400" />
                                    Institutional Verification
                                </div>
                                <h3 className="text-sm font-bold text-white mt-1">Daily Attendance Terminal</h3>
                                <p className="text-[11px] text-slate-400">
                                    Present this dynamic token at the host facility or verify your portal session
                                </p>
                            </div>

                            {/* High-contrast QR Container */}
                            <div className="relative p-4 bg-white rounded-xl shadow-2xl border-4 border-[#22242f]">
                                <QRCodeSVG
                                    value={qrToken}
                                    size={164}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            {/* Token Expiry & Check-in Controller */}
                            <div className="w-full space-y-3">
                                <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-[#181a24] border border-[#22242f] text-[11px] text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Rotating secure token</span>
                                    </div>
                                    <span className="font-mono text-slate-300 font-semibold">{secondsLeft}s left</span>
                                </div>

                                {todayCheckedIn ? (
                                    <div className="w-full py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-center font-medium text-xs flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>Today's Check-In Confirmed</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={checkInLoading}
                                        variant="primary"
                                        className="w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>{checkInLoading ? 'Recording Attendance...' : 'Record Portal Check-In for Today'}</span>
                                    </Button>
                                )}

                                {checkInMsg && (
                                    <div className={`p-2.5 rounded-md text-xs font-medium text-center border ${
                                        checkInMsg.type === 'success'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                    }`}>
                                        {checkInMsg.text}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Supervisory Team Roster */}
                        <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-5 space-y-4 shadow-md">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-violet-400" />
                                    Assigned Supervisors
                                </h3>
                                <Link to="/student/messages" className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium">
                                    <Mail className="w-3 h-3" /> Messages
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {/* Industry Supervisor */}
                                <div className="p-3.5 rounded-lg bg-[#181a24] border border-[#22242f] hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                Industry Supervisor
                                            </span>
                                            <p className="text-white font-semibold text-xs mt-1.5">
                                                {student.industrySupervisor?.name || 'Allocation In Progress'}
                                            </p>
                                            <p className="text-slate-400 text-[11px] font-mono">
                                                {student.industrySupervisor?.email || 'Awaiting coordinator pairing'}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* University Faculty Lead */}
                                <div className="p-3.5 rounded-lg bg-[#181a24] border border-[#22242f] hover:border-violet-500/30 transition-all">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                                University Faculty Lead
                                            </span>
                                            <p className="text-white font-semibold text-xs mt-1.5">
                                                {student.universitySupervisor?.name || 'Allocation In Progress'}
                                            </p>
                                            <p className="text-slate-400 text-[11px] font-mono">
                                                {student.universitySupervisor?.email || 'Awaiting department assignment'}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                                            <GraduationCap className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* 8-Point Academic Completion Rubric Matrix */}
                        <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center justify-between pb-3.5 border-b border-[#1e2230]">
                                <div>
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-violet-400" />
                                        Academic Completion Rubric
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        8 authoritative criteria required for university attachment credit clearance
                                    </p>
                                </div>
                                <span className="font-mono text-xs font-bold text-violet-300 bg-violet-500/15 px-2.5 py-1 rounded-md border border-violet-500/30">
                                    {readiness.score ?? 0}% Cleared
                                </span>
                            </div>

                            <div className="space-y-2">
                                {[
                                    { label: 'Host Organization Placement Recorded & Approved', passed: readiness.checklist?.placementApproved },
                                    { label: 'Industry Workplace Supervisor Assigned', passed: readiness.checklist?.industrySupervisorAssigned },
                                    { label: 'University Academic Supervisor Assigned', passed: readiness.checklist?.universitySupervisorAssigned },
                                    { label: 'Institutional Attendance Verified (≥75% presence)', passed: readiness.checklist?.attendanceThresholdMet },
                                    { label: 'Weekly Logbook Submissions Reviewed & Signed', passed: readiness.checklist?.logbooksSubmittedAndReviewed },
                                    { label: 'Academic Supervision Site Visit Completed', passed: readiness.checklist?.supervisionCompleted },
                                    { label: 'Industry Supervisor Final Evaluation Submitted', passed: readiness.checklist?.industryAssessmentCompleted },
                                    { label: 'University Faculty Academic Assessment Graded', passed: readiness.checklist?.universityAssessmentCompleted }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-all ${
                                            item.passed
                                                ? 'bg-emerald-500/[0.04] border-emerald-500/25 text-emerald-300'
                                                : 'bg-[#181a24] border-[#22242f] text-slate-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                                item.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                                            }`}>
                                                {item.passed ? <Check className="w-3 h-3" /> : <span className="text-[9px] font-mono">{idx + 1}</span>}
                                            </div>
                                            <span className={`font-medium ${item.passed ? 'text-slate-200' : 'text-slate-400'}`}>
                                                {item.label}
                                            </span>
                                        </div>

                                        {item.passed ? (
                                            <span className="flex items-center gap-1 font-semibold text-emerald-400 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 font-medium bg-[#12141c] px-2 py-0.5 rounded border border-[#2a2e40]">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Outstanding Blockers if any */}
                            {readiness.blockers?.length > 0 && (
                                <div className="p-3.5 rounded-lg bg-rose-500/[0.08] border border-rose-500/20 space-y-1.5 text-xs">
                                    <p className="font-semibold text-rose-300 flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Outstanding Requirements for Clearance:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] pl-1">
                                        {readiness.blockers.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Lifecycle Attachment Progress Stepper */}
                        <div className="rounded-xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-violet-400" />
                                    Attachment Milestone Journey
                                </h3>
                                <span className="text-[11px] text-slate-400 font-mono">
                                    Academic Term 2026
                                </span>
                            </div>

                            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#22242f]">
                                {timeline.length > 0 ? (
                                    timeline.map((step, idx) => (
                                        <div key={idx} className="relative">
                                            <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                step.completed
                                                    ? 'bg-emerald-500 border-emerald-400 text-white'
                                                    : step.current
                                                    ? 'bg-violet-600 border-violet-400 ring-4 ring-violet-500/20 text-white'
                                                    : 'bg-[#12141c] border-slate-700'
                                            }`}>
                                                {step.completed && <Check className="w-2.5 h-2.5" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`text-xs font-semibold ${step.completed ? 'text-white' : step.current ? 'text-violet-300 font-bold' : 'text-slate-500'}`}>
                                                        {step.title}
                                                    </h4>
                                                    {step.current && (
                                                        <span className="text-[10px] font-bold bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded border border-violet-500/30">
                                                            Current Stage
                                                        </span>
                                                    )}
                                                </div>
                                                {step.date && (
                                                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                                        {new Date(step.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">Timeline will activate upon placement registration.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
