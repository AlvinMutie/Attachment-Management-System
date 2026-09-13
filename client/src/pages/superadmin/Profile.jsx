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
    Cpu,
    User,
    Phone,
    Key,
    Save,
    Edit3,
    AlertTriangle,
    Bell,
    Layers,
    Building2,
    History,
    Check,
    ArrowUpRight,
    Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Badge, Button } from '../../components/ui';

const SuperAdminProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [adminData, setAdminData] = useState({
        name: user?.name || 'Root Platform Administrator',
        email: user?.email || 'superadmin@attachpro.io',
        phone: '+1 (800) 555-0199',
        recoveryEmail: 'sec-ops@attachpro.io',
        role: 'Global Platform Owner & Infrastructure Authority',
        scope: 'Multi-Tenant Root Clearance',
        securityLevel: 'Tier 1 (Unrestricted Access)',
        sessionIp: '192.168.1.1 (Encrypted TLS v1.3)',
        notificationsEnabled: true,
        breachAlertsEnabled: true
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordFeedback, setPasswordFeedback] = useState(null);

    const permissions = [
        'Multi-Tenant Institutional Provisioning & De-provisioning',
        'Cross-School User Role Elevation & Administrative Overrides',
        'Immutable Security & Compliance Audit Trail Oversight',
        'Database Diagnostic Inspections & Health Monitoring',
        'Session Invalidation & Emergency Platform Lockdown'
    ];

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setPasswordFeedback({ type: 'error', text: 'Please provide both current and new password.' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordFeedback({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        setPasswordFeedback({ type: 'success', text: 'Administrative credentials rotated successfully across all platform services.' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordFeedback(null), 3500);
    };

    return (
        <DashboardLayout role="super_admin">
            <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
                {/* 1. Header Hero Dossier */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-rose-600/20 border border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-300 shadow-inner">
                                    <ShieldCheck size={32} className="text-violet-400" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f1117]" title="Root Clearance Active" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                        {adminData.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                        <Shield size={12} className="text-violet-400" />
                                        Global Super Administrator
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                    <span className="text-slate-300 font-mono">{adminData.email}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-violet-400 font-semibold flex items-center gap-1">
                                        <Server size={13} /> {adminData.scope}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-emerald-400 font-medium">{adminData.securityLevel}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 w-full md:w-auto">
                            {isEditing ? (
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 sm:flex-none text-xs py-2 px-3.5 border border-[#2a2e40]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="flex-1 sm:flex-none text-xs py-2 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-900/30"
                                    >
                                        <Save size={13} />
                                        <span>Save Credentials</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto text-xs py-2 px-4 border border-[#2a2e40] hover:border-violet-500/40 text-slate-200 hover:text-white flex items-center gap-2"
                                >
                                    <Edit3 size={13} className="text-violet-400" />
                                    <span>Edit Admin Profile</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {saveSuccess && (
                    <div className="p-3.5 bg-violet-500/10 border border-violet-500/25 rounded-xl text-violet-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg shadow-violet-950/20">
                        <CheckCircle2 size={16} className="text-violet-400" />
                        <span>Administrative profile and security contact data synchronized successfully.</span>
                    </div>
                )}

                {/* 2. Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Permissions & Session Control (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* System Rights Card */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-3.5 shadow-md">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck size={14} className="text-violet-400" />
                                Assigned System Rights
                            </h3>
                            <div className="space-y-2.5 text-xs">
                                {permissions.map((perm, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                                        <CheckCircle2 size={13} className="text-violet-400 flex-shrink-0 mt-0.5" />
                                        <span className="leading-tight">{perm}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Shortcuts */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-3 shadow-md">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Terminal size={14} className="text-violet-400" />
                                Super Admin Console
                            </h3>
                            <div className="space-y-1.5 text-xs">
                                <button
                                    onClick={() => navigate('/superadmin/schools')}
                                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#181a24] hover:bg-[#1e2230] border border-[#22242f] text-slate-200 hover:text-white transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Building2 size={14} className="text-violet-400" />
                                        <span>Multi-Tenant Institutions</span>
                                    </div>
                                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-violet-400 transition-colors" />
                                </button>

                                <button
                                    onClick={() => navigate('/superadmin/audit-logs')}
                                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#181a24] hover:bg-[#1e2230] border border-[#22242f] text-slate-200 hover:text-white transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <History size={14} className="text-cyan-400" />
                                        <span>Security Audit Trail</span>
                                    </div>
                                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-violet-400 transition-colors" />
                                </button>

                                <button
                                    onClick={() => navigate('/superadmin/system-health')}
                                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#181a24] hover:bg-[#1e2230] border border-[#22242f] text-slate-200 hover:text-white transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Activity size={14} className="text-emerald-400" />
                                        <span>System Health & Telemetry</span>
                                    </div>
                                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-violet-400 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Session Control */}
                        <div className="rounded-2xl bg-[#12141c] border border-rose-500/20 p-5 space-y-3 shadow-md">
                            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                                <LogOut size={14} />
                                Master Session Termination
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Invalidate your root credentials session and return to the secure sign-in gateway.
                            </p>
                            <Button
                                variant="danger"
                                className="w-full text-xs py-2 bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-300 font-semibold flex items-center justify-center gap-1.5"
                                onClick={logout}
                            >
                                <LogOut size={13} />
                                <span>Terminate Admin Session</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Profile Form & Password Rotation (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Identity & Contact Settings */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-5 shadow-md">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Administrative Identity & Contact Coordinates</h3>
                                    <p className="text-[11px] text-slate-400">Master account contact points for platform alerts and recovery</p>
                                </div>
                                <Badge variant="success">Active Session</Badge>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <User size={13} className="text-violet-400" />
                                            Administrator Name
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={adminData.name}
                                            onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Mail size={13} className="text-violet-400" />
                                            Primary Administrative Email
                                        </label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={adminData.email}
                                            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Phone size={13} className="text-violet-400" />
                                            Direct Phone / Emergency Hotline
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={adminData.phone}
                                            onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Shield size={13} className="text-violet-400" />
                                            Secondary SecOps Email
                                        </label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={adminData.recoveryEmail}
                                            onChange={(e) => setAdminData({ ...adminData, recoveryEmail: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            className="text-xs py-2 px-5 bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-900/30"
                                        >
                                            <Save size={13} />
                                            <span>Save Changes</span>
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Security Alert & Audit Dispatch Preferences */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2230]">
                                <div className="w-8 h-8 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-400 flex items-center justify-center">
                                    <Bell size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Critical Platform Alert Dispatch</h3>
                                    <p className="text-[11px] text-slate-400">Configure instant notification relays for platform anomalies</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-200">Security Breach & Failed Root Authentication</p>
                                        <p className="text-[11px] text-slate-400">Instant SMS and email alert whenever 3+ failed administrator login attempts occur</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAdminData({ ...adminData, breachAlertsEnabled: !adminData.breachAlertsEnabled })}
                                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${adminData.breachAlertsEnabled ? 'bg-violet-600' : 'bg-slate-700'}`}
                                    >
                                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${adminData.breachAlertsEnabled ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-200">Institutional Onboarding & Tenant Changes</p>
                                        <p className="text-[11px] text-slate-400">Receive dispatch digests when new university tenant nodes are created or locked</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAdminData({ ...adminData, notificationsEnabled: !adminData.notificationsEnabled })}
                                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${adminData.notificationsEnabled ? 'bg-violet-600' : 'bg-slate-700'}`}
                                    >
                                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${adminData.notificationsEnabled ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Master Credential & Password Rotation */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2230]">
                                <div className="w-8 h-8 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-400 flex items-center justify-center">
                                    <Lock size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Administrative Password Rotation</h3>
                                    <p className="text-[11px] text-slate-400">Rotate master password for the global superadmin account</p>
                                </div>
                            </div>

                            {passwordFeedback && (
                                <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                                    passwordFeedback.type === 'success'
                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                                }`}>
                                    {passwordFeedback.type === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
                                    <span>{passwordFeedback.text}</span>
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-4 pt-1">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                                            Current Master Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#181a24] text-white border border-[#22242f] focus:outline-none focus:border-violet-500 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                                            New Master Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Min. 12 characters"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#181a24] text-white border border-[#22242f] focus:outline-none focus:border-violet-500 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Repeat password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#181a24] text-white border border-[#22242f] focus:outline-none focus:border-violet-500 font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        className="text-xs py-2 px-4 border border-[#2a2e40] text-slate-200 hover:text-white flex items-center gap-1.5"
                                    >
                                        <Lock size={13} />
                                        <span>Rotate Master Password</span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SuperAdminProfile;
