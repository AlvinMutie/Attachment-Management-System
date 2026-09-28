import React, { useState } from 'react';
import {
    Briefcase,
    Building,
    CheckCircle2,
    LogOut,
    Shield,
    Users,
    Phone,
    Mail,
    Award,
    Sparkles,
    Check,
    Edit3,
    Calendar,
    X,
    RefreshCw,
    User
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const IndustryProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || 'Eng. Sarah Jenkins',
        email: user?.email || 's.jenkins@safaricom.com',
        phone: '+254 700 123 456',
        role: 'Industry Workplace Supervisor',
        department: 'Enterprise Infrastructure & Cloud',
        company: 'Safaricom PLC',
        staffId: 'EMP-9921-SAF',
        activeStudents: 8,
        totalMentored: 24,
        experience: '12 Years',
        notificationsEnabled: true
    });

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const fieldRow = (label, key, type = 'text', placeholder = '') => (
        <div className="py-3 first:pt-0 border-b border-[#e5e0d5] dark:border-[#202330] last:border-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block mb-1.5">
                {label}
            </span>
            {isEditing ? (
                <input
                    type={type}
                    value={profileData[key]}
                    onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs font-mono text-[#0a0d14] dark:text-white outline-none focus:border-emerald-500 transition-colors"
                />
            ) : (
                <span className="text-xs font-bold font-mono text-[#0a0d14] dark:text-white">
                    {profileData[key] || <span className="text-[#a09d93] dark:text-slate-500 font-normal">Not provided</span>}
                </span>
            )}
        </div>
    );

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="max-w-6xl mx-auto space-y-5 pb-16 font-sans">

                {/* ============================================================= */}
                {/* WORKSPACE TOOLBAR                                               */}
                {/* ============================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                <span>Workspace</span>
                                <span>/</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Supervisor Profile</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-600/15 border border-emerald-300 dark:border-emerald-500/25 flex items-center justify-center text-base font-black text-emerald-700 dark:text-emerald-300">
                                        {profileData.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#11131a]" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-black text-[#0a0d14] dark:text-white tracking-tight">
                                        {profileData.name}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">{profileData.email}</span>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                                            <CheckCircle2 size={10} />
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={() => { setIsEditing(!isEditing); setSaveSuccess(false); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                                    isEditing
                                        ? 'bg-[#f6f5ee] dark:bg-[#181a24] text-[#0a0d14] dark:text-slate-300 border-[#e2ddd3] dark:border-[#2a2e40]'
                                        : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                }`}
                            >
                                {isEditing ? <X size={13} /> : <Edit3 size={13} />}
                                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={logout}
                                className="px-3 py-1.5 rounded-lg bg-[#fff5f5] dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <LogOut size={13} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Save Success Toast */}
                {saveSuccess && (
                    <div className="p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-400">
                        <CheckCircle2 size={14} className="shrink-0" />
                        <span>Profile updated successfully.</span>
                    </div>
                )}

                {/* ============================================================= */}
                {/* STATS ROW                                                        */}
                {/* ============================================================= */}
                <div className="grid grid-cols-3 gap-3.5">
                    {[
                        { label: 'Active Interns', value: profileData.activeStudents, color: 'text-emerald-700 dark:text-emerald-400', pill: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20', pillText: 'Current cohort' },
                        { label: 'Total Mentored', value: profileData.totalMentored, color: 'text-violet-700 dark:text-violet-400', pill: 'bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 border-violet-300 dark:border-violet-500/20', pillText: 'Lifetime' },
                        { label: 'Experience', value: profileData.experience, color: 'text-amber-700 dark:text-amber-400', pill: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20', pillText: 'Industry tenure' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 shadow-2xs flex flex-col gap-2">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">{m.label}</span>
                            <span className={`text-2xl font-black font-mono tracking-tight ${m.color}`}>{m.value}</span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border self-start ${m.pill}`}>{m.pillText}</span>
                        </div>
                    ))}
                </div>

                {/* ============================================================= */}
                {/* MAIN GRID: LEFT + RIGHT                                          */}
                {/* ============================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* LEFT: Company & Supervisor ID */}
                    <div className="space-y-5">

                        {/* Company Identity */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <Building size={14} className="text-emerald-600 dark:text-emerald-400" />
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider">
                                    Company Identity
                                </h3>
                            </div>
                            <div className="space-y-0">
                                {fieldRow('Company / Organisation', 'company')}
                                {fieldRow('Department / Division', 'department')}
                                {fieldRow('Employee Staff ID', 'staffId')}
                            </div>
                        </div>

                        {/* Supervisor Capabilities */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <Shield size={14} className="text-emerald-600 dark:text-emerald-400" />
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider">
                                    Supervisor Permissions
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {[
                                    'Mark daily attendance',
                                    'Review & sign logbooks',
                                    'QR scan verification',
                                    'Flag compliance risk',
                                    'View student progress'
                                ].map((cap, i) => (
                                    <div key={i} className="flex items-center gap-2.5 text-xs">
                                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
                                            <Check size={9} className="text-emerald-700 dark:text-emerald-400" />
                                        </div>
                                        <span className="text-[#22283a] dark:text-slate-300 font-mono">{cap}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Contact & Role Details */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Personal Details */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider">
                                        Personal & Contact Details
                                    </h3>
                                </div>
                                {isEditing && (
                                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/20">
                                        Editing
                                    </span>
                                )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-x-6">
                                <div>
                                    {fieldRow('Full Name', 'name', 'text', 'Your full name')}
                                    {fieldRow('Email Address', 'email', 'email', 'work@company.com')}
                                </div>
                                <div>
                                    {fieldRow('Phone Number', 'phone', 'tel', '+254 700 000 000')}
                                    {fieldRow('Job Role / Title', 'role', 'text', 'e.g. Senior Engineer')}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-3 border-t border-[#e5e0d5] dark:border-[#202330] flex justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-xl bg-[#f6f5ee] dark:bg-[#181a24] border border-[#e2ddd3] dark:border-[#22242f] text-[#5b6276] dark:text-slate-400 text-xs font-mono font-semibold cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                        <Check size={13} />
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Account Security */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <Shield size={14} className="text-emerald-600 dark:text-emerald-400" />
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider">
                                    Account & Security
                                </h3>
                            </div>

                            <div className="space-y-2.5">
                                {[
                                    { label: 'Account Type', value: 'Industry Supervisor', chip: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20' },
                                    { label: 'Access Level', value: 'Workplace Mentorship', chip: 'bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 border-violet-300 dark:border-violet-500/20' },
                                    { label: 'Verification Status', value: 'Verified Active', chip: 'bg-sky-100 dark:bg-sky-500/10 text-sky-800 dark:text-sky-400 border-sky-300 dark:border-sky-500/20' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-[#faf9f6] dark:bg-[#161822] rounded-xl border border-[#e2ddd3] dark:border-[#22242f]">
                                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">{item.label}</span>
                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.chip}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-[#e5e0d5] dark:border-[#202330] flex flex-wrap gap-2">
                                <button className="px-3 py-1.5 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-[#0a0d14] dark:text-slate-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer hover:border-emerald-500/40 transition-colors">
                                    <Shield size={12} className="text-[#5b6276] dark:text-slate-400" />
                                    <span>Change Password</span>
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-3 py-1.5 rounded-lg bg-[#fff5f5] dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                                >
                                    <LogOut size={12} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default IndustryProfile;
