import { useEffect, useState } from 'react';
import { Search, Filter, Shield, Clock, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAuditLogs } from '../../utils/superadminApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: '',
        targetType: '',
        startDate: '',
        endDate: ''
    });
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

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

    const getActionBadgeVariant = (action) => {
        if (action.startsWith('CREATE')) return 'success';
        if (action.startsWith('UPDATE') || action.startsWith('UNLOCK')) return 'info';
        if (action.startsWith('DELETE') || action.startsWith('LOCK')) return 'danger';
        return 'neutral';
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">Security Ledger</span>
                        <Badge variant="neutral">Immutable Stream</Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">Platform Audit Logs</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Comprehensive audit trail of institutional operations, role elevations, and access modifications.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Action Type</label>
                        <select
                            value={filters.action}
                            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                        >
                            <option value="">All Actions</option>
                            <option value="CREATE_SCHOOL">Create Institution</option>
                            <option value="UPDATE_SCHOOL">Update Institution</option>
                            <option value="TOGGLE_SCHOOL_STATUS">Toggle Node State</option>
                            <option value="UPDATE_USER_ROLE">Assign Role</option>
                            <option value="RESET_USER_PASSWORD">Password Reset</option>
                            <option value="LOCK_USER">Account Locked</option>
                            <option value="UNLOCK_USER">Account Unlocked</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Entity</label>
                        <select
                            value={filters.targetType}
                            onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                        >
                            <option value="">All Entities</option>
                            <option value="School">Institution</option>
                            <option value="User">User Identity</option>
                            <option value="Student">Student Record</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 [color-scheme:dark]"
                        />
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">No audit events match the selected criteria.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#22242f] bg-[#12141c]">
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Originator</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Entity</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#22242f]">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#181a24]/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <Clock size={13} className="text-slate-500" />
                                                <div>
                                                    <p className="text-xs font-medium text-slate-200">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                                    <p className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-200">{log.user?.name || 'System'}</p>
                                                <p className="text-[11px] text-slate-500">{log.user?.email || 'INTERNAL_DAEMON'}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={getActionBadgeVariant(log.action)}>
                                                {log.action.replace(/_/g, ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-slate-300">{log.targetType || 'SYSTEM'}</span>
                                                {log.targetId && (
                                                    <span className="text-[10px] font-mono text-slate-500 bg-[#12141c] px-1.5 py-0.5 rounded border border-[#22242f]">
                                                        #{log.targetId.substring(0, 8)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[11px] font-mono text-slate-400">{log.ipAddress || '127.0.0.1'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && logs.length > 0 && (
                    <div className="p-4 bg-[#12141c] border-t border-[#22242f] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
                        <span>
                            Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} events
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                icon={ChevronLeft}
                            >
                                Previous
                            </Button>
                            <span className="px-3 py-1 bg-[#15171f] border border-[#22242f] rounded text-xs font-semibold text-slate-300">
                                {pagination.page} / {pagination.totalPages || 1}
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page >= pagination.totalPages}
                                icon={ChevronRight}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
