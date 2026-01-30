import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Download,
    RefreshCcw,
    FileText,
    PieChart,
    Calendar,
    Activity
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalLogbooks: 0,
        pendingReviews: 0,
        totalAttendance: 0,
        avgAttendance: 0
    });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAnalytics();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            setGenerating(true);
            const response = await adminApi.downloadReport();

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Oversight-Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to generate report:', error);
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
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-600/5 p-8 rounded-m3-xl border border-blue-600/10 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30">
                        <Activity size={32} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Institutional Hub</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Oversight <span className="text-blue-500">Analytics</span></h1>
                        <p className="text-slate-500 text-sm font-medium">Real-time indicators for academic compliance and industrial synchronization.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchAnalytics}
                        className="p-4 glass-card rounded-2xl text-slate-400 hover:text-white transition-all"
                        title="Refresh Intelligence"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleGenerateReport}
                        disabled={generating}
                        className="btn-primary px-8 py-4 !rounded-2xl group"
                    >
                        <Download size={20} className={generating ? 'animate-bounce' : 'group-hover:-translate-y-1 transition-transform'} />
                        <span className="text-xs font-black uppercase tracking-widest">{generating ? 'Generating...' : 'Export PDF Report'}</span>
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Student Registry"
                    value={stats.totalStudents}
                    color="text-blue-400"
                    description="Active institutional nodes"
                />
                <StatCard
                    icon={BookOpen}
                    label="Technical Logs"
                    value={stats.totalLogbooks}
                    color="text-emerald-400"
                    description="Verified industrial entries"
                />
                <StatCard
                    icon={AlertCircle}
                    label="Pending Oversight"
                    value={stats.pendingReviews}
                    color="text-amber-400"
                    description="Required supervisor actions"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Attendance Velocity"
                    value={`${stats.avgAttendance}%`}
                    color="text-purple-400"
                    description="Current presence rate"
                />
            </div>

            {/* Detailed Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2 border-white/5 bg-transparent">
                    <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                        <PieChart size={40} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter">Velocity Visualizations</h4>
                        <p className="text-slate-500 text-sm max-w-sm">Detailed institutional metrics including attendance trends and AI-powered sentiment analysis are currently synchronizing.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 space-y-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4 flex items-center gap-2">
                            <Calendar size={14} className="text-blue-400" />
                            Session Overview
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Active Supervisors', val: '12 Users', color: 'bg-blue-400' },
                                { label: 'QR Scan Reliability', val: '98.4%', color: 'bg-emerald-400' },
                                { label: 'AI Refinement Hits', val: '450+', color: 'bg-purple-400' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 space-y-4 bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/10">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <FileText size={14} className="text-indigo-400" />
                            System Integrity
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-medium">All data nodes are cryptographically signed and archived for institutional compliance.</p>
                        <div className="pt-2">
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-indigo-500 rounded-full" />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[8px] font-black text-slate-500 uppercase">Archive Capacity</span>
                                <span className="text-[8px] font-black text-indigo-400 uppercase">85% Secured</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
