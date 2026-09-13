import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    RefreshCw,
    GraduationCap,
    Briefcase,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    AlertTriangle,
    SlidersHorizontal,
    Mail,
    ChevronRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { LoadingSkeleton } from '../../components/ui';

export default function SupervisorWorkload() {
    const [loading, setLoading] = useState(true);
    const [supervisors, setSupervisors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const loadSupervisors = async () => {
        try {
            setLoading(true);
            const res = await coordinatorApi.getSupervisors().catch(() => ({ success: false }));
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

    const getCapacityInfo = (count) => {
        if (count >= 15) {
            return {
                label: 'High Load (≥15)',
                badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                barClass: 'bg-rose-500',
                dotClass: 'bg-rose-400'
            };
        }
        if (count >= 8) {
            return {
                label: 'Moderate (8-14)',
                badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                barClass: 'bg-amber-500',
                dotClass: 'bg-amber-400'
            };
        }
        return {
            label: 'Optimal (<8)',
            badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            barClass: 'bg-emerald-500',
            dotClass: 'bg-emerald-400'
        };
    };

    if (loading && supervisors.length === 0) {
        return (
            <DashboardLayout role="attachment_coordinator">
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

    return (
        <DashboardLayout role="attachment_coordinator">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600/20 to-sky-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10 shrink-0">
                                <Users size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Resource Governance
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {totalSupervisors} Active Supervisors
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Supervisor Workload & Capacity Matrix
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Monitor faculty and industry allocations, prevent capacity saturation, and balance mentee distributions.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={loadSupervisors}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin text-teal-400' : ''} />
                                <span>{loading ? 'Refreshing...' : 'Refresh Matrix'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Mentors</span>
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalSupervisors}</span>
                            <span className="text-xs text-slate-500">supervisors</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Supervision pool</span>
                            <span className="text-teal-400 font-medium">All active</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faculty Supervisors</span>
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <GraduationCap size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-400 font-mono">{uniSupervisors}</span>
                            <span className="text-xs text-slate-500">academic staff</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>University oversight</span>
                            <span className="text-purple-400 font-medium">Academic leads</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry Mentors</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Briefcase size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{industrySupervisors}</span>
                            <span className="text-xs text-slate-500">workplace mentors</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Host organizations</span>
                            <span className="text-emerald-400 font-medium">Industry leads</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Mentee Load</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <SlidersHorizontal size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">{avgRatio}</span>
                            <span className="text-xs text-slate-500">students / mentor</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Capacity target: &lt;10</span>
                            <span className="text-sky-400 font-medium">{avgRatio <= 10 ? 'Balanced' : 'High'}</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by supervisor name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Role:
                        </span>
                        {[
                            { id: 'ALL', label: 'All Supervisors' },
                            { id: 'university_supervisor', label: 'University Faculty' },
                            { id: 'industry_supervisor', label: 'Industry Mentors' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setRoleFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                                    roleFilter === tab.id
                                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Supervisor Workload Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3.5 px-6">Supervisor Mentor</th>
                                    <th className="py-3.5 px-6">Supervision Role</th>
                                    <th className="py-3.5 px-6">Mentee Load</th>
                                    <th className="py-3.5 px-6">Capacity Saturation</th>
                                    <th className="py-3.5 px-6 text-right">Assigned Students Preview</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {filtered.length > 0 ? (
                                    filtered.map((s) => {
                                        const count = s.assignedStudentsCount || 0;
                                        const cap = getCapacityInfo(count);
                                        const isUni = s.role === 'university_supervisor';

                                        return (
                                            <tr key={s.id} className="hover:bg-[#181a24]/50 transition-colors">
                                                <td className="py-3.5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs uppercase ${
                                                            isUni ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                        }`}>
                                                            {s.name ? s.name.charAt(0) : 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-100">{s.name || 'Supervisor'}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">{s.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        isUni ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    }`}>
                                                        {isUni ? 'Faculty Lead' : 'Industry Host'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6 font-mono text-[11px] text-slate-200">
                                                    <div className="space-y-1">
                                                        <span className="font-bold">{count} Mentees</span>
                                                        <div className="w-24 bg-[#181a24] rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className={`h-1.5 rounded-full ${cap.barClass}`}
                                                                style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cap.badgeClass}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${cap.dotClass}`} />
                                                        {cap.label}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6 text-right text-slate-400 text-xs italic max-w-xs truncate">
                                                    {s.assignedStudents && s.assignedStudents.length > 0 ? (
                                                        s.assignedStudents.map(st => st.user?.name || st.name).join(', ')
                                                    ) : (
                                                        count > 0 ? `${count} active mentees` : 'No mentees allocated'
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                                            No supervisors match the current filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
