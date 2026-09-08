import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    RefreshCw
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

export default function SupervisorWorkload() {
    const [loading, setLoading] = useState(true);
    const [supervisors, setSupervisors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const loadSupervisors = async () => {
        try {
            setLoading(true);
            const res = await coordinatorApi.getSupervisors();
            if (res.success) {
                setSupervisors(res.data || []);
            }
        } catch (error) {
            console.error('Failed to load supervisor workload:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSupervisors();
    }, []);

    const filtered = supervisors.filter(s => {
        if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (s.name && s.name.toLowerCase().includes(term)) ||
                   (s.email && s.email.toLowerCase().includes(term));
        }
        return true;
    });

    const totalSupervisors = supervisors.length;
    const uniSupervisors = supervisors.filter(s => s.role === 'university_supervisor').length;
    const industrySupervisors = supervisors.filter(s => s.role === 'industry_supervisor').length;
    const totalAssignments = supervisors.reduce((acc, s) => acc + (s.assignedStudentsCount || 0), 0);
    const avgRatio = totalSupervisors > 0 ? (totalAssignments / totalSupervisors).toFixed(1) : 0;

    const getCapacityBadge = (status) => {
        switch (status) {
            case 'high':
                return <Badge variant="danger" size="sm" dot={true}>High Load (≥15)</Badge>;
            case 'moderate':
                return <Badge variant="warning" size="sm" dot={true}>Moderate (8-14)</Badge>;
            default:
                return <Badge variant="success" size="sm" dot={true}>Optimal (&lt;8)</Badge>;
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-violet-600/15 border border-violet-500/25 rounded-lg flex items-center justify-center text-violet-300">
                        <Users size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Resource Governance</span>
                        <h1 className="text-xl font-semibold text-white tracking-tight">
                            Supervisor Workload & Capacity
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Monitor faculty and industry allocations, capacity saturation, and pending evaluation items.
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    onClick={loadSupervisors}
                    className="flex items-center gap-1.5 text-xs py-1.5 px-3 self-start md:self-auto"
                >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Refresh Matrix</span>
                </Button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Active Supervisors</span>
                        <Users className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div className="kpi-metric-value mt-2">{totalSupervisors}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>Distribution</span>
                        <span className="font-mono text-slate-300">{uniSupervisors} Uni | {industrySupervisors} Ind</span>
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Active Pairings</span>
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <div className="kpi-metric-value text-sky-400 mt-2">{totalAssignments}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>Total assigned</span>
                        <span className="font-mono text-slate-300">{totalAssignments} links</span>
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Average Ratio</span>
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="kpi-metric-value text-emerald-400 mt-2">{avgRatio} <span className="text-xs font-normal text-slate-400">: 1</span></div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>Mentees per mentor</span>
                        <span className="font-mono text-emerald-400">Target &lt; 15</span>
                    </div>
                </div>

                <div className="craft-card p-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium">Saturation Alerts</span>
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div className="kpi-metric-value text-rose-400 mt-2">
                        {supervisors.filter(s => s.capacityStatus === 'high').length}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                        <span>Exceeding threshold</span>
                        <span className="font-mono text-rose-300">High load</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#22242f]">
                <div className="segmented-tabs">
                    {[
                        { id: 'ALL', label: 'All Supervisors' },
                        { id: 'university_supervisor', label: 'University Faculty' },
                        { id: 'industry_supervisor', label: 'Industry Mentors' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setRoleFilter(tab.id)}
                            className={`segmented-tab-btn text-xs ${
                                roleFilter === tab.id ? 'active' : ''
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                    <input
                        placeholder="Search supervisor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#181a24] border border-[#22242f] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 font-sans"
                    />
                </div>
            </div>

            {/* Workload Table */}
            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <LoadingSkeleton key={i} className="h-14 rounded-md" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="craft-card p-10 text-center space-y-1.5">
                    <Users className="w-8 h-8 text-slate-500 mx-auto mb-1 opacity-70" />
                    <h3 className="text-xs font-semibold text-white">No supervisors found</h3>
                    <p className="text-[11px] text-slate-400">Try adjusting your search or role filter.</p>
                </div>
            ) : (
                <div className="craft-card p-5 space-y-3">
                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#12141c] text-slate-400 font-medium border-b border-[#22242f]">
                                <tr>
                                    <th className="py-2.5 px-5">Supervisor</th>
                                    <th className="py-2.5 px-5">Role Type</th>
                                    <th className="py-2.5 px-5 text-center">Assigned</th>
                                    <th className="py-2.5 px-5 text-center">Active</th>
                                    <th className="py-2.5 px-5 text-center">Pending Reviews</th>
                                    <th className="py-2.5 px-5 text-center">Completed</th>
                                    <th className="py-2.5 px-5 text-center">Pending Visits</th>
                                    <th className="py-2.5 px-5 text-right">Capacity Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#22242f]">
                                {filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-[#181a24] transition-colors">
                                        <td className="py-2.5 px-5">
                                            <div className="font-medium text-white">{s.name}</div>
                                            <div className="text-[10px] text-slate-500">{s.email}</div>
                                        </td>
                                        <td className="py-2.5 px-5">
                                            <Badge variant={s.role === 'university_supervisor' ? 'indigo' : 'success'} size="sm">
                                                {s.role === 'university_supervisor' ? 'University' : 'Industry'}
                                            </Badge>
                                        </td>
                                        <td className="py-2.5 px-5 text-center font-mono font-medium text-white">
                                            {s.assignedStudentsCount || 0}
                                        </td>
                                        <td className="py-2.5 px-5 text-center font-mono text-emerald-400">
                                            {s.activeStudentsCount || 0}
                                        </td>
                                        <td className="py-2.5 px-5 text-center font-mono text-amber-400">
                                            {s.pendingLogbooksCount || 0}
                                        </td>
                                        <td className="py-2.5 px-5 text-center font-mono text-sky-400">
                                            {s.completedAssessmentsCount || 0}
                                        </td>
                                        <td className="py-2.5 px-5 text-center font-mono text-violet-400">
                                            {s.pendingSupervisionCount || 0}
                                        </td>
                                        <td className="py-2.5 px-5 text-right">
                                            {getCapacityBadge(s.capacityStatus)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
