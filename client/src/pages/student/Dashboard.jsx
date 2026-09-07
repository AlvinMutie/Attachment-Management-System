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
    Sparkles,
    UserCheck
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
                <div className="space-y-6 p-6 sm:p-8 max-w-7xl mx-auto">
                    <LoadingSkeleton className="h-28 rounded-2xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <LoadingSkeleton className="h-28 rounded-xl" />
                        <LoadingSkeleton className="h-28 rounded-xl" />
                        <LoadingSkeleton className="h-28 rounded-xl" />
                        <LoadingSkeleton className="h-28 rounded-xl" />
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
        timeline = [],
        logbooksSummary = {}
    } = workspaceData || {};

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCheckedIn = (student.attendance || []).some(a => a.date === todayStr);

    const getPlacementBadge = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'ACTIVE':
                return <Badge variant="success" dot={true}>Active Attachment</Badge>;
            case 'PENDING_APPROVAL':
                return <Badge variant="warning" dot={true}>Pending Approval</Badge>;
            case 'REJECTED':
                return <Badge variant="danger" dot={true}>Rejected</Badge>;
            case 'COMPLETED':
                return <Badge variant="indigo" dot={true}>Completed</Badge>;
            default:
                return <Badge variant="default" dot={true}>Draft Profile</Badge>;
        }
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-7 p-6 sm:p-8 max-w-7xl mx-auto pb-16">
                {/* Header Welcome Bento Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-[#101626] border border-[#1f293d] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 border border-white/20 flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-lg shadow-indigo-500/20">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                                    {user?.name}
                                </h1>
                                {getPlacementBadge(student.placementStatus)}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
                                <span>{student.course || student.department || 'Undergraduate Attachment'}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-indigo-400 font-medium">{student.organizationName || 'No Organization Placed'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                        <Button
                            variant="secondary"
                            onClick={loadWorkspace}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs"
                        >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Refresh Sync</span>
                        </Button>
                        <Link to="/student/logbook" className="flex-1 md:flex-none">
                            <Button variant="primary" className="w-full flex items-center justify-center gap-2 text-xs">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Open Logbook</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Prioritized Action Queue */}
                {actionQueue.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                                <h2 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
                                    Action Required ({actionQueue.length} items)
                                </h2>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">Immediate attention</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {actionQueue.map(action => (
                                <div
                                    key={action.id}
                                    className="p-4 rounded-xl bg-[#0c101d] border border-[#1f293d] flex items-start justify-between gap-3 hover:border-slate-600 transition-all"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${action.priority === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : action.priority === 'HIGH' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                                            <h3 className="text-xs font-bold text-slate-200">{action.title}</h3>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
                                    </div>
                                    <Link to={action.link} className="shrink-0">
                                        <Button size="sm" variant="outline" className="text-xs text-amber-400 border-amber-500/30 hover:bg-amber-500/10">
                                            <span>{action.actionText}</span>
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stripe-Grade Metric Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <div className="kpi-metric-tile">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400">Attendance Rate</span>
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="kpi-metric-value mt-2">{attendance.rate ?? 0}%</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                            <span>Verified Presence</span>
                            <span className="font-mono text-slate-300 font-semibold">{attendance.presentCount || 0} / {attendance.totalRecords || 0}</span>
                        </div>
                    </div>

                    <div className="kpi-metric-tile">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400">Approved Logbooks</span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <FileText className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="kpi-metric-value text-emerald-400 mt-2">{logbooksSummary.approved || 0}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                            <span>Pending Review</span>
                            <span className="font-mono text-amber-400 font-semibold">{logbooksSummary.pending || 0} entries</span>
                        </div>
                    </div>

                    <div className="kpi-metric-tile">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400">Days Remaining</span>
                            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="kpi-metric-value mt-2">{dates.daysRemaining ?? 0} <span className="text-sm font-normal text-slate-400">days</span></div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                            <span>Elapsed Time</span>
                            <span className="font-mono text-slate-300 font-semibold">{dates.percentElapsed || 0}%</span>
                        </div>
                    </div>

                    <div className="kpi-metric-tile">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400">Readiness Score</span>
                            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="kpi-metric-value text-teal-400 mt-2">{readiness.score ?? 0}%</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                            <span>Status</span>
                            <span className="font-semibold text-teal-300">{readiness.ready ? 'Eligible' : 'In Progress'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Bento Grid: Daily Check-In & Academic Completion Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                    {/* Left Column: QR Attendance & Assigned Team */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card variant="stripe" className="p-6 sm:p-7 flex flex-col items-center justify-between space-y-6">
                            <div className="text-center space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                                    <Sparkles size={11} className="text-indigo-400" />
                                    Daily Verification
                                </div>
                                <h3 className="text-base font-extrabold text-white tracking-tight">On-Site QR Attendance</h3>
                                <p className="text-xs text-slate-400">Scan at institutional reader or log daily portal check-in</p>
                            </div>

                            <div className="p-5 bg-white rounded-2xl shadow-xl ring-4 ring-indigo-500/10">
                                <QRCodeSVG
                                    value={qrToken}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex items-center justify-center space-x-2 text-slate-400 text-[11px] font-semibold">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span>Token rotating every 30 seconds</span>
                                </div>

                                {todayCheckedIn ? (
                                    <div className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>Today's Check-In Verified</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={checkInLoading}
                                        variant="primary"
                                        className="w-full py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>{checkInLoading ? 'Recording Session...' : 'Instant Check-In Today'}</span>
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
                        <Card variant="stripe" className="p-6 space-y-4">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Supervisory Team</h3>
                            <div className="space-y-3">
                                <div className="p-3.5 rounded-xl bg-[#0c101d] border border-[#1f293d] flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Industry Supervisor</span>
                                        <p className="text-white font-bold text-xs sm:text-sm mt-0.5">{student.industrySupervisor?.name || 'Pending Assignment'}</p>
                                        <p className="text-slate-400 text-xs">{student.industrySupervisor?.email || '—'}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-[#0c101d] border border-[#1f293d] flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">University Faculty Lead</span>
                                        <p className="text-white font-bold text-xs sm:text-sm mt-0.5">{student.universitySupervisor?.name || 'Pending Assignment'}</p>
                                        <p className="text-slate-400 text-xs">{student.universitySupervisor?.email || '—'}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                        <GraduationCap className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Academic Milestones Checklist & Timeline */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Milestone Completion Checklist */}
                        <Card variant="stripe" className="p-6 sm:p-7 space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-[#1f293d]">
                                <div>
                                    <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                                        Academic Completion Rubric
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Authoritative criteria required for university attachment credit</p>
                                </div>
                                <span className="font-mono text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/25">
                                    {readiness.score}% Complete
                                </span>
                            </div>

                            <div className="space-y-2">
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
                                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                            item.passed
                                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                                                : 'bg-[#0c101d] border-[#1f293d] text-slate-400'
                                        }`}
                                    >
                                        <span className="font-medium">{item.label}</span>
                                        {item.passed ? (
                                            <span className="flex items-center gap-1 font-bold text-emerald-400 text-[11px]">
                                                <Check className="w-3.5 h-3.5" /> Verified
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Pending</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {readiness.blockers?.length > 0 && (
                                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1 text-xs">
                                    <p className="font-bold text-rose-300 flex items-center gap-1.5">
                                        <AlertCircle className="w-4 h-4 text-rose-400" /> Outstanding Completion Blockers:
                                    </p>
                                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px] pt-1">
                                        {readiness.blockers.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Card>

                        {/* Chronological Lifecycle Timeline */}
                        <Card variant="stripe" className="p-6 sm:p-7 space-y-5">
                            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 pb-4 border-b border-[#1f293d]">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                                Attachment Lifecycle Journey
                            </h3>

                            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1f293d]">
                                {timeline.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 ${
                                            step.completed
                                                ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/50'
                                                : step.current
                                                ? 'bg-indigo-500 border-indigo-400 ring-2 ring-indigo-500/30 animate-pulse'
                                                : 'bg-[#0c101d] border-slate-700'
                                        }`} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-xs font-bold ${step.completed ? 'text-white' : step.current ? 'text-indigo-400' : 'text-slate-500'}`}>
                                                    {step.title}
                                                </h4>
                                                {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                            </div>
                                            {step.date && (
                                                <p className="text-[10px] text-slate-400 mt-0.5">
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
