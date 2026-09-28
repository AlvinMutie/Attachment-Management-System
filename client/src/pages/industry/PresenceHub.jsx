import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    User,
    Users,
    RefreshCw,
    QrCode,
    FileText,
    ArrowRight,
    Check
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getLivePresence, markSupervisorAttendance } from '../../utils/supervisorApi';
import { LoadingSkeleton } from '../../components/ui';

const PresenceHub = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchPresence = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const response = await getLivePresence();
            let list = [];
            if (Array.isArray(response.data?.data)) list = response.data.data;
            else if (Array.isArray(response.data)) list = response.data;
            else if (Array.isArray(response?.data?.students)) list = response.data.students;
            setStudents(list);
        } catch (error) {
            console.error('Failed to fetch presence data:', error);
            setStudents([]);
        } finally {
            setLoading(false);
            if (isManual) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPresence();
        const interval = setInterval(() => fetchPresence(), 30000);
        return () => clearInterval(interval);
    }, []);

    const handleQuickCheckin = async (studentId) => {
        try {
            await markSupervisorAttendance({
                studentId,
                date: new Date().toISOString().split('T')[0],
                status: 'present',
                notes: 'Quick presence check-in via Presence Hub'
            });
            fetchPresence();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to mark attendance');
        }
    };

    const filtered = students.filter(s => {
        const matchSearch =
            (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.admissionNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const status = s.todayAttendance?.status || 'not-scanned';
        const matchStatus = statusFilter === 'all' || status === statusFilter;
        return matchSearch && matchStatus;
    });

    const presentCount = students.filter(s => s.todayAttendance?.status === 'present').length;
    const lateCount = students.filter(s => s.todayAttendance?.status === 'late').length;
    const absentCount = students.filter(s => s.todayAttendance?.status === 'absent').length;
    const notScanned = students.filter(s => !s.todayAttendance?.status).length;
    const total = students.length;
    const presenceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    const now = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

    const statusConfig = (status) => {
        if (status === 'present') return {
            label: 'Present',
            icon: CheckCircle2,
            chip: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20',
            dot: 'bg-emerald-500'
        };
        if (status === 'late') return {
            label: 'Late',
            icon: Clock,
            chip: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20',
            dot: 'bg-amber-500'
        };
        if (status === 'absent') return {
            label: 'Absent',
            icon: XCircle,
            chip: 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20',
            dot: 'bg-rose-500'
        };
        return {
            label: 'Not Scanned',
            icon: AlertCircle,
            chip: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
            dot: 'bg-slate-400'
        };
    };

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="max-w-7xl mx-auto space-y-5 pb-16 font-sans">

                {/* ============================================================= */}
                {/* WORKSPACE TOOLBAR                                               */}
                {/* ============================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                <span>Workspace</span>
                                <span>/</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Live Presence Hub</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-black text-[#0a0d14] dark:text-white tracking-tight">Presence Hub</h1>
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Live · Refreshes every 30s
                                </span>
                            </div>
                            <p className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                Real-time intern check-in status as of {now}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <button
                                onClick={() => fetchPresence(true)}
                                disabled={refreshing}
                                className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={13} className={`text-[#5b6276] dark:text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                            <Link
                                to="/industry/attendance"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                            >
                                <FileText size={13} />
                                <span>Full Ledger</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ============================================================= */}
                {/* KPI STRIP — Today's Snapshot                                    */}
                {/* ============================================================= */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                        { label: 'Total Interns', value: total, pill: 'bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 border-violet-300 dark:border-violet-500/20', pillText: 'Assigned', color: 'text-[#0a0d14] dark:text-white' },
                        { label: 'Present', value: presentCount, pill: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20', pillText: `${presenceRate}% rate`, color: 'text-emerald-700 dark:text-emerald-400', bar: presenceRate },
                        { label: 'Late', value: lateCount, pill: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20', pillText: 'Checked in late', color: 'text-amber-700 dark:text-amber-400' },
                        { label: 'Not Scanned', value: notScanned, pill: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700', pillText: 'Awaiting scan', color: 'text-[#5b6276] dark:text-slate-400' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 shadow-2xs hover:border-emerald-500/30 transition-colors flex flex-col gap-2.5">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">{m.label}</span>
                            <span className={`text-3xl font-black font-mono tracking-tight ${m.color}`}>{m.value}</span>
                            {m.bar !== undefined ? (
                                <div className="space-y-1">
                                    <div className="w-full h-1 bg-[#e5e0d5] dark:bg-[#1e2230] rounded-full overflow-hidden">
                                        <div className="h-1 bg-emerald-500 rounded-full transition-all" style={{ width: `${m.bar}%` }} />
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border self-start ${m.pill}`}>{m.pillText}</span>
                                </div>
                            ) : (
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border self-start ${m.pill}`}>{m.pillText}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* ============================================================= */}
                {/* SEARCH + FILTER + STUDENT GRID                                  */}
                {/* ============================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl shadow-xs overflow-hidden">
                    {/* Controls */}
                    <div className="p-4 border-b border-[#e5e0d5] dark:border-[#202330] flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09d93] dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name or admission number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 text-xs font-mono bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] rounded-lg text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'present', 'late', 'absent', 'not-scanned'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize border transition-colors cursor-pointer whitespace-nowrap ${
                                        statusFilter === f
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-[#faf9f6] dark:bg-[#161822] text-[#5b6276] dark:text-slate-400 border-[#e2ddd3] dark:border-[#22242f]'
                                    }`}
                                >
                                    {f.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Student Cards Grid */}
                    {loading ? (
                        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5, 6].map(i => <LoadingSkeleton key={i} className="h-24 rounded-xl" />)}
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filtered.map((s) => {
                                const status = s.todayAttendance?.status || 'not-scanned';
                                const sc = statusConfig(status);
                                const name = s.user?.name || s.name || 'Intern';
                                const time = s.todayAttendance?.createdAt
                                    ? new Date(s.todayAttendance.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
                                    : null;

                                return (
                                    <div key={s.id} className="p-3.5 bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl hover:border-emerald-500/30 transition-colors space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-[#e5e0d5] dark:bg-[#22242f] border border-[#d6d0c2] dark:border-[#2a2e40] flex items-center justify-center font-black text-sm text-[#5b6276] dark:text-slate-400 uppercase shrink-0">
                                                    {name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-xs text-[#0a0d14] dark:text-white truncate">{name}</p>
                                                    <p className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400 truncate">{s.admissionNumber || s.user?.email || '—'}</p>
                                                </div>
                                            </div>
                                            <span className={`shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${sc.chip}`}>
                                                {sc.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                {time ? `Checked in at ${time}` : 'No scan today'}
                                            </div>

                                            {status === 'not-scanned' && (
                                                <button
                                                    onClick={() => handleQuickCheckin(s.id || s.studentId)}
                                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                                >
                                                    <Check size={11} />
                                                    <span>Check-in</span>
                                                </button>
                                            )}
                                        </div>

                                        {s.todayAttendance?.notes && (
                                            <p className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400 bg-white dark:bg-[#11131a] px-2 py-1.5 rounded border border-[#e2ddd3] dark:border-[#22242f]">
                                                Note: {s.todayAttendance.notes}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center space-y-2">
                            <Activity size={22} className="mx-auto text-[#d6d0c2] dark:text-slate-600" />
                            <p className="text-xs font-medium text-[#5b6276] dark:text-slate-400">No students match your filter</p>
                            <p className="text-[11px] text-[#a09d93] dark:text-slate-500">Try adjusting your search or filter selection</p>
                        </div>
                    )}

                    <div className="px-4 py-3 border-t border-[#e5e0d5] dark:border-[#202330]">
                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                            {filtered.length} of {students.length} interns shown
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PresenceHub;
