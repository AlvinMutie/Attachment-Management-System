import React, { useState, useEffect } from 'react';
import {
    FileText,
    Upload,
    CheckCircle2,
    Calendar,
    AlertCircle,
    X,
    Sparkles,
    Wand2,
    ArrowRight,
    Edit3,
    History,
    RefreshCw
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { submitLogbook, updateLogbook, getMyLogbooks, refineSummary } from '../../utils/studentApi';
import { Card, Badge, Button, LoadingSkeleton } from '../../components/ui';

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
                // Default week number to next week if logs exist
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
            setError('Please provide a basic summary before refining');
            return;
        }

        setRefining(true);
        setError(null);
        try {
            const response = await refineSummary(formData.summary);
            setRefinedDraft(response.data.data.refined);
            setShowRefineModal(true);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'AI Refinement failed. Please try again.';
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
            <div className="max-w-6xl mx-auto space-y-10 animate-fade-in p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400">
                            <FileText size={32} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Academic Reporting</span>
                            <h1 className="text-3xl font-black text-white tracking-tight">Weekly Industrial Logbook</h1>
                            <p className="text-xs text-slate-400">Record weekly tasks, industrial competencies, and supervisor evidence.</p>
                        </div>
                    </div>
                    {editingLogbookId && (
                        <Button
                            variant="outline"
                            onClick={cancelRevision}
                            className="text-xs bg-slate-800 border-slate-700 text-slate-300"
                        >
                            Cancel Revision Mode
                        </Button>
                    )}
                </div>

                {submitted ? (
                    <Card className="max-w-2xl mx-auto py-16 text-center space-y-6 bg-slate-900/80 border-slate-800">
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={36} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Logbook Submitted Successfully!</h2>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Your report for Week {formData.weekNumber} has been transmitted to your industry supervisor for verification.
                        </p>
                        <Button onClick={() => setSubmitted(false)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-6">
                            Submit Another Entry / View Logbooks
                        </Button>
                    </Card>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Form Area */}
                        <div className="lg:col-span-8 space-y-6">
                            {editingLogbookId && (
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1 text-xs">
                                    <div className="flex items-center gap-2 font-bold">
                                        <Edit3 className="w-4 h-4" />
                                        <span>Revising Week {formData.weekNumber} Logbook</span>
                                    </div>
                                    {supervisorComment && (
                                        <p className="text-slate-300 text-[11px] mt-1 italic">
                                            Supervisor Feedback: "{supervisorComment}"
                                        </p>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Card className="p-6 sm:p-8 space-y-6 bg-slate-900/80 border-slate-800">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reporting Week</label>
                                            <select
                                                value={formData.weekNumber}
                                                disabled={Boolean(editingLogbookId)}
                                                onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                                                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                                            >
                                                {[...Array(16).keys()].map(i => (
                                                    <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Daily Entries */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Activity Log</label>
                                        <div className="flex bg-slate-800/80 p-1 rounded-xl gap-1 overflow-x-auto">
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => setActiveDay(day)}
                                                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition ${
                                                        activeDay === day
                                                            ? 'bg-blue-600 text-white shadow'
                                                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                                    }`}
                                                >
                                                    {day.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>

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
                                            className="w-full p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-white placeholder-slate-500 resize-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Detail your technical activities and deliverables for ${activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}...`}
                                        />
                                    </div>

                                    {/* Weekly Summary */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Comprehensive Summary</label>
                                            <button
                                                type="button"
                                                onClick={handleRefine}
                                                disabled={refining}
                                                className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20"
                                            >
                                                {refining ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                                <span>{refining ? 'Refining...' : 'AI Refine'}</span>
                                            </button>
                                        </div>
                                        <textarea
                                            rows={5}
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="w-full p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-white placeholder-slate-500 resize-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Describe overall competencies acquired, equipment utilized, and technical challenges overcome..."
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                                            <AlertCircle size={16} className="shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                                    >
                                        <Upload size={16} />
                                        <span>{loading ? 'Submitting...' : editingLogbookId ? 'Resubmit Revised Logbook' : 'Submit Weekly Logbook'}</span>
                                    </Button>
                                </Card>
                            </form>
                        </div>

                        {/* Right Column: Evidence Upload & History */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Evidence Vault */}
                            <Card className="p-6 space-y-4 bg-slate-900/80 border-slate-800">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Upload size={16} className="text-blue-400" />
                                    Evidence Attachments
                                </h3>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center space-y-2 transition ${
                                        dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-blue-500/50'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload size={24} className="text-blue-400 mx-auto opacity-80" />
                                    <p className="text-xs font-semibold text-slate-300">Upload Photos / PDFs</p>
                                    <p className="text-[10px] text-slate-500">Max 10MB per file</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="space-y-2">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-800 text-xs">
                                                <span className="text-slate-300 truncate max-w-[180px]">{file.name}</span>
                                                <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-rose-400">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>

                            {/* Existing Submissions List */}
                            <Card className="p-6 space-y-4 bg-slate-900/80 border-slate-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <History size={16} className="text-purple-400" />
                                        Logbook Submissions
                                    </h3>
                                    <span className="text-[10px] text-slate-500">{existingLogs.length} Records</span>
                                </div>

                                {historyLoading ? (
                                    <div className="space-y-2">
                                        <LoadingSkeleton className="h-10 rounded-lg" />
                                        <LoadingSkeleton className="h-10 rounded-lg" />
                                    </div>
                                ) : existingLogs.length === 0 ? (
                                    <p className="text-xs text-slate-500 italic text-center py-4">No submissions yet.</p>
                                ) : (
                                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                        {existingLogs.map(log => {
                                            const isApproved = log.status === 'approved';
                                            const isRejected = log.status === 'rejected';

                                            return (
                                                <div key={log.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs">
                                                    <div>
                                                        <p className="font-bold text-white">Week {log.weekNumber}</p>
                                                        <p className="text-[10px] text-slate-400">{log.startDate} to {log.endDate}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={isApproved ? 'bg-emerald-500/10 text-emerald-400' : isRejected ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}>
                                                            {log.status.toUpperCase()}
                                                        </Badge>
                                                        {isRejected && (
                                                            <button
                                                                type="button"
                                                                onClick={() => startRevision(log)}
                                                                className="text-[10px] font-bold text-amber-400 hover:underline"
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
                            </Card>
                        </div>
                    </div>
                )}

                {/* AI Refine Modal */}
                {showRefineModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                    AI Technical Enhancement
                                </h3>
                                <button onClick={() => setShowRefineModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-400 uppercase text-[10px]">Your Original Draft</p>
                                    <div className="p-3 bg-slate-800 rounded-xl text-slate-300 italic max-h-48 overflow-y-auto">
                                        "{formData.summary}"
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-blue-400 uppercase text-[10px]">Enhanced Version</p>
                                    <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-white max-h-48 overflow-y-auto">
                                        {refinedDraft}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                <Button variant="outline" onClick={() => setShowRefineModal(false)} className="text-xs">
                                    Discard
                                </Button>
                                <Button onClick={applyRefinement} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                                    Apply Refinement
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
