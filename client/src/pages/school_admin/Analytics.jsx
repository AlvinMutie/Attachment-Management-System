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
    Sparkles,
    Database,
    ShieldCheck,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';
import { reportApi } from '../../utils/reportApi';
import { analyticsApi } from '../../utils/analyticsApi';
import { Card, Badge, Button, LoadingSkeleton } from '../../components/ui';

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
            <div className="space-y-6 p-6 sm:p-8 max-w-7xl mx-auto">
                <LoadingSkeleton className="h-14 w-80 rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => (
                        <LoadingSkeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
                <LoadingSkeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-7 max-w-7xl mx-auto pb-16 font-sans">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-[#101626] border border-[#1f293d] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-3xl pointer-events-none" />

                <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 border border-white/20 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                        <Activity size={28} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold mb-1">
                            <Sparkles size={11} className="text-indigo-400" />
                            Audited Executive Telemetry
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                            Institutional Analytics & Compliance
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            Real-time risk scoring, cohort telemetry, data quality auditing, and regulatory reports.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                    <Button
                        variant="secondary"
                        onClick={fetchAllData}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs"
                    >
                        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                        <span>Refresh Data</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleGeneratePDF}
                        disabled={generating}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs"
                    >
                        <Download size={14} className={generating ? 'animate-bounce' : ''} />
                        <span>{generating ? 'Exporting PDF...' : 'Audit PDF'}</span>
                    </Button>
                </div>
            </div>

            {/* Attio-Style Segmented Sliding Tabs */}
            <div className="segmented-tabs overflow-x-auto">
                {[
                    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
                    { id: 'insights', label: `Intervention Queue (${interventionData.totalCount})`, icon: ShieldAlert },
                    { id: 'data_quality', label: `Data Quality (${dataQualityData?.integrityScore || 100}%)`, icon: Database },
                    { id: 'reports', label: 'CSV Export Center', icon: FileSpreadsheet },
                    { id: 'supervisors', label: 'Supervisor Allocations', icon: UserCheck }
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`segmented-tab-btn flex items-center gap-2 ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={14} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-7">
                    {/* Stripe-Grade Metric Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        <div className="kpi-metric-tile">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400">Enrolled Cohort</span>
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="kpi-metric-value mt-2">{summary.totalStudents || 0}</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                                <span>Active Placements</span>
                                <span className="font-mono text-slate-300 font-semibold">{summary.activePlacements || 0}</span>
                            </div>
                        </div>

                        <div className="kpi-metric-tile">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400">Cohort Attendance</span>
                                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="kpi-metric-value text-purple-400 mt-2">{attendance.averageRate || 0}%</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                                <span>Total Check-Ins</span>
                                <span className="font-mono text-slate-300 font-semibold">{attendance.totalRecords || 0}</span>
                            </div>
                        </div>

                        <div className="kpi-metric-tile">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400">Logbook Approval</span>
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="kpi-metric-value text-emerald-400 mt-2">{logbooks.approvalRate || 0}%</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                                <span>Reviewed Entries</span>
                                <span className="font-mono text-emerald-400 font-semibold">{logbooks.approved || 0} / {logbooks.total || 0}</span>
                            </div>
                        </div>

                        <div className="kpi-metric-tile">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400">Completion Rate</span>
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="kpi-metric-value text-amber-400 mt-2">{summary.completionRate || 0}%</div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1f293d]/50 text-xs text-slate-400">
                                <span>Finalized Attachments</span>
                                <span className="font-mono text-amber-300 font-semibold">{summary.completedPlacements || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Operational Risk Teaser Banner */}
                    {interventionData.totalCount > 0 && (
                        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                    <AlertTriangle size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-white">
                                        {interventionData.totalCount} Students Require Academic Oversight Intervention
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Deterministic risk models flagged elevated attendance or assessment blockers.
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveTab('insights')}
                                className="text-xs text-amber-300 border-amber-500/30 hover:bg-amber-500/10 shrink-0"
                            >
                                <span>Inspect Queue</span>
                                <ArrowRight size={13} className="ml-1" />
                            </Button>
                        </div>
                    )}

                    {/* Historical Trend Timeline & Attendance Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                        {/* Monthly Trends Table */}
                        <div className="lg:col-span-2">
                            <Card variant="stripe" className="p-6 space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-[#1f293d]">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <TrendingUp size={15} className="text-indigo-400" />
                                        Monthly Activity Telemetry
                                    </h4>
                                    <span className="text-[10px] font-mono text-slate-400">Last 6 Months</span>
                                </div>
                                <div className="overflow-x-auto -mx-6">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#0c101d] text-slate-400 font-semibold border-b border-[#1f293d]">
                                            <tr>
                                                <th className="py-3 px-6">Period</th>
                                                <th className="py-3 px-6">Placements</th>
                                                <th className="py-3 px-6">Logbooks Logged</th>
                                                <th className="py-3 px-6">Assessments Graded</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#1f293d]">
                                            {monthlyTrends.length > 0 ? (
                                                monthlyTrends.map((m, i) => (
                                                    <tr key={i} className="hover:bg-[#162035]/50 transition-colors">
                                                        <td className="py-3 px-6 font-bold text-white">{m.month}</td>
                                                        <td className="py-3 px-6 text-slate-300 font-mono">{m.placements}</td>
                                                        <td className="py-3 px-6 text-slate-300 font-mono">{m.logbooks}</td>
                                                        <td className="py-3 px-6 text-slate-300 font-mono">{m.assessments}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="py-6 text-center text-slate-500 font-medium">
                                                        No historical records logged yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>

                        {/* Attendance Compliance Distribution */}
                        <Card variant="stripe" className="p-6 space-y-5">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-3 border-b border-[#1f293d] flex items-center gap-2">
                                <PieChart size={15} className="text-indigo-400" />
                                Attendance Compliance
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-emerald-400">Compliant (≥ 75%)</span>
                                        <span className="text-white font-mono">{attendance.distribution?.compliant || 0} students</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#080c14] rounded-full overflow-hidden border border-[#1f293d]">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.compliant || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-amber-400">At Risk (60% - 74%)</span>
                                        <span className="text-white font-mono">{attendance.distribution?.atRisk || 0} students</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#080c14] rounded-full overflow-hidden border border-[#1f293d]">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.atRisk || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-rose-400">Critical (&lt; 60% / Inactive)</span>
                                        <span className="text-white font-mono">{attendance.distribution?.critical || 0} students</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#080c14] rounded-full overflow-hidden border border-[#1f293d]">
                                        <div
                                            className="h-full bg-rose-500 rounded-full"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.critical || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB 2: INTERVENTION INSIGHTS & RISK QUEUE */}
            {activeTab === 'insights' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#101626] border border-[#1f293d]">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-indigo-400" size={18} />
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold text-white">Deterministic Academic Risk Ranking</h3>
                                <p className="text-xs text-slate-400">Prioritized cases derived from verified presence, logbook velocity, and assessment milestones.</p>
                            </div>
                        </div>
                        <Badge variant="warning" dot={true}>
                            {interventionData.totalCount} Cases Flagged
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {interventionData.queue.length > 0 ? (
                            interventionData.queue.map((item, idx) => (
                                <Card key={idx} variant="stripe" className="p-5 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                                                {item.admissionNumber} • {item.course || 'Attachment'}
                                            </p>
                                            <p className="text-xs text-slate-300 mt-1">Host: <span className="font-semibold text-slate-200">{item.organizationName || 'Not Assigned'}</span></p>
                                        </div>
                                        <Badge
                                            variant={item.riskLevel === 'CRITICAL' ? 'danger' : item.riskLevel === 'ELEVATED' ? 'warning' : 'indigo'}
                                            dot={true}
                                        >
                                            Risk: {item.riskScore}/100
                                        </Badge>
                                    </div>

                                    {item.topInsight && (
                                        <div className="p-3 bg-[#0c101d] rounded-xl border border-[#1f293d] space-y-1">
                                            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Primary Risk Indicator</span>
                                            <p className="text-xs text-slate-300 leading-snug">{item.topInsight.reason}</p>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-[#1f293d] flex items-center justify-between text-xs">
                                        <span className="text-slate-400 italic">Action: {item.recommendation}</span>
                                        <a
                                            href={`/admin/students`}
                                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                        >
                                            <span>Manage</span>
                                            <ArrowUpRight size={13} />
                                        </a>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card variant="stripe" className="col-span-2 p-12 text-center space-y-2">
                                <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={32} />
                                <p className="text-sm font-bold text-white">No elevated academic risk cases detected.</p>
                                <p className="text-xs text-slate-400">All active students are currently meeting compliance thresholds.</p>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: DATA QUALITY AUDIT */}
            {activeTab === 'data_quality' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="kpi-metric-tile">
                            <span className="text-xs font-semibold text-slate-400">Integrity Score</span>
                            <div className="kpi-metric-value text-indigo-400 mt-2">{dataQualityData?.integrityScore || 100}%</div>
                            <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-[#1f293d]/50">
                                {dataQualityData?.cleanRecords || 0} / {dataQualityData?.totalAudited || 0} intact
                            </div>
                        </div>
                        <div className="kpi-metric-tile">
                            <span className="text-xs font-semibold text-slate-400">Missing Attendance</span>
                            <div className="kpi-metric-value text-amber-400 mt-2">{dataQualityData?.issuesCount?.missingAttendance || 0}</div>
                            <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-[#1f293d]/50">
                                Students with 0 check-ins
                            </div>
                        </div>
                        <div className="kpi-metric-tile">
                            <span className="text-xs font-semibold text-slate-400">Unassigned Mentors</span>
                            <div className="kpi-metric-value text-purple-400 mt-2">
                                {(dataQualityData?.issuesCount?.missingIndustrySupervisor || 0) + (dataQualityData?.issuesCount?.missingUniversitySupervisor || 0)}
                            </div>
                            <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-[#1f293d]/50">
                                Missing supervisor links
                            </div>
                        </div>
                        <div className="kpi-metric-tile">
                            <span className="text-xs font-semibold text-slate-400">Incomplete Dates</span>
                            <div className="kpi-metric-value text-rose-400 mt-2">{dataQualityData?.issuesCount?.missingDates || 0}</div>
                            <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-[#1f293d]/50">
                                Placements missing dates
                            </div>
                        </div>
                    </div>

                    <Card variant="stripe" className="p-6 space-y-4">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-[#1f293d]">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            Data Quality Deficiencies & Integrity Actions
                        </h4>

                        <div className="space-y-3">
                            {dataQualityData?.issues?.missingAttendance?.length > 0 && (
                                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-2">
                                    <span className="text-xs font-bold text-amber-300">Active Students Lacking Attendance Records</span>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {dataQualityData.issues.missingAttendance.map((item, idx) => (
                                            <span key={idx} className="text-xs px-2.5 py-1 bg-[#0c101d] rounded-lg text-slate-300 border border-[#1f293d]">
                                                {item.name} ({item.admissionNumber})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {dataQualityData?.issues?.missingIndustrySupervisor?.length > 0 && (
                                <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/20 space-y-2">
                                    <span className="text-xs font-bold text-purple-300">Placements Missing Industry Supervisor Assignment</span>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {dataQualityData.issues.missingIndustrySupervisor.map((item, idx) => (
                                            <span key={idx} className="text-xs px-2.5 py-1 bg-[#0c101d] rounded-lg text-slate-300 border border-[#1f293d]">
                                                {item.name} ({item.admissionNumber})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {dataQualityData?.integrityScore === 100 && (
                                <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    All audited records satisfy complete schema and association integrity.
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB 4: CSV EXPORT CENTER */}
            {activeTab === 'reports' && (
                <div className="space-y-6">
                    <Card variant="stripe" className="p-6 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-[#1f293d]">
                            <div>
                                <h3 className="text-base font-extrabold text-white">Institutional Data Exports</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Download sanitized, audit-ready CSV datasets for external regulatory compliance.</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { id: 'placements', label: 'Placement Directory', desc: 'All student placement records and approval statuses' },
                                { id: 'attendance', label: 'Attendance Logs', desc: 'Daily presence check-in logs and verification methods' },
                                { id: 'logbooks', label: 'Weekly Logbooks', desc: 'Student technical summaries and review evaluations' },
                                { id: 'assessments', label: 'Graded Assessments', desc: 'Industry and university evaluation marks and feedback' }
                            ].map((rep) => (
                                <div key={rep.id} className="p-5 bg-[#0c101d] rounded-xl border border-[#1f293d] flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                        <h4 className="text-xs sm:text-sm font-bold text-white">{rep.label}</h4>
                                        <p className="text-xs text-slate-400 leading-snug">{rep.desc}</p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleDownloadCSV(rep.id, rep.label)}
                                        disabled={exportingType === rep.id}
                                        className="w-full text-xs flex items-center justify-center gap-2"
                                    >
                                        <Download size={13} />
                                        <span>{exportingType === rep.id ? 'Exporting...' : 'Export CSV'}</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB 5: SUPERVISOR ALLOCATIONS */}
            {activeTab === 'supervisors' && (
                <Card variant="stripe" className="p-6 sm:p-8 space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-[#1f293d]">
                        <div>
                            <h3 className="text-base font-extrabold text-white">Supervisor Allocation & Workload</h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {summary.totalSupervisors || 0} active faculty and industry supervisors registered across institutional placements.
                            </p>
                        </div>
                        <a href="/coordinator/supervisors" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            <span>Open Rebalance Console</span>
                            <ArrowRight size={13} />
                        </a>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Analytics;
