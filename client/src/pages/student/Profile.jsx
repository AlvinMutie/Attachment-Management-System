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
    Send,
    Edit3,
    Clock,
    Check,
    X,
    ExternalLink
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, updateStudentPlacement } from '../../utils/studentApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const StudentProfile = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
            const res = await getStudentProfile();
            if (res.data?.data) {
                const s = res.data.data;
                setProfile(s);
                setPlacementForm({
                    course: s.course || '',
                    yearOfStudy: s.yearOfStudy || 'Year 3',
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
        } finally {
            setLoading(false);
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
            setFeedback({
                type: 'success',
                text: submitForApproval
                    ? 'Placement details submitted to your coordinator for approval.'
                    : 'Placement draft saved successfully.'
            });
            setIsEditing(false);
            loadProfile();
        } catch (err) {
            setFeedback({
                type: 'error',
                text: err.response?.data?.message || 'Failed to update placement details'
            });
        } finally {
            setSaving(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'ACTIVE':
                return 'success';
            case 'SUBMITTED':
            case 'PENDING_APPROVAL':
                return 'warning';
            case 'REJECTED':
                return 'danger';
            default:
                return 'neutral';
        }
    };

    const placementStatus = profile?.placementStatus || 'DRAFT';
    const canEdit = ['DRAFT', 'REJECTED', 'SUBMITTED'].includes(placementStatus);

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 font-sans">
                {/* 1. Header & Identity Card */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl flex items-center justify-center text-lg font-bold">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-slate-300">
                                    {profile?.admissionNumber || 'Admission Pending'}
                                </span>
                                <span className="text-slate-600">•</span>
                                <span className="text-xs text-slate-400">
                                    {profile?.course || profile?.department || 'Department Unassigned'}
                                </span>
                                <Badge variant={getStatusBadgeVariant(placementStatus)}>
                                    {placementStatus.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">{user?.name}</h1>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
                        </div>
                    </div>

                    {canEdit && (
                        <Button
                            variant={isEditing ? 'outline' : 'primary'}
                            onClick={() => {
                                setIsEditing(!isEditing);
                                setFeedback(null);
                            }}
                            icon={isEditing ? X : Edit3}
                        >
                            {isEditing ? 'Cancel Editing' : 'Edit Placement Info'}
                        </Button>
                    )}
                </div>

                {/* 2. Feedback Alert */}
                {feedback && (
                    <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                        feedback.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{feedback.text}</span>
                    </div>
                )}

                {/* 3. Rejection / Action Required Banner */}
                {placementStatus === 'REJECTED' && profile?.rejectionReason && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                            <AlertCircle size={15} />
                            <span>Coordinator Feedback — Revisions Required</span>
                        </div>
                        <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                            {profile.rejectionReason}
                        </p>
                    </div>
                )}

                {/* 4. Main Body: 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Academic & Supervision Oversight */}
                    <div className="space-y-6">
                        {/* Institutional Details */}
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="text-violet-400" size={17} />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Academic Dossier</h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-slate-500 text-[11px] block">University / School:</span>
                                    <span className="text-slate-200 font-semibold">{profile?.institution || user?.schoolName || 'Kirinyaga University'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[11px] block">Academic Department:</span>
                                    <span className="text-slate-300">{profile?.department || 'Computing & Information Technology'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[11px] block">Degree Programme:</span>
                                    <span className="text-slate-300">{profile?.course || 'BSc Software Engineering'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[11px] block">Year of Study:</span>
                                    <span className="text-slate-300">{profile?.yearOfStudy || 'Year 3'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Supervision Pairings */}
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <Shield className="text-violet-400" size={17} />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Supervision Oversight</h3>
                            </div>

                            <div className="space-y-3">
                                {/* Industry Mentor */}
                                <div className="p-3 bg-[#12141c] rounded-lg border border-[#22242f] space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-semibold text-emerald-400">Industry Mentor</span>
                                        <Badge variant={profile?.industrySupervisor ? 'success' : 'neutral'}>
                                            {profile?.industrySupervisor ? 'Assigned' : 'Pending'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-200">
                                        {profile?.industrySupervisor?.name || 'Pending Assignment'}
                                    </p>
                                    {profile?.industrySupervisor?.email && (
                                        <p className="text-[11px] text-slate-400 font-mono">{profile.industrySupervisor.email}</p>
                                    )}
                                </div>

                                {/* Academic Supervisor */}
                                <div className="p-3 bg-[#12141c] rounded-lg border border-[#22242f] space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-semibold text-violet-400">Faculty Supervisor</span>
                                        <Badge variant={profile?.universitySupervisor ? 'purple' : 'neutral'}>
                                            {profile?.universitySupervisor ? 'Assigned' : 'Pending'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-200">
                                        {profile?.universitySupervisor?.name || 'Pending Assignment'}
                                    </p>
                                    {profile?.universitySupervisor?.email && (
                                        <p className="text-[11px] text-slate-400 font-mono">{profile.universitySupervisor.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Session & Sign Out */}
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-5 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Account Session</h3>
                            <Button
                                variant="danger"
                                className="w-full"
                                onClick={logout}
                                icon={LogOut}
                            >
                                Sign Out from Terminal
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Host Organization & Placement Application */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-[#22242f] pb-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-100">Host Organization & Placement Record</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {isEditing
                                            ? 'Fill in your workplace placement details for coordinator verification.'
                                            : 'Official host organization details registered with the attachment office.'}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleSavePlacement(true); }} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Hosting Organization Name
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={placementForm.organizationName}
                                            onChange={(e) => setPlacementForm({ ...placementForm, organizationName: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
                                            placeholder="e.g. Safaricom PLC HQ"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Workplace Physical Address
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={placementForm.organizationAddress}
                                            onChange={(e) => setPlacementForm({ ...placementForm, organizationAddress: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
                                            placeholder="e.g. Waiyaki Way, Nairobi"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            HR / Mentor Contact Person
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={placementForm.contactPerson}
                                            onChange={(e) => setPlacementForm({ ...placementForm, contactPerson: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
                                            placeholder="e.g. Jane Mwangi (Head of Engineering)"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Company Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={placementForm.organizationEmail}
                                            onChange={(e) => setPlacementForm({ ...placementForm, organizationEmail: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
                                            placeholder="e.g. attachments@safaricom.co.ke"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Company Phone
                                        </label>
                                        <input
                                            type="tel"
                                            disabled={!isEditing}
                                            value={placementForm.organizationPhone}
                                            onChange={(e) => setPlacementForm({ ...placementForm, organizationPhone: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
                                            placeholder="e.g. +254 722 000000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Student Mobile Phone
                                        </label>
                                        <input
                                            type="tel"
                                            disabled={!isEditing}
                                            value={placementForm.phone}
                                            onChange={(e) => setPlacementForm({ ...placementForm, phone: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 disabled:opacity-60"
                                            placeholder="e.g. +254 712 345678"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Attachment Start Date
                                        </label>
                                        <input
                                            type="date"
                                            disabled={!isEditing}
                                            value={placementForm.startDate}
                                            onChange={(e) => setPlacementForm({ ...placementForm, startDate: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 disabled:opacity-60 [color-scheme:dark]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Attachment End Date
                                        </label>
                                        <input
                                            type="date"
                                            disabled={!isEditing}
                                            value={placementForm.endDate}
                                            onChange={(e) => setPlacementForm({ ...placementForm, endDate: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 disabled:opacity-60 [color-scheme:dark]"
                                            required
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-4 border-t border-[#22242f] flex items-center justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={saving}
                                            onClick={() => handleSavePlacement(false)}
                                        >
                                            Save Draft
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={saving}
                                            icon={Send}
                                        >
                                            {saving ? 'Submitting...' : 'Submit for Coordinator Approval'}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentProfile;
