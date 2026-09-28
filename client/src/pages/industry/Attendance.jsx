import React, { useState, useEffect } from 'react';
import {
    Clock,
    Calendar,
    Search,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Users,
    Plus,
    UserCheck,
    Check,
    X,
    FileSpreadsheet,
    RefreshCw,
    Filter,
    Download,
    ChevronDown,
    TrendingUp
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getSupervisorAttendance, getAssignedStudents, markSupervisorAttendance } from '../../utils/supervisorApi';
import { LoadingSkeleton } from '../../components/ui';

const AttendanceMonitoring = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const [showMarkModal, setShowMarkModal] = useState(false);
    const [markForm, setMarkForm] = useState({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        try {
            const [attRes, studRes] = await Promise.all([
                getSupervisorAttendance().catch(() => ({ data: { data: [] } })),
                getAssignedStudents().catch(() => ({ data: { data: [] } }))
            ]);
            setAttendanceList(attRes.data?.data || []);
            const fetched = studRes.data?.data || [];
            setStudents(fetched);
            if (fetched.length > 0 && !markForm.studentId) {
                setMarkForm(prev => ({ ...prev, studentId: fetched[0].id }));
            }
        } catch (err) {
            console.error('Failed to load supervisor attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleMarkSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await markSupervisorAttendance(markForm);
            setShowMarkModal(false);
            setMarkForm({
                studentId: students[0]?.id || '',
                date: new Date().toISOString().split('T')[0],
                status: 'present',
                notes: ''
            });
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = attendanceList.filter(a => {
        const name = a.student?.user?.name || '';
        const adm = a.student?.admissionNumber || '';
        const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || adm.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const presentCount = attendanceList.filter(a => a.status === 'present').length;
    const lateCount = attendanceList.filter(a => a.status === 'late').length;
    const absentCount = attendanceList.filter(a => a.status === 'absent').length;
    const totalRecords = attendanceList.length;

    const statusChip = (status) => {
        if (status === 'present') return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20';
        if (status === 'late') return 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20';
        if (status === 'absent') return 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20';
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
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
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Attendance Audit Ledger</span>
                            </div>
                            <h1 className="text-lg font-black text-[#0a0d14] dark:text-white tracking-tight">
                                Attendance Monitoring
                            </h1>
                            <p className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                Full historical attendance records across all assigned interns
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <button
                                onClick={loadData}
                                className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={13} className="text-[#5b6276] dark:text-slate-400" />
                                <span>Sync</span>
                            </button>
                            <button
                                onClick={() => setShowMarkModal(true)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <Plus size={13} />
                                <span>Mark Attendance</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ============================================================= */}
                {/* KPI STRIP                                                        */}
                {/* ============================================================= */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                        { label: 'Total Records', value: totalRecords, pill: 'bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 border-violet-300 dark:border-violet-500/20', pillText: 'All time', color: 'text-[#0a0d14] dark:text-white' },
                        { label: 'Present', value: presentCount, pill: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20', pillText: 'Verified', color: 'text-emerald-700 dark:text-emerald-400' },
                        { label: 'Late Arrivals', value: lateCount, pill: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20', pillText: 'Marked late', color: 'text-amber-700 dark:text-amber-400' },
                        { label: 'Absences', value: absentCount, pill: 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20', pillText: 'No-shows', color: 'text-rose-700 dark:text-rose-400' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 shadow-2xs hover:border-emerald-500/30 transition-colors flex flex-col gap-2.5">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">{m.label}</span>
                            <span className={`text-3xl font-black font-mono tracking-tight ${m.color}`}>{m.value}</span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border self-start ${m.pill}`}>{m.pillText}</span>
                        </div>
                    ))}
                </div>

                {/* ============================================================= */}
                {/* SEARCH + FILTER BAR + TABLE                                     */}
                {/* ============================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl shadow-xs overflow-hidden">
                    {/* Search + Filters */}
                    <div className="p-4 border-b border-[#e5e0d5] dark:border-[#202330] flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09d93] dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by intern name or admission number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 text-xs font-mono bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] rounded-lg text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        <div className="flex gap-2">
                            {['all', 'present', 'late', 'absent'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize border transition-colors cursor-pointer ${
                                        statusFilter === f
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-[#faf9f6] dark:bg-[#161822] text-[#5b6276] dark:text-slate-400 border-[#e2ddd3] dark:border-[#22242f] hover:border-emerald-500/40'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4, 5].map(i => <LoadingSkeleton key={i} className="h-12 rounded-xl" />)}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#f0eee6] dark:bg-[#161822] border-b border-[#e5e0d5] dark:border-[#202330]">
                                    <tr>
                                        {['Intern', 'Adm. No.', 'Date', 'Status', 'Method', 'Notes'].map((h, i) => (
                                            <th key={i} className="py-3 px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e5e0d5] dark:divide-[#202330]">
                                    {filtered.length > 0 ? filtered.map((a) => (
                                        <tr key={a.id} className="hover:bg-[#f7f6f2] dark:hover:bg-[#161822] transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-[#e5e0d5] dark:bg-[#22242f] border border-[#d6d0c2] dark:border-[#2a2e40] flex items-center justify-center font-bold text-[#5b6276] dark:text-slate-400 text-xs uppercase">
                                                        {a.student?.user?.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#0a0d14] dark:text-slate-100">{a.student?.user?.name || 'Intern'}</p>
                                                        <p className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">{a.student?.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-[11px] text-[#5b6276] dark:text-slate-400">
                                                {a.student?.admissionNumber || '—'}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-[11px] text-[#0a0d14] dark:text-slate-200">
                                                {a.date || new Date().toISOString().split('T')[0]}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border capitalize ${statusChip(a.status)}`}>
                                                    {a.status || 'present'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                                {a.verificationMethod || 'Manual'}
                                            </td>
                                            <td className="py-3 px-4 text-[11px] text-[#5b6276] dark:text-slate-400 max-w-[160px] truncate">
                                                {a.notes || '—'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-10 text-[#5b6276] dark:text-slate-500 text-xs">
                                                <FileSpreadsheet size={22} className="mx-auto mb-2 text-[#d6d0c2] dark:text-slate-600" />
                                                No records match your filters
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="px-4 py-3 border-t border-[#e5e0d5] dark:border-[#202330] flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                            Showing {filtered.length} of {attendanceList.length} records
                        </span>
                    </div>
                </div>
            </div>

            {/* ============================================================= */}
            {/* MARK ATTENDANCE MODAL                                           */}
            {/* ============================================================= */}
            {showMarkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-5 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <h3 className="text-sm font-black text-[#0a0d14] dark:text-white">Record Attendance</h3>
                            <button onClick={() => setShowMarkModal(false)} className="text-[#5b6276] dark:text-slate-400 hover:text-[#0a0d14] dark:hover:text-white p-1 rounded cursor-pointer">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleMarkSubmit} className="space-y-3.5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">Intern</label>
                                <select
                                    value={markForm.studentId}
                                    onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs font-mono text-[#0a0d14] dark:text-white outline-none focus:border-emerald-500 cursor-pointer"
                                    required
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.user?.name || 'Intern'} — {s.admissionNumber}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    value={markForm.date}
                                    onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs font-mono text-[#0a0d14] dark:text-white outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['present', 'late', 'absent'].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setMarkForm({ ...markForm, status: s })}
                                            className={`py-2 rounded-xl text-xs font-mono font-bold capitalize border transition-colors cursor-pointer ${
                                                markForm.status === s
                                                    ? s === 'present'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                                                        : s === 'late'
                                                            ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
                                                            : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
                                                    : 'bg-[#faf9f6] dark:bg-[#161822] border-[#e2ddd3] dark:border-[#22242f] text-[#5b6276] dark:text-slate-400'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">Notes (Optional)</label>
                                <input
                                    type="text"
                                    value={markForm.notes}
                                    onChange={(e) => setMarkForm({ ...markForm, notes: e.target.value })}
                                    placeholder="Reason for absence, late arrival note..."
                                    className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs font-mono text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e5e0d5] dark:border-[#202330]">
                                <button
                                    type="button"
                                    onClick={() => setShowMarkModal(false)}
                                    className="px-4 py-2 rounded-xl bg-[#f6f5ee] dark:bg-[#181a24] border border-[#e2ddd3] dark:border-[#22242f] text-[#5b6276] dark:text-slate-400 text-xs font-mono font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                                >
                                    <Check size={13} />
                                    <span>{submitting ? 'Recording...' : 'Record Attendance'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AttendanceMonitoring;
