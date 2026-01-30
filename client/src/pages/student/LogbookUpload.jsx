import React, { useState } from 'react';
import {
    FileText,
    Upload,
    CheckCircle2,
    Calendar,
    AlertCircle,
    X,
    Sparkles,
    Wand2,
    ArrowRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

import { submitLogbook, refineSummary } from '../../utils/studentApi';

const LogbookUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        weekNumber: 9,
        startDate: '2026-01-26',
        endDate: '2026-01-31',
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

            await submitLogbook(data);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit logbook evidence');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <DashboardLayout role="student">
                <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-600/20 text-green-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Submission Successful!</h1>
                    <p className="text-slate-400">Your logbook for Week 9 has been sent to your industry supervisor for review.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-primary px-8">Return to Dashboard</button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-1 ring-white/20">
                            <FileText className="text-white" size={40} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Activity Reporting</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Weekly <span className="text-blue-500">Logbook</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">Submit your technical summaries and work evidence for supervisor validation.</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="glass-card p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Reporting Week</label>
                                        <select
                                            value={formData.weekNumber}
                                            onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                                            className="input-field w-full bg-slate-900 border-white/5"
                                        >
                                            {[...Array(12).keys()].map(i => (
                                                <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Submission Date</label>
                                        <div className="input-field w-full flex items-center space-x-3 opacity-50 select-none">
                                            <Calendar size={18} />
                                            <span>Jan 30, 2026</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Entries Section */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Activity Log</label>
                                    <div className="flex bg-slate-900 p-1 rounded-xl gap-1 overflow-x-auto no-scrollbar">
                                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => setActiveDay(day)}
                                                className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeDay === day
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {day.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="animate-fade-in relative">
                                        <textarea
                                            rows={8}
                                            value={formData.dailyEntries[activeDay]}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                dailyEntries: {
                                                    ...formData.dailyEntries,
                                                    [activeDay]: e.target.value
                                                }
                                            })}
                                            className="input-field w-full resize-none p-4"
                                            placeholder={`Detail your technical activities for ${activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}...`}
                                        />
                                        <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-600 uppercase tracking-widest pointer-events-none">
                                            {activeDay}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Weekly Summary</label>
                                        <button
                                            type="button"
                                            onClick={handleRefine}
                                            disabled={refining}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-all bg-blue-600/10 px-3 py-1.5 rounded-full border border-blue-500/20 group animate-pulse-slow"
                                        >
                                            {refining ? (
                                                <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                            ) : (
                                                <Sparkles size={12} className="group-hover:scale-125 transition-transform" />
                                            )}
                                            {refining ? 'Consulting AI...' : 'AI Refine'}
                                        </button>
                                    </div>
                                    <textarea
                                        rows={6}
                                        value={formData.summary}
                                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                        className="input-field w-full resize-none p-4"
                                        placeholder="Describe your activities, achievements, and challenges this week..."
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold uppercase tracking-widest">
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-5 text-sm flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Upload size={20} />
                                    )}
                                    {loading ? 'Processing Submission...' : 'Transmit Weekly Report'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-8">
                        {/* Evidence Upload Area */}
                        <div className="glass-card p-8 space-y-6">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Upload size={18} className="text-blue-500" />
                                Evidence Vault
                            </h3>

                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col items-center text-center space-y-4 ${dragActive ? 'border-blue-500 bg-blue-500/10 scale-95' : 'border-white/10 hover:border-blue-500/30'
                                    }`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Upload size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white">Drop attachments here</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Images or PDFs • Max 10MB per file</p>
                                </div>
                            </div>

                            {/* File List */}
                            <div className="space-y-3">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 group animate-in slide-in-from-bottom-2 fade-in">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-300 truncate">{file.name}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-slate-500 hover:text-rose-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                {files.length === 0 && (
                                    <div className="text-center py-6">
                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-relaxed">No evidence artifacts staged</p>
                                    </div>
                                )}
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center pt-2">
                                    {files.length}/5 Artifacts Staged
                                </p>
                            </div>
                        </div>

                        <div className="glass-card p-8 bg-blue-600/5 border-blue-500/10">
                            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <AlertCircle size={14} />
                                Reporting Guidelines
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'Detail high-impact technical tasks',
                                    'Mention problematic operational nodes',
                                    'Include visual evidence for audit',
                                    'Ensure week boundaries are correct'
                                ].map((step, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* AI Refinement Modal */}
            {showRefineModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowRefineModal(false)} />

                    <div className="relative w-full max-w-5xl glass-card !p-0 border-white/10 shadow-[0_0_100px_rgba(37,99,235,0.2)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-500">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center">
                                    <Wand2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">AI Technical Refinement</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">Side-by-side Comparative Analysis</p>
                                </div>
                            </div>
                            <button onClick={() => setShowRefineModal(false)} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Original */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                        Student Original Draft
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-sm text-slate-400 font-medium leading-relaxed italic">
                                        "{formData.summary}"
                                    </div>
                                </div>

                                {/* Refined */}
                                <div className="space-y-4 relative">
                                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 hidden lg:flex w-10 h-10 bg-blue-600 rounded-full items-center justify-center text-white shadow-2xl shadow-blue-600/40 z-10 border-4 border-slate-950">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#2563eb]" />
                                        AI Enhanced Technical Report
                                    </div>
                                    <div className="p-6 rounded-3xl bg-blue-600/[0.03] border border-blue-500/20 text-sm text-white font-medium leading-relaxed">
                                        {refinedDraft}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                                <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Academic Integrity Policy</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Verify that the AI suggestions accurately represent your actual technical activities. Once applied, this refined text will be submitted to your supervisor for grading.</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-white/5 flex items-center justify-end gap-4 bg-slate-900/50">
                            <button
                                onClick={() => setShowRefineModal(false)}
                                className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={applyRefinement}
                                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                            >
                                <CheckCircle2 size={18} />
                                Integrate Refinement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default LogbookUpload;
