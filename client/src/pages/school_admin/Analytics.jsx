import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Download,
    RefreshCcw,
    PieChart,
    Activity,
    ShieldAlert,
    FileSpreadsheet,
    UserCheck,
    Database,
    ShieldCheck,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';
import { reportApi } from '../../utils/reportApi';
import { analyticsApi } from '../../utils/analyticsApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

const Analytics = () => {
    const [analyticsOverview, setAnalyticsOverview] = useState(null);
    const [interventionData, setInterventionData] = useState({ totalCount: 0, queue: [] });
    const [dataQualityData, setDataQualityData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, insights, data_quality, reports, supervisors
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [exportingType, setExportingType] = useState(null);

    // Report filters
    const [reportFilter, setReportFilter] = useState({
        search: '',
        status: '',
        department: '',
        dateFrom: '',
        dateTo: ''
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [overviewRes, queueRes, qualityRes] = await Promise.allSettled([
                analyticsApi.getOverview(),
                analyticsApi.getInterventionQueue(),
                analyticsApi.getDataQualityAudit()
            ]);

            if (overviewRes.status === 'fulfilled' && overviewRes.value?.success) {
                setAnalyticsOverview(overviewRes.value.data);
            }

            if (queueRes.status === 'fulfilled' && queueRes.value?.success) {
                setInterventionData(queueRes.value.data || { totalCount: 0, queue: [] });
            }

            if (qualityRes.status === 'fulfilled' && qualityRes.value?.success) {
                setDataQualityData(qualityRes.value.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics intelligence:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCSV = async (reportType, defaultName) => {
        try {
            setExportingType(reportType);
            await reportApi.downloadCSV(reportType, reportFilter, `${defaultName}-${Date.now()}.csv`);
        } catch (error) {
            console.error(`Failed to export ${reportType} CSV:`, error);
            alert(`Failed to export ${reportType} CSV`);
        } finally {
            setExportingType(null);
        }
    };

    const handleGeneratePDF = async () => {
        try {
            setGenerating(true);
            const response = await adminApi.downloadReport();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Institutional-Oversight-Report-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to generate PDF report:', error);
            alert('Failed to generate audit-ready PDF');
        } finally {
            setGenerating(false);
        }
    };

    const summary = analyticsOverview?.summary || {};
    const attendance = analyticsOverview?.attendance || {};
    const logbooks = analyticsOverview?.logbooks || {};
    const monthlyTrends = analyticsOverview?.monthlyTrends || [];

    if (loading) {
        return (
            <div className="space-y-4 p-6 sm:p-8 max-w-7xl mx-auto">
                <LoadingSkeleton className="h-10 w-72 rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <LoadingSkeleton key={i} className="h-24 rounded-md" />
                    ))}
                </div>
                <LoadingSkeleton className="h-80 rounded-md" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
            {/* Header Section */}
            <div className="craft-card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-300">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium mb-1">
                            Academic Analytics & Governance
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                            Institutional Analytics & Compliance
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Risk telemetry, cohort progression, data quality audits, and statutory reporting.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <Button
                        variant="secondary"
                        onClick={fetchAllData}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs py-2"
                    >
                        <RefreshCcw size={13} className={loading ? 'animate-spin' : ''} />
                        <span>Refresh</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleGeneratePDF}
                        disabled={generating}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs py-2"
                    >
                        <Download size={13} className={generating ? 'animate-bounce' : ''} />
                        <span>{generating ? 'Exporting...' : 'Export Audit PDF'}</span>
                    </Button>
                </div>
            </div>

            {/* Segmented Sliding Tabs */}
            <div className="segmented-tabs overflow-x-auto">
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'insights', label: `Intervention Queue (${interventionData.totalCount})`, icon: ShieldAlert },
                    { id: 'data_quality', label: `Data Quality (${dataQualityData?.integrityScore || 100}%)`, icon: Database },
                    { id: 'reports', label: 'Data Exports', icon: FileSpreadsheet },
                    { id: 'supervisors', label: 'Faculty Roster', icon: UserCheck }
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`segmented-tab-btn flex items-center gap-1.5 text-xs ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={13} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-5">
                    {/* Linear Metric Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="craft-card p-4">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-medium">Enrolled Cohort</span>
                                <Users className="w-3.5 h-3.5 text-violet-400" />
                            </div>
                            <div className="kpi-metric-value mt-2">{summary.totalStudents || 0}</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                                <span>Active Placements</span>
                                <span className="font-mono text-slate-300 font-medium">{summary.activePlacements || 0}</span>
                            </div>
                        </div>

                        <div className="craft-card p-4">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-medium">Cohort Attendance</span>
                                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                            </div>
                            <div className="kpi-metric-value text-sky-400 mt-2">{attendance.averageRate || 0}%</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                                <span>Total Check-Ins</span>
                                <span className="font-mono text-slate-300 font-medium">{attendance.totalRecords || 0}</span>
                            </div>
                        </div>

                        <div className="craft-card p-4">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-medium">Logbook Approval</span>
                                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <div className="kpi-metric-value text-emerald-400 mt-2">{logbooks.approvalRate || 0}%</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                                <span>Reviewed Entries</span>
                                <span className="font-mono text-emerald-400 font-medium">{logbooks.approved || 0} / {logbooks.total || 0}</span>
                            </div>
                        </div>

                        <div className="craft-card p-4">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-medium">Completion Rate</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div className="kpi-metric-value text-amber-400 mt-2">{summary.completionRate || 0}%</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                                <span>Finalized Placements</span>
                                <span className="font-mono text-amber-300 font-medium">{summary.completedPlacements || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Operational Risk Alert */}
                    {interventionData.totalCount > 0 && (
                        <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                    <AlertTriangle size={15} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-white">
                                        {interventionData.totalCount} Students Flagged for Academic Intervention
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Deterministic risk models flagged low attendance or assessment blockers.
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveTab('insights')}
                                className="text-[11px] text-amber-300 border-amber-500/20 hover:bg-amber-500/10 shrink-0 py-1 px-2.5"
                            >
                                <span>Inspect Queue</span>
                                <ArrowRight size={12} className="ml-1" />
                            </Button>
                        </div>
                    )}

                    {/* Historical Trend Timeline & Attendance Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Monthly Trends Table */}
                        <div className="lg:col-span-2">
                            <div className="craft-card p-5 space-y-3">
                                <div className="flex items-center justify-between pb-2.5 border-b border-[#22242f]">
                                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                                        <TrendingUp size={14} className="text-violet-400" />
                                        Monthly Activity Overview
                                    </h4>
                                    <span className="text-[10px] font-mono text-slate-500">Last 6 Months</span>
                                </div>
                                <div className="overflow-x-auto -mx-5">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#12141c] text-slate-400 font-medium border-b border-[#22242f]">
                                            <tr>
                                                <th className="py-2.5 px-5">Period</th>
                                                <th className="py-2.5 px-5">Placements</th>
                                                <th className="py-2.5 px-5">Logbooks</th>
                                                <th className="py-2.5 px-5">Graded Assessments</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#22242f]">
                                            {monthlyTrends.length > 0 ? (
                                                monthlyTrends.map((m, i) => (
                                                    <tr key={i} className="hover:bg-[#181a24] transition-colors">
                                                        <td className="py-2.5 px-5 font-medium text-white">{m.month}</td>
                                                        <td className="py-2.5 px-5 text-slate-300 font-mono">{m.placements}</td>
                                                        <td className="py-2.5 px-5 text-slate-300 font-mono">{m.logbooks}</td>
                                                        <td className="py-2.5 px-5 text-slate-300 font-mono">{m.assessments}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="py-6 text-center text-slate-500">
                                                        No historical records logged yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Attendance Compliance Distribution */}
                        <div className="craft-card p-5 space-y-4">
                            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide pb-2.5 border-b border-[#22242f] flex items-center gap-1.5">
                                <PieChart size={14} className="text-violet-400" />
                                Attendance Compliance
                            </h4>
                            <div className="space-y-3.5">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-emerald-400 font-normal">Compliant (≥ 75%)</span>
                                        <span className="text-white font-mono font-medium">{attendance.distribution?.compliant || 0} students</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#12141c] rounded-full overflow-hidden border border-[#22242f]">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.compliant || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-amber-400 font-normal">At Risk (60% - 74%)</span>
                                        <span className="text-white font-mono font-medium">{attendance.distribution?.atRisk || 0} students</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#12141c] rounded-full overflow-hidden border border-[#22242f]">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.atRisk || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-rose-400 font-normal">Critical (&lt; 60%)</span>
                                        <span className="text-white font-mono font-medium">{attendance.distribution?.critical || 0} students</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#12141c] rounded-full overflow-hidden border border-[#22242f]">
                                        <div
                                            className="h-full bg-rose-500 rounded-full"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.critical || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: INTERVENTION INSIGHTS & RISK QUEUE */}
            {activeTab === 'insights' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#12141c] border border-[#22242f]">
                        <div>
                            <h3 className="text-xs font-semibold text-white">Deterministic Academic Risk Triage</h3>
                            <p className="text-[11px] text-slate-400">Derived from verified attendance logs, weekly logbook velocity, and assessment milestones.</p>
                        </div>
                        <Badge variant="warning" dot={true}>
                            {interventionData.totalCount} Cases
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3.5">
                        {interventionData.queue.length > 0 ? (
                            interventionData.queue.map((item, idx) => (
                                <div key={idx} className="craft-card p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-xs font-semibold text-white">{item.name}</h4>
                                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                {item.admissionNumber} • {item.course || 'Attachment'}
                                            </p>
                                            <p className="text-[11px] text-slate-300 mt-1">Host: <span className="font-medium text-slate-200">{item.organizationName || 'Unassigned'}</span></p>
                                        </div>
                                        <Badge
                                            variant={item.riskLevel === 'CRITICAL' ? 'danger' : item.riskLevel === 'ELEVATED' ? 'warning' : 'indigo'}
                                            dot={true}
                                        >
                                            Risk: {item.riskScore}/100
                                        </Badge>
                                    </div>

                                    {item.topInsight && (
                                        <div className="p-2.5 bg-[#12141c] rounded-md border border-[#22242f] space-y-0.5">
                                            <span className="text-[10px] font-medium uppercase text-amber-400">Risk Indicator</span>
                                            <p className="text-[11px] text-slate-300 leading-normal">{item.topInsight.reason}</p>
                                        </div>
                                    )}

                                    <div className="pt-2.5 border-t border-[#22242f] flex items-center justify-between text-xs">
                                        <span className="text-slate-400 text-[11px]">Action: {item.recommendation}</span>
                                        <a
                                            href={`/admin/students`}
                                            className="text-xs font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1"
                                        >
                                            <span>Manage</span>
                                            <ArrowUpRight size={12} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 craft-card p-10 text-center space-y-1.5">
                                <CheckCircle2 className="mx-auto text-emerald-400 mb-1" size={28} />
                                <p className="text-xs font-semibold text-white">No elevated risk cases detected</p>
                                <p className="text-[11px] text-slate-400">All active students are meeting attendance and logbook requirements.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: DATA QUALITY AUDIT */}
            {activeTab === 'data_quality' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="craft-card p-4">
                            <span className="text-xs text-slate-400 font-medium">Integrity Score</span>
                            <div className="kpi-metric-value text-violet-400 mt-2">{dataQualityData?.integrityScore || 100}%</div>
                            <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                                {dataQualityData?.cleanRecords || 0} / {dataQualityData?.totalAudited || 0} intact
                            </div>
                        </div>
                        <div className="craft-card p-4">
                            <span className="text-xs text-slate-400 font-medium">Missing Attendance</span>
                            <div className="kpi-metric-value text-amber-400 mt-2">{dataQualityData?.issuesCount?.missingAttendance || 0}</div>
                            <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                                0 check-ins recorded
                            </div>
                        </div>
                        <div className="craft-card p-4">
                            <span className="text-xs text-slate-400 font-medium">Unassigned Mentors</span>
                            <div className="kpi-metric-value text-sky-400 mt-2">
                                {(dataQualityData?.issuesCount?.missingIndustrySupervisor || 0) + (dataQualityData?.issuesCount?.missingUniversitySupervisor || 0)}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                                Missing supervisor links
                            </div>
                        </div>
                        <div className="craft-card p-4">
                            <span className="text-xs text-slate-400 font-medium">Incomplete Dates</span>
                            <div className="kpi-metric-value text-rose-400 mt-2">{dataQualityData?.issuesCount?.missingDates || 0}</div>
                            <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                                Missing placement dates
                            </div>
                        </div>
                    </div>

                    <div className="craft-card p-5 space-y-3">
                        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 pb-2.5 border-b border-[#22242f]">
                            <ShieldCheck size={15} className="text-emerald-400" />
                            Data Quality Deficiencies
                        </h4>

                        <div className="space-y-2.5">
                            {dataQualityData?.issues?.missingAttendance?.length > 0 && (
                                <div className="p-3 bg-amber-500/5 rounded-md border border-amber-500/20 space-y-1.5">
                                    <span className="text-xs font-medium text-amber-300">Students with 0 Check-In Records</span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {dataQualityData.issues.missingAttendance.map((item, idx) => (
                                            <span key={idx} className="text-[11px] px-2 py-0.5 bg-[#12141c] rounded text-slate-300 border border-[#22242f]">
                                                {item.name} ({item.admissionNumber})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {dataQualityData?.issues?.missingIndustrySupervisor?.length > 0 && (
                                <div className="p-3 bg-violet-500/5 rounded-md border border-violet-500/20 space-y-1.5">
                                    <span className="text-xs font-medium text-violet-300">Missing Industry Supervisor Assignment</span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {dataQualityData.issues.missingIndustrySupervisor.map((item, idx) => (
                                            <span key={idx} className="text-[11px] px-2 py-0.5 bg-[#12141c] rounded text-slate-300 border border-[#22242f]">
                                                {item.name} ({item.admissionNumber})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {dataQualityData?.integrityScore === 100 && (
                                <div className="p-6 text-center text-slate-400 text-xs font-medium">
                                    All audited records satisfy complete schema and supervisor association integrity.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: CSV EXPORT CENTER */}
            {activeTab === 'reports' && (
                <div className="craft-card p-5 sm:p-6 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#22242f]">
                        <div>
                            <h3 className="text-sm font-semibold text-white">Institutional Data Exports</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Download formatted CSV datasets for institutional archiving or audit preparation.</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { id: 'placements', label: 'Placement Directory', desc: 'All placement records and approval statuses' },
                            { id: 'attendance', label: 'Attendance Logs', desc: 'Daily presence check-in logs and timestamps' },
                            { id: 'logbooks', label: 'Weekly Logbooks', desc: 'Student technical summaries and supervisor reviews' },
                            { id: 'assessments', label: 'Graded Assessments', desc: 'Industry and university evaluation scores' }
                        ].map((rep) => (
                            <div key={rep.id} className="p-4 bg-[#12141c] rounded-md border border-[#22242f] flex flex-col justify-between space-y-3">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-semibold text-white">{rep.label}</h4>
                                    <p className="text-[11px] text-slate-400 leading-normal">{rep.desc}</p>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => handleDownloadCSV(rep.id, rep.label)}
                                    disabled={exportingType === rep.id}
                                    className="w-full text-xs flex items-center justify-center gap-1.5 py-2"
                                >
                                    <Download size={12} />
                                    <span>{exportingType === rep.id ? 'Exporting...' : 'Export CSV'}</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 5: SUPERVISOR ALLOCATIONS */}
            {activeTab === 'supervisors' && (
                <div className="craft-card p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#22242f]">
                        <div>
                            <h3 className="text-sm font-semibold text-white">Faculty & Supervisor Roster</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {summary.totalSupervisors || 0} active faculty and industry mentors registered across current cohort placements.
                            </p>
                        </div>
                        <a href="/coordinator/supervisors" className="text-xs font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1">
                            <span>Open Rebalance Console</span>
                            <ArrowRight size={12} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
