import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    QrCode,
    TrendingUp,
    AlertCircle,
    GraduationCap,
    Building,
    UserCheck,
    Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { getStudentProgress, getStudentAttendance, getMyLogbooks, recordCheckIn } from '../../utils/studentApi';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card !rounded-[28px] p-8 flex flex-col justify-between h-40 bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 hover:border-blue-500/20 transition-all group">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} mb-4 transition-transform group-hover:scale-110`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        </div>
    </div>
);

const StudentDashboard = () => {
    const { user } = useAuth();
    const [qrToken, setQrToken] = useState('');
    const [progress, setProgress] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [todayCheckedIn, setTodayCheckedIn] = useState(false);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInMsg, setCheckInMsg] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            const [progRes, logsRes, attRes] = await Promise.all([
                getStudentProgress().catch(() => ({ data: { data: null } })),
                getMyLogbooks().catch(() => ({ data: { data: [] } })),
                getStudentAttendance().catch(() => ({ data: { data: [] } }))
            ]);

            if (progRes.data?.data) {
                setProgress(progRes.data.data);
            }

            if (logsRes.data?.data) {
                setRecentLogs(logsRes.data.data.slice(0, 5));
            }

            const today = new Date().toISOString().split('T')[0];
            const hasCheckedInToday = attRes.data?.data?.some(a => a.date === today);
            setTodayCheckedIn(hasCheckedInToday);
        } catch (err) {
            console.error('Failed to load dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        const generateToken = () => {
            const token = btoa(JSON.stringify({
                studentId: user?.id,
                schoolId: user?.schoolId,
                timestamp: Date.now(),
                expires: Date.now() + 60000
            }));
            setQrToken(token);
        };

        generateToken();
        const interval = setInterval(generateToken, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const handleCheckIn = async () => {
        setCheckInLoading(true);
        setCheckInMsg(null);
        try {
            const res = await recordCheckIn({ notes: 'Daily web portal check-in' });
            setTodayCheckedIn(true);
            setCheckInMsg({ type: 'success', text: res.data?.message || 'Check-in recorded successfully!' });
            loadDashboardData();
        } catch (err) {
            setCheckInMsg({ type: 'error', text: err.response?.data?.message || 'Check-in failed' });
        } finally {
            setCheckInLoading(false);
        }
    };

    const statusColors = {
        DRAFT: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        SUBMITTED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        PENDING_APPROVAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        APPROVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        ACTIVE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        COMPLETED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        REJECTED: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    };

    const currentStatus = progress?.placementStatus || 'DRAFT';

    return (
        <DashboardLayout role="student">
            <div className="space-y-10 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-600/5 p-8 rounded-[32px] border border-blue-600/10 backdrop-blur-md">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-blue-600/50 p-0.5 overflow-hidden">
                                <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-xl font-black text-white">
                                    {user?.name?.charAt(0) || 'S'}
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#020617] rounded-full" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-white tracking-tighter">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${statusColors[currentStatus] || 'bg-blue-600/20 text-blue-400'}`}>
                                    {currentStatus.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium text-sm mt-1">Institutional Identity: {user?.schoolName || 'University Student'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Primary QR Verification Card */}
                    <div className="lg:col-span-4 glass-card !rounded-[32px] p-8 flex flex-col items-center justify-between bg-white/[0.02] border-white/5 space-y-8 min-h-[450px]">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-[0.1em]">Daily Verification</h3>
                            <p className="text-slate-500 text-xs font-bold">Secure Attendance Protocol</p>
                        </div>

                        <div className="p-8 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] relative group">
                            <QRCodeSVG
                                value={qrToken}
                                size={220}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-center space-x-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                                <span>Token rotating in 30s</span>
                            </div>

                            {todayCheckedIn ? (
                                <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    <CheckCircle size={18} />
                                    <span>Checked In Today</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleCheckIn}
                                    disabled={checkInLoading}
                                    className="btn-primary w-full !rounded-2xl py-4 text-xs tracking-widest uppercase shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
                                >
                                    <UserCheck size={18} />
                                    <span>{checkInLoading ? 'Recording...' : 'Instant Check-in'}</span>
                                </button>
                            )}

                            {checkInMsg && (
                                <p className={`text-xs text-center font-bold ${checkInMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {checkInMsg.text}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats & Activity Grid */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard
                                icon={TrendingUp}
                                label="Attendance"
                                value={`${progress?.attendance?.attendanceRate ?? 0}%`}
                                color="bg-blue-600/10 text-blue-400"
                            />
                            <StatCard
                                icon={FileText}
                                label="Approved Logs"
                                value={`${progress?.logbooks?.approved ?? 0} / ${progress?.logbooks?.total ?? 0}`}
                                color="bg-indigo-600/10 text-indigo-400"
                            />
                            <StatCard
                                icon={Clock}
                                label="Days Remaining"
                                value={`${progress?.daysRemaining ?? 0} Days`}
                                color="bg-rose-600/10 text-rose-400"
                            />
                        </div>

                        {/* Recent Activity List */}
                        <div className="glass-card !rounded-[32px] p-8 space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase tracking-[0.05em]">Recent Logbook Submissions</h3>
                                <a href="/student/logbooks" className="text-blue-500 text-xs font-black uppercase tracking-widest hover:text-blue-400">View All</a>
                            </div>

                            <div className="space-y-4">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log) => {
                                        const isApproved = log.status === 'approved';
                                        const isRejected = log.status === 'rejected';
                                        const badgeClass = isApproved
                                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                            : isRejected
                                                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                                : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

                                        return (
                                            <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
                                                        <GraduationCap className="text-blue-500" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white tracking-tight">Week {log.weekNumber} Logbook Report</p>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{log.startDate} to {log.endDate}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${badgeClass}`}>
                                                        {log.status}
                                                    </span>
                                                    {isApproved ? (
                                                        <CheckCircle size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <AlertCircle size={16} className={isRejected ? "text-rose-400" : "text-amber-400"} />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        No logbook submissions recorded yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
