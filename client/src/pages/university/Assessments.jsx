import React, { useState, useEffect } from 'react';
import {
    ClipboardCheck,
    Search,
    Plus,
    Star,
    TrendingUp,
    X,
    Check
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getUniversityAssessments, getMyStudents, submitUniversityAssessment } from '../../utils/universityApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

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

    if (loading) {
        return (
            <DashboardLayout role="university_supervisor">
                <div className="space-y-4 p-6 sm:p-8 max-w-7xl mx-auto">
                    <LoadingSkeleton className="h-14 w-60 rounded-md" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <LoadingSkeleton className="h-24 rounded-md" />
                        <LoadingSkeleton className="h-24 rounded-md" />
                        <LoadingSkeleton className="h-24 rounded-md" />
                    </div>
                    <LoadingSkeleton className="h-80 rounded-md" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-6 p-6 sm:p-8 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-violet-600/15 border border-violet-500/25 rounded-lg flex items-center justify-center text-violet-300">
                            <ClipboardCheck size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Academic Grading</span>
                            <h1 className="text-xl font-semibold text-white tracking-tight">Academic Assessments</h1>
                            <p className="text-xs text-slate-400 mt-0.5">Faculty evaluations of student technical competence, site visits, and certification.</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="text-xs py-2 px-3.5 flex items-center gap-1.5"
                    >
                        <Plus size={14} />
                        <span>Evaluate Mentee</span>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Average Mentee Score</span>
                            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="kpi-metric-value mt-2">{avgScore}<span className="text-xs text-slate-400 font-normal"> / 100</span></div>
                        <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                            Cohort mean performance
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Completed Evaluations</span>
                            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="kpi-metric-value text-emerald-400 mt-2">{assessments.length}</div>
                        <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                            Submitted grade forms
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Supervised Students</span>
                            <Star className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                        <div className="kpi-metric-value text-sky-400 mt-2">{students.length}</div>
                        <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#22242f]">
                            Allocated cohort size
                        </div>
                    </div>
                </div>

                {/* Search & Assessment Table */}
                <div className="craft-card p-5 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[#22242f]">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search by student name, admission no, or type..."
                                className="w-full bg-[#181a24] border border-[#22242f] rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 font-sans"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#12141c] text-slate-400 font-medium border-b border-[#22242f]">
                                <tr>
                                    <th className="py-2.5 px-5">Student</th>
                                    <th className="py-2.5 px-5">Milestone</th>
                                    <th className="py-2.5 px-5">Evaluator</th>
                                    <th className="py-2.5 px-5">Overall Score</th>
                                    <th className="py-2.5 px-5 text-right">Academic Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#22242f]">
                                {filteredAssessments.length > 0 ? (
                                    filteredAssessments.map((a) => (
                                        <tr key={a.id} className="hover:bg-[#181a24] transition-colors">
                                            <td className="py-2.5 px-5">
                                                <div>
                                                    <p className="font-medium text-white">{a.student?.user?.name || 'Student'}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{a.student?.admissionNumber}</p>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-5">
                                                <Badge variant="indigo" size="sm">
                                                    {a.type}
                                                </Badge>
                                            </td>
                                            <td className="py-2.5 px-5 text-slate-400 capitalize">
                                                {a.evaluatorType}
                                            </td>
                                            <td className="py-2.5 px-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-[#181a24] h-1.5 rounded-full overflow-hidden border border-[#22242f]">
                                                        <div className="bg-violet-500 h-full rounded-full" style={{ width: `${a.score}%` }} />
                                                    </div>
                                                    <span className="font-mono font-medium text-white">{a.score}/100</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-5 text-right text-slate-400 italic max-w-xs truncate">
                                                {a.feedback || '—'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-slate-500">
                                            No assessment evaluations matching your filter.
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                            <h3 className="text-sm font-semibold text-white">Evaluate Student Mentee</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                                <X size={15} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Select Student</label>
                                <select
                                    value={form.studentId}
                                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500"
                                    required
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.user?.name} ({s.admissionNumber})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Assessment Milestone</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500"
                                >
                                    <option value="mid-term">Mid-Term Supervisory Assessment</option>
                                    <option value="end-of-attachment">Final End-of-Attachment Assessment</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-400">Technical (100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.technicalScore}
                                        onChange={(e) => setForm({ ...form, technicalScore: e.target.value })}
                                        className="w-full p-2 text-center rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500 font-mono"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-400">Discipline (100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.disciplineScore}
                                        onChange={(e) => setForm({ ...form, disciplineScore: e.target.value })}
                                        className="w-full p-2 text-center rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500 font-mono"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-400">Logbooks (100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={form.documentationScore}
                                        onChange={(e) => setForm({ ...form, documentationScore: e.target.value })}
                                        className="w-full p-2 text-center rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500 font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Academic Feedback & Certification</label>
                                <textarea
                                    rows={3}
                                    value={form.feedback}
                                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                                    className="w-full p-2.5 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans"
                                    placeholder="Provide constructive assessment comments and academic remarks..."
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22242f]">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowModal(false)}
                                    className="text-xs py-1.5 px-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="text-xs py-1.5 px-3"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Evaluation'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AcademicAssessments;
