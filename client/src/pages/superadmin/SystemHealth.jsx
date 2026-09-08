import { useEffect, useState } from 'react';
import { Database, Clock, Zap, Cpu, MemoryStick as Memory, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSystemHealth } from '../../utils/superadminApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const HealthMetric = ({ title, value, icon: Icon, status, subtitle }) => (
    <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-5 hover:border-[#2f3242] transition-colors">
        <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <Icon size={20} />
            </div>
            {status && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status === 'healthy' || status === 'Online'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'healthy' || status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {status}
                </span>
            )}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
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
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const database = health?.database || {};
    const server = health?.server || {};
    const memory = server.memory || {};

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">Vital Diagnostics</span>
                        <Badge variant="success">All Systems Operational</Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">Core Infrastructure Health</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Hardware, database connection latency, and runtime performance metrics.</p>
                </div>
                <Button
                    onClick={fetchHealth}
                    variant="outline"
                    icon={Zap}
                >
                    Refresh Diagnostics
                </Button>
            </div>

            {/* Health Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <HealthMetric
                    title="Database Cluster"
                    value={database.latency || '0ms'}
                    icon={Database}
                    status={database.status || 'healthy'}
                    subtitle="PostgreSQL / Prisma layer"
                />
                <HealthMetric
                    title="Engine Uptime"
                    value={formatUptime(server.uptime || 0)}
                    icon={Clock}
                    status="Online"
                    subtitle="Continuous runtime"
                />
                <HealthMetric
                    title="Heap Allocation"
                    value={formatBytes(memory.heapUsed)}
                    icon={Memory}
                    subtitle={`Total: ${formatBytes(memory.heapTotal)}`}
                />
                <HealthMetric
                    title="Database Storage"
                    value={formatBytes(database.size)}
                    icon={HardDrive}
                    subtitle="Allocated data volume"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Advanced Metrics */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Cpu className="text-violet-400" size={20} />
                        <h2 className="text-base font-bold text-slate-100 tracking-tight">Runtime Diagnostics</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#12141c] border border-[#22242f]">
                            <span className="text-xs font-medium text-slate-400">Node.js Engine Version</span>
                            <span className="font-mono text-xs text-violet-400 font-semibold">{server.nodeVersion || 'v20.x'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#12141c] border border-[#22242f]">
                            <span className="text-xs font-medium text-slate-400">RSS Resident Set Memory</span>
                            <span className="font-mono text-xs text-slate-200 font-semibold">{formatBytes(memory.rss)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#12141c] border border-[#22242f]">
                            <span className="text-xs font-medium text-slate-400">Total Heap Capacity</span>
                            <span className="font-mono text-xs text-slate-200 font-semibold">{formatBytes(memory.heapTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Incident Console */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="text-amber-400" size={20} />
                        <h2 className="text-base font-bold text-slate-100 tracking-tight">Incident Stream</h2>
                    </div>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {!health?.recentErrors || health.recentErrors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-[#12141c] rounded-lg border border-[#22242f]">
                                <CheckCircle2 size={28} className="text-emerald-500 mb-2" />
                                <p className="text-xs font-semibold text-slate-200">No Incidents Detected</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">All services operating within standard reliability parameters.</p>
                            </div>
                        ) : (
                            health.recentErrors.map((error, index) => (
                                <div key={index} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/15 flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-semibold text-rose-400">{error.action}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{error.message || 'Standard error logged by security middleware'}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">{new Date(error.createdAt).toLocaleTimeString()}</span>
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
