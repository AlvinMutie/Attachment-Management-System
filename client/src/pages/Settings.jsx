import React from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Smartphone,
    Globe,
    Moon,
    Sun,
    HelpCircle,
    Save
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const role = user?.role || 'student';

    return (
        <DashboardLayout role={role}>
            <div className="space-y-12 animate-fade-in">
                {/* Header */}
                <div className="space-y-2">
                    <span className="section-label">Configuration</span>
                    <h1 className="text-4xl font-black text-white tracking-tighter">System Settings</h1>
                    <p className="text-slate-500 font-medium leading-relaxed">Customize your platform experience and security preferences.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Notifications */}
                        <div className="glass-card p-10 space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center">
                                    <Bell size={20} />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">Notification Center</h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: 'Push Notifications', desc: 'Receive real-time alerts on your device.', active: true },
                                    { label: 'Email Reports', desc: 'Weekly summary of your attachment progress.', active: true },
                                    { label: 'System Announcements', desc: 'Important platform updates and maintenance news.', active: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-white">{item.label}</p>
                                            <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full cursor-pointer flex items-center px-1 transition-colors ${item.active ? 'bg-blue-600 justify-end' : 'bg-white/10 justify-start border border-white/5'}`}>
                                            <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Appearance */}
                        <div className="glass-card p-10 space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-600/10 text-purple-500 rounded-xl flex items-center justify-center">
                                    <Moon size={20} />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">Appearance</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-6 rounded-[2rem] border-2 border-blue-600 bg-slate-900 flex flex-col items-center space-y-3 transition-all">
                                    <Moon className="text-blue-500" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">High Contrast Dark</span>
                                </button>
                                <button className="p-6 rounded-[2rem] border-2 border-transparent bg-white/5 flex flex-col items-center space-y-3 hover:bg-white/10 transition-all">
                                    <Sun className="text-slate-500" size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Modern Light</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        {/* Security */}
                        <div className="glass-card p-8 space-y-6 bg-gradient-to-b from-blue-600/10 to-transparent">
                            <div className="flex items-center space-x-3">
                                <Shield className="text-blue-500" size={20} />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Access Control</h3>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">Manage your biometric login and multi-factor authentication settings.</p>
                            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                                <Smartphone size={14} />
                                <span>Setup 2FA</span>
                            </button>
                        </div>

                        {/* Help & Support */}
                        <div className="glass-card p-8 space-y-6">
                            <div className="flex items-center space-x-3 text-slate-400">
                                <HelpCircle size={20} />
                                <h3 className="text-xs font-black uppercase tracking-widest leading-none">Support</h3>
                            </div>
                            <div className="space-y-4">
                                <button className="w-full text-left text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Documentation</button>
                                <button className="w-full text-left text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">API Reference</button>
                                <button className="w-full text-left text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Contact Engineering</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Footer */}
                <div className="flex items-center justify-between p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-600/10 border-dashed">
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center space-x-3">
                        <Globe size={16} />
                        <span>Changes are synchronized across all regions</span>
                    </p>
                    <button className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest flex items-center space-x-3">
                        <Save size={18} />
                        <span>Commit Changes</span>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
