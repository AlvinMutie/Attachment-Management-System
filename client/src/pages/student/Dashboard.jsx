import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    QrCode,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-6 flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
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
            <div className="space-y-12 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <span className="section-label">Overview</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Student Dashboard</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">Monitoring your industrial attachment progress.</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-blue-600/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-600/20 shadow-inner">
                        <TrendingUp size={20} />
                        <span className="text-sm font-black uppercase tracking-widest">Active Placement</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        icon={CheckCircle}
                        label="Attendance Score"
                        value="92%"
                        color="bg-green-600/10 text-green-400"
                    />
                    <StatCard
                        icon={FileText}
                        label="Logbooks Submitted"
                        value="8 / 12"
                        color="bg-blue-600/10 text-blue-400"
                    />
                    <StatCard
                        icon={Clock}
                        label="Days Remaining"
                        value="24"
                        color="bg-purple-600/10 text-purple-400"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* QR Code Section */}
                    <div className="lg:col-span-1 glass-card p-10 flex flex-col items-center justify-center space-y-8 bg-gradient-to-b from-white/[0.05] to-transparent text-center">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white tracking-tight">Daily Verification</h3>
                            <p className="text-slate-500 text-sm font-medium">Verify your attendance with your supervisor</p>
                        </div>

                        <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl relative group">
                            <QRCodeSVG
                                value={qrToken}
                                size={200}
                                level="H"
                                includeMargin={true}
                            />
                            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-all pointer-events-none rounded-[2rem]" />
                        </div>

                        <div className="flex items-center space-x-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                            <span>Token refreshes in 30s</span>
                        </div>

                        <button className="btn-primary w-full py-4 text-xs tracking-widest uppercase">
                            <QrCode size={18} />
                            <span>Save Offline</span>
                        </button>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-white tracking-tighter">Recent Logbooks</h3>
                            <button className="text-blue-500 text-sm font-black uppercase tracking-widest hover:underline">View History</button>
                        </div>

                        <div className="space-y-6">
                            {[
                                { week: 8, status: 'Approved', date: '20 Jan 2026', comment: 'Excellent technical depth in the networking section.' },
                                { week: 7, status: 'Approved', date: '13 Jan 2026', comment: 'Well detailed summary of the server migration project.' },
                                { week: 6, status: 'Rejected', date: '06 Jan 2026', comment: 'Please re-upload the attachment. The file is corrupt.' },
                            ].map((log, i) => (
                                <div key={i} className="glass-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-600/5 to-transparent">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-xl font-black text-white tracking-tight">Week {log.week}</span>
                                            <span className={`text-[10px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full ${log.status === 'Approved' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed italic font-medium opacity-80">"{log.comment}"</p>
                                        <div className="flex items-center space-x-2 text-slate-500 text-[10px] font-black uppercase tracking-widest pt-1">
                                            <Calendar size={14} />
                                            <span>Submitted {log.date}</span>
                                        </div>
                                    </div>
                                    <button className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[10px] uppercase font-black text-white tracking-widest transition-all border border-white/5 whitespace-nowrap">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Action Alert */}
                        <div className="bg-orange-600/10 border border-orange-600/20 p-8 rounded-[2rem] flex items-start space-x-5 shadow-2xl shadow-orange-950/20">
                            <AlertCircle className="text-orange-500 shrink-0" size={32} />
                            <div className="space-y-2">
                                <p className="text-orange-500 font-black uppercase tracking-widest text-sm">Action Required: Mid-term Assessment</p>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">Your university supervisor has requested a meeting for your mid-term grade. Please check your institutional email for the zoom link.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
