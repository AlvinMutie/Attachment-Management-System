import React, { useState } from 'react';
import {
    FileText,
    Upload,
    CheckCircle2,
    Calendar,
    AlertCircle,
    X
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const LogbookUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);

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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
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
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
                        <FileText className="text-blue-500" size={32} />
                        <span>Submit Weekly Logbook</span>
                    </h1>
                    <p className="text-slate-400 mt-1">Upload your summary and attachments for the current week.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="glass-card p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Reporting Week</label>
                                        <select className="input-field w-full bg-slate-900 border-white/5">
                                            <option>Week 9 (Jan 19 - Jan 25)</option>
                                            <option>Week 10 (Jan 26 - Feb 01)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Submission Date</label>
                                        <div className="input-field w-full flex items-center space-x-3 opacity-50 select-none">
                                            <Calendar size={18} />
                                            <span>Jan 26, 2026</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Weekly Summary</label>
                                    <textarea
                                        rows={6}
                                        className="input-field w-full resize-none p-4"
                                        placeholder="Describe your activities, achievements, and challenges this week..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block">Attachments (PDF / Images)</label>
                                    <div
                                        onDragEnter={handleDrag}
                                        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 bg-white/2'
                                            }`}
                                    >
                                        {!file ? (
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
                                                    <Upload size={32} />
                                                </div>
                                                <p className="text-slate-300 font-bold">Drag and drop file here</p>
                                                <p className="text-slate-500 text-xs">Maximum file size: 10MB</p>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                                                <div className="flex items-center space-x-4">
                                                    <FileText className="text-blue-400" />
                                                    <div className="text-left">
                                                        <p className="text-sm font-bold text-white max-w-[200px] truncate">{file.name}</p>
                                                        <p className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setFile(null)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-xl transition-all">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="btn-primary px-12 py-4 text-lg">
                                    Submit Logbook
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <div className="glass-card p-6 space-y-4 border-l-4 border-l-yellow-600">
                            <div className="flex items-center space-x-3 text-yellow-500">
                                <AlertCircle size={20} />
                                <h3 className="font-bold">Important Note</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Ensure all technical diagrams are attached within your summary PDF. Supervisors will reject submissions if the proof of work is insufficient.
                            </p>
                        </div>

                        <div className="glass-card p-6 space-y-6">
                            <h3 className="text-lg font-bold text-white">Guidelines</h3>
                            <ul className="space-y-4">
                                {[
                                    'Update your summary daily.',
                                    'Include snapshots of code or projects.',
                                    'Address supervisor comments within 24h.',
                                    'Keep logs professional and concise.'
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start space-x-3">
                                        <div className="w-5 h-5 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</div>
                                        <span className="text-sm text-slate-300">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LogbookUpload;
