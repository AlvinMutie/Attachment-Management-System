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
    BookOpen,
    Phone,
    MapPin,
    Award,
    Sparkles,
    Check,
    Save,
    Edit3,
    Calendar,
    Bell
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Badge, Button } from '../../components/ui';

const AcademicProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || 'Dr. James Okoth',
        email: user?.email || 'j.okoth@modernuni.edu',
        phone: '+254 711 987 654',
        role: 'Senior Academic Faculty Lead',
        department: 'Department of Computer Science',
        faculty: 'Faculty of Engineering & Technology',
        office: 'Tech Complex, Room 402',
        staffId: 'STF-5582-2022',
        institution: 'Modern University of Technology',
        activeMentees: 18,
        visitsConducted: 14,
        experience: '12 Years',
        notificationsEnabled: true
    });

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <DashboardLayout role="university_supervisor">
            <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
                {/* 1. Header Hero Dossier */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-300 shadow-inner">
                                    {profileData.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-violet-500 border-2 border-[#0f1117]" title="Verified Academic Faculty" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                        {profileData.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                        <GraduationCap size={12} className="text-violet-400" />
                                        University Faculty Lead
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                    <span className="text-slate-300 font-medium">{profileData.department}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-violet-400 font-semibold flex items-center gap-1">
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
                                        variant="primary"
                                        onClick={handleSave}
                                        className="flex-1 sm:flex-none text-xs py-2 px-4 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/20"
                                    >
                                        <Save size={14} />
                                        <span>Save Changes</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto text-xs py-2 px-4 font-semibold flex items-center justify-center gap-1.5 border-[#2a2e40]"
                                >
                                    <Edit3 size={14} />
                                    <span>Edit Profile</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {saveSuccess && (
                    <div className="p-3.5 bg-violet-500/10 border border-violet-500/25 rounded-xl text-violet-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 size={16} className="text-violet-400" />
                        <span>Academic faculty credentials updated successfully.</span>
                    </div>
                )}

                {/* 2. Key Academic Supervisor Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-400">Supervised Students</span>
                        <div className="text-2xl font-bold text-white tracking-tight mt-1">{profileData.activeMentees}</div>
                        <span className="text-[11px] text-violet-400 mt-1">Active Placements</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-400">Site Inspections</span>
                        <div className="text-2xl font-bold text-violet-400 tracking-tight mt-1">{profileData.visitsConducted}</div>
                        <span className="text-[11px] text-slate-500 mt-1">Visits Completed</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-400">Faculty Seniority</span>
                        <div className="text-2xl font-bold text-white tracking-tight mt-1">{profileData.experience}</div>
                        <span className="text-[11px] text-slate-500 mt-1">Academic Leadership</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-400">Staff Standing</span>
                        <div className="text-base font-bold text-violet-400 tracking-tight mt-1.5 flex items-center gap-1.5">
                            <Shield size={16} /> Verified Faculty
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1">Senate Cleared</span>
                    </div>
                </div>

                {/* 3. Main Configuration Grid */}
                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Column: Academic Affiliation (4 Cols) */}
                    <div className="lg:col-span-4 space-y-5">
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-4 shadow-md">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <Building size={14} className="text-violet-400" />
                                    University Affiliation
                                </h3>
                                <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                    Faculty
                                </span>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institution</span>
                                    <p className="font-semibold text-white">{profileData.institution}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Faculty</span>
                                    <p className="font-semibold text-slate-300">{profileData.faculty}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</span>
                                    <p className="font-semibold text-slate-300">{profileData.department}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Staff ID</span>
                                    <p className="font-mono font-semibold text-slate-300">{profileData.staffId}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campus Office</span>
                                    <p className="font-semibold text-slate-300">{profileData.office}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sign Out Action */}
                        <button
                            type="button"
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 p-3.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all font-bold text-xs"
                        >
                            <LogOut size={15} />
                            <span>Sign Out of Faculty Account</span>
                        </button>
                    </div>

                    {/* Right Column: Profile Edit & Security Form (8 Cols) */}
                    <div className="lg:col-span-8 space-y-5">
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-5 shadow-md">
                            <div className="flex items-center justify-between pb-3.5 border-b border-[#1e2230]">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Academic Identity & Contacts</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Faculty contact details visible to department coordinators and student mentees.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <User size={13} className="text-violet-400" /> Full Name & Title
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            readOnly={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className={`w-full p-2.5 rounded-lg border text-xs outline-none transition-colors ${
                                                isEditing
                                                    ? 'bg-[#181a24] border-[#22242f] text-white focus:border-violet-500'
                                                    : 'bg-[#10121a] border-[#1e2230] text-slate-300 cursor-not-allowed'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <Mail size={13} className="text-violet-400" /> Official Academic Email
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            readOnly={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className={`w-full p-2.5 rounded-lg border text-xs outline-none transition-colors ${
                                                isEditing
                                                    ? 'bg-[#181a24] border-[#22242f] text-white focus:border-violet-500'
                                                    : 'bg-[#10121a] border-[#1e2230] text-slate-300 cursor-not-allowed'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <Phone size={13} className="text-violet-400" /> Direct Office Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.phone}
                                            readOnly={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className={`w-full p-2.5 rounded-lg border text-xs outline-none transition-colors ${
                                                isEditing
                                                    ? 'bg-[#181a24] border-[#22242f] text-white focus:border-violet-500'
                                                    : 'bg-[#10121a] border-[#1e2230] text-slate-300 cursor-not-allowed'
                                            }`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <MapPin size={13} className="text-violet-400" /> Office / Room
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.office}
                                            readOnly={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, office: e.target.value })}
                                            className={`w-full p-2.5 rounded-lg border text-xs outline-none transition-colors ${
                                                isEditing
                                                    ? 'bg-[#181a24] border-[#22242f] text-white focus:border-violet-500'
                                                    : 'bg-[#10121a] border-[#1e2230] text-slate-300 cursor-not-allowed'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Security Credentials Section */}
                                <div className="pt-4 border-t border-[#1e2230] space-y-3.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                            <Lock size={13} className="text-violet-400" /> Academic Portal Credentials
                                        </h4>
                                        <span className="text-[10px] text-slate-500">University SSO Linked</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">Current Password</label>
                                            <input
                                                type="password"
                                                readOnly={!isEditing}
                                                defaultValue="••••••••••••"
                                                className="w-full p-2.5 rounded-lg bg-[#10121a] border border-[#1e2230] text-xs text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">New Password</label>
                                            <input
                                                type="password"
                                                readOnly={!isEditing}
                                                placeholder={isEditing ? 'Leave blank to keep current' : '••••••••••••'}
                                                className={`w-full p-2.5 rounded-lg border text-xs outline-none transition-colors ${
                                                    isEditing
                                                        ? 'bg-[#181a24] border-[#22242f] text-white focus:border-violet-500'
                                                        : 'bg-[#10121a] border-[#1e2230] text-slate-400 cursor-not-allowed'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences & Notification Controls */}
                                <div className="pt-4 border-t border-[#1e2230] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-white flex items-center gap-2">
                                            <Bell size={13} className="text-violet-400" />
                                            Academic Submission Notifications
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Receive instant alerts when student logbooks are submitted or site visits confirmed.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setProfileData({ ...profileData, notificationsEnabled: !profileData.notificationsEnabled })}
                                        className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                                            profileData.notificationsEnabled ? 'bg-violet-600 justify-end' : 'bg-slate-800 justify-start'
                                        }`}
                                    >
                                        <div className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AcademicProfile;

