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
    Layers,
    QrCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { getStudentWorkspace, recordCheckIn } from '../../utils/studentApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

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
                <div className="space-y-4 p-6 sm:p-8 max-w-7xl mx-auto">
                    <LoadingSkeleton className="h-24 rounded-lg" />
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
                return <Badge variant="success" dot={true}>Active Placement</Badge>;
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
            <div className="space-y-5 p-6 sm:p-8 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner - Linear/Figma Card */}
                <div className="craft-card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-lg font-semibold text-violet-300">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                                    {user?.name}
                                </h1>
                                {getPlacementBadge(student.placementStatus)}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                <span>{student.course || student.department || 'Undergraduate Internship'}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-violet-400 font-medium">{student.organizationName || 'No Organization Placed'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                        <Button
                            variant="secondary"
                            onClick={loadWorkspace}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs py-2"
                        >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                            <span>Refresh</span>
                        </Button>
                        <Link to="/student/logbook" className="flex-1 md:flex-none">
                            <Button variant="primary" className="w-full flex items-center justify-center gap-1.5 text-xs py-2">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Logbook</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Prioritized Action Queue */}
                {actionQueue.length > 0 && (
                    <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-3 h-3" />
                                </div>
                                <h2 className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                                    Action Required ({actionQueue.length})
                                </h2>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">Immediate items</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {actionQueue.map(action => (
                                <div
                                    key={action.id}
                                    className="p-3 rounded-md bg-[#12141c] border border-[#22242f] flex items-start justify-between gap-3 hover:border-slate-600 transition-all"
                                >
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${action.priority === 'CRITICAL' ? 'bg-rose-500' : action.priority === 'HIGH' ? 'bg-amber-500' : 'bg-violet-500'}`} />
                                            <h3 className="text-xs font-medium text-slate-200">{action.title}</h3>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-normal">{action.description}</p>
                                    </div>
                                    <Link to={action.link} className="shrink-0">
                                        <Button size="sm" variant="outline" className="text-[11px] text-amber-400 border-amber-500/20 hover:bg-amber-500/10 py-1 px-2.5">
                                            <span>{action.actionText}</span>
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Linear Style KPI Metric Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Attendance Rate</span>
                            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="kpi-metric-value mt-2">{attendance.rate ?? 0}%</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Presence count</span>
                            <span className="font-mono text-slate-300">{attendance.presentCount || 0} / {attendance.totalRecords || 0}</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Approved Logbooks</span>
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="kpi-metric-value text-emerald-400 mt-2">{logbooksSummary.approved || 0}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Pending review</span>
                            <span className="font-mono text-amber-400">{logbooksSummary.pending || 0} entries</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Days Remaining</span>
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                        <div className="kpi-metric-value mt-2">{dates.daysRemaining ?? 0} <span className="text-xs font-normal text-slate-400">days</span></div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Elapsed</span>
                            <span className="font-mono text-slate-300">{dates.percentElapsed || 0}%</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Readiness Score</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="kpi-metric-value text-violet-400 mt-2">{readiness.score ?? 0}%</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Status</span>
                            <span className="text-violet-300 font-medium">{readiness.ready ? 'Eligible' : 'In Progress'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left Column: QR Attendance & Supervisors */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="craft-card p-5 flex flex-col items-center justify-between space-y-5">
                            <div className="text-center space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium">
                                    <QrCode size={12} className="text-violet-400" />
                                    Daily Verification
                                </div>
                                <h3 className="text-sm font-semibold text-white">QR Attendance Check-In</h3>
                                <p className="text-[11px] text-slate-400">Scan at institutional kiosk or record daily portal session</p>
                            </div>

                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <QRCodeSVG
                                    value={qrToken}
                                    size={160}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>

                            <div className="w-full space-y-2.5">
                                <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-[11px]">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                    <span>Token auto-rotates every 30 seconds</span>
                                </div>

                                {todayCheckedIn ? (
                                    <div className="w-full py-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center font-medium text-xs flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span>Today's Check-In Verified</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={checkInLoading}
                                        variant="primary"
                                        className="w-full py-2.5 rounded-md text-xs flex items-center justify-center gap-2"
                                    >
                                        <UserCheck className="w-3.5 h-3.5" />
                                        <span>{checkInLoading ? 'Recording Session...' : 'Record Check-In Today'}</span>
                                    </Button>
                                )}

                                {checkInMsg && (
                                    <p className={`text-xs text-center font-medium ${checkInMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {checkInMsg.text}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Supervisory Team Card */}
                        <div className="craft-card p-4 space-y-3">
                            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Assigned Supervisors</h3>
                            <div className="space-y-2">
                                <div className="p-3 rounded-md bg-[#12141c] border border-[#22242f] flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400">Industry Supervisor</span>
                                        <p className="text-white font-medium text-xs mt-0.5">{student.industrySupervisor?.name || 'Pending Assignment'}</p>
                                        <p className="text-slate-500 text-[11px]">{student.industrySupervisor?.email || '—'}</p>
                                    </div>
                                    <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Briefcase className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                <div className="p-3 rounded-md bg-[#12141c] border border-[#22242f] flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-violet-400">University Faculty Lead</span>
                                        <p className="text-white font-medium text-xs mt-0.5">{student.universitySupervisor?.name || 'Pending Assignment'}</p>
                                        <p className="text-slate-500 text-[11px]">{student.universitySupervisor?.email || '—'}</p>
                                    </div>
                                    <div className="w-7 h-7 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                        <GraduationCap className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Academic Milestones & Timeline */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Milestone Completion Rubric */}
                        <div className="craft-card p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#22242f]">
                                <div>
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-violet-400" />
                                        Academic Completion Rubric
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Authoritative criteria required for university attachment credit</p>
                                </div>
                                <span className="font-mono text-xs font-medium text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded-md border border-violet-500/20">
                                    {readiness.score}% Done
                                </span>
                            </div>

                            <div className="space-y-1.5">
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
                                        className={`p-2.5 rounded-md border flex items-center justify-between text-xs transition-all ${
                                            item.passed
                                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                                                : 'bg-[#12141c] border-[#22242f] text-slate-400'
                                        }`}
                                    >
                                        <span className="font-normal">{item.label}</span>
                                        {item.passed ? (
                                            <span className="flex items-center gap-1 font-medium text-emerald-400 text-[11px]">
                                                <Check className="w-3.5 h-3.5" /> Verified
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-slate-500 font-medium bg-[#181a24] px-2 py-0.5 rounded border border-[#22242f]">Pending</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {readiness.blockers?.length > 0 && (
                                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 space-y-1 text-xs">
                                    <p className="font-medium text-rose-300 flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Outstanding Requirements:
                                    </p>
                                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px] pt-1">
                                        {readiness.blockers.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Lifecycle Journey */}
                        <div className="craft-card p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-3 border-b border-[#22242f]">
                                <Calendar className="w-4 h-4 text-violet-400" />
                                Attachment Progress Timeline
                            </h3>

                            <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-[#22242f]">
                                {timeline.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full border ${
                                            step.completed
                                                ? 'bg-emerald-500 border-emerald-400'
                                                : step.current
                                                ? 'bg-violet-500 border-violet-400 ring-2 ring-violet-500/20'
                                                : 'bg-[#12141c] border-slate-700'
                                        }`} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-xs font-medium ${step.completed ? 'text-white' : step.current ? 'text-violet-400' : 'text-slate-500'}`}>
                                                    {step.title}
                                                </h4>
                                                {step.completed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
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
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
