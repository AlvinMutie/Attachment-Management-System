import React, { useState } from 'react';
import {
    FileText,
    ClipboardCheck,
    Search,
    Plus,
    Star,
    MessageSquare,
    GraduationCap,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const AcademicAssessments = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const assessments = [
        { name: 'Alvin Mutie', id: 'BIT-001', type: 'Mid-term Visit', date: '15 Jan 2026', score: 85, status: 'Graded' },
        { name: 'Sarah Wilson', id: 'BIT-005', type: 'Workplace Audit', date: '21 Jan 2026', score: 92, status: 'Graded' },
        { name: 'Michael Chen', id: 'BIT-012', type: 'Final Report', date: 'Waiting...', score: null, status: 'Pending Submission' },
        { name: 'Jane Doe', id: 'BIT-018', type: 'Site Visit', date: 'Today', score: null, status: 'Pending Review' },
    ];

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-12 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-1 ring-white/20">
                            <ClipboardCheck className="text-white" size={40} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Grading Hub</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Academic <span className="text-blue-500">Assessments</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">Technical evaluation of student performance, workplace audits, and industrial compliance certification.</p>
                        </div>
                    </div>
                    <button className="btn-primary px-8 py-3.5 flex items-center space-x-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-900/40">
                        <Plus size={18} />
                        <span>New Report</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 flex items-center justify-between bg-gradient-to-br from-blue-600/10 to-transparent">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Average Score</p>
                            <p className="text-3xl font-black text-white tracking-tighter">88.2/100</p>
                        </div>
                        <TrendingUp className="text-blue-500" size={32} />
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Awaiting Review</p>
                            <p className="text-3xl font-black text-white tracking-tighter">12 Reports</p>
                        </div>
                        <ClipboardCheck className="text-orange-500" size={32} />
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Evaluated</p>
                            <p className="text-3xl font-black text-white tracking-tighter">156 Items</p>
                        </div>
                        <Star className="text-purple-500" size={32} />
                    </div>
                </div>

                {/* Assessment List */}
                <div className="glass-card overflow-hidden">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search assessment records..."
                                className="input-field pl-12 h-14"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-4 bg-white/5 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                                <FileText size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <th className="px-8 py-6">Student Mentees</th>
                                    <th className="px-8 py-6">Assessment Type</th>
                                    <th className="px-8 py-6">Date Recorded</th>
                                    <th className="px-8 py-6">Performance</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {assessments.map((a, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-indigo-500 border border-white/5 uppercase tracking-tighter">
                                                    {a.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white tracking-tight">{a.name}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{a.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-400 capitalize">{a.type}</span>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 text-xs font-black uppercase tracking-widest">{a.date}</td>
                                        <td className="px-8 py-6">
                                            {a.score ? (
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-blue-600 h-full" style={{ width: `${a.score}%` }} />
                                                    </div>
                                                    <span className="text-xs font-black text-white">{a.score}/100</span>
                                                </div>
                                            ) : (
                                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${a.status === 'Pending Submission' ? 'bg-slate-800 text-slate-500' : 'bg-orange-600/20 text-orange-400'
                                                    }`}>
                                                    {a.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-white tracking-widest transition-all border border-white/5 group-hover:border-blue-500/30">
                                                {a.score ? 'Edit Score' : 'Grading Tool'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="p-8 bg-purple-600/5 rounded-[2.5rem] border border-purple-600/10 border-dashed flex items-center space-x-6">
                        <GraduationCap className="text-purple-500 shrink-0" size={32} />
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Graduation Clearance</h4>
                            <p className="text-xs text-slate-500 font-medium">Students require at least 60/100 in their final report to pass the attachment module.</p>
                        </div>
                    </div>
                    <div className="p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-600/10 border-dashed flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <MessageSquare className="text-blue-500" size={24} />
                            <span className="text-xs font-black text-white uppercase tracking-widest">Industry Feedback Loop</span>
                        </div>
                        <button className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline">Sync Remarks</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AcademicAssessments;
