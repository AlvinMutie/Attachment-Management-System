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
    GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

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

    return (
        <DashboardLayout role="student">
            <div className="space-y-10 animate-fade-in pb-12">
                {/* M3 Header Section */}
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
                                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">Year 4 • IT</span>
                            </div>
                            <p className="text-slate-500 font-medium text-sm mt-1">Institutional Identity: {user?.schoolName}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Primary QR Verification Card (M3 Large) */}
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
                            <button className="btn-primary w-full !rounded-2xl py-4 text-xs tracking-widest uppercase shadow-blue-600/20 hover:shadow-blue-600/40">
                                <QrCode size={18} />
                                <span>Save Offline Card</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats & Activity Grid */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard
                                icon={TrendingUp}
                                label="Attendance"
                                value="94.8%"
                                color="bg-blue-600/10 text-blue-400"
                            />
                            <StatCard
                                icon={FileText}
                                label="Logbooks"
                                value="09 / 12"
                                color="bg-indigo-600/10 text-indigo-400"
                            />
                            <StatCard
                                icon={Clock}
                                label="Attachment"
                                value="18 Days"
                                color="bg-rose-600/10 text-rose-400"
                            />
                        </div>

                        {/* Recent Activity List (M3 List Style) */}
                        <div className="glass-card !rounded-[32px] p-8 space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase tracking-[0.05em]">Recent Submissions</h3>
                                <button className="text-blue-500 text-xs font-black uppercase tracking-widest hover:text-blue-400">View Archive</button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { week: 8, status: 'Approved', date: 'Today, 10:30 AM', icon: CheckCircle, color: 'text-emerald-400' },
                                    { week: 7, status: 'Approved', date: 'Yesterday', icon: CheckCircle, color: 'text-emerald-400' },
                                    { week: 6, status: 'Feedback', date: 'Oct 25', icon: AlertCircle, color: 'text-orange-400' },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
                                                <GraduationCap className="text-blue-500" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white tracking-tight">Week {log.week} Logbook Submission</p>
                                                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{log.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-white/5 ${log.color}`}>{log.status}</span>
                                            <log.icon size={16} className={log.color} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
