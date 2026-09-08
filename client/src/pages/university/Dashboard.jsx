import React, { useState, useEffect } from 'react';
import {
    Users,
    ClipboardCheck,
    TrendingUp,
    GraduationCap,
    AlertTriangle,
    ShieldAlert,
    ArrowUpRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getUniversityWorkspace, getMyStudents, getUniversityAssessments } from '../../utils/universityApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

const UniversitySupervisorDashboard = () => {
    const [workspace, setWorkspace] = useState(null);
    const [students, setStudents] = useState([]);
    const [actionQueue, setActionQueue] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const wsRes = await getUniversityWorkspace().catch(() => null);
                if (wsRes && wsRes.data?.data) {
                    const data = wsRes.data.data;
                    setWorkspace(data);
                    setStudents(data.students || []);
                    setActionQueue(data.actionQueue || []);
                } else {
                    const [studRes, assRes] = await Promise.all([
                        getMyStudents().catch(() => ({ data: { data: [] } })),
                        getUniversityAssessments().catch(() => ({ data: { data: [] } }))
                    ]);
                    setStudents(studRes.data?.data || []);
                    setAssessments(assRes.data?.data || []);
                }
            } catch (err) {
                console.error('Failed to load academic dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <DashboardLayout role="university_supervisor">
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

    const totalStudents = workspace?.metrics?.totalAssigned ?? students.length;
    const activePlacements = workspace?.metrics?.activePlacements ?? students.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus)).length;
    const totalAssessments = workspace?.metrics?.completedAssessments ?? assessments.length;
    const atRiskCount = workspace?.metrics?.atRiskCount ?? 0;

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-5 p-6 sm:p-8 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="craft-card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-300">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium mb-1">
                                Faculty Assessment & Oversight
                            </div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                                University Supervisor Workspace
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Academic grading, supervision site visit records, and mentee cohort monitoring.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a href="/university/assessments">
                            <Button variant="primary" className="text-xs py-2 px-3.5 flex items-center gap-1.5">
                                <ClipboardCheck size={14} />
                                <span>Record Assessment</span>
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Academic Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Assigned Mentees</span>
                            <Users className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="kpi-metric-value mt-2">{totalStudents}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Faculty cohort</span>
                            <span className="font-mono text-slate-300">{totalStudents} students</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Active Placements</span>
                            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="kpi-metric-value text-emerald-400 mt-2">{activePlacements}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>In-progress attachments</span>
                            <span className="font-mono text-emerald-400">{activePlacements} active</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Evaluations Graded</span>
                            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                        <div className="kpi-metric-value text-sky-400 mt-2">{totalAssessments}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Submitted reports</span>
                            <span className="font-mono text-sky-300">{totalAssessments} graded</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Academic Deficiencies</span>
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        </div>
                        <div className="kpi-metric-value text-rose-400 mt-2">{atRiskCount}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Require intervention</span>
                            <span className="font-mono text-rose-300">{atRiskCount} flagged</span>
                        </div>
                    </div>
                </div>

                {/* Academic Action Queue */}
                {actionQueue.length > 0 && (
                    <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <AlertTriangle className="w-3 h-3" />
                                </div>
                                <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                                    Supervision Action Queue ({actionQueue.length})
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
                                        href={item.actionUrl || '/university/assessments'}
                                        className="shrink-0"
                                    >
                                        <Button size="sm" variant="outline" className="text-[11px] py-1 px-2.5">
                                            <span>Action</span>
                                            <ArrowUpRight size={11} className="ml-1" />
                                        </Button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Table: Supervised Student Cohort */}
                <div className="craft-card p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#22242f]">
                        <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Supervised Student Cohort</h3>
                        <a href="/university/assessments" className="text-violet-400 text-xs font-medium hover:underline">
                            Academic Assessments →
                        </a>
                    </div>
                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#12141c] text-slate-400 font-medium border-b border-[#22242f]">
                                <tr>
                                    <th className="py-2.5 px-5">Student</th>
                                    <th className="py-2.5 px-5">Host Organization</th>
                                    <th className="py-2.5 px-5">Attendance</th>
                                    <th className="py-2.5 px-5">Logbooks</th>
                                    <th className="py-2.5 px-5 text-right">Academic Standing</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#22242f]">
                                {students.length > 0 ? (
                                    students.map((s) => (
                                        <tr key={s.id} className="hover:bg-[#181a24] transition-colors">
                                            <td className="py-2.5 px-5">
                                                <div>
                                                    <p className="font-medium text-white">{s.user?.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{s.admissionNumber} • {s.course || s.department}</p>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-5 text-slate-300">
                                                {s.organizationName || 'Unassigned'}
                                            </td>
                                            <td className="py-2.5 px-5 text-slate-300">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono">{s.attendanceRate !== undefined ? `${s.attendanceRate}%` : `${s.attendance?.length || 0} days`}</span>
                                                    {s.complianceStatus?.status === 'CRITICAL' && (
                                                        <Badge variant="danger" size="sm">Critical</Badge>
                                                    )}
                                                    {s.complianceStatus?.status === 'AT_RISK' && (
                                                        <Badge variant="warning" size="sm">At Risk</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-5 text-slate-300 font-mono">
                                                {s.logbooksCount !== undefined ? `${s.logbooksCount} entries` : `${s.logbooks?.length || 0} entries`}
                                            </td>
                                            <td className="py-2.5 px-5 text-right">
                                                <Badge
                                                    variant={s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE' ? 'success' : 'warning'}
                                                    size="sm"
                                                >
                                                    {s.placementStatus || 'DRAFT'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-slate-500 text-xs">
                                            No students currently allocated to your academic supervision.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UniversitySupervisorDashboard;
