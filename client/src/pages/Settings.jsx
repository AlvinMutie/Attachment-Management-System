import React, { useState } from 'react';
import {
    Bell,
    Shield,
    Smartphone,
    Moon,
    Sun,
    HelpCircle,
    UserCheck,
    Check,
    Lock,
    Settings as SettingsIcon,
    Key,
    CheckCircle2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Badge, Button } from '../components/ui';

const Settings = () => {
    const { user } = useAuth();
    const role = user?.role || 'student';

    const [notifications, setNotifications] = useState({
        logbookReminders: true,
        evaluations: true,
        announcements: false,
        securityAlerts: true
    });

    const [saveSuccess, setSaveSuccess] = useState(false);

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
    };

    return (
        <DashboardLayout role={role}>
            <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
                {/* 1. Header Cockpit */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-300 shadow-inner">
                                <SettingsIcon size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                    System Preferences
                                </span>
                                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                                    Account & Workspace Settings
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Configure notification dispatch triggers, visual design preferences, and multi-factor authentication.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-300 bg-[#181a24] px-3 py-1.5 rounded-lg border border-[#22242f] capitalize">
                                {user?.role?.replace(/_/g, ' ')} Account
                            </span>
                        </div>
                    </div>
                </div>

                {saveSuccess && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>Preferences saved successfully.</span>
                    </div>
                )}

                {/* 2. Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Notifications Card */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2230]">
                                <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-400 flex items-center justify-center">
                                    <Bell size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Notification Triggers</h3>
                                    <p className="text-[11px] text-slate-400">Configure real-time automated portal alerts</p>
                                </div>
                            </div>

                            <div className="divide-y divide-[#1e2230]">
                                {[
                                    { key: 'logbookReminders', label: 'Weekly Logbook & Activity Reminders', desc: 'Automated warnings prior to Friday submission deadlines.' },
                                    { key: 'evaluations', label: 'Assessment & Feedback Dispatch', desc: 'Instant push notifications when a supervisor grades or signs off on an entry.' },
                                    { key: 'announcements', label: 'Campus & Institutional Directives', desc: 'Academic calendar revisions, department memos, and coordinator notices.' },
                                    { key: 'securityAlerts', label: 'Security & New Login Alerts', desc: 'Instant email alert whenever your account is accessed from a new IP or device.' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1">
                                        <div className="pr-4">
                                            <p className="text-xs font-semibold text-slate-200">{item.label}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleNotification(item.key)}
                                            className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center shrink-0 ${
                                                notifications[item.key] ? 'bg-violet-600 justify-end' : 'bg-slate-800 justify-start'
                                            }`}
                                        >
                                            <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Appearance */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2230]">
                                <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-400 flex items-center justify-center">
                                    <Moon size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Visual Interface Theme</h3>
                                    <p className="text-[11px] text-slate-400">Institutional canvas appearance</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border-2 border-violet-600 bg-[#161924] flex flex-col justify-between space-y-3">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2 text-violet-400">
                                            <Moon size={18} />
                                            <span className="text-xs font-bold text-white">Obsidian Craft Dark</span>
                                        </div>
                                        <span className="text-[10px] font-bold bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded border border-violet-500/30">
                                            Active Default
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">High-contrast dark canvas tuned for low-light clinical and institutional focus.</p>
                                </div>

                                <div className="p-4 rounded-xl border border-[#22242f] bg-[#12141c] flex flex-col justify-between space-y-3 opacity-60">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Sun size={18} />
                                            <span className="text-xs font-bold text-slate-300">Classroom Light</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500">Theme</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">Daytime classroom light mode for bright lecture halls and lab environments.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (4 Cols) */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Security */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-3.5 shadow-md">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e2230]">
                                <Shield className="text-violet-400" size={16} />
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Multi-Factor Security</h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Protect your account with hardware security keys (FIDO2) or authenticator apps (TOTP).
                            </p>
                            <Button
                                variant="outline"
                                className="w-full text-xs font-semibold py-2.5 flex items-center justify-center gap-2 border-[#2a2e40]"
                                icon={Smartphone}
                            >
                                Setup 2FA Authenticator
                            </Button>
                        </div>

                        {/* Account Identity Summary */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-3.5 shadow-md">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-[#1e2230]">
                                <UserCheck className="text-violet-400" size={16} />
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Authenticated Session</h3>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Account Name:</span>
                                    <span className="text-white font-semibold">{user?.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Email Address:</span>
                                    <span className="text-slate-300 font-mono text-[11px]">{user?.email}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Security Clearance:</span>
                                    <span className="text-violet-400 font-semibold capitalize">{user?.role?.replace(/_/g, ' ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;

