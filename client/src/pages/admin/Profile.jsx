import React, { useState } from 'react';
import {
    ShieldCheck,
    Mail,
    Lock,
    Shield,
    Activity,
    LogOut,
    CheckCircle2,
    Server,
    Cpu
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const SuperAdminProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const adminData = {
        name: user?.name || 'Administrator',
        email: user?.email || 'superadmin@attachpro.io',
        role: 'Global Platform Owner',
        permissions: [
            'Full System Operations Control',
            'Institutional Tenant Provisioning',
            'Cross-School Audit Ledger Oversight',
            'Security Session Management & Lockouts',
            'Core Database Diagnostic Clearance'
        ]
    };

    return (
        <DashboardLayout role="super_admin">
            <div className="space-y-6 max-w-5xl mx-auto p-6">
                {/* Header / Identity Card */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">Super Administrator</span>
                                <Badge variant="success">Active Session</Badge>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">{adminData.name}</h1>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{adminData.email}</p>
                        </div>
                    </div>
                    <Button variant={isEditing ? 'primary' : 'outline'} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Permissions Column */}
                    <div className="space-y-6">
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-4">
                            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Assigned System Rights</h3>
                            <div className="space-y-2.5">
                                {adminData.permissions.map((perm, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                        <CheckCircle2 className="text-violet-400 flex-shrink-0 mt-0.5" size={14} />
                                        <span>{perm}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#15171f] border border-rose-500/20 rounded-xl p-6 space-y-3">
                            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Session Security</h3>
                            <p className="text-xs text-slate-400">Terminate your current authenticated administrative session.</p>
                            <Button
                                variant="danger"
                                className="w-full"
                                onClick={logout}
                                icon={LogOut}
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-4">
                            <h3 className="text-base font-bold text-slate-100">Account Credentials</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        readOnly={!isEditing}
                                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                        defaultValue={adminData.email}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Account Scope</label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-400 select-none opacity-60"
                                        defaultValue="Global Super Admin"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-[#22242f] pt-4 mt-2">
                                <h4 className="text-xs font-semibold text-slate-300 mb-3">Password Management</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            readOnly={!isEditing}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                            defaultValue="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">New Password</label>
                                        <input
                                            type="password"
                                            readOnly={!isEditing}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SuperAdminProfile;
