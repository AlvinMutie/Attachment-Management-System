import { useEffect, useState } from 'react';
import { Activity, Database, Server, HardDrive, AlertCircle, CheckCircle, Zap, Cpu, MemoryStick as Memory, Clock } from 'lucide-react';
import { getSystemHealth } from '../../utils/superadminApi';

const HealthMetric = ({ title, value, icon: Icon, color, status }) => (
    <div className="glass-card p-6 group hover:border-indigo-500/30 transition-all duration-500">
        <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-white shadow-lg ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
            {status && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status === 'healthy' || status === 'Online'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'healthy' || status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {status}
                </div>
            )}
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
    </div>
);

const SystemHealth = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchHealth = async () => {
        try {
            const response = await getSystemHealth();
            setHealth(response.data);
        } catch (error) {
            console.error('Failed to fetch system health:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const database = health?.database || {};
    const server = health?.server || {};
    const memory = server.memory || {};

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 animate-fade-in">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/30 ring-1 ring-white/20">
                        <Activity size={40} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Vital Diagnostics</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Core <span className="text-emerald-500">Health</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-lg">Hardware & software performance matrices for the entire attachment grid.</p>
                    </div>
                </div>
                <button
                    onClick={fetchHealth}
                    className="btn-primary px-8 py-4 group"
                >
                    <Zap size={18} className="group-hover:animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Refresh Core</span>
                </button>
            </div>

            {/* Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HealthMetric
                    title="Database Cluster"
                    value={database.latency || '0ms'}
                    icon={Database}
                    color="bg-emerald-600"
                    status={database.status}
                />
                <HealthMetric
                    title="Engine Uptime"
                    value={formatUptime(server.uptime || 0)}
                    icon={Clock}
                    color="bg-indigo-600"
                    status="Online"
                />
                <HealthMetric
                    title="Heap Allocation"
                    value={formatBytes(memory.heapUsed)}
                    icon={Memory}
                    color="bg-blue-600"
                />
                <HealthMetric
                    title="System Storage"
                    value={formatBytes(database.size)}
                    icon={HardDrive}
                    color="bg-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Advanced Metrics */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
                        <Cpu className="text-blue-500" size={24} />
                        Engine Diagnostics
                    </h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Node Version</span>
                            <span className="font-mono text-indigo-400 font-bold">{server.nodeVersion || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">RSS Resident Set</span>
                            <span className="text-white font-bold">{formatBytes(memory.rss)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Heap Space</span>
                            <span className="text-white font-bold">{formatBytes(memory.heapTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Error Console */}
                <div className="glass-card p-8 border-rose-500/10">
                    <h2 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
                        <AlertCircle className="text-rose-500" size={24} />
                        Incident Console
                    </h2>
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {!health?.recentErrors || health.recentErrors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-600 opacity-50">
                                <CheckCircle size={48} className="mb-4" />
                                <p className="font-black uppercase tracking-widest text-xs">No active incidents detected</p>
                            </div>
                        ) : (
                            health.recentErrors.map((error, index) => (
                                <div key={index} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 group hover:border-rose-500/30 transition-all">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-rose-400 tracking-tight">{error.action}</p>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(error.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 font-medium italic">Protocol failure in autonomous system</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealth;
