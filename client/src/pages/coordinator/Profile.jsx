import React, { useState } from 'react';
import {
    User,
    Mail,
    Lock,
    GraduationCap,
    Building,
    CheckCircle2,
    Settings,
    LogOut,
    Shield,
    Users,
    Phone,
    MapPin,
    Award,
    Sparkles,
    Check,
    Save,
    Edit3,
    Calendar,
    Bell,
    Briefcase,
    AlertTriangle,
    Layers,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Badge, Button } from '../../components/ui';

const CoordinatorProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || 'Prof. Arthur Pendelton',
        email: user?.email || 'a.pendelton@modernuni.edu',
        phone: '+254 722 456 789',
        role: 'Attachment Coordinator & Industrial Liaison Lead',
        department: 'School of Computing & Informatics',
        faculty: 'Faculty of Pure & Applied Sciences',
        office: 'Liaison Wing, Office 108',
        staffId: 'CRD-8841-2021',
        institution: user?.schoolName || 'Modern University of Technology',
        activePlacements: 142,
        assignedSupervisors: 24,
        partnerOrganizations: 38,
        activeTerm: 'May - August 2026 Cohort',
        officeHours: 'Mon - Thu (10:00 AM - 3:00 PM)',
        notificationsEnabled: true
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordFeedback, setPasswordFeedback] = useState(null);

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
        setPasswordFeedback({ type: 'success', text: 'Password updated successfully across security tokens.' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordFeedback(null), 3500);
    };

    return (
        <DashboardLayout role="attachment_coordinator">
            <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
                {/* 1. Header Hero Dossier */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600/20 to-cyan-600/20 border border-teal-500/30 flex items-center justify-center text-2xl font-bold text-teal-300 shadow-inner">
                                    {profileData.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal-500 border-2 border-[#0f1117]" title="Verified Liaison Coordinator" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                        {profileData.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                        <CheckCircle2 size={12} className="text-teal-400" />
                                        Attachment Coordinator & Liaison Lead
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                    <span className="text-slate-300 font-medium">{profileData.department}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-teal-400 font-semibold flex items-center gap-1">
                                        <Building size={13} /> {profileData.institution}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="font-mono text-slate-400">{profileData.staffId}</span>
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
                                        className="flex-1 sm:flex-none text-xs py-2 px-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-teal-900/30"
                                    >
                                        <Save size={13} />
                                        <span>Save Changes</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto text-xs py-2 px-4 border border-[#2a2e40] hover:border-teal-500/40 text-slate-200 hover:text-white flex items-center gap-2"
                                >
                                    <Edit3 size={13} className="text-teal-400" />
                                    <span>Edit Coordinator Profile</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {saveSuccess && (
                    <div className="p-3.5 bg-teal-500/10 border border-teal-500/25 rounded-xl text-teal-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg shadow-teal-950/20">
                        <CheckCircle2 size={16} className="text-teal-400" />
                        <span>Coordinator profile and liaison configuration updated successfully.</span>
                    </div>
                )}

                {/* 2. Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Coordination Stats & System Rights (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Coordination Metrics Summary */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-4 shadow-md">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Layers size={14} className="text-teal-400" />
                                Active Coordination Scope
                            </h3>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Active Interns</p>
                                    <p className="text-xl font-bold text-white tracking-tight mt-0.5">{profileData.activePlacements}</p>
                                    <p className="text-[10px] text-teal-400 mt-0.5 font-medium">Under Liaison</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Faculty Mentors</p>
                                    <p className="text-xl font-bold text-white tracking-tight mt-0.5">{profileData.assignedSupervisors}</p>
                                    <p className="text-[10px] text-teal-400 mt-0.5 font-medium">Workload Monitored</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Host Employers</p>
                                    <p className="text-xl font-bold text-white tracking-tight mt-0.5">{profileData.partnerOrganizations}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Approved Sites</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Active Term</p>
                                    <p className="text-xs font-bold text-teal-300 tracking-tight mt-1 line-clamp-2">May - Aug 2026</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Trimester Cycle</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Coordination Tools */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-3 shadow-md">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Briefcase size={14} className="text-teal-400" />
                                Liaison Shortcuts
                            </h3>
                            <div className="space-y-1.5 text-xs">
                                <button
                                    onClick={() => navigate('/coordinator/attention-queue')}
                                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#181a24] hover:bg-[#1e2230] border border-[#22242f] text-slate-200 hover:text-white transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-amber-400" />
                                        <span>Risk Attention Queue</span>
                                    </div>
                                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
                                </button>

                                <button
                                    onClick={() => navigate('/coordinator/placements')}
                                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#181a24] hover:bg-[#1e2230] border border-[#22242f] text-slate-200 hover:text-white transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Layers size={14} className="text-teal-400" />
                                        <span>Placement Coordination</span>
                                    </div>
                                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
                                </button>

                                <button
                                    onClick={() => navigate('/coordinator/supervisors')}
                                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#181a24] hover:bg-[#1e2230] border border-[#22242f] text-slate-200 hover:text-white transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-violet-400" />
                                        <span>Supervisor Capacity Matrix</span>
                                    </div>
                                    <ArrowUpRight size={13} className="text-slate-500 group-hover:text-teal-400 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Assigned Liaison Rights */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-3.5 shadow-md">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Shield size={14} className="text-teal-400" />
                                Institutional Rights
                            </h3>
                            <div className="space-y-2.5 text-xs">
                                {[
                                    'Faculty & Industry Placement Sign-off',
                                    'Supervisor Workload Re-allocation & Audit',
                                    'Supervision Visit Scheduling Oversight',
                                    'Departmental Assessment Compliance Lock',
                                    'Host Employer Accreditation Review'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                                        <CheckCircle2 size={13} className="text-teal-400 flex-shrink-0 mt-0.5" />
                                        <span className="leading-tight">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sign Out Card */}
                        <div className="rounded-2xl bg-[#12141c] border border-rose-500/20 p-5 space-y-3 shadow-md">
                            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                                <LogOut size={14} />
                                Terminate Session
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Sign out of your institutional coordination console.
                            </p>
                            <Button
                                variant="danger"
                                className="w-full text-xs py-2 bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-300 font-semibold flex items-center justify-center gap-1.5"
                                onClick={logout}
                            >
                                <LogOut size={13} />
                                <span>Sign Out of Console</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Profile Edit & Security Form (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Primary Details Card */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-5 shadow-md">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Liaison Contact & Departmental Dossier</h3>
                                    <p className="text-[11px] text-slate-400">Institutional coordinates visible to students and faculty supervisors</p>
                                </div>
                                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                                    ID: {profileData.staffId}
                                </span>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <User size={13} className="text-teal-400" />
                                            Full Name & Title
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Mail size={13} className="text-teal-400" />
                                            Official Liaison Email
                                        </label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Phone size={13} className="text-teal-400" />
                                            Direct Phone / Extension
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <MapPin size={13} className="text-teal-400" />
                                            Liaison Office Location
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.office}
                                            onChange={(e) => setProfileData({ ...profileData, office: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <GraduationCap size={13} className="text-teal-400" />
                                            School / Department
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.department}
                                            onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Clock size={13} className="text-teal-400" />
                                            Consultation / Office Hours
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.officeHours}
                                            onChange={(e) => setProfileData({ ...profileData, officeHours: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                                isEditing
                                                    ? 'bg-[#181a24] text-white border border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500'
                                                    : 'bg-[#151720] text-slate-300 border border-[#22242f] cursor-not-allowed opacity-90'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            className="text-xs py-2 px-5 bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-teal-900/30"
                                        >
                                            <Save size={13} />
                                            <span>Save Changes</span>
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Notification & Dispatch Preferences */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2230]">
                                <div className="w-8 h-8 rounded-xl bg-teal-600/15 border border-teal-500/25 text-teal-400 flex items-center justify-center">
                                    <Bell size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Liaison Notification Triggers</h3>
                                    <p className="text-[11px] text-slate-400">Automated alerts for pending placement approvals and supervisor load warnings</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-200">Pending Placement Applications</p>
                                        <p className="text-[11px] text-slate-400">Receive instant alerts when interns submit placement documentation for coordinator approval</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setProfileData({ ...profileData, notificationsEnabled: !profileData.notificationsEnabled })}
                                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${profileData.notificationsEnabled ? 'bg-teal-600' : 'bg-slate-700'}`}
                                    >
                                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${profileData.notificationsEnabled ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181a24] border border-[#22242f]">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-200">Supervisor Capacity Overload Warnings</p>
                                        <p className="text-[11px] text-slate-400">Alert when a faculty member exceeds maximum mentee allocation thresholds</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-11 h-6 rounded-full transition-colors relative bg-teal-600 cursor-pointer"
                                    >
                                        <span className="w-4 h-4 rounded-full bg-white absolute top-1 left-6 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security & Password Card */}
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 shadow-md">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2230]">
                                <div className="w-8 h-8 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-400 flex items-center justify-center">
                                    <Lock size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Password & Security</h3>
                                    <p className="text-[11px] text-slate-400">Update your coordinator login credentials</p>
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
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#181a24] text-white border border-[#22242f] focus:outline-none focus:border-teal-500 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#181a24] text-white border border-[#22242f] focus:outline-none focus:border-teal-500 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Repeat new password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl text-xs bg-[#181a24] text-white border border-[#22242f] focus:outline-none focus:border-teal-500 font-mono"
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
                                        <span>Update Security Credentials</span>
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

export default CoordinatorProfile;
