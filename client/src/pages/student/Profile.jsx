import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Lock,
    Shield,
    MapPin,
    Building,
    GraduationCap,
    Calendar,
    CheckCircle2,
    Settings,
    LogOut,
    Briefcase,
    Phone,
    AlertCircle,
    Send
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, updateStudentPlacement } from '../../utils/studentApi';

const ProfileCard = ({ title, icon: Icon = Settings, children }) => (
    <div className="glass-card p-8 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <Icon className="text-blue-500" size={18} />
            <span className="uppercase tracking-widest text-xs">{title}</span>
        </h3>
        {children}
    </div>
);

const StudentProfile = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const [placementForm, setPlacementForm] = useState({
        course: '',
        yearOfStudy: '',
        phone: '',
        organizationName: '',
        organizationAddress: '',
        organizationPhone: '',
        organizationEmail: '',
        contactPerson: '',
        startDate: '',
        endDate: ''
    });

    const loadProfile = async () => {
        try {
            const res = await getStudentProfile();
            if (res.data?.data) {
                const s = res.data.data;
                setProfile(s);
                setPlacementForm({
                    course: s.course || '',
                    yearOfStudy: s.yearOfStudy || '',
                    phone: s.phone || '',
                    organizationName: s.organizationName || '',
                    organizationAddress: s.organizationAddress || '',
                    organizationPhone: s.organizationPhone || '',
                    organizationEmail: s.organizationEmail || '',
                    contactPerson: s.contactPerson || '',
                    startDate: s.startDate || '',
                    endDate: s.endDate || ''
                });
            }
        } catch (err) {
            console.error('Failed to load student profile:', err);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSavePlacement = async (submitForApproval = false) => {
        setSaving(true);
        setFeedback(null);
        try {
            const res = await updateStudentPlacement({
                ...placementForm,
                submitForApproval
            });
            setFeedback({ type: 'success', text: res.data?.message || 'Placement details updated.' });
            setIsEditing(false);
            loadProfile();
        } catch (err) {
            setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update placement details' });
        } finally {
            setSaving(false);
        }
    };

    const statusColors = {
        DRAFT: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        SUBMITTED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        PENDING_APPROVAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        APPROVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        ACTIVE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        COMPLETED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        REJECTED: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    };

    const placementStatus = profile?.placementStatus || 'DRAFT';
    const canEdit = ['DRAFT', 'REJECTED', 'SUBMITTED'].includes(placementStatus);

    return (
        <DashboardLayout role="student">
            <div className="space-y-8 animate-fade-in pb-12">
                {/* Header / Identity */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-600/10 to-transparent p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden">
                            <User className="text-blue-500" size={64} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="text-white" size={16} />
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter">{user?.name}</h1>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${statusColors[placementStatus] || 'bg-blue-600 text-white'}`}>
                                {placementStatus.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium">
                            {profile?.admissionNumber || 'Admission Pending'} • {profile?.course || profile?.department || 'Department Unassigned'}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Building size={14} className="text-blue-500" />
                                <span>{profile?.organizationName || 'No Organization Assigned'}</span>
                            </div>
                            {profile?.endDate && (
                                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <Calendar size={14} className="text-purple-500" />
                                    <span>Ends {profile.endDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Alert */}
                {feedback && (
                    <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        <AlertCircle size={16} />
                        <span>{feedback.text}</span>
                    </div>
                )}

                {/* Rejection Alert */}
                {placementStatus === 'REJECTED' && profile?.rejectionReason && (
                    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
                            <AlertCircle size={16} />
                            <span>Placement Application Requires Revision</span>
                        </div>
                        <p className="text-slate-300 text-sm">{profile.rejectionReason}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Academic & Supervisor Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <ProfileCard title="Academic Institution" icon={GraduationCap}>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Institution</p>
                                    <p className="text-sm font-bold text-white leading-tight">{profile?.institution || user?.schoolName || 'University'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Department</p>
                                    <p className="text-sm font-bold text-slate-300 leading-tight">{profile?.department || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Admission Number</p>
                                    <p className="text-sm font-bold text-slate-300 leading-tight">{profile?.admissionNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </ProfileCard>

                        <ProfileCard title="Supervision Oversight" icon={Shield}>
                            <div className="space-y-5">
                                <div className="flex items-start space-x-4">
                                    <Briefcase className="text-emerald-500 shrink-0 mt-1" size={20} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Industry Supervisor</p>
                                        <p className="text-sm font-bold text-white leading-tight">
                                            {profile?.industrySupervisor ? profile.industrySupervisor.name : 'Pending Assignment'}
                                        </p>
                                        {profile?.industrySupervisor?.email && (
                                            <p className="text-xs text-slate-400">{profile.industrySupervisor.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <GraduationCap className="text-purple-500 shrink-0 mt-1" size={20} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Academic Supervisor</p>
                                        <p className="text-sm font-bold text-white leading-tight">
                                            {profile?.universitySupervisor ? profile.universitySupervisor.name : 'Pending Assignment'}
                                        </p>
                                        {profile?.universitySupervisor?.email && (
                                            <p className="text-xs text-slate-400">{profile.universitySupervisor.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ProfileCard>
                    </div>

                    {/* Attachment Placement Application & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-10 space-y-8">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div>
                                    <h3 className="text-base font-black uppercase tracking-widest text-white">Attachment Placement Details</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Submit your hosting organization and timeline</p>
                                </div>
                                {canEdit && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300"
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Details'}
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Hosting Organization</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={placementForm.organizationName}
                                        onChange={(e) => setPlacementForm({ ...placementForm, organizationName: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                        placeholder="e.g. Safaricom PLC, Google"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Organization Address</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={placementForm.organizationAddress}
                                        onChange={(e) => setPlacementForm({ ...placementForm, organizationAddress: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                        placeholder="e.g. Waiyaki Way, Nairobi"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Person / HR Lead</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={placementForm.contactPerson}
                                        onChange={(e) => setPlacementForm({ ...placementForm, contactPerson: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                        placeholder="e.g. Jane Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Company Contact Email</label>
                                    <input
                                        type="email"
                                        disabled={!isEditing}
                                        value={placementForm.organizationEmail}
                                        onChange={(e) => setPlacementForm({ ...placementForm, organizationEmail: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                        placeholder="e.g. hr@company.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Company Phone</label>
                                    <input
                                        type="tel"
                                        disabled={!isEditing}
                                        value={placementForm.organizationPhone}
                                        onChange={(e) => setPlacementForm({ ...placementForm, organizationPhone: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                        placeholder="e.g. +254 700 000000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Student Mobile Phone</label>
                                    <input
                                        type="tel"
                                        disabled={!isEditing}
                                        value={placementForm.phone}
                                        onChange={(e) => setPlacementForm({ ...placementForm, phone: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                        placeholder="e.g. +254 712 345678"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Attachment Start Date</label>
                                    <input
                                        type="date"
                                        disabled={!isEditing}
                                        value={placementForm.startDate}
                                        onChange={(e) => setPlacementForm({ ...placementForm, startDate: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Attachment End Date</label>
                                    <input
                                        type="date"
                                        disabled={!isEditing}
                                        value={placementForm.endDate}
                                        onChange={(e) => setPlacementForm({ ...placementForm, endDate: e.target.value })}
                                        className="input-field w-full disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 justify-end">
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() => handleSavePlacement(false)}
                                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest"
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={() => handleSavePlacement(true)}
                                        className="btn-primary px-8 py-3 text-xs flex items-center gap-2"
                                    >
                                        <Send size={16} />
                                        <span>{saving ? 'Transmitting...' : 'Submit For Approval'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sign Out Card */}
                        <div className="glass-card p-8 border-l-4 border-l-red-600 bg-red-600/[0.02] flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Sign Out</h3>
                                <p className="text-xs text-slate-500 font-medium">Terminate current session securely</p>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-8 py-3 bg-red-600/10 text-red-500 rounded-xl border border-red-600/20 hover:bg-red-600/20 transition-all font-black text-xs uppercase tracking-widest"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentProfile;
