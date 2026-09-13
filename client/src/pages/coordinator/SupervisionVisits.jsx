import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Calendar,
    Clock,
    User,
    Building2,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Search,
    Video,
    Briefcase,
    Filter,
    ArrowRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { LoadingSkeleton } from '../../components/ui';

export default function SupervisionVisits() {
    const [loading, setLoading] = useState(true);
    const [supervisionData, setSupervisionData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await coordinatorApi.getSupervisionOversight().catch(() => ({ success: false }));
            if (res.success) {
                setSupervisionData(res.data);
            }
        } catch (error) {
            console.error('Failed to load supervision visits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const summary = supervisionData?.summary || {};
    const meetings = supervisionData?.meetings || [];

    const filteredMeetings = meetings.filter(m => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
            (m.purpose || '').toLowerCase().includes(query) ||
            (m.student?.user?.name || '').toLowerCase().includes(query) ||
            (m.student?.admissionNumber || '').toLowerCase().includes(query) ||
            (m.industrySupervisor?.name || '').toLowerCase().includes(query);

        if (!matchesQuery) return false;
        if (statusFilter === 'ALL') return true;
        return (m.status || '').toLowerCase() === statusFilter.toLowerCase();
    });

    if (loading && meetings.length === 0) {
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
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10 shrink-0">
                                <MapPin size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Field Supervision
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {summary.total || meetings.length} Scheduled Visits
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Academic Supervision & Field Visits
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Institutional oversight of mandatory site inspections, on-site consultations, and verification meetings.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={loadData}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin text-teal-400' : ''} />
                                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Supervision Visits</span>
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <MapPin size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{summary.total || meetings.length}</span>
                            <span className="text-xs text-slate-500">visits</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Supervision record</span>
                            <span className="text-teal-400 font-medium">All visits</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('confirmed')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'confirmed' ? 'border-emerald-500/50 bg-emerald-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed / Verified</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{summary.completedCount || 0}</span>
                            <span className="text-xs text-slate-500">conducted</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Successfully verified</span>
                            <span className="text-emerald-400 font-mono font-medium">
                                {summary.total ? `${Math.round(((summary.completedCount || 0) / summary.total) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('pending')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'pending' ? 'border-amber-500/50 bg-amber-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Confirmation</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Clock size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{summary.pendingCount || 0}</span>
                            <span className="text-xs text-slate-500">pending</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Awaiting confirmation</span>
                            <span className="text-amber-400 font-medium">In coordination</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Scheduled</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <Calendar size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">{summary.upcomingCount || 0}</span>
                            <span className="text-xs text-slate-500">future</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Scheduled itinerary</span>
                            <span className="text-sky-400 font-medium">Upcoming</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by purpose, student, or supervisor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Status:
                        </span>
                        {[
                            { id: 'ALL', label: 'All Visits' },
                            { id: 'completed', label: 'Conducted' },
                            { id: 'confirmed', label: 'Confirmed' },
                            { id: 'pending', label: 'Pending' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                                    statusFilter === tab.id
                                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Supervision Visits Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3.5 px-6">Student Intern</th>
                                    <th className="py-3.5 px-6">Site Visit Purpose</th>
                                    <th className="py-3.5 px-6">Scheduled Date & Time</th>
                                    <th className="py-3.5 px-6">Venue Type</th>
                                    <th className="py-3.5 px-6">Host Supervisor</th>
                                    <th className="py-3.5 px-6 text-right">Oversight Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {filteredMeetings.length > 0 ? (
                                    filteredMeetings.map((m) => {
                                        const isPhysical = m.type === 'physical';
                                        const dateObj = new Date(m.scheduledAt);

                                        return (
                                            <tr key={m.id} className="hover:bg-[#181a24]/50 transition-colors">
                                                <td className="py-3.5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-teal-400 text-xs uppercase">
                                                            {m.student?.user?.name ? m.student.user.name.charAt(0) : 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-100">{m.student?.user?.name || 'Student'}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">{m.student?.admissionNumber || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-200 font-medium max-w-xs truncate">
                                                    {m.purpose || 'Supervision Review'}
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-300 font-mono text-[11px]">
                                                    {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        isPhysical
                                                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    }`}>
                                                        {isPhysical ? <MapPin size={10} /> : <Video size={10} />}
                                                        {isPhysical ? 'On-Site' : 'Virtual'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-300">
                                                    {m.industrySupervisor?.name || 'Workplace Host'}
                                                </td>
                                                <td className="py-3.5 px-6 text-right">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        m.status === 'completed' || m.status === 'confirmed'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : m.status === 'pending'
                                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            m.status === 'completed' || m.status === 'confirmed' ? 'bg-emerald-400' :
                                                            m.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
                                                        }`} />
                                                        {m.status || 'Scheduled'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                                            No supervision visits match the current filter criteria.
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
