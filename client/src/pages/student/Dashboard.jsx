import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    QrCode,
    TrendingUp,
    AlertTriangle,
    GraduationCap,
    Building2,
    UserCheck,
    Briefcase,
    ArrowRight,
    RefreshCw,
    ShieldCheck,
    Check,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { getStudentWorkspace, recordCheckIn } from '../../utils/studentApi';
import { Card, Badge, Button, LoadingSkeleton } from '../../components/ui';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [qrToken, setQrToken] = useState('');
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

    useEffect(() => {
        const generateToken = () => {
            const token = btoa(JSON.stringify({
                studentId: user?.id,
                schoolId: user?.schoolId,
                timestamp: Date.now(),
                expires: Date.now() + 60000
            }));
            setQrToken(token);
        };

        generateToken();
        const interval = setInterval(generateToken, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const handleCheckIn = async () => {
        setCheckInLoading(true);
        setCheckInMsg(null);
        try {
            const res = await recordCheckIn({ notes: 'Daily web portal check-in' });
            setCheckInMsg({ type: 'success', text: res.data?.message || 'Check-in recorded successfully for today!' });
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
                <div className="space-y-6 p-6">
                    <LoadingSkeleton className="h-28 rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LoadingSkeleton className="h-32 rounded-xl" />
                        <LoadingSkeleton className="h-32 rounded-xl" />
                        <LoadingSkeleton className="h-32 rounded-xl" />
                    </div>
                    <LoadingSkeleton className="h-96 rounded-2xl" />
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
        deadlines = [],
        timeline = [],
        logbooksSummary = {}
    } = workspaceData || {};

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCheckedIn = (student.attendance || []).some(a => a.date === todayStr);

    const getPlacementBadge = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'ACTIVE':
                return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{status}</Badge>;
            case 'PENDING_APPROVAL':
                return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">PENDING APPROVAL</Badge>;
            case 'REJECTED':
                return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20">REJECTED</Badge>;
            case 'COMPLETED':
                return <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20">COMPLETED</Badge>;
            default:
                return <Badge className="bg-slate-500/10 text-slate-400 border border-slate-500/20">DRAFT</Badge>;
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-8 p-6 max-w-7xl mx-auto pb-16">
                {/* Header Welcome Card */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900/60 to-slate-900/40 border border-blue-500/20 backdrop-blur-md">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl font-black text-blue-400">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    Welcome, {user?.name?.split(' ')[0]}!
                                </h1>
                                {getPlacementBadge(student.placementStatus)}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                {student.course || student.department || 'Academic Industrial Attachment'} • {student.organizationName || 'Placement Unset'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={loadWorkspace}
                        className="flex items-center gap-2 text-xs bg-slate-800/80 border-slate-700 hover:bg-slate-700"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh Workspace
                    </Button>
                </div>

                {/* Prioritized Action Queue: "What I need to do next" */}
                {actionQueue.length > 0 && (
                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Action Required ({actionQueue.length} items)
                            </h2>
                            <span className="text-xs text-slate-500">Immediate next steps</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {actionQueue.map(action => (
                                <div
                                    key={action.id}
                                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${action.priority === 'CRITICAL' ? 'bg-rose-500' : action.priority === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                            <h3 className="text-xs font-bold text-white">{action.title}</h3>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">{action.description}</p>
                                    </div>
                                    <Link to={action.link} className="shrink-0">
                                        <Button size="sm" className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                                            {action.actionText} <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Key Progress & Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance Rate</p>
                                <p className="text-3xl font-extrabold text-white mt-1">{attendance.rate ?? 0}%</p>
                                <p className="text-xs text-slate-500 mt-1">{attendance.presentCount || 0} / {attendance.totalRecords || 0} sessions verified</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Logbooks</p>
                                <p className="text-3xl font-extrabold text-emerald-400 mt-1">{logbooksSummary.approved || 0}</p>
                                <p className="text-xs text-slate-500 mt-1">{logbooksSummary.pending || 0} pending review • {logbooksSummary.rejected || 0} rejected</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Days Remaining</p>
                                <p className="text-3xl font-extrabold text-white mt-1">{dates.daysRemaining ?? 0}</p>
                                <p className="text-xs text-slate-500 mt-1">{dates.daysCompleted || 0} days elapsed ({dates.percentElapsed || 0}%)</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Readiness</p>
                                <p className="text-3xl font-extrabold text-teal-400 mt-1">{readiness.score ?? 0}%</p>
                                <p className="text-xs text-slate-500 mt-1">{readiness.ready ? 'Eligible for Completion' : `${readiness.blockers?.length || 0} criteria pending`}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content: Daily Check-In & Academic Completion Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Daily QR Verification & Check-in */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="p-6 sm:p-8 border border-slate-800 bg-slate-900/80 rounded-3xl flex flex-col items-center justify-between space-y-6">
                            <div className="text-center space-y-1">
                                <h3 className="text-base font-bold text-white uppercase tracking-wider">Daily Attendance Verification</h3>
                                <p className="text-xs text-slate-500">Scan at workplace or log daily portal check-in</p>
                            </div>

                            <div className="p-6 bg-white rounded-3xl shadow-xl">
                                <QRCodeSVG
                                    value={qrToken}
                                    size={190}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex items-center justify-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span>QR token rotating every 30s</span>
                                </div>

                                {todayCheckedIn ? (
                                    <div className="w-full py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-xs flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Attendance Logged For Today</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={checkInLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>{checkInLoading ? 'Recording...' : 'Instant Check-In Today'}</span>
                                    </Button>
                                )}

                                {checkInMsg && (
                                    <p className={`text-xs text-center font-semibold ${checkInMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {checkInMsg.text}
                                    </p>
                                )}
                            </div>
                        </Card>

                        {/* Assigned Supervisors Card */}
                        <Card className="p-6 border border-slate-800 bg-slate-900/60 rounded-3xl space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Supervisory Team</h3>
                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase">Industry Supervisor</p>
                                        <p className="text-white font-bold text-sm mt-0.5">{student.industrySupervisor?.name || 'Pending Assignment'}</p>
                                        <p className="text-slate-400 text-[11px]">{student.industrySupervisor?.email || '—'}</p>
                                    </div>
                                    <Briefcase className="w-5 h-5 text-emerald-400 opacity-80" />
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase">University Supervisor</p>
                                        <p className="text-white font-bold text-sm mt-0.5">{student.universitySupervisor?.name || 'Pending Assignment'}</p>
                                        <p className="text-slate-400 text-[11px]">{student.universitySupervisor?.email || '—'}</p>
                                    </div>
                                    <GraduationCap className="w-5 h-5 text-purple-400 opacity-80" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Academic Milestones Checklist & Timeline */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Milestone Completion Checklist */}
                        <Card className="p-6 sm:p-8 border border-slate-800 bg-slate-900/80 rounded-3xl space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-teal-400" />
                                        Academic Completion Requirements
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Authoritative criteria required for attachment credit sign-off</p>
                                </div>
                                <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                                    {readiness.score}% Complete
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                {[
                                    { label: 'Approved Placement & Organization Record', passed: readiness.checklist?.placementApproved },
                                    { label: 'Industry Supervisor Allocation', passed: readiness.checklist?.industrySupervisorAssigned },
                                    { label: 'University Faculty Supervisor Allocation', passed: readiness.checklist?.universitySupervisorAssigned },
                                    { label: 'Attendance Compliance (≥75% verified presence)', passed: readiness.checklist?.attendanceThresholdMet },
                                    { label: 'Approved Weekly Logbook Submissions', passed: readiness.checklist?.logbooksSubmittedAndReviewed },
                                    { label: 'Supervision Site Visit Conducted & Verified', passed: readiness.checklist?.supervisionCompleted },
                                    { label: 'Final Industry Supervisor Evaluation Graded', passed: readiness.checklist?.industryAssessmentCompleted },
                                    { label: 'Final University Academic Evaluation Graded', passed: readiness.checklist?.universityAssessmentCompleted }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                            item.passed
                                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                                                : 'bg-slate-800/40 border-slate-800 text-slate-400'
                                        }`}
                                    >
                                        <span className="font-medium">{item.label}</span>
                                        {item.passed ? (
                                            <span className="flex items-center gap-1 font-bold text-emerald-400">
                                                <Check className="w-4 h-4" /> Verified
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-amber-500/90 font-semibold">Pending</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {readiness.blockers?.length > 0 && (
                                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1 text-xs">
                                    <p className="font-bold text-rose-400 flex items-center gap-1.5">
                                        <AlertCircle className="w-4 h-4" /> Outstanding Completion Blockers:
                                    </p>
                                    <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                                        {readiness.blockers.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Card>

                        {/* Chronological Lifecycle Timeline */}
                        <Card className="p-6 sm:p-8 border border-slate-800 bg-slate-900/80 rounded-3xl space-y-5">
                            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Attachment Lifecycle Journey
                            </h3>

                            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                                {timeline.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 ${
                                            step.completed
                                                ? 'bg-emerald-500 border-emerald-400'
                                                : step.current
                                                ? 'bg-blue-500 border-blue-400 animate-pulse'
                                                : 'bg-slate-900 border-slate-700'
                                        }`} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-xs font-bold ${step.completed ? 'text-white' : step.current ? 'text-blue-400' : 'text-slate-500'}`}>
                                                    {step.title}
                                                </h4>
                                                {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                            </div>
                                            {step.date && (
                                                <p className="text-[10px] text-slate-500 mt-0.5">
                                                    {new Date(step.date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
