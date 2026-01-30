import { useEffect, useState } from 'react';
import { Search, Filter, Shield, Clock, Hash, Activity } from 'lucide-react';
import { getAuditLogs } from '../../utils/superadminApi';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: '',
        targetType: '',
        startDate: '',
        endDate: ''
    });
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });

    useEffect(() => {
        fetchLogs();
    }, [filters, pagination.page]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await getAuditLogs({
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            });
            setLogs(response.data.logs);
            setPagination(prev => ({ ...prev, ...response.data.pagination }));
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action) => {
        const colors = {
            CREATE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            UPDATE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            LOCK: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            UNLOCK: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };

        const actionType = action.split('_')[0];
        return (
            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${colors[actionType] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {action.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 animate-fade-in">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-amber-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-amber-600/30 ring-1 ring-white/20">
                        <Shield size={40} className="text-white" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Security Ledger</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">System <span className="text-amber-500">Audit</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-lg">Immutable session and action logs monitoring platform-wide administrative activity.</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        value={filters.action}
                        onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                        className="input-field cursor-pointer text-xs font-semibold"
                    >
                        <option value="">Events: All Activities</option>
                        <option value="CREATE_SCHOOL">Create Institution</option>
                        <option value="UPDATE_SCHOOL">Update Institution</option>
                        <option value="TOGGLE_SCHOOL_STATUS">Toggle Node State</option>
                        <option value="UPDATE_USER_ROLE">Assign Role</option>
                        <option value="RESET_USER_PASSWORD">Security Reset</option>
                        <option value="LOCK_USER">Session Terminated</option>
                        <option value="UNLOCK_USER">Session Restored</option>
                    </select>
                    <select
                        value={filters.targetType}
                        onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
                        className="input-field cursor-pointer text-xs font-semibold"
                    >
                        <option value="">Targets: All Entities</option>
                        <option value="School">Entity: Institutions</option>
                        <option value="User">Entity: Identities</option>
                        <option value="Student">Entity: Academic Node</option>
                    </select>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="input-field [color-scheme:dark] text-xs font-semibold"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="input-field [color-scheme:dark] text-xs font-semibold"
                    />
                </div>
            </div>

            {/* Logs List - Cards for Mobile, Table for Desktop */}
            <div className="glass-card overflow-hidden border-white/5">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-amber-500">
                        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Originator</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action Protocol</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Target Entity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Endpoint IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-amber-500/50">
                                                    <Clock size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm tracking-tight">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-bold text-indigo-400">
                                                    {log.user?.name ? log.user.name.charAt(0) : 'S'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-200">{log.user?.name || 'System Engine'}</p>
                                                    <p className="text-[10px] text-slate-500">{log.user?.email || 'INTERNAL_PROCESS'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{log.targetType || 'SYSTEM'}</span>
                                                {log.targetId && (
                                                    <div className="flex items-center gap-1 text-[9px] bg-slate-800 px-1.5 py-0.5 rounded border border-white/5 text-slate-500 font-mono">
                                                        <Hash size={10} />
                                                        {log.targetId.substring(0, 8)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                                <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                                                {log.ipAddress || '0.0.0.0'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && logs.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Audit Depth: {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} OF {pagination.total} RECORDED EVENTS
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="px-6 py-2 glass-card rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="px-6 py-2 glass-card rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
