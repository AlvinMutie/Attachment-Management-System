import React, { useState, useEffect } from 'react';
import {
    Clock,
    Calendar,
    Search,
    Download,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Users,
    Plus,
    UserCheck,
    Filter,
    ArrowUpDown,
    Check,
    X,
    FileSpreadsheet
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

    // Modal state for marking attendance manually
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
            const fetchedStudents = studRes.data?.data || [];
            setStudents(fetchedStudents);
            if (fetchedStudents.length > 0 && !markForm.studentId) {
                setMarkForm(prev => ({ ...prev, studentId: fetchedStudents[0].id }));
            }
        } catch (err) {
            console.error('Failed to load supervisor attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

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

    const handleExportCSV = () => {
        if (filteredAttendance.length === 0) {
            alert('No attendance records to export.');
            return;
        }

        const headers = ['Student Name', 'Admission Number', 'Date', 'Status', 'Verification Method', 'Notes'];
        const rows = filteredAttendance.map(log => [
            `"${log.student?.user?.name || 'Unknown'}"`,
            `"${log.student?.admissionNumber || 'N/A'}"`,
            `"${log.date || ''}"`,
            `"${log.status || ''}"`,
            `"${log.verificationMethod || 'Manual'}"`,
            `"${(log.notes || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Attendance_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredAttendance = attendanceList.filter(a => {
        const matchesQuery =
            (a.student?.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.student?.admissionNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.date || '').includes(searchQuery);

        if (!matchesQuery) return false;
        if (statusFilter === 'all') return true;
        return a.status === statusFilter;
    });

    const presentCount = attendanceList.filter(a => a.status === 'present').length;
    const lateCount = attendanceList.filter(a => a.status === 'late').length;
    const absentCount = attendanceList.filter(a => a.status === 'absent').length;
    const excusedCount = attendanceList.filter(a => a.status === 'excused').length;

    if (loading) {
        return (
            <DashboardLayout role="industry_supervisor">
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
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
                                <Clock size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Audit Registry
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400 text-[11px] font-mono">
                                        {attendanceList.length} Total Records
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Attendance Audit Ledger
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Official timesheets, verified check-in history, and manual exception overrides for assigned interns.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleExportCSV}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <Download size={14} />
                                <span>Export CSV</span>
                            </button>
                            <button
                                onClick={() => setShowMarkModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} />
                                <span>Record Attendance</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Stats Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        onClick={() => setStatusFilter('present')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'present' ? 'border-emerald-500/50 bg-emerald-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Present Records</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{presentCount}</span>
                            <span className="text-xs text-slate-500">entries</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Compliance status</span>
                            <span className="text-emerald-400 font-mono font-semibold">
                                {attendanceList.length > 0 ? `${Math.round((presentCount / attendanceList.length) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('late')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'late' ? 'border-amber-500/50 bg-amber-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Late Arrivals</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Clock size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{lateCount}</span>
                            <span className="text-xs text-slate-500">entries</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Tardiness threshold</span>
                            <span className="text-amber-400 font-medium">Logged after 08:30</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('absent')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'absent' ? 'border-rose-500/50 bg-rose-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Absences</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <XCircle size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-400 font-mono">{absentCount}</span>
                            <span className="text-xs text-slate-500">entries</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Unexcused absences</span>
                            <span className="text-rose-400 font-medium">{absentCount > 0 ? 'Requires attention' : '0 unexcused'}</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('all')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'all' ? 'border-violet-500/50 bg-violet-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Recorded</span>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{attendanceList.length}</span>
                            <span className="text-xs text-slate-500">timesheet logs</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Cohort scope</span>
                            <span className="text-violet-400 font-medium">{students.length} students</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by student, admission number, or date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Status:
                        </span>
                        {[
                            { id: 'all', label: 'All Logs' },
                            { id: 'present', label: 'Present' },
                            { id: 'late', label: 'Late' },
                            { id: 'absent', label: 'Absent' },
                            { id: 'excused', label: 'Excused' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                                    statusFilter === tab.id
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Attendance Log Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3.5 px-6">Student Intern</th>
                                    <th className="py-3.5 px-6">Date</th>
                                    <th className="py-3.5 px-6">Attendance Status</th>
                                    <th className="py-3.5 px-6">Authentication Method</th>
                                    <th className="py-3.5 px-6 text-right">Remarks & Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {filteredAttendance.length > 0 ? (
                                    filteredAttendance.map((log) => (
                                        <tr key={log.id} className="hover:bg-[#181a24]/50 transition-colors">
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-slate-300 text-xs uppercase">
                                                        {log.student?.user?.name ? log.student.user.name.charAt(0) : 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-100">{log.student?.user?.name || 'Intern'}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono">{log.student?.admissionNumber || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-300 font-mono text-[11px]">
                                                {log.date}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    log.status === 'present'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : log.status === 'late'
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            : log.status === 'excused'
                                                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        log.status === 'present' ? 'bg-emerald-400' :
                                                        log.status === 'late' ? 'bg-amber-400' :
                                                        log.status === 'excused' ? 'bg-sky-400' : 'bg-rose-400'
                                                    }`} />
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-400 font-mono text-[11px]">
                                                <span className="px-2 py-0.5 rounded bg-[#181a24] border border-[#22242f] text-slate-300">
                                                    {log.verificationMethod || 'Manual Portal'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-right text-slate-400 text-xs italic">
                                                {log.notes || '—'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                                            No attendance entries found for the selected criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Record Attendance Modal */}
            {showMarkModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Record Intern Attendance</h3>
                                <p className="text-xs text-slate-400">Manual timesheet entry with supervisor authorization</p>
                            </div>
                            <button
                                onClick={() => setShowMarkModal(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleMarkSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Student Intern</label>
                                <select
                                    value={markForm.studentId}
                                    onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                                    required
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.name} ({s.admissionNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={markForm.date}
                                    onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Attendance Status</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['present', 'late', 'absent', 'excused'].map((st) => (
                                        <button
                                            key={st}
                                            type="button"
                                            onClick={() => setMarkForm({ ...markForm, status: st })}
                                            className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                                                markForm.status === st
                                                    ? st === 'present'
                                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                                        : st === 'late'
                                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                                            : st === 'excused'
                                                                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                                                                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                                    : 'bg-[#181a24] border-[#22242f] text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Remarks / Reason (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={markForm.notes}
                                    onChange={(e) => setMarkForm({ ...markForm, notes: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#181a24] border border-[#22242f] text-xs text-slate-200 placeholder-slate-500 resize-none outline-none focus:border-emerald-500 font-sans"
                                    placeholder="e.g., Authorized doctor appointment, site visit fieldwork..."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                                <button
                                    type="button"
                                    onClick={() => setShowMarkModal(false)}
                                    className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                                >
                                    <Check size={14} />
                                    <span>{submitting ? 'Recording...' : 'Submit Entry'}</span>
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
