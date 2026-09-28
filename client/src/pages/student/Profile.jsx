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
    LogOut,
    Briefcase,
    Phone,
    AlertCircle,
    Send,
    Edit3,
    Check,
    X,
    ChevronRight,
    RefreshCw,
    Building2
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
            await updateStudentPlacement({ ...placementForm, submitForApproval });
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

    const placementStatus = profile?.placementStatus || 'DRAFT';
    const canEdit = ['DRAFT', 'REJECTED', 'SUBMITTED'].includes(placementStatus);

    const statusConfig = {
        APPROVED: { label: 'Placement Approved', cls: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20', dot: 'bg-emerald-500' },
        ACTIVE: { label: 'Placement Active', cls: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20', dot: 'bg-emerald-500 animate-pulse' },
        PENDING_APPROVAL: { label: 'Pending Approval', cls: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20', dot: 'bg-amber-500' },
        SUBMITTED: { label: 'Submitted for Review', cls: 'bg-sky-100 dark:bg-sky-500/10 text-sky-800 dark:text-sky-400 border-sky-300 dark:border-sky-500/20', dot: 'bg-sky-500' },
        REJECTED: { label: 'Revision Required', cls: 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20', dot: 'bg-rose-500' },
        COMPLETED: { label: 'Completed', cls: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/20', dot: 'bg-indigo-500' },
        DRAFT: { label: 'Draft Profile', cls: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700', dot: 'bg-slate-400' }
    };

    const sc = statusConfig[placementStatus] || statusConfig.DRAFT;

    const fieldInput = (label, key, type = 'text', placeholder = '', required = false) => (
        <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">
                {label}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={placementForm[key]}
                    onChange={(e) => setPlacementForm({ ...placementForm, [key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 outline-none focus:border-violet-500 transition-colors font-mono"
                    placeholder={placeholder}
                    required={required}
                />
            ) : (
                <p className="text-xs font-semibold text-[#0a0d14] dark:text-white py-2 font-mono">
                    {placementForm[key] || <span className="text-[#a09d93] dark:text-slate-500 font-normal">Not provided</span>}
                </p>
            )}
        </div>
    );

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
            <div className="space-y-5 max-w-6xl mx-auto pb-16 font-sans">

                {/* ================================================================= */}
                {/* FIGMA WORKSPACE TOOLBAR                                            */}
                {/* ================================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                <span>Workspace</span>
                                <span>/</span>
                                <span className="text-violet-600 dark:text-violet-400 font-bold">Student Profile & Placement</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-600/15 border border-violet-300 dark:border-violet-500/25 flex items-center justify-center text-base font-black text-violet-700 dark:text-violet-300">
                                        {user?.name?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-black text-[#0a0d14] dark:text-white tracking-tight">
                                            {user?.name}
                                        </h1>
                                        <p className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400">{user?.email}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${sc.cls}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                    {sc.label}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={loadProfile}
                                className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={13} className="text-[#5b6276] dark:text-slate-400" />
                                <span>Sync</span>
                            </button>

                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={() => { setIsEditing(!isEditing); setFeedback(null); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                                        isEditing
                                            ? 'bg-[#f6f5ee] dark:bg-[#181a24] text-[#0a0d14] dark:text-slate-300 border-[#e2ddd3] dark:border-[#2a2e40]'
                                            : 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700'
                                    }`}
                                >
                                    {isEditing ? <X size={13} /> : <Edit3 size={13} />}
                                    <span>{isEditing ? 'Cancel Editing' : 'Edit Placement'}</span>
                                </button>
                            )}

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

                {/* Feedback Alert */}
                {feedback && (
                    <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
                        feedback.type === 'success'
                            ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20 text-rose-900 dark:text-rose-400'
                    }`}>
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{feedback.text}</span>
                    </div>
                )}

                {/* Rejection Banner */}
                {placementStatus === 'REJECTED' && profile?.rejectionReason && (
                    <div className="p-3.5 rounded-xl bg-rose-100 dark:bg-rose-500/[0.06] border border-rose-300 dark:border-rose-500/25 space-y-1">
                        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-semibold text-xs">
                            <AlertCircle size={13} />
                            <span>Coordinator Feedback — Revision Required</span>
                        </div>
                        <p className="text-xs text-[#22283a] dark:text-slate-300 pl-5 leading-relaxed">
                            {profile.rejectionReason}
                        </p>
                    </div>
                )}

                {/* ================================================================= */}
                {/* MAIN 3-COLUMN BODY                                                 */}
                {/* ================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* LEFT COLUMN: Academic + Supervisors + Account */}
                    <div className="space-y-5">

                        {/* Academic Dossier */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <GraduationCap size={15} className="text-violet-600 dark:text-violet-400" />
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider">
                                    Academic Dossier
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs divide-y divide-[#e5e0d5] dark:divide-[#202330]">
                                {[
                                    { label: 'University / School', value: profile?.institution || user?.schoolName || 'Kirinyaga University' },
                                    { label: 'Academic Department', value: profile?.department || 'Computing & Information Technology' },
                                    { label: 'Degree Programme', value: profile?.course || 'BSc Software Engineering' },
                                    { label: 'Year of Study', value: profile?.yearOfStudy || 'Year 3' },
                                    { label: 'Admission Number', value: profile?.admissionNumber || '—', mono: true }
                                ].map((item, i) => (
                                    <div key={i} className="py-2 first:pt-0 last:pb-0">
                                        <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400 block mb-0.5 uppercase tracking-wider">
                                            {item.label}
                                        </span>
                                        <span className={`text-[#0a0d14] dark:text-slate-200 font-semibold ${item.mono ? 'font-mono' : ''}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Supervisory Roster */}
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <Shield size={15} className="text-violet-600 dark:text-violet-400" />
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider">
                                    Supervisory Oversight
                                </h3>
                            </div>

                            <div className="space-y-2.5">
                                {/* Industry Mentor */}
                                <div className="p-3 bg-[#faf9f6] dark:bg-[#161822] rounded-xl border border-[#e2ddd3] dark:border-[#22242f] space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                                            Industry Mentor
                                        </span>
                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                            profile?.industrySupervisor
                                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-[#5b6276] dark:text-slate-400 border-slate-300 dark:border-slate-700'
                                        }`}>
                                            {profile?.industrySupervisor ? 'Assigned' : 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-[#0a0d14] dark:text-slate-200">
                                        {profile?.industrySupervisor?.name || 'Awaiting Assignment'}
                                    </p>
                                    {profile?.industrySupervisor?.email && (
                                        <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                            {profile.industrySupervisor.email}
                                        </p>
                                    )}
                                </div>

                                {/* University Supervisor */}
                                <div className="p-3 bg-[#faf9f6] dark:bg-[#161822] rounded-xl border border-[#e2ddd3] dark:border-[#22242f] space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-800 dark:text-violet-400">
                                            Faculty Advisor
                                        </span>
                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                            profile?.universitySupervisor
                                                ? 'bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 border-violet-300 dark:border-violet-500/20'
                                                : 'bg-slate-100 dark:bg-slate-800 text-[#5b6276] dark:text-slate-400 border-slate-300 dark:border-slate-700'
                                        }`}>
                                            {profile?.universitySupervisor ? 'Assigned' : 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-[#0a0d14] dark:text-slate-200">
                                        {profile?.universitySupervisor?.name || 'Awaiting Assignment'}
                                    </p>
                                    {profile?.universitySupervisor?.email && (
                                        <p className="text-[11px] text-[#5b6276] dark:text-slate-400 font-mono">
                                            {profile.universitySupervisor.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Host Organization Placement Form (2 Cols) */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div>
                                    <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                        <Building2 size={16} className="text-violet-600 dark:text-violet-400" />
                                        Host Organization & Placement Record
                                    </h3>
                                    <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">
                                        {isEditing
                                            ? 'Fill in your workplace placement details for coordinator verification.'
                                            : 'Official host organization details registered with the attachment office.'}
                                    </p>
                                </div>

                                {!isEditing && canEdit && (
                                    <span className="text-[11px] font-mono text-violet-700 dark:text-violet-400 font-bold flex items-center gap-1 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-md border border-violet-300 dark:border-violet-500/20">
                                        <Edit3 size={11} />
                                        Editable
                                    </span>
                                )}
                            </div>

                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSavePlacement(true); }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {fieldInput('Hosting Organization Name', 'organizationName', 'text', 'e.g. Safaricom PLC HQ', true)}
                                    {fieldInput('Workplace Physical Address', 'organizationAddress', 'text', 'e.g. Waiyaki Way, Nairobi', true)}
                                    {fieldInput('HR / Mentor Contact Person', 'contactPerson', 'text', 'e.g. Jane Mwangi (Head of Engineering)', true)}
                                    {fieldInput('Company Contact Email', 'organizationEmail', 'email', 'e.g. attachments@safaricom.co.ke')}
                                    {fieldInput('Company Phone Number', 'organizationPhone', 'tel', 'e.g. +254 722 000000')}
                                    {fieldInput('Your Mobile Phone', 'phone', 'tel', 'e.g. +254 712 345678')}
                                    {fieldInput('Attachment Start Date', 'startDate', 'date', '', true)}
                                    {fieldInput('Attachment End Date', 'endDate', 'date', '', true)}
                                </div>

                                {/* Academic info (read-only) */}
                                <div className="pt-4 border-t border-[#e5e0d5] dark:border-[#202330] grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">
                                            Course / Programme
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={placementForm.course}
                                                onChange={(e) => setPlacementForm({ ...placementForm, course: e.target.value })}
                                                className="w-full px-3 py-2.5 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 outline-none focus:border-violet-500 transition-colors font-mono"
                                                placeholder="e.g. BSc Software Engineering"
                                            />
                                        ) : (
                                            <p className="text-xs font-semibold text-[#0a0d14] dark:text-white py-2 font-mono">
                                                {placementForm.course || <span className="text-[#a09d93] dark:text-slate-500 font-normal">Not provided</span>}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">
                                            Year of Study
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={placementForm.yearOfStudy}
                                                onChange={(e) => setPlacementForm({ ...placementForm, yearOfStudy: e.target.value })}
                                                className="w-full px-3 py-2.5 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white outline-none focus:border-violet-500 transition-colors font-mono cursor-pointer"
                                            >
                                                {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'].map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-xs font-semibold text-[#0a0d14] dark:text-white py-2 font-mono">
                                                {placementForm.yearOfStudy || <span className="text-[#a09d93] dark:text-slate-500 font-normal">Not provided</span>}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="pt-4 border-t border-[#e5e0d5] dark:border-[#202330] flex flex-wrap items-center justify-end gap-2.5">
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() => handleSavePlacement(false)}
                                            className="px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] transition-colors cursor-pointer disabled:opacity-60"
                                        >
                                            Save Draft
                                        </button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={saving}
                                            className="text-xs font-bold px-4 py-2 flex items-center gap-1.5"
                                        >
                                            <Send size={13} />
                                            <span>{saving ? 'Submitting...' : 'Submit for Approval'}</span>
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Placement Timeline Reference */}
                        {profile?.startDate && profile?.endDate && (
                            <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                                <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                    <Calendar size={14} className="text-violet-600 dark:text-violet-400" />
                                    Attachment Period Reference
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    {[
                                        { label: 'Start Date', value: profile.startDate },
                                        { label: 'End Date', value: profile.endDate },
                                        { label: 'Duration', value: `${Math.ceil((new Date(profile.endDate) - new Date(profile.startDate)) / (1000 * 60 * 60 * 24 * 7))} weeks` },
                                        { label: 'Status', value: sc.label }
                                    ].map((item, i) => (
                                        <div key={i} className="p-2.5 bg-[#faf9f6] dark:bg-[#161822] rounded-xl border border-[#e2ddd3] dark:border-[#22242f] space-y-0.5">
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block">
                                                {item.label}
                                            </span>
                                            <span className="text-[#0a0d14] dark:text-white font-bold font-mono">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentProfile;
