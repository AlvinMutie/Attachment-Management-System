import React, { useState } from 'react';
import {
    ShieldCheck,
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    Activity,
    LogOut,
    CheckCircle2,
    Settings,
    Server,
    Cpu
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const ProfileCard = ({ title, children }) => (
    <div className="glass-card p-8 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <Settings className="text-blue-500" size={18} />
            <span className="uppercase tracking-widest text-xs">{title}</span>
        </h3>
        {children}
    </div>
);

const SuperAdminProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Mock data for Super Admin
    const adminData = {
        name: user?.name || 'Administrator',
        email: user?.email || 'superadmin@attachpro.io',
        role: 'Global Platform Owner',
        lastLogin: '26 Jan 2026, 03:45 PM',
        location: 'Global Operations Center',
        permissions: [
            'Full System Control',
            'Institutional Management',
            'Revenue & Billing Oversight',
            'Emergency System Override',
            'Database Migration Rights'
        ]
    };

    return (
        <DashboardLayout role="super_admin">
            <div className="space-y-8 animate-fade-in">
                {/* Header / Identity */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-600/10 to-transparent p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 group-hover:scale-105 transition-transform">
                            <ShieldCheck className="text-white" size={64} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-slate-950 rounded-full flex items-center justify-center p-2 shadow-lg" title="System Online">
                            <Server className="text-white" size={16} />
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter">{adminData.name}</h1>
                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg shadow-blue-600/20">
                                {adminData.role}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">{adminData.email}</p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Activity size={14} className="text-blue-500" />
                                <span>Session Active</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Cpu size={14} className="text-purple-500" />
                                <span>High Priority Clearace</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:ml-auto">
                        <button className="btn-primary px-8" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Security & Access */}
                    <div className="lg:col-span-1 space-y-8">
                        <ProfileCard title="System Rights">
                            <div className="space-y-4">
                                {adminData.permissions.map((perm, i) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <CheckCircle2 className="text-blue-500" size={18} />
                                        <span className="text-sm font-bold text-slate-300">{perm}</span>
                                    </div>
                                ))}
                            </div>
                        </ProfileCard>

                        <div className="glass-card p-8 border-l-4 border-l-red-600 bg-red-600/[0.02]">
                            <h3 className="text-lg font-black text-red-500 mb-4 flex items-center space-x-2 uppercase tracking-widest text-xs">Danger Zone</h3>
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600/10 text-red-500 rounded-2xl border border-red-600/20 hover:bg-red-600/20 transition-all font-black text-xs uppercase tracking-widest"
                            >
                                <LogOut size={18} />
                                <span>Logout from System</span>
                            </button>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="email" readOnly={!isEditing} className="input-field pl-12 opacity-80" defaultValue={adminData.email} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Global ID</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" readOnly className="input-field pl-12 opacity-50 select-none" defaultValue="SA-GLOBAL-99" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Security Credentials</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input type="password" readOnly={!isEditing} className="input-field pl-12" defaultValue="••••••••" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input type="password" readOnly={!isEditing} className="input-field pl-12" placeholder="Leave empty to keep current" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white">System Notifications</p>
                                    <p className="text-xs text-slate-500">Receive alerts for platform-wide emergencies</p>
                                </div>
                                <div className="w-14 h-8 bg-blue-600 rounded-full p-1 cursor-pointer flex items-center justify-end px-1.5 transition-colors">
                                    <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Audit Log / Activity */}
                        <div className="glass-card overflow-hidden">
                            <div className="p-8 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-black text-white uppercase tracking-widest text-xs">Recent Platform Actions</h3>
                                <button className="text-blue-500 text-xs font-bold uppercase tracking-widest hover:underline">Full Audit Log</button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {[
                                    { action: 'Updated Global Subscription Policy', time: '2 hours ago', target: 'Payment Gateway' },
                                    { action: 'Approved Kenya Poly Onboarding', time: '5 hours ago', target: 'Institutions' },
                                    { action: 'System Backup Initiated', time: 'Yesterday', target: 'AWS-S3-Cluster' }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-white tracking-tight">{item.action}</p>
                                            <p className="text-xs text-slate-500 font-medium">Target: {item.target}</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-900 px-3 py-1 rounded-full">{item.time}</span>
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

export default SuperAdminProfile;
