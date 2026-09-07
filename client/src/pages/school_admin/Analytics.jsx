import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    TrendingUp,
    Download,
    RefreshCcw,
    FileText,
    PieChart,
    Calendar,
    Activity,
    ShieldAlert,
    FileSpreadsheet,
    Search,
    ChevronRight,
    UserCheck,
    Check,
    Sparkles,
    Database,
    ShieldCheck,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';
import { reportApi } from '../../utils/reportApi';
import { analyticsApi } from '../../utils/analyticsApi';

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

    const StatCard = ({ icon: Icon, label, value, color, description }) => (
        <div className="glass-card p-6 flex items-start gap-4 group hover:scale-[1.02] transition-all">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 shadow-inner`}>
                <Icon size={24} className={color} />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-600/5 p-8 rounded-m3-xl border border-blue-600/10 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30">
                        <Activity size={32} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Phase 7 Intelligence</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                            Operational <span className="text-blue-500">Intelligence</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Explainable risk scoring, cohort trend telemetry, data quality auditing, and compliance reporting.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={fetchAllData}
                        className="p-3.5 glass-card rounded-2xl text-slate-400 hover:text-white transition-all"
                        title="Refresh Intelligence"
                    >
                        <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleGeneratePDF}
                        disabled={generating}
                        className="btn-primary px-6 py-3.5 !rounded-2xl flex items-center gap-2 group shadow-lg shadow-blue-600/20"
                    >
                        <Download size={18} className={generating ? 'animate-bounce' : 'group-hover:-translate-y-0.5 transition-transform'} />
                        <span className="text-xs font-black uppercase tracking-wider">{generating ? 'Exporting PDF...' : 'Institutional PDF'}</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
                    { id: 'insights', label: `Intervention Queue (${interventionData.totalCount})`, icon: ShieldAlert, badge: interventionData.totalCount > 0 ? 'bg-amber-500' : 'bg-slate-700' },
                    { id: 'data_quality', label: `Data Quality (${dataQualityData?.integrityScore || 100}%)`, icon: Database },
                    { id: 'reports', label: 'CSV Export Center', icon: FileSpreadsheet },
                    { id: 'supervisors', label: 'Supervisor Workload', icon: UserCheck }
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={Users}
                            label="Student Cohort"
                            value={summary.totalStudents || 0}
                            color="text-blue-400"
                            description={`${summary.activePlacements || 0} active placements`}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Attendance Velocity"
                            value={`${attendance.averageRate || 0}%`}
                            color="text-purple-400"
                            description={`${attendance.totalRecords || 0} verified check-ins`}
                        />
                        <StatCard
                            icon={BookOpen}
                            label="Logbook Approval Rate"
                            value={`${logbooks.approvalRate || 0}%`}
                            color="text-emerald-400"
                            description={`${logbooks.approved || 0} of ${logbooks.total || 0} approved`}
                        />
                        <StatCard
                            icon={CheckCircle2}
                            label="Completion Rate"
                            value={`${summary.completionRate || 0}%`}
                            color="text-amber-400"
                            description={`${summary.completedPlacements || 0} completed attachments`}
                        />
                    </div>

                    {/* Operational Risk Teaser Banner */}
                    {interventionData.totalCount > 0 && (
                        <div className="glass-card p-6 border-l-4 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-500/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        {interventionData.totalCount} Students Require Academic Oversight
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Deterministic risk models flagged elevated operational or academic blockers.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('insights')}
                                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                                <span>Inspect Intervention Queue</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Historical Trend Timeline & Attendance Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Monthly Trends Table */}
                        <div className="lg:col-span-2 glass-card p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-400" />
                                    Monthly Activity Telemetry (Last 6 Months)
                                </h4>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Historical Aggregates</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white/[0.02] text-slate-400 uppercase font-black tracking-widest text-[9px]">
                                        <tr>
                                            <th className="p-3">Reporting Period</th>
                                            <th className="p-3">New Placements</th>
                                            <th className="p-3">Logbooks Logged</th>
                                            <th className="p-3">Assessments Graded</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {monthlyTrends.length > 0 ? (
                                            monthlyTrends.map((m, i) => (
                                                <tr key={i} className="hover:bg-white/[0.02]">
                                                    <td className="p-3 font-bold text-white">{m.month}</td>
                                                    <td className="p-3 text-slate-300">{m.placements}</td>
                                                    <td className="p-3 text-slate-300">{m.logbooks}</td>
                                                    <td className="p-3 text-slate-300">{m.assessments}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-slate-500 font-bold">
                                                    No historical records available yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Attendance Compliance Distribution */}
                        <div className="glass-card p-6 space-y-6">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-3 flex items-center gap-2">
                                <PieChart size={14} className="text-blue-400" />
                                Attendance Compliance Standing
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-emerald-400">Compliant (&gt;= 75%)</span>
                                        <span className="text-white">{attendance.distribution?.compliant || 0} Students</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.compliant || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-amber-400">At Risk (60% - 74%)</span>
                                        <span className="text-white">{attendance.distribution?.atRisk || 0} Students</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500"
                                            style={{ width: `${summary.totalStudents > 0 ? ((attendance.distribution?.atRisk || 0) / summary.totalStudents) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-rose-400">Critical (&lt; 60% / No Logs)</span>
                                        <span className="text-white">{attendance.distribution?.critical || 0} Students</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500"
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
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-blue-400" size={20} />
                            <div>
                                <h3 className="text-sm font-bold text-white">Deterministic Academic Risk Ranking</h3>
                                <p className="text-[10px] text-slate-400">Prioritized cases derived from verified attendance, logbook velocity, and assessment milestones.</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase rounded-full border border-blue-500/30">
                            {interventionData.totalCount} Cases Flagged
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {interventionData.queue.length > 0 ? (
                            interventionData.queue.map((item, idx) => (
                                <div key={idx} className="glass-card p-6 space-y-4 border border-white/5 hover:border-blue-500/30 transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="text-base font-black text-white">{item.name}</h4>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                {item.admissionNumber} • {item.course || 'Attachment'}
                                            </p>
                                            <p className="text-xs text-slate-300 font-medium mt-1">Host: {item.organizationName || 'Not Assigned'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                                                item.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                                item.riskLevel === 'ELEVATED' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                                'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                            }`}>
                                                Risk: {item.riskScore}/100
                                            </span>
                                        </div>
                                    </div>

                                    {item.topInsight && (
                                        <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 space-y-1">
                                            <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">Primary Risk Indicator</span>
                                            <p className="text-xs text-slate-300">{item.topInsight.reason}</p>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 italic">Action: {item.recommendation}</span>
                                        <a
                                            href={`/admin/students`}
                                            className="btn-primary px-3 py-1.5 text-[10px] uppercase flex items-center gap-1"
                                        >
                                            <span>Manage</span>
                                            <ArrowUpRight size={12} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 glass-card p-12 text-center space-y-2 text-slate-400 font-bold uppercase tracking-wider text-xs">
                                <CheckCircle2 className="mx-auto text-emerald-400 mb-2" size={32} />
                                <p>No elevated academic risk cases detected.</p>
                                <p className="text-[10px] text-slate-500">All active students are currently meeting compliance thresholds.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: DATA QUALITY AUDIT */}
            {activeTab === 'data_quality' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="glass-card p-5 border-l-4 border-blue-500">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Integrity Score</p>
                            <h3 className="text-3xl font-black text-blue-400 mt-1">{dataQualityData?.integrityScore || 100}%</h3>
                            <p className="text-[11px] text-slate-400 mt-1">{dataQualityData?.cleanRecords || 0} of {dataQualityData?.totalAudited || 0} records fully intact</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-amber-500">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Missing Attendance</p>
                            <h3 className="text-3xl font-black text-amber-400 mt-1">{dataQualityData?.issuesCount?.missingAttendance || 0}</h3>
                            <p className="text-[11px] text-slate-400 mt-1">Active students with 0 check-ins</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-purple-500">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Unassigned Supervisors</p>
                            <h3 className="text-3xl font-black text-purple-400 mt-1">
                                {(dataQualityData?.issuesCount?.missingIndustrySupervisor || 0) + (dataQualityData?.issuesCount?.missingUniversitySupervisor || 0)}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1">Missing industry or university mentor</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-rose-500">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Incomplete Dates</p>
                            <h3 className="text-3xl font-black text-rose-400 mt-1">{dataQualityData?.issuesCount?.missingDates || 0}</h3>
                            <p className="text-[11px] text-slate-400 mt-1">Placements missing start/end dates</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 space-y-4">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                            <ShieldCheck size={18} className="text-emerald-400" />
                            Data Quality Deficiencies & Integrity Actions
                        </h4>

                        <div className="space-y-3">
                            {dataQualityData?.issues?.missingAttendance?.length > 0 && (
                                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-2">
                                    <span className="text-xs font-bold text-amber-300">Active Students Lacking Attendance Records</span>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {dataQualityData.issues.missingAttendance.map((item, idx) => (
                                            <span key={idx} className="text-[10px] px-2.5 py-1 bg-white/5 rounded-lg text-slate-300 border border-white/10">
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
                                            <span key={idx} className="text-[10px] px-2.5 py-1 bg-white/5 rounded-lg text-slate-300 border border-white/10">
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
                    </div>
                </div>
            )}

            {/* TAB 4: CSV EXPORT CENTER */}
            {activeTab === 'reports' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-lg font-black text-white">Institutional Data Exports</h3>
                                <p className="text-xs text-slate-400">Download sanitized, audit-ready CSV exports for external compliance verification.</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { id: 'placements', label: 'Placement Directory', desc: 'All student placement records and approval statuses' },
                                { id: 'attendance', label: 'Attendance Logs', desc: 'Daily presence check-in logs and verification methods' },
                                { id: 'logbooks', label: 'Weekly Logbooks', desc: 'Student technical summaries and review evaluations' },
                                { id: 'assessments', label: 'Graded Assessments', desc: 'Industry and university evaluation marks and feedback' }
                            ].map((rep) => (
                                <div key={rep.id} className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white">{rep.label}</h4>
                                        <p className="text-[11px] text-slate-400">{rep.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDownloadCSV(rep.id, rep.label)}
                                        disabled={exportingType === rep.id}
                                        className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
                                    >
                                        <Download size={14} />
                                        <span>{exportingType === rep.id ? 'Exporting...' : 'Export CSV'}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: SUPERVISOR WORKLOAD */}
            {activeTab === 'supervisors' && (
                <div className="glass-card p-8 space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-lg font-black text-white">Supervisor Allocation & Workload</h3>
                        <a href="/coordinator/supervisors" className="text-xs font-bold text-blue-400 hover:underline uppercase">
                            Coordinator Supervisor Console &rarr;
                        </a>
                    </div>
                    <p className="text-xs text-slate-400">
                        {summary.totalSupervisors || 0} active faculty and industry supervisors registered across institutional placements.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Analytics;
