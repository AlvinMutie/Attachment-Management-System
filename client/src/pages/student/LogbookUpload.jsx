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
    Eye,
    ChevronRight,
    Layers
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { submitLogbook, updateLogbook, getMyLogbooks, refineSummary } from '../../utils/studentApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

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
                setExistingLogs(res.data.data);
                if (res.data.data.length > 0 && !editingLogbookId) {
                    const maxWeek = Math.max(...res.data.data.map(l => l.weekNumber || 1));
                    setFormData(prev => ({ ...prev, weekNumber: maxWeek + 1 }));
                }
            }
        } catch (err) {
            console.error('Failed to load logbook history:', err);
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
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: ''
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
            dailyEntries: {
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: ''
            }
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
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
            const errorMsg = err.response?.data?.message || 'Refinement service unavailable. Please check your text and try again.';
            setError(errorMsg);
        } finally {
            setRefining(false);
        }
    };

    const applyRefinement = () => {
        setFormData(prev => ({ ...prev, summary: refinedDraft }));
        setShowRefineModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            data.append('weekNumber', formData.weekNumber);
            data.append('startDate', formData.startDate);
            data.append('endDate', formData.endDate);
            data.append('summary', formData.summary);
            data.append('dailyEntries', JSON.stringify(formData.dailyEntries));

            files.forEach(file => {
                data.append('evidenceFiles', file);
            });

            if (editingLogbookId) {
                await updateLogbook(editingLogbookId, data);
            } else {
                await submitLogbook(data);
            }

            setSubmitted(true);
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
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' }
    ];

    const filledDaysCount = days.filter(d => Boolean(formData.dailyEntries[d.id]?.trim())).length;

    return (
        <DashboardLayout role="student">
            <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
                {/* 1. Header Cockpit */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-300 shadow-inner">
                                <FileText size={22} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                        Academic Portfolio
                                    </span>
                                    {editingLogbookId && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                            Revision Mode
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                                    Weekly Industrial Logbook
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Document daily technical tasks, competencies gained, and verified supervisor evidence.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 w-full md:w-auto">
                            {editingLogbookId && (
                                <Button
                                    variant="secondary"
                                    onClick={cancelRevision}
                                    className="text-xs py-2 px-3.5 border border-[#2a2e40]"
                                >
                                    Cancel Revision
                                </Button>
                            )}
                            <button
                                type="button"
                                onClick={loadLogbooks}
                                className="px-3 py-2 rounded-lg bg-[#1a1d28] hover:bg-[#232736] text-slate-300 hover:text-white border border-[#2a2e40] text-xs font-medium flex items-center gap-1.5 transition-all"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${historyLoading ? 'animate-spin' : ''}`} />
                                <span>Sync History</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Logbook Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-400">Total Submitted</span>
                        <div className="text-2xl font-bold text-white tracking-tight mt-1">{existingLogs.length}</div>
                        <span className="text-[11px] text-slate-500 mt-1">Weeks recorded</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-emerald-400">Supervisor Approved</span>
                        <div className="text-2xl font-bold text-emerald-400 tracking-tight mt-1">{approvedCount}</div>
                        <span className="text-[11px] text-slate-500 mt-1">Locked entries</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-amber-400">Under Review</span>
                        <div className="text-2xl font-bold text-amber-400 tracking-tight mt-1">{pendingCount}</div>
                        <span className="text-[11px] text-slate-500 mt-1">Awaiting assessment</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                        <span className="text-xs font-semibold text-rose-400">Revisions Requested</span>
                        <div className="text-2xl font-bold text-rose-400 tracking-tight mt-1">{revisionCount}</div>
                        <span className="text-[11px] text-slate-500 mt-1">Action required</span>
                    </div>
                </div>

                {submitted ? (
                    <div className="rounded-2xl bg-[#12141c] border border-[#22242f] max-w-xl mx-auto py-12 px-6 text-center space-y-4 shadow-xl">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 size={28} />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-lg font-bold text-white">Logbook Submitted Successfully</h2>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                Your weekly report for Week {formData.weekNumber} has been logged and transmitted to your workplace supervisor for review and signature.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Button
                                onClick={() => { setSubmitted(false); setEditingLogbookId(null); }}
                                variant="primary"
                                className="text-xs py-2 px-5 font-semibold"
                            >
                                Create Another Entry
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* 3. Form Area (8 Cols) */}
                        <div className="lg:col-span-8 space-y-5">
                            {editingLogbookId && (
                                <div className="p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/30 text-amber-300 space-y-1.5 text-xs shadow-sm">
                                    <div className="flex items-center gap-2 font-bold">
                                        <Edit3 className="w-4 h-4 text-amber-400" />
                                        <span>Revising Week {formData.weekNumber} Submission</span>
                                    </div>
                                    {supervisorComment && (
                                        <div className="p-3 bg-[#10121a] rounded-lg border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed">
                                            <span className="font-semibold text-amber-400 block mb-0.5">Supervisor Instruction:</span>
                                            "{supervisorComment}"
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-5 shadow-md">
                                    {/* Week & Dates Picker */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-violet-400" /> Reporting Week
                                            </label>
                                            <select
                                                value={formData.weekNumber}
                                                disabled={Boolean(editingLogbookId)}
                                                onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                                                className="w-full p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500 transition-colors cursor-pointer"
                                            >
                                                {[...Array(16).keys()].map(i => (
                                                    <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Period Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500 transition-colors"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Period End Date</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Daily Entries Tabbed Workspace */}
                                    <div className="space-y-3 pt-2 border-t border-[#1e2230]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                                                    Daily Task Entries
                                                </label>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    Record duties, tools, methodologies, and engineering accomplishments
                                                </p>
                                            </div>
                                            <span className="text-[11px] font-mono text-slate-400 bg-[#181a24] px-2 py-0.5 rounded border border-[#22242f]">
                                                {filledDaysCount}/5 days documented
                                            </span>
                                        </div>

                                        {/* Day Segmented Tabs */}
                                        <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-[#0e1017] border border-[#22242f]">
                                            {days.map((day) => {
                                                const isFilled = Boolean(formData.dailyEntries[day.id]?.trim());
                                                const isActive = activeDay === day.id;

                                                return (
                                                    <button
                                                        key={day.id}
                                                        type="button"
                                                        onClick={() => setActiveDay(day.id)}
                                                        className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                                                            isActive
                                                                ? 'bg-violet-600 text-white shadow-md'
                                                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                                                        }`}
                                                    >
                                                        <span>{day.label.slice(0, 3)}</span>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isFilled ? (isActive ? 'bg-emerald-300' : 'bg-emerald-400') : 'bg-slate-600'}`} />
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
                                                    dailyEntries: {
                                                        ...formData.dailyEntries,
                                                        [activeDay]: e.target.value
                                                    }
                                                })}
                                                className="w-full p-4 rounded-xl bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans leading-relaxed transition-colors"
                                                placeholder={`Document specific activities, tasks, technical problems solved, and tools used on ${activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}...`}
                                            />
                                            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500">
                                                {formData.dailyEntries[activeDay]?.length || 0} chars
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weekly Summary & Technical Reflection */}
                                    <div className="space-y-2.5 pt-2 border-t border-[#1e2230]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                                                    Weekly Learning Reflection
                                                </label>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    Synthesize competencies acquired, industry insights, and challenges overcome
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleRefine}
                                                disabled={refining}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-white bg-violet-600/15 hover:bg-violet-600/25 px-3 py-1.5 rounded-lg border border-violet-500/30 transition-all shadow-sm"
                                            >
                                                {refining ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" /> : <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                                                <span>{refining ? 'Refining...' : 'Enhance with AI'}</span>
                                            </button>
                                        </div>

                                        <textarea
                                            rows={4}
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="w-full p-4 rounded-xl bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans leading-relaxed transition-colors"
                                            placeholder="Write your comprehensive technical weekly summary here..."
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2.5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs">
                                            <AlertCircle size={15} className="shrink-0 text-rose-400" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        variant="primary"
                                        className="w-full py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
                                    >
                                        <Upload size={15} />
                                        <span>{loading ? 'Submitting Logbook...' : editingLogbookId ? 'Resubmit Revised Logbook' : 'Submit Weekly Logbook'}</span>
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* 4. Evidence Vault & Submission History (4 Cols) */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* Evidence Attachments Dropzone */}
                            <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-3.5 shadow-md">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Paperclip size={14} className="text-violet-400" />
                                        Evidence Attachments
                                    </h3>
                                    <span className="text-[10px] text-slate-500 font-mono">{files.length}/5 files</span>
                                </div>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-xl p-5 text-center space-y-2 transition-all ${
                                        dragActive ? 'border-violet-500 bg-violet-500/10' : 'border-[#22242f] hover:border-slate-600 bg-[#181a24]/50'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-10 h-10 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center mx-auto text-violet-400">
                                        <Upload size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-200">Upload Photos or Reports</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Drag & drop or click (PNG, JPG, PDF up to 10MB)</p>
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="space-y-2">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText size={13} className="text-violet-400 shrink-0" />
                                                    <span className="text-slate-300 truncate text-[11px] font-medium">{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Existing Submissions Roster */}
                            <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-4 shadow-md">
                                <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <History size={14} className="text-violet-400" />
                                        Submission History
                                    </h3>
                                    <span className="text-[11px] font-mono text-slate-400">{existingLogs.length} Records</span>
                                </div>

                                {historyLoading ? (
                                    <div className="space-y-2.5">
                                        <LoadingSkeleton className="h-14 rounded-lg bg-[#181a24]" />
                                        <LoadingSkeleton className="h-14 rounded-lg bg-[#181a24]" />
                                        <LoadingSkeleton className="h-14 rounded-lg bg-[#181a24]" />
                                    </div>
                                ) : existingLogs.length === 0 ? (
                                    <div className="py-8 text-center space-y-1">
                                        <FileText className="w-6 h-6 text-slate-600 mx-auto" />
                                        <p className="text-xs font-medium text-slate-400">No submissions yet</p>
                                        <p className="text-[11px] text-slate-500">Completed weekly logs will appear here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                                        {existingLogs.map(log => {
                                            const isApproved = log.status === 'approved';
                                            const isRejected = log.status === 'rejected';

                                            return (
                                                <div
                                                    key={log.id}
                                                    className={`p-3 rounded-xl border transition-all ${
                                                        isApproved
                                                            ? 'bg-[#181a24] border-[#22242f]'
                                                            : isRejected
                                                            ? 'bg-rose-500/[0.04] border-rose-500/25'
                                                            : 'bg-[#181a24] border-[#22242f]'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-white text-xs">Week {log.weekNumber}</span>
                                                                {isApproved && <Lock size={12} className="text-emerald-400" title="Locked" />}
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                                                {log.startDate} to {log.endDate}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            {isApproved ? (
                                                                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                    Approved
                                                                </span>
                                                            ) : isRejected ? (
                                                                <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                                                    Revision
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                                    Reviewing
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isRejected && (
                                                        <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex items-center justify-between">
                                                            <span className="text-[10px] text-rose-300 truncate max-w-[140px]">
                                                                {log.supervisorComment ? `"${log.supervisorComment}"` : 'Feedback provided'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => startRevision(log)}
                                                                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                                                            >
                                                                <span>Revise Log</span>
                                                                <ChevronRight size={12} />
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

                {/* 5. AI Reflection Refinement Modal */}
                {showRefineModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="w-full max-w-2xl bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in">
                            <div className="flex items-center justify-between pb-3 border-b border-[#22242f]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                                        <Sparkles size={16} />
                                    </div>
                                    <h3 className="text-sm font-bold text-white">Technical Summary Enhancement</h3>
                                </div>
                                <button
                                    onClick={() => setShowRefineModal(false)}
                                    className="text-slate-400 hover:text-white p-1 rounded-md"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1.5">
                                    <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Original Draft</p>
                                    <div className="p-3.5 bg-[#181a24] rounded-xl text-slate-300 max-h-52 overflow-y-auto text-[11px] leading-relaxed border border-[#22242f]">
                                        "{formData.summary}"
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="font-bold text-violet-400 uppercase text-[10px] tracking-wider">Enhanced Academic Reflection</p>
                                    <div className="p-3.5 bg-violet-950/20 border border-violet-500/30 rounded-xl text-slate-100 max-h-52 overflow-y-auto text-[11px] leading-relaxed shadow-inner">
                                        {refinedDraft}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#22242f]">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowRefineModal(false)}
                                    className="text-xs py-2 px-4 border border-[#2a2e40]"
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
