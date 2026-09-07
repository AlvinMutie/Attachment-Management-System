import React, { useState, useEffect } from 'react';
import {
    FileText,
    ClipboardCheck,
    Search,
    Plus,
    Star,
    GraduationCap,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getUniversityAssessments, getMyStudents, submitUniversityAssessment } from '../../utils/universityApi';

const AcademicAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Evaluation modal
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        studentId: '',
        type: 'mid-term',
        score: 85,
        feedback: '',
        technicalScore: 85,
        disciplineScore: 85,
        documentationScore: 85
    });
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        try {
            const [assRes, studRes] = await Promise.all([
                getUniversityAssessments().catch(() => ({ data: { data: [] } })),
                getMyStudents().catch(() => ({ data: { data: [] } }))
            ]);
            setAssessments(assRes.data?.data || []);
            setStudents(studRes.data?.data || []);
            if (studRes.data?.data?.length > 0 && !form.studentId) {
                setForm(prev => ({ ...prev, studentId: studRes.data.data[0].id }));
            }
        } catch (err) {
            console.error('Failed to load academic assessments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const avgScore = Math.round((parseInt(form.technicalScore) + parseInt(form.disciplineScore) + parseInt(form.documentationScore)) / 3);
            await submitUniversityAssessment({
                studentId: form.studentId,
                type: form.type,
                score: avgScore,
                feedback: form.feedback,
                criteria: {
                    technicalCompetency: parseInt(form.technicalScore),
                    attendanceDiscipline: parseInt(form.disciplineScore),
                    documentationQuality: parseInt(form.documentationScore)
                }
            });
            setShowModal(false);
            setForm({
                studentId: students[0]?.id || '',
                type: 'mid-term',
                score: 85,
                feedback: '',
                technicalScore: 85,
                disciplineScore: 85,
                documentationScore: 85
            });
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit assessment');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredAssessments = assessments.filter(a =>
        a.student?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.student?.admissionNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const avgScore = assessments.length > 0
        ? Math.round(assessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / assessments.length)
        : 0;

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-12 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-1 ring-white/20">
                            <ClipboardCheck className="text-white" size={40} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Grading Hub</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Academic <span className="text-blue-500">Assessments</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">Technical evaluation of student performance, academic visits, and final certification.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary px-8 py-3.5 flex items-center space-x-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-900/40"
                    >
                        <Plus size={18} />
                        <span>Evaluate Mentee</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 flex items-center justify-between bg-gradient-to-br from-blue-600/10 to-transparent">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Average Mentee Score</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{avgScore}/100</p>
                        </div>
                        <TrendingUp className="text-blue-500" size={32} />
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Completed Evaluations</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{assessments.length} Reports</p>
                        </div>
                        <ClipboardCheck className="text-emerald-500" size={32} />
                    </div>
                    <div className="glass-card p-8 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Supervised Mentees</p>
                            <p className="text-3xl font-black text-white tracking-tighter">{students.length} Students</p>
                        </div>
                        <Star className="text-purple-500" size={32} />
                    </div>
                </div>

                {/* Search & Assessment Table */}
                <div className="glass-card overflow-hidden">
                    <div className="p-8 border-b border-white/10 flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search mentee name, admission number, or type..."
                                className="input-field pl-12 h-14 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <th className="px-8 py-6">Student Mentee</th>
                                    <th className="px-8 py-6">Assessment Type</th>
                                    <th className="px-8 py-6">Evaluator Type</th>
                                    <th className="px-8 py-6">Score</th>
                                    <th className="px-8 py-6 text-right">Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {filteredAssessments.length > 0 ? (
                                    filteredAssessments.map((a) => (
                                        <tr key={a.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-indigo-500 border border-white/5 uppercase">
                                                        {a.student?.user?.name ? a.student.user.name.charAt(0) : 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white tracking-tight">{a.student?.user?.name || 'Student'}</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{a.student?.admissionNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-bold text-slate-300 capitalize">{a.type}</span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                {a.evaluatorType}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-20 bg-white/5 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-blue-600 h-full" style={{ width: `${a.score}%` }} />
                                                    </div>
                                                    <span className="text-xs font-black text-white">{a.score}/100</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right text-slate-400 text-xs italic max-w-xs truncate">
                                                {a.feedback || '---'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            No assessment evaluations recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Assessment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-lg glass-card p-8 border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-black text-white">Evaluate Student Mentee</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Student</label>
                                <select
                                    value={form.studentId}
                                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                                    className="input-field w-full"
                                    required
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.user?.name} ({s.admissionNumber})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Assessment Milestone</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="input-field w-full"
                                >
                                    <option value="mid-term">Mid-Term Supervisory Assessment</option>
                                    <option value="end-of-attachment">Final End-of-Attachment Assessment</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Technical (100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.technicalScore}
                                        onChange={(e) => setForm({ ...form, technicalScore: e.target.value })}
                                        className="input-field w-full text-center"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Discipline (100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.disciplineScore}
                                        onChange={(e) => setForm({ ...form, disciplineScore: e.target.value })}
                                        className="input-field w-full text-center"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Reports (100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.documentationScore}
                                        onChange={(e) => setForm({ ...form, documentationScore: e.target.value })}
                                        className="input-field w-full text-center"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Academic Feedback & Certification</label>
                                <textarea
                                    rows={4}
                                    value={form.feedback}
                                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                                    className="input-field w-full p-3 resize-none"
                                    placeholder="Provide detailed academic evaluation comments..."
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary px-8 py-3 text-xs"
                                >
                                    {submitting ? 'Submitting...' : 'Transmit Evaluation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AcademicAssessments;
