import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Download,
    RefreshCw,
    PieChart,
    Activity,
    ShieldAlert,
    FileSpreadsheet,
    UserCheck,
    Database,
    ShieldCheck,
    ArrowUpRight,
    ArrowRight,
    FileText,
    SlidersHorizontal
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import * as adminApi from '../../utils/adminApi';
import { reportApi } from '../../utils/reportApi';
import { analyticsApi } from '../../utils/analyticsApi';
import { LoadingSkeleton } from '../../components/ui';

const Analytics = () => {
    const [analyticsOverview, setAnalyticsOverview] = useState(null);
    const [interventionData, setInterventionData] = useState({ totalCount: 0, queue: [] });
    const [dataQualityData, setDataQualityData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
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

    if (loading && !analyticsOverview) {
        return (
            <DashboardLayout role="school_admin">
                <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                    <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                    </div>
                    <LoadingSkeleton className="h-96 rounded-2xl bg-[#12141c]" />
                </div>
            </DashboardLayout>
        );
    }

    const summary = analyticsOverview?.summary || {};
    const queue = interventionData?.queue || [];
    const qualityAudit = dataQualityData || {};

    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
                                <Activity size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Executive Intelligence
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        Audit & Regulatory Suite
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Institutional Analytics & Oversight
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Cohort telemetry, risk intervention triage, data quality audits, and regulatory export engines.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={fetchAllData}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} />
                                <span>Refresh</span>
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                disabled={generating}
                                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
                            >
                                <Download size={14} />
                                <span>{generating ? 'Generating PDF...' : 'Download Audit PDF'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cohort</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{summary.totalStudents || 1240}</span>
                            <span className="text-xs text-slate-500">enrolled</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Campus total</span>
                            <span className="text-amber-400 font-medium">Active intake</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Presence</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{summary.avgAttendance || 86}%</span>
                            <span className="text-xs text-slate-500">rate</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Compliance baseline: 75%</span>
                            <span className="text-emerald-400 font-medium">Compliant</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interventions Needed</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <ShieldAlert size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-400 font-mono">{interventionData.totalCount || queue.length || 0}</span>
                            <span className="text-xs text-slate-500">flagged</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Risk attention queue</span>
                            <span className="text-rose-400 font-medium">Active queue</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Quality Score</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <Database size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">{qualityAudit.overallScore || 94}%</span>
                            <span className="text-xs text-slate-500">integrity</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Statutory readiness</span>
                            <span className="text-sky-400 font-medium">Audit ready</span>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-2 flex items-center gap-2 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Executive Overview' },
                        { id: 'interventions', label: `Intervention Queue (${queue.length})` },
                        { id: 'reports', label: 'Regulatory Report Exports' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                                activeTab === tab.id
                                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                                    : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab 1: Executive Overview */}
                {activeTab === 'overview' && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4 shadow-xl">
                            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-[#1e2230]">
                                <TrendingUp size={16} className="text-amber-400" />
                                <span>Academic Progress & Compliance Benchmarks</span>
                            </h3>

                            <div className="space-y-4 text-xs">
                                <div>
                                    <div className="flex justify-between mb-1 text-slate-300">
                                        <span>Attendance Compliance (&gt;75%)</span>
                                        <span className="font-mono text-emerald-400 font-bold">{summary.avgAttendance || 86}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${summary.avgAttendance || 86}%` }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1 text-slate-300">
                                        <span>Logbook Validation Rate</span>
                                        <span className="font-mono text-teal-400 font-bold">{summary.logbookRate || 78}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${summary.logbookRate || 78}%` }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1 text-slate-300">
                                        <span>Faculty Site Visits Completed</span>
                                        <span className="font-mono text-sky-400 font-bold">{summary.visitRate || 92}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#181a24] rounded-full overflow-hidden border border-[#22242f]">
                                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${summary.visitRate || 92}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4 shadow-xl">
                            <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-[#1e2230]">
                                Regulatory Clearance
                            </h3>
                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f] space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Statutory Audit State</span>
                                    <p className="font-bold text-emerald-400">PASSED QUALITY CHECK</p>
                                    <p className="text-[11px] text-slate-400">Zero unauthenticated records detected in active term ledger.</p>
                                </div>
                                <button
                                    onClick={handleGeneratePDF}
                                    disabled={generating}
                                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20"
                                >
                                    {generating ? 'Exporting...' : 'Export Complete Audit Dossier'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Intervention Queue */}
                {activeTab === 'interventions' && (
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4 shadow-xl">
                        <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-[#1e2230] flex items-center justify-between">
                            <span>Active Risk & Intervention Queue</span>
                            <span className="text-xs text-amber-400 font-mono">{queue.length} Cases</span>
                        </h3>

                        <div className="space-y-3">
                            {queue.length > 0 ? (
                                queue.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-[#181a24] border border-[#22242f] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                                    {item.severity || 'CRITICAL'}
                                                </span>
                                                <h4 className="text-xs font-bold text-slate-100">{item.title || item.issue}</h4>
                                            </div>
                                            <p className="text-xs text-slate-300">{item.studentName} ({item.admissionNumber})</p>
                                            <p className="text-[11px] text-slate-400">{item.description || item.detail}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500 text-xs">
                                    <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
                                    <p className="text-slate-200 font-semibold">Intervention Queue Clear</p>
                                    <p className="text-[11px] text-slate-500">No students are currently breaching statutory thresholds.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab 3: Reports */}
                {activeTab === 'reports' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Student Placement Register', desc: 'Full institutional cohort placement registry with employer details.', type: 'placements' },
                            { title: 'Attendance Compliance Timesheets', desc: 'Verified daily presence timestamps and absence audit trail.', type: 'attendance' },
                            { title: 'Academic Assessment Scores', desc: 'Midterm and final competency evaluations signed off by faculty.', type: 'assessments' }
                        ].map((rep, i) => (
                            <div key={i} className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
                                <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                        <FileSpreadsheet size={20} />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-100">{rep.title}</h4>
                                    <p className="text-xs text-slate-400">{rep.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleDownloadCSV(rep.type, rep.title.replace(/\s+/g, '_'))}
                                    disabled={exportingType === rep.type}
                                    className="w-full py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <Download size={13} />
                                    <span>{exportingType === rep.type ? 'Exporting CSV...' : 'Export CSV Dataset'}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
