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
    ArrowRight
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
            setError('Please provide an initial technical summary before refining');
            return;
        }

        setRefining(true);
        setError(null);
        try {
            const response = await refineSummary(formData.summary);
            setRefinedDraft(response.data.data.refined);
            setShowRefineModal(true);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Refinement service unavailable. Please check text and retry.';
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

    return (
        <DashboardLayout role="student">
            <div className="max-w-6xl mx-auto space-y-6 p-6 font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#22242f]">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-violet-600/15 border border-violet-500/25 rounded-lg flex items-center justify-center text-violet-300">
                            <FileText size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Academic Reporting</span>
                            <h1 className="text-xl font-semibold text-white tracking-tight">Weekly Industrial Logbook</h1>
                            <p className="text-xs text-slate-400 mt-0.5">Record daily technical tasks, equipment competencies, and supervisor evidence.</p>
                        </div>
                    </div>
                    {editingLogbookId && (
                        <Button
                            variant="outline"
                            onClick={cancelRevision}
                            className="text-xs py-1.5 px-3"
                        >
                            Cancel Revision Mode
                        </Button>
                    )}
                </div>

                {submitted ? (
                    <div className="craft-card max-w-xl mx-auto py-12 px-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center justify-center mx-auto">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-white">Logbook Submitted Successfully</h2>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Your report for Week {formData.weekNumber} has been submitted for industry supervisor review.
                            </p>
                        </div>
                        <Button
                            onClick={() => { setSubmitted(false); setEditingLogbookId(null); }}
                            className="text-xs py-2 px-4"
                        >
                            Create Another Entry
                        </Button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-5">
                        {/* Form Area */}
                        <div className="lg:col-span-8 space-y-4">
                            {editingLogbookId && (
                                <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-300 space-y-1 text-xs">
                                    <div className="flex items-center gap-1.5 font-semibold">
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Revising Week {formData.weekNumber} Logbook</span>
                                    </div>
                                    {supervisorComment && (
                                        <p className="text-slate-300 text-[11px] leading-normal italic">
                                            Supervisor Feedback: "{supervisorComment}"
                                        </p>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="craft-card p-5 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-300">Reporting Week</label>
                                            <select
                                                value={formData.weekNumber}
                                                disabled={Boolean(editingLogbookId)}
                                                onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                                                className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500"
                                            >
                                                {[...Array(16).keys()].map(i => (
                                                    <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-300">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-300">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Daily Entries */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-300">Daily Technical Tasks</label>
                                        <div className="segmented-tabs w-full flex">
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => setActiveDay(day)}
                                                    className={`segmented-tab-btn flex-1 text-center capitalize ${
                                                        activeDay === day ? 'active' : ''
                                                    }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>

                                        <textarea
                                            rows={5}
                                            value={formData.dailyEntries[activeDay]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                dailyEntries: {
                                                    ...formData.dailyEntries,
                                                    [activeDay]: e.target.value
                                                }
                                            })}
                                            className="w-full p-3 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans"
                                            placeholder={`Detail tasks and deliverables completed on ${activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}...`}
                                        />
                                    </div>

                                    {/* Weekly Summary */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-slate-300">Weekly Reflection & Summary</label>
                                            <button
                                                type="button"
                                                onClick={handleRefine}
                                                disabled={refining}
                                                className="flex items-center gap-1 text-[11px] font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 px-2.5 py-0.5 rounded border border-violet-500/20"
                                            >
                                                {refining ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                                <span>{refining ? 'Enhancing...' : 'Refine Summary'}</span>
                                            </button>
                                        </div>
                                        <textarea
                                            rows={4}
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="w-full p-3 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans"
                                            placeholder="Summarize key learning objectives, equipment used, challenges solved, and skills developed..."
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-300 text-xs">
                                            <AlertCircle size={14} className="shrink-0 text-rose-400" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-2.5 text-xs font-semibold rounded-md flex items-center justify-center gap-2"
                                    >
                                        <Upload size={14} />
                                        <span>{loading ? 'Submitting...' : editingLogbookId ? 'Resubmit Revised Logbook' : 'Submit Weekly Logbook'}</span>
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: Evidence Vault & Submission History */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Evidence Upload */}
                            <div className="craft-card p-4 space-y-3">
                                <h3 className="text-xs font-semibold text-white uppercase tracking-wide flex items-center gap-1.5">
                                    <Upload size={14} className="text-violet-400" />
                                    Evidence Attachments
                                </h3>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border border-dashed rounded-lg p-5 text-center space-y-1.5 transition ${
                                        dragActive ? 'border-violet-500 bg-violet-500/10' : 'border-[#22242f] hover:border-slate-500'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload size={20} className="text-violet-400 mx-auto opacity-80" />
                                    <p className="text-xs font-medium text-slate-300">Upload Photos or PDFs</p>
                                    <p className="text-[10px] text-slate-500">Max 10MB per file</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="space-y-1.5">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs">
                                                <span className="text-slate-300 truncate max-w-[160px] text-[11px]">{file.name}</span>
                                                <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-rose-400 p-0.5">
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Existing Submissions List */}
                            <div className="craft-card p-4 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                                    <h3 className="text-xs font-semibold text-white uppercase tracking-wide flex items-center gap-1.5">
                                        <History size={14} className="text-violet-400" />
                                        Logbook Submissions
                                    </h3>
                                    <span className="text-[10px] text-slate-500">{existingLogs.length} Records</span>
                                </div>

                                {historyLoading ? (
                                    <div className="space-y-2">
                                        <LoadingSkeleton className="h-9 rounded-md" />
                                        <LoadingSkeleton className="h-9 rounded-md" />
                                    </div>
                                ) : existingLogs.length === 0 ? (
                                    <p className="text-xs text-slate-500 text-center py-4">No logbooks submitted yet.</p>
                                ) : (
                                    <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
                                        {existingLogs.map(log => {
                                            const isApproved = log.status === 'approved';
                                            const isRejected = log.status === 'rejected';

                                            return (
                                                <div key={log.id} className="p-2.5 rounded-md bg-[#181a24] border border-[#22242f] flex items-center justify-between text-xs">
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-medium text-white">Week {log.weekNumber}</p>
                                                            {isApproved && <Lock size={11} className="text-emerald-400" title="Locked" />}
                                                        </div>
                                                        <p className="text-[10px] text-slate-500">{log.startDate} to {log.endDate}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={isApproved ? 'success' : isRejected ? 'danger' : 'warning'}
                                                            size="sm"
                                                            dot={true}
                                                        >
                                                            {isApproved ? 'Approved' : isRejected ? 'Revision Required' : 'Under Review'}
                                                        </Badge>
                                                        {isRejected && (
                                                            <button
                                                                type="button"
                                                                onClick={() => startRevision(log)}
                                                                className="text-[11px] font-medium text-amber-400 hover:text-amber-300"
                                                            >
                                                                Revise
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Refine Modal */}
                {showRefineModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <div className="w-full max-w-xl bg-[#12141c] border border-[#22242f] rounded-xl p-5 space-y-4 shadow-2xl">
                            <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-violet-400" />
                                    Technical Summary Enhancement
                                </h3>
                                <button onClick={() => setShowRefineModal(false)} className="text-slate-400 hover:text-white p-1">
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                    <p className="font-medium text-slate-400 uppercase text-[10px]">Original Draft</p>
                                    <div className="p-3 bg-[#181a24] rounded-md text-slate-300 max-h-40 overflow-y-auto text-[11px] leading-relaxed border border-[#22242f]">
                                        "{formData.summary}"
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium text-violet-400 uppercase text-[10px]">Enhanced Version</p>
                                    <div className="p-3 bg-violet-950/20 border border-violet-500/20 rounded-md text-slate-100 max-h-40 overflow-y-auto text-[11px] leading-relaxed">
                                        {refinedDraft}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-[#22242f]">
                                <Button variant="secondary" onClick={() => setShowRefineModal(false)} className="text-xs py-1.5 px-3">
                                    Discard
                                </Button>
                                <Button onClick={applyRefinement} className="text-xs py-1.5 px-3">
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
