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
    Check
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';
import { reportApi } from '../../utils/reportApi';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalLogbooks: 0,
        pendingReviews: 0,
        totalAttendance: 0,
        avgAttendance: 0
    });
    const [alertsData, setAlertsData] = useState({ summary: { total: 0, critical: 0, warning: 0, info: 0 }, alerts: [] });
    const [activeTab, setActiveTab] = useState('overview'); // overview, alerts, reports, supervisors
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
            const [analyticsRes, alertsRes] = await Promise.allSettled([
                adminApi.getAnalytics(),
                reportApi.getOperationalAlerts()
            ]);

            if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data?.success) {
                setStats(analyticsRes.value.data.data);
            }

            if (alertsRes.status === 'fulfilled' && alertsRes.value?.success) {
                setAlertsData(alertsRes.value.data || { summary: { total: 0, critical: 0, warning: 0, info: 0 }, alerts: [] });
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
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Phase 4 Intelligence</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                            Operational <span className="text-blue-500">Intelligence</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Real-time risk telemetry, audit-ready compliance reporting, and supervisor workload analytics.
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
                    { id: 'alerts', label: `Risk Alerts (${alertsData.summary?.total || 0})`, icon: ShieldAlert, badge: alertsData.summary?.critical > 0 ? 'bg-rose-500' : 'bg-amber-500' },
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
                            label="Student Registry"
                            value={stats.totalStudents}
                            color="text-blue-400"
                            description="Registered institutional nodes"
                        />
                        <StatCard
                            icon={BookOpen}
                            label="Technical Logs"
                            value={stats.totalLogbooks}
                            color="text-emerald-400"
                            description="Weekly submitted logs"
                        />
                        <StatCard
                            icon={AlertCircle}
                            label="Pending Reviews"
                            value={stats.pendingReviews}
                            color="text-amber-400"
                            description="Awaiting supervisor action"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Attendance Velocity"
                            value={`${stats.avgAttendance || 0}%`}
                            color="text-purple-400"
                            description="Institutional presence average"
                        />
                    </div>

                    {/* Operational Risk Teaser Banner */}
                    {alertsData.summary?.total > 0 && (
                        <div className="glass-card p-6 border-l-4 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-500/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        {alertsData.summary.total} Active Operational Alerts Detected
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {alertsData.summary.critical} critical risks and {alertsData.summary.warning} warnings requiring administrative oversight.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('alerts')}
                                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                                <span>Inspect Alerts</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Detailed Insights Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 glass-card p-8 min-h-[320px] flex flex-col items-center justify-center text-center space-y-4 border border-white/5 bg-slate-900/40">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                <PieChart size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-white tracking-tight">Institutional Compliance Stream</h4>
                                <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                                    All telemetry logs, presence entries, and supervisor assessments are cryptographically synchronized under multi-tenant isolation.
                                </p>
                            </div>
                        </div>

                        <div className="glass-card p-6 space-y-4">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-3 flex items-center gap-2">
                                <Calendar size={14} className="text-blue-400" />
                                Operational Thresholds
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Minimum Attendance', val: '75%', color: 'text-emerald-400' },
                                    { label: 'Max Days Pending Placement', val: '3 Days', color: 'text-amber-400' },
                                    { label: 'Assessment Milestone Notice', val: '14 Days Prior', color: 'text-blue-400' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                        <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                                        <span className={`text-xs font-black ${item.color}`}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: OPERATIONAL RISK ALERTS */}
            {activeTab === 'alerts' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass-card p-5 border-l-4 border-rose-500">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Critical Risk</p>
                            <h3 className="text-2xl font-black text-rose-400 mt-1">{alertsData.summary?.critical || 0}</h3>
                            <p className="text-[11px] text-slate-400 mt-1">Severe compliance or attendance deviations</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-amber-500">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Warnings</p>
                            <h3 className="text-2xl font-black text-amber-400 mt-1">{alertsData.summary?.warning || 0}</h3>
                            <p className="text-[11px] text-slate-400 mt-1">Approaching milestones & review delays</p>
                        </div>
                        <div className="glass-card p-5 border-l-4 border-blue-500">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Informational</p>
                            <h3 className="text-2xl font-black text-blue-400 mt-1">{alertsData.summary?.info || 0}</h3>
                            <p className="text-[11px] text-slate-400 mt-1">Upcoming cycle completions</p>
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <ShieldAlert size={18} className="text-amber-400" />
                                Detected Operational Anomalies
                            </h3>
                            <span className="text-xs text-slate-500">{alertsData.alerts?.length || 0} alerts evaluated</span>
                        </div>

                        {alertsData.alerts?.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                                <CheckCircle2 size={40} className="text-emerald-400" />
                                <p className="text-sm font-semibold text-white">Zero Operational Risks Detected</p>
                                <p className="text-xs text-slate-500">All student placements, attendance streams, and supervisor assessments are within compliance parameters.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {alertsData.alerts.map((alert, idx) => (
                                    <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="space-y-1 max-w-2xl">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    alert.severity === 'CRITICAL'
                                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                                        : alert.severity === 'WARNING'
                                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                    {alert.severity}
                                                </span>
                                                <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                                                <span className="text-xs text-slate-400">· {alert.studentName} ({alert.admissionNumber})</span>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                                            {alert.recommendedAction && (
                                                <p className="text-[11px] text-blue-400 font-medium flex items-center gap-1 mt-1">
                                                    <span>Action:</span>
                                                    <span>{alert.recommendedAction}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: CSV EXPORT CENTER */}
            {activeTab === 'reports' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-card p-6 border-b border-white/10">
                        <h3 className="text-base font-bold text-white">Institutional CSV Data Exporter</h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Generate and download cryptographically formatted, sanitized CSV datasets for external audits, institutional accreditation, and analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                id: 'placements',
                                title: 'Placements Registry',
                                desc: 'Complete student placement applications, organizational links, start/end dates, and approval statuses.',
                                filename: 'placements-report'
                            },
                            {
                                id: 'attendance',
                                title: 'Attendance Log Stream',
                                desc: 'Daily presence logs, verification methods, scanner attribution, and timestamps.',
                                filename: 'attendance-report'
                            },
                            {
                                id: 'logbooks',
                                title: 'Logbook Submissions',
                                desc: 'Weekly logbook technical summaries, submission dates, supervisor comments, and review statuses.',
                                filename: 'logbooks-report'
                            },
                            {
                                id: 'assessments',
                                title: 'Evaluations & Assessments',
                                desc: 'All submitted industry and academic milestone assessments with scores and feedback.',
                                filename: 'assessments-report'
                            },
                            {
                                id: 'supervisor-workload',
                                title: 'Supervisor Allocation Matrix',
                                desc: 'Workload distribution across industry and academic supervisors with assignment tallies.',
                                filename: 'supervisor-workload-report'
                            }
                        ].map((report) => (
                            <div key={report.id} className="glass-card p-6 flex flex-col justify-between gap-4 border border-white/5 hover:border-blue-500/30 transition-all">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <FileSpreadsheet size={20} />
                                        <h4 className="text-sm font-bold text-white">{report.title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{report.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleDownloadCSV(report.id, report.filename)}
                                    disabled={exportingType === report.id}
                                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center justify-center gap-2 border border-blue-500/30 transition-all"
                                >
                                    <Download size={14} className={exportingType === report.id ? 'animate-bounce' : ''} />
                                    <span>{exportingType === report.id ? 'Exporting CSV...' : 'Download CSV'}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: SUPERVISOR WORKLOAD */}
            {activeTab === 'supervisors' && (
                <div className="glass-card overflow-hidden animate-fade-in">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <UserCheck size={18} className="text-purple-400" />
                                Supervisor Workload & Allocation Matrix
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">Real-time student allocations and completed evaluations per supervisor node.</p>
                        </div>
                        <button
                            onClick={() => handleDownloadCSV('supervisor-workload', 'supervisor-workload')}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-2 border border-white/10 transition-colors"
                        >
                            <Download size={14} />
                            <span>Export Matrix CSV</span>
                        </button>
                    </div>

                    <div className="p-6 text-center text-xs text-slate-400">
                        Workload metrics are live and synchronized with active placement allocations. Use the export tool above to analyze complete supervisor schedules.
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
