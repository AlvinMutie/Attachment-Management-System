import React from 'react';
import {
    Bell,
    Shield,
    Smartphone,
    Moon,
    Sun,
    HelpCircle,
    UserCheck,
    Check
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Settings = () => {
    const { user } = useAuth();
    const role = user?.role || 'student';

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">System Preferences</span>
                            <Badge variant="neutral">{user?.role?.replace(/_/g, ' ')}</Badge>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">Account & Workspace Settings</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Manage notification triggers, user interface themes, and multi-factor security.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Notifications */}
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                                    <Bell size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-100">Notification Triggers</h3>
                                    <p className="text-xs text-slate-400">Configure real-time dispatch alerts</p>
                                </div>
                            </div>

                            <div className="divide-y divide-[#22242f]">
                                {[
                                    { label: 'Weekly Logbook Reminders', desc: 'Alerts before Friday submission cutoff times.', active: true },
                                    { label: 'Evaluation & Review Notifications', desc: 'Instant dispatch when a supervisor marks an entry or assessment.', active: true },
                                    { label: 'System & Institutional Announcements', desc: 'Academic calendar updates and coordinator directives.', active: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-3.5">
                                        <div className="pr-4">
                                            <p className="text-xs font-semibold text-slate-200">{item.label}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full cursor-pointer flex items-center px-0.5 transition-colors ${item.active ? 'bg-violet-600 justify-end' : 'bg-[#181a24] justify-start border border-[#22242f]'}`}>
                                            <div className="w-4 h-4 bg-white rounded-full shadow" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Appearance */}
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                                    <Moon size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-100">Interface Theme</h3>
                                    <p className="text-xs text-slate-400">Select canvas visual tone</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 rounded-xl border-2 border-violet-600 bg-[#12141c] flex flex-col items-center space-y-2 text-left">
                                    <div className="flex items-center justify-between w-full">
                                        <Moon className="text-violet-400" size={20} />
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                    <div className="w-full pt-2">
                                        <p className="text-xs font-semibold text-slate-200">Figma Obsidian Dark</p>
                                        <p className="text-[10px] text-slate-500">Curated institutional palette</p>
                                    </div>
                                </button>
                                <button className="p-4 rounded-xl border border-[#22242f] bg-[#12141c] flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity text-left">
                                    <div className="flex items-center justify-between w-full">
                                        <Sun className="text-slate-400" size={20} />
                                        <span className="text-[10px] text-slate-500">Available</span>
                                    </div>
                                    <div className="w-full pt-2">
                                        <p className="text-xs font-semibold text-slate-300">Clean Institutional Light</p>
                                        <p className="text-[10px] text-slate-500">Daytime classroom mode</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Security */}
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Shield className="text-violet-400" size={18} />
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Access Security</h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">Two-factor authentication adds an institutional hardware key or authenticator layer.</p>
                            <Button variant="outline" className="w-full" icon={Smartphone}>
                                Configure 2FA Authenticator
                            </Button>
                        </div>

                        {/* Profile Info */}
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <UserCheck className="text-violet-400" size={18} />
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Identity Details</h3>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-400">
                                    <span>Account:</span>
                                    <span className="text-slate-200 font-medium">{user?.name}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Email:</span>
                                    <span className="text-slate-200 font-mono text-[11px]">{user?.email}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Role:</span>
                                    <span className="text-violet-400 capitalize">{user?.role?.replace(/_/g, ' ')}</span>
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
