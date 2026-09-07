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
    UserCheck
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getSupervisorAttendance, getAssignedStudents, markSupervisorAttendance } from '../../utils/supervisorApi';

const AttendanceMonitoring = () => {
    const [attendanceList, setAttendanceList] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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
            setStudents(studRes.data?.data || []);
            if (studRes.data?.data?.length > 0 && !markForm.studentId) {
                setMarkForm(prev => ({ ...prev, studentId: studRes.data.data[0].id }));
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

    const filteredAttendance = attendanceList.filter(a =>
        a.student?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.student?.admissionNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.date?.includes(searchQuery)
    );

    const presentCount = attendanceList.filter(a => a.status === 'present').length;
    const lateCount = attendanceList.filter(a => a.status === 'late').length;
    const absentCount = attendanceList.filter(a => a.status === 'absent').length;

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-12 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-1 ring-white/20">
                            <Clock className="text-white" size={40} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Ops Tracking</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Attendance <span className="text-blue-500">Registry</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">Daily attendance records, presence authentication, and manual verification for assigned students.</p>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowMarkModal(true)}
                            className="btn-primary px-6 py-3.5 text-xs flex items-center gap-2"
                        >
                            <Plus size={18} />
                            <span>Record Attendance</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Present Records</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{presentCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Late Records</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{lateCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-600/10 text-amber-500 rounded-2xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Absent Records</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{absentCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-rose-600/10 text-rose-500 rounded-2xl flex items-center justify-center">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search student name, admission number, or date..."
                        className="input-field pl-12 h-14 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Attendance Log Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <th className="px-8 py-6">Student Account</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6">Verification Method</th>
                                    <th className="px-8 py-6 text-right">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {filteredAttendance.length > 0 ? (
                                    filteredAttendance.map((log) => (
                                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-blue-500 border border-white/5 uppercase">
                                                        {log.student?.user?.name ? log.student.user.name.charAt(0) : 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white tracking-tight">{log.student?.user?.name || 'Student'}</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.student?.admissionNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-slate-300 text-xs font-bold leading-tight">
                                                {log.date}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${log.status === 'present'
                                                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20'
                                                        : log.status === 'late'
                                                            ? 'bg-amber-600/20 text-amber-400 border-amber-500/20'
                                                            : 'bg-rose-600/20 text-rose-400 border-rose-500/20'
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-400 text-xs font-bold">
                                                {log.verificationMethod || 'manual'}
                                            </td>
                                            <td className="px-8 py-6 text-right text-slate-400 text-xs italic">
                                                {log.notes || '---'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            No attendance records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Mark Attendance Modal */}
            {showMarkModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowMarkModal(false)} />
                    <div className="relative w-full max-w-md glass-card p-8 border-white/10 shadow-2xl space-y-6">
                        <h3 className="text-xl font-black text-white">Record Student Attendance</h3>
                        <form onSubmit={handleMarkSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Student</label>
                                <select
                                    value={markForm.studentId}
                                    onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                                    className="input-field w-full"
                                    required
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.user?.name} ({s.admissionNumber})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</label>
                                <input
                                    type="date"
                                    value={markForm.date}
                                    onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                                    className="input-field w-full"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Attendance Status</label>
                                <select
                                    value={markForm.status}
                                    onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}
                                    className="input-field w-full"
                                >
                                    <option value="present">Present</option>
                                    <option value="late">Late</option>
                                    <option value="absent">Absent</option>
                                    <option value="excused">Excused</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Notes / Remarks</label>
                                <textarea
                                    rows={3}
                                    value={markForm.notes}
                                    onChange={(e) => setMarkForm({ ...markForm, notes: e.target.value })}
                                    className="input-field w-full p-3 resize-none"
                                    placeholder="Optional notes..."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setShowMarkModal(false)}
                                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary px-8 py-3 text-xs"
                                >
                                    {submitting ? 'Recording...' : 'Submit Entry'}
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
