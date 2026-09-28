import React, { useState, useEffect } from 'react';
import {
    FileText,
    Upload,
    CheckCircle2,
    Calendar,
    AlertCircle,
    X,
    Sparkles,
    Edit3,
    History,
    RefreshCw,
    Lock,
    ArrowRight,
    Check,
    Clock,
    FileCheck,
    Paperclip,
    AlertTriangle,
    ChevronRight,
    Layers
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { submitLogbook, updateLogbook, getMyLogbooks, refineSummary } from '../../utils/studentApi';
import { Button, LoadingSkeleton } from '../../components/ui';

const LogbookUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [existingLogs, setExistingLogs] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    // Revision Mode
    const [editingLogbookId, setEditingLogbookId] = useState(null);
    const [supervisorComment, setSupervisorComment] = useState(null);

    const [formData, setFormData] = useState({
        weekNumber: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        summary: '',
        dailyEntries: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: ''
        }
    });

    const [activeDay, setActiveDay] = useState('monday');
    const [refining, setRefining] = useState(false);
    const [refinedDraft, setRefinedDraft] = useState(null);
    const [showRefineModal, setShowRefineModal] = useState(false);

    const loadLogbooks = async () => {
        try {
            setHistoryLoading(true);
            const res = await getMyLogbooks();
            if (res.data?.data) {
                const sorted = [...res.data.data].sort((a, b) => b.weekNumber - a.weekNumber);
                setExistingLogs(sorted);
                if (!editingLogbookId) {
                    const nextWeek = sorted.length > 0 ? Math.max(...sorted.map(l => l.weekNumber)) + 1 : 1;
                    setFormData(prev => ({ ...prev, weekNumber: nextWeek }));
                }
            }
        } catch (err) {
            console.error('Failed to load logbooks', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        loadLogbooks();
    }, []);

    const startRevision = (log) => {
        setEditingLogbookId(log.id);
        setSupervisorComment(log.supervisorComment);
        setFormData({
            weekNumber: log.weekNumber,
            startDate: log.startDate,
            endDate: log.endDate,
            summary: log.summary || '',
            dailyEntries: log.dailyEntries || {
                monday: '', tuesday: '', wednesday: '', thursday: '', friday: ''
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelRevision = () => {
        setEditingLogbookId(null);
        setSupervisorComment(null);
        setFormData({
            weekNumber: existingLogs.length + 1,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
            summary: '',
            dailyEntries: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' }
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).slice(0, 5 - files.length);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).slice(0, 5 - files.length);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRefine = async () => {
        if (!formData.summary || formData.summary.length < 10) {
            setError('Please write an initial reflection before requesting enhancement');
            return;
        }
        setRefining(true);
        setError(null);
        try {
            const response = await refineSummary(formData.summary);
            setRefinedDraft(response.data.data.refined);
            setShowRefineModal(true);
        } catch (err) {
            setError('AI enhancement unavailable. Please try again.');
        } finally {
            setRefining(false);
        }
    };

    const applyRefinement = () => {
        if (refinedDraft) {
            setFormData(prev => ({ ...prev, summary: refinedDraft }));
        }
        setShowRefineModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const fd = new FormData();
            fd.append('weekNumber', formData.weekNumber);
            fd.append('startDate', formData.startDate);
            fd.append('endDate', formData.endDate);
            fd.append('summary', formData.summary);
            fd.append('dailyEntries', JSON.stringify(formData.dailyEntries));
            files.forEach(file => fd.append('evidence', file));

            if (editingLogbookId) {
                await updateLogbook(editingLogbookId, fd);
            } else {
                await submitLogbook(fd);
            }
            setSubmitted(true);
            setFiles([]);
            loadLogbooks();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit logbook report');
        } finally {
            setLoading(false);
        }
    };

    const approvedCount = existingLogs.filter(l => l.status === 'approved').length;
    const pendingCount = existingLogs.filter(l => l.status === 'pending' || !l.status).length;
    const revisionCount = existingLogs.filter(l => l.status === 'rejected').length;

    const days = [
        { id: 'monday', label: 'Monday', short: 'Mon' },
        { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
        { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
        { id: 'thursday', label: 'Thursday', short: 'Thu' },
        { id: 'friday', label: 'Friday', short: 'Fri' }
    ];

    const filledDaysCount = days.filter(d => Boolean(formData.dailyEntries[d.id]?.trim())).length;

    const getStatusChip = (status) => {
        if (status === 'approved') return { label: 'Signed', cls: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20' };
        if (status === 'rejected') return { label: 'Revision', cls: 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-300 dark:border-rose-500/20' };
        return { label: 'In Review', cls: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/20' };
    };

    return (
        <DashboardLayout role="student">
            <div className="max-w-7xl mx-auto space-y-5 pb-16 font-sans">

                {/* ================================================================= */}
                {/* FIGMA WORKSPACE TOOLBAR                                            */}
                {/* ================================================================= */}
                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                <span>Workspace</span>
                                <span>/</span>
                                <span>Academic Portfolio</span>
                                <span>/</span>
                                <span className="text-violet-600 dark:text-violet-400 font-bold">Weekly Logbook Hub</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-lg sm:text-xl font-black text-[#0a0d14] dark:text-white tracking-tight">
                                    {editingLogbookId ? 'Revising Logbook Entry' : 'Weekly Industrial Logbook'}
                                </h1>
                                {editingLogbookId && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20">
                                        <Edit3 size={11} />
                                        Revision Mode — Week {formData.weekNumber}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#5b6276] dark:text-slate-400">
                                Document daily technical tasks, competencies, and supervisor evidence each week
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            {editingLogbookId && (
                                <button
                                    type="button"
                                    onClick={cancelRevision}
                                    className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <X size={13} />
                                    <span>Cancel Revision</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={loadLogbooks}
                                className="px-3 py-1.5 rounded-lg bg-[#f6f5ee] dark:bg-[#181a24] hover:bg-[#eae8de] dark:hover:bg-[#202330] text-[#0a0d14] dark:text-slate-300 border border-[#e2ddd3] dark:border-[#2a2e40] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RefreshCw size={13} className={`text-[#5b6276] dark:text-slate-400 ${historyLoading ? 'animate-spin' : ''}`} />
                                <span>Sync</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================================================================= */}
                {/* CLEAN KPI METRIC STRIP                                             */}
                {/* ================================================================= */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                        {
                            label: 'Total Submitted',
                            value: existingLogs.length,
                            suffix: 'of 12 weeks',
                            color: 'text-[#0a0d14] dark:text-white',
                            accent: 'bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400'
                        },
                        {
                            label: 'Supervisor Signed',
                            value: approvedCount,
                            suffix: 'locked entries',
                            color: 'text-emerald-700 dark:text-emerald-400',
                            accent: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400'
                        },
                        {
                            label: 'Under Review',
                            value: pendingCount,
                            suffix: 'awaiting assessment',
                            color: 'text-amber-700 dark:text-amber-400',
                            accent: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400'
                        },
                        {
                            label: 'Revision Requested',
                            value: revisionCount,
                            suffix: 'action required',
                            color: 'text-rose-700 dark:text-rose-400',
                            accent: 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400'
                        }
                    ].map((m, i) => (
                        <div key={i} className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-xl p-4 shadow-2xs hover:border-violet-500/40 transition-colors flex flex-col justify-between">
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                {m.label}
                            </span>
                            <div className="mt-2">
                                <span className={`text-2xl font-black font-mono tracking-tight ${m.color}`}>
                                    {m.value}
                                </span>
                            </div>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded mt-2 self-start ${m.accent}`}>
                                {m.suffix}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ================================================================= */}
                {/* SUBMISSION SUCCESS STATE                                           */}
                {/* ================================================================= */}
                {submitted ? (
                    <div className="bg-white dark:bg-[#11131a] border border-emerald-300 dark:border-emerald-500/30 rounded-2xl p-10 text-center space-y-4 shadow-xs">
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                            <CheckCircle2 size={28} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-black text-[#0a0d14] dark:text-white">Logbook Submitted</h2>
                            <p className="text-xs text-[#5b6276] dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                                Week {formData.weekNumber} has been transmitted to your industry supervisor for review and sign-off.
                            </p>
                        </div>
                        <Button
                            onClick={() => { setSubmitted(false); setEditingLogbookId(null); }}
                            variant="primary"
                            className="text-xs py-2 px-5 font-semibold"
                        >
                            Submit Another Entry
                        </Button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-5">

                        {/* ============================================================= */}
                        {/* FORM AREA (8 Cols)                                             */}
                        {/* ============================================================= */}
                        <div className="lg:col-span-8 space-y-5">
                            {/* Revision Banner */}
                            {editingLogbookId && (
                                <div className="p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/30 text-xs space-y-1.5">
                                    <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-400">
                                        <Edit3 size={13} className="text-amber-500" />
                                        <span>Revising — Week {formData.weekNumber}</span>
                                    </div>
                                    {supervisorComment && (
                                        <div className="p-2.5 bg-white dark:bg-[#141620] rounded-lg border border-amber-500/20 text-[#22283a] dark:text-slate-300 text-[11px] leading-relaxed">
                                            <span className="font-semibold text-amber-800 dark:text-amber-400 block mb-0.5">Supervisor Instruction:</span>
                                            "{supervisorComment}"
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* === WEEK & DATE PICKERS === */}
                                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                                    <div className="flex items-center gap-2 pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                        <Calendar size={15} className="text-violet-600 dark:text-violet-400" />
                                        <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white">Reporting Period</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">
                                                Reporting Week
                                            </label>
                                            <select
                                                value={formData.weekNumber}
                                                disabled={Boolean(editingLogbookId)}
                                                onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                                                className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white outline-none focus:border-violet-500 transition-colors cursor-pointer disabled:opacity-60 font-mono"
                                            >
                                                {[...Array(16).keys()].map(i => (
                                                    <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">
                                                Period Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white outline-none focus:border-violet-500 transition-colors font-mono"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-mono font-semibold text-[#5b6276] dark:text-slate-400 uppercase tracking-wider">
                                                Period End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white outline-none focus:border-violet-500 transition-colors font-mono"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* === DAILY ENTRIES WORKSPACE === */}
                                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                                    <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                        <div>
                                            <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                                <Layers size={15} className="text-violet-600 dark:text-violet-400" />
                                                Daily Task Entries
                                            </h3>
                                            <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">
                                                Record duties, tools, methodologies, and accomplishments per day
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 bg-[#f0eee6] dark:bg-[#1c202d] px-2 py-0.5 rounded border border-[#e2ddd3] dark:border-[#22242f]">
                                            {filledDaysCount}/5 days
                                        </span>
                                    </div>

                                    {/* Day Tab Selector */}
                                    <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-[#f0eee6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f]">
                                        {days.map((day) => {
                                            const isFilled = Boolean(formData.dailyEntries[day.id]?.trim());
                                            const isActive = activeDay === day.id;
                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => setActiveDay(day.id)}
                                                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                                        isActive
                                                            ? 'bg-violet-600 text-white shadow-xs'
                                                            : 'text-[#5b6276] dark:text-slate-400 hover:text-[#0a0d14] dark:hover:text-white'
                                                    }`}
                                                >
                                                    <span>{day.short}</span>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        isFilled
                                                            ? (isActive ? 'bg-emerald-300' : 'bg-emerald-500')
                                                            : 'bg-[#cbd5e1] dark:bg-slate-600'
                                                    }`} />
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Active Day Textarea */}
                                    <div className="relative">
                                        <textarea
                                            rows={6}
                                            value={formData.dailyEntries[activeDay]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                dailyEntries: { ...formData.dailyEntries, [activeDay]: e.target.value }
                                            })}
                                            className="w-full p-4 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans leading-relaxed transition-colors"
                                            placeholder={`Document activities, technical problems solved, and tools used on ${activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}...`}
                                        />
                                        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#a09d93] dark:text-slate-500">
                                            {formData.dailyEntries[activeDay]?.length || 0} chars
                                        </div>
                                    </div>
                                </div>

                                {/* === WEEKLY SUMMARY & AI ENHANCE === */}
                                <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                                    <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                        <div>
                                            <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white flex items-center gap-2">
                                                <FileText size={15} className="text-violet-600 dark:text-violet-400" />
                                                Weekly Learning Reflection
                                            </h3>
                                            <p className="text-[11px] text-[#5b6276] dark:text-slate-400 mt-0.5">
                                                Synthesize competencies acquired, industry insights, and challenges overcome
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRefine}
                                            disabled={refining}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-600/15 hover:bg-violet-200 dark:hover:bg-violet-600/25 px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-500/30 transition-colors cursor-pointer"
                                        >
                                            {refining ? <RefreshCw size={13} className="animate-spin text-violet-500" /> : <Sparkles size={13} className="text-violet-500" />}
                                            <span>{refining ? 'Refining...' : 'AI Enhance'}</span>
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            rows={5}
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs text-[#0a0d14] dark:text-white placeholder-[#a09d93] dark:placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans leading-relaxed transition-colors"
                                            placeholder="Write your comprehensive technical weekly summary, key learnings, and competencies developed..."
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-rose-100 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/20 rounded-lg text-rose-900 dark:text-rose-300 text-xs">
                                            <AlertCircle size={14} className="shrink-0 text-rose-500" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        variant="primary"
                                        className="w-full py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
                                    >
                                        <Upload size={14} />
                                        <span>{loading ? 'Submitting...' : editingLogbookId ? 'Resubmit Revised Logbook' : 'Submit Weekly Logbook'}</span>
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* ============================================================= */}
                        {/* RIGHT RAIL: Evidence Vault + History (4 Cols)                 */}
                        {/* ============================================================= */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* Evidence Attachments Dropzone */}
                            <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                                <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                    <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Paperclip size={13} className="text-violet-600 dark:text-violet-400" />
                                        Evidence Files
                                    </h3>
                                    <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                        {files.length}/5
                                    </span>
                                </div>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-xl p-5 text-center space-y-2 transition-all ${
                                        dragActive
                                            ? 'border-violet-500 bg-violet-100/60 dark:bg-violet-500/10'
                                            : 'border-[#d6d0c2] dark:border-[#2a2e40] hover:border-violet-500/50 bg-[#faf9f6] dark:bg-[#161822]'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-600/15 border border-violet-300 dark:border-violet-500/25 flex items-center justify-center mx-auto text-violet-600 dark:text-violet-400">
                                        <Upload size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[#0a0d14] dark:text-slate-200">Upload Evidence</p>
                                        <p className="text-[10px] text-[#5b6276] dark:text-slate-500 mt-0.5">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="space-y-1.5">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#faf9f6] dark:bg-[#161822] border border-[#e2ddd3] dark:border-[#22242f] text-xs">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <FileText size={12} className="text-violet-600 dark:text-violet-400 shrink-0" />
                                                    <span className="text-[#0a0d14] dark:text-slate-300 truncate text-[11px]">{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="text-[#5b6276] dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-0.5 rounded cursor-pointer"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submission History */}
                            <div className="bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                                <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                    <h3 className="text-xs font-mono font-bold text-[#0a0d14] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <History size={13} className="text-violet-600 dark:text-violet-400" />
                                        Submission History
                                    </h3>
                                    <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                        {existingLogs.length} Records
                                    </span>
                                </div>

                                {historyLoading ? (
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => (
                                            <LoadingSkeleton key={i} className="h-14 rounded-lg bg-[#f0eee6] dark:bg-[#161822]" />
                                        ))}
                                    </div>
                                ) : existingLogs.length === 0 ? (
                                    <div className="py-8 text-center space-y-1">
                                        <FileText size={22} className="text-[#d6d0c2] dark:text-slate-600 mx-auto" />
                                        <p className="text-xs font-medium text-[#5b6276] dark:text-slate-400">No submissions yet</p>
                                        <p className="text-[11px] text-[#a09d93] dark:text-slate-500">Completed weekly logs will appear here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-0.5">
                                        {existingLogs.map(log => {
                                            const chip = getStatusChip(log.status);
                                            const isRejected = log.status === 'rejected';
                                            const isApproved = log.status === 'approved';

                                            return (
                                                <div
                                                    key={log.id}
                                                    className={`p-3 rounded-xl border transition-all ${
                                                        isRejected
                                                            ? 'bg-rose-500/[0.03] border-rose-500/25'
                                                            : 'bg-[#faf9f6] dark:bg-[#161822] border-[#e2ddd3] dark:border-[#22242f]'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-[#0a0d14] dark:text-white text-xs font-mono">
                                                                    W{log.weekNumber < 10 ? `0${log.weekNumber}` : log.weekNumber}
                                                                </span>
                                                                {isApproved && <Lock size={11} className="text-emerald-600 dark:text-emerald-400" />}
                                                            </div>
                                                            <p className="text-[10px] text-[#5b6276] dark:text-slate-400 font-mono mt-0.5">
                                                                {log.startDate} → {log.endDate}
                                                            </p>
                                                        </div>
                                                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${chip.cls}`}>
                                                            {chip.label}
                                                        </span>
                                                    </div>

                                                    {isRejected && (
                                                        <div className="mt-2 pt-2 border-t border-rose-500/20 flex items-center justify-between">
                                                            <span className="text-[10px] text-rose-800 dark:text-rose-300 truncate max-w-[140px]">
                                                                {log.supervisorComment ? `"${log.supervisorComment}"` : 'Feedback provided'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => startRevision(log)}
                                                                className="text-[11px] font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                                                            >
                                                                <span>Revise</span>
                                                                <ArrowRight size={11} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================= */}
                {/* AI REFINEMENT MODAL                                                */}
                {/* ================================================================= */}
                {showRefineModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-2xl bg-white dark:bg-[#11131a] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-600/20 border border-violet-300 dark:border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-300">
                                        <Sparkles size={15} />
                                    </div>
                                    <h3 className="text-sm font-bold text-[#0a0d14] dark:text-white">AI Summary Enhancement</h3>
                                </div>
                                <button
                                    onClick={() => setShowRefineModal(false)}
                                    className="text-[#5b6276] dark:text-slate-400 hover:text-[#0a0d14] dark:hover:text-white p-1 rounded-md cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1.5">
                                    <p className="font-mono font-bold text-[#5b6276] dark:text-slate-400 uppercase text-[10px] tracking-wider">Original Draft</p>
                                    <div className="p-3.5 bg-[#faf9f6] dark:bg-[#161822] rounded-xl text-[#22283a] dark:text-slate-300 max-h-52 overflow-y-auto text-[11px] leading-relaxed border border-[#e2ddd3] dark:border-[#22242f]">
                                        "{formData.summary}"
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="font-mono font-bold text-violet-700 dark:text-violet-400 uppercase text-[10px] tracking-wider">Enhanced Academic Reflection</p>
                                    <div className="p-3.5 bg-violet-50 dark:bg-violet-950/20 border border-violet-300 dark:border-violet-500/30 rounded-xl text-[#22283a] dark:text-slate-100 max-h-52 overflow-y-auto text-[11px] leading-relaxed">
                                        {refinedDraft}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e5e0d5] dark:border-[#202330]">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowRefineModal(false)}
                                    className="text-xs py-2 px-4 border border-[#e2ddd3] dark:border-[#2a2e40]"
                                >
                                    Discard
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={applyRefinement}
                                    className="text-xs py-2 px-4 font-bold"
                                >
                                    Apply Enhancement
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default LogbookUpload;
