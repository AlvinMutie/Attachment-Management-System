import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    Users,
    CheckCircle,
    XCircle,
    Camera,
    Clock,
    History,
    AlertCircle,
    ArrowUpRight,
    MessageSquare,
    Check,
    X,
    Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import {
    getAssignedStudents,
    getSupervisorLogbooks,
    reviewLogbook,
    getSupervisorAttendance,
    markSupervisorAttendance
} from '../../utils/supervisorApi';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-8 flex flex-col justify-between h-full bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 hover:border-blue-500/20 transition-all group rounded-m3-large overflow-hidden relative">
        <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{label}</p>
            <div className={`p-3 rounded-2xl bg-white/5 ${color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="text-4xl font-black text-white tracking-tighter relative z-10">{value}</p>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 blur-xl rounded-full" />
    </div>
);

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [pendingLogbooks, setPendingLogbooks] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState([]);
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(true);

    // Modal state for reviewing logbook
    const [selectedLogbook, setSelectedLogbook] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewing, setReviewing] = useState(false);

    const loadData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const [studRes, logRes, attRes] = await Promise.all([
                getAssignedStudents().catch(() => ({ data: { data: [] } })),
                getSupervisorLogbooks({ status: 'pending' }).catch(() => ({ data: { data: [] } })),
                getSupervisorAttendance({ date: today }).catch(() => ({ data: { data: [] } }))
            ]);

            setStudents(studRes.data?.data || []);
            setPendingLogbooks(logRes.data?.data || []);
            setTodayAttendance(attRes.data?.data || []);
        } catch (err) {
            console.error('Failed to load supervisor data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let scanner;
        if (isScanning) {
            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            });

            scanner.render((result) => {
                setScanResult(result);
                setIsScanning(false);
                scanner.clear();
            }, (error) => { });
        }

        return () => {
            if (scanner) scanner.clear();
        };
    }, [isScanning]);

    const handleReviewSubmit = async (status) => {
        if (!selectedLogbook) return;
        setReviewing(true);
        try {
            await reviewLogbook(selectedLogbook.id, {
                status,
                supervisorComment: reviewComment
            });
            setSelectedLogbook(null);
            setReviewComment('');
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to review logbook');
        } finally {
            setReviewing(false);
        }
    };

    const presentCount = todayAttendance.filter(a => a.status === 'present').length;

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-12 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-blue-600/5 p-10 rounded-m3-xl border border-blue-600/10 backdrop-blur-md">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 ring-1 ring-white/20">
                            <Briefcase className="text-white" size={40} />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-70">Industrial Management</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Industry <span className="text-blue-500">Supervisor</span></h1>
                            <p className="text-slate-500 font-medium max-w-md text-sm">Managing attached students, evaluating logbook reports, and verifying presence records.</p>
                        </div>
                    </div>
                    <div className="flex bg-blue-600/10 p-2 rounded-2xl border border-blue-600/20 shadow-lg">
                        <div className="flex items-center gap-4 px-6 py-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                            <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase">Active Roster</span>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={Users} label="Assigned Students" value={students.length} color="text-blue-400" />
                    <StatCard icon={CheckCircle} label="Today's Present" value={presentCount} color="text-emerald-400" />
                    <StatCard icon={AlertCircle} label="Pending Logbooks" value={pendingLogbooks.length} color="text-amber-400" />
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* QR Attendance Scanner */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-10 flex flex-col items-center justify-center space-y-10 bg-gradient-to-br from-white/[0.04] to-transparent !rounded-m3-xl shadow-2xl">
                            <div className="text-center w-full space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Clock-in Student</h3>
                                <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">QR Presence Verification</p>
                            </div>

                            {!isScanning ? (
                                <div
                                    onClick={() => setIsScanning(true)}
                                    className="w-full aspect-square bg-white/[0.02] border-2 border-dashed border-white/10 rounded-m3-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-blue-500/30 transition-all group shadow-inner"
                                >
                                    <div className="w-24 h-24 bg-blue-600/10 text-blue-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                                        <Camera size={48} />
                                    </div>
                                    <span className="text-slate-500 font-black text-[11px] uppercase tracking-[0.25em] group-hover:text-blue-400">Initialize Camera</span>
                                </div>
                            ) : (
                                <div id="reader" className="w-full overflow-hidden rounded-m3-xl border-4 border-blue-600/50 shadow-2xl" />
                            )}

                            {scanResult && (
                                <div className="w-full bg-emerald-600/10 border border-emerald-600/20 p-6 rounded-[2rem] animate-fade-in text-center">
                                    <div className="flex items-center justify-center space-x-3 text-emerald-400 mb-2">
                                        <CheckCircle size={24} />
                                        <span className="font-black uppercase tracking-widest text-xs">Verified</span>
                                    </div>
                                    <p className="text-[10px] font-mono text-slate-400 truncate">{scanResult}</p>
                                    <button
                                        onClick={() => setScanResult(null)}
                                        className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-4 hover:underline"
                                    >
                                        Scan Another Student
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Today's Live Attendance */}
                        <div className="glass-card p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Today's Check-ins</h3>
                                <History size={16} className="text-blue-400" />
                            </div>
                            <div className="space-y-4">
                                {todayAttendance.length > 0 ? (
                                    todayAttendance.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-white tracking-tight">{log.student?.user?.name || 'Student'}</p>
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{log.verificationMethod || 'Verified'}</p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/20">
                                                {log.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 text-center py-4 font-bold uppercase tracking-widest">No check-ins today yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pending Reviews & Roster */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-white tracking-tighter">Pending Logbook Reviews</h3>
                            <span className="bg-amber-600/20 text-amber-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-500/20 tracking-widest">
                                {pendingLogbooks.length} Pending
                            </span>
                        </div>

                        <div className="space-y-6 px-2">
                            {pendingLogbooks.length > 0 ? (
                                pendingLogbooks.map((log) => (
                                    <div key={log.id} className="glass-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-600/30 transition-all bg-gradient-to-r from-blue-600/5 to-transparent !rounded-m3-xl">
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-white tracking-tighter">{log.student?.user?.name || 'Student'}</h4>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Week {log.weekNumber} • {log.startDate} to {log.endDate}</p>
                                            <p className="text-slate-300 text-sm italic line-clamp-2">"{log.summary}"</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => { setSelectedLogbook(log); setReviewComment(log.supervisorComment || ''); }}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center space-x-2"
                                            >
                                                <span>Review</span>
                                                <ArrowUpRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center glass-card text-slate-500 text-xs font-bold uppercase tracking-widest">
                                    All submitted logbooks have been reviewed.
                                </div>
                            )}
                        </div>

                        {/* Student Watchlist */}
                        <div className="glass-card overflow-hidden">
                            <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs">Assigned Student Roster</h3>
                                <a href="/industry/attendance" className="text-blue-500 text-xs font-black tracking-widest uppercase hover:underline">Attendance Hub</a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.02]">
                                        <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
                                            <th className="px-8 py-5">Managed Student</th>
                                            <th className="px-8 py-5">Admission No</th>
                                            <th className="px-8 py-5">Course</th>
                                            <th className="px-8 py-5 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium">
                                        {students.length > 0 ? (
                                            students.map((s) => (
                                                <tr key={s.id} className="hover:bg-white/[0.03] transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-1.5 h-6 bg-blue-600 rounded-full group-hover:h-8 transition-all" />
                                                            <div>
                                                                <p className="text-sm font-black text-white">{s.user?.name}</p>
                                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-slate-300 text-xs font-bold">{s.admissionNumber}</td>
                                                    <td className="px-8 py-6 text-slate-400 text-xs font-bold">{s.course || s.department}</td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="text-[9px] font-black uppercase text-emerald-400 px-3 py-1 bg-emerald-600/10 rounded-full tracking-tighter border border-emerald-500/20">
                                                            {s.placementStatus || 'ACTIVE'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                    No students assigned yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logbook Review Modal */}
            {selectedLogbook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedLogbook(null)} />
                    <div className="relative w-full max-w-2xl glass-card p-8 border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-white">Review Week {selectedLogbook.weekNumber} Logbook</h3>
                                <p className="text-xs text-slate-400">Student: {selectedLogbook.student?.user?.name}</p>
                            </div>
                            <button onClick={() => setSelectedLogbook(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Student Weekly Summary</span>
                                <p className="text-sm text-slate-300">{selectedLogbook.summary}</p>
                            </div>

                            {selectedLogbook.dailyEntries && typeof selectedLogbook.dailyEntries === 'object' && (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Activity Breakdown</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        {Object.entries(selectedLogbook.dailyEntries).map(([day, text]) => (
                                            <div key={day} className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                                <span className="font-bold uppercase text-[9px] text-blue-400 block">{day}</span>
                                                <span className="text-slate-300">{text || 'No entry logged'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Supervisor Feedback & Guidance</label>
                                <textarea
                                    rows={4}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Add constructive feedback or corrections..."
                                    className="input-field w-full p-3 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewSubmit('rejected')}
                                className="px-6 py-3 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-600/20 hover:bg-rose-600/20 text-xs font-bold uppercase tracking-widest"
                            >
                                Request Revision
                            </button>
                            <button
                                type="button"
                                disabled={reviewing}
                                onClick={() => handleReviewSubmit('approved')}
                                className="btn-primary px-8 py-3 text-xs flex items-center gap-2"
                            >
                                <Check size={16} />
                                <span>{reviewing ? 'Saving...' : 'Approve Logbook'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default SupervisorDashboard;
