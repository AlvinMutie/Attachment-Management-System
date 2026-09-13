import React, { useState, useEffect } from 'react';
import {
    ClipboardCheck,
    Search,
    Plus,
    Star,
    TrendingUp,
    X,
    Check,
    GraduationCap,
    Award,
    FileSpreadsheet,
    Download,
    Filter,
    ChevronRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getUniversityAssessments, getMyStudents, submitUniversityAssessment } from '../../utils/universityApi';
import { LoadingSkeleton } from '../../components/ui';

const AcademicAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
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
            const fetchedStudents = studRes.data?.data || [];
            setStudents(fetchedStudents);
            if (fetchedStudents.length > 0 && !form.studentId) {
                setForm(prev => ({ ...prev, studentId: fetchedStudents[0].id }));
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

    const calculatedAvgScore = Math.round(
        (parseInt(form.technicalScore || 0) + parseInt(form.disciplineScore || 0) + parseInt(form.documentationScore || 0)) / 3
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitUniversityAssessment({
                studentId: form.studentId,
                type: form.type,
                score: calculatedAvgScore,
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

    const handleExportCSV = () => {
        if (filteredAssessments.length === 0) {
            alert('No assessments to export.');
            return;
        }

        const headers = ['Student Name', 'Admission Number', 'Milestone', 'Score', 'Evaluator', 'Academic Feedback'];
        const rows = filteredAssessments.map(a => [
            `"${a.student?.user?.name || 'Unknown'}"`,
            `"${a.student?.admissionNumber || 'N/A'}"`,
            `"${a.type || ''}"`,
            `"${a.score || 0}"`,
            `"${a.evaluatorType || 'University Supervisor'}"`,
            `"${(a.feedback || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Academic_Assessments_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredAssessments = assessments.filter(a => {
        const matchesQuery =
            (a.student?.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.student?.admissionNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.type || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesQuery) return false;
        if (typeFilter === 'all') return true;
        return a.type?.toLowerCase().includes(typeFilter.toLowerCase());
    });

    const avgCohortScore = assessments.length > 0
        ? Math.round(assessments.reduce((acc, curr) => acc + (curr.score || 0), 0) / assessments.length)
        : 0;

    const midtermCount = assessments.filter(a => a.type?.toLowerCase().includes('mid')).length;
    const finalCount = assessments.filter(a => a.type?.toLowerCase().includes('end') || a.type?.toLowerCase().includes('final')).length;

    if (loading) {
        return (
            <DashboardLayout role="university_supervisor">
                <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                    <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                    </div>
                    <LoadingSkeleton className="h-96 rounded-2xl bg-[#12141c]" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10 shrink-0">
                                <ClipboardCheck size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Academic Grading
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {assessments.length} Graded Submissions
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Academic Evaluation & Grading
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Assess technical proficiency, logbook documentation rigor, and field visit performance for industrial certification.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleExportCSV}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <Download size={14} />
                                <span>Export Ledger</span>
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} />
                                <span>Evaluate Mentee</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cohort Mean Score</span>
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-400 font-mono">{avgCohortScore}</span>
                            <span className="text-xs text-slate-500">/ 100</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Overall academic average</span>
                            <span className="text-purple-400 font-semibold">{avgCohortScore >= 70 ? 'Distinction' : 'Proficient'}</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setTypeFilter('mid')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            typeFilter === 'mid' ? 'border-amber-500/50 bg-amber-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mid-Term Assessments</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <ClipboardCheck size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{midtermCount}</span>
                            <span className="text-xs text-slate-500">graded</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Interim progress</span>
                            <span className="text-amber-400 font-medium">Milestone 1</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setTypeFilter('end')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            typeFilter === 'end' ? 'border-emerald-500/50 bg-emerald-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Final Certifications</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Award size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{finalCount}</span>
                            <span className="text-xs text-slate-500">graded</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Final exit grading</span>
                            <span className="text-emerald-400 font-medium">Milestone 2</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setTypeFilter('all')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            typeFilter === 'all' ? 'border-violet-500/50 bg-violet-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Supervised Cohort</span>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <Star size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{students.length}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Faculty allocation</span>
                            <span className="text-violet-400 font-medium">100% covered</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by student name, admission number, or milestone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Milestone:
                        </span>
                        {[
                            { id: 'all', label: 'All Assessments' },
                            { id: 'mid', label: 'Mid-Term' },
                            { id: 'end', label: 'End-of-Attachment' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setTypeFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                                    typeFilter === tab.id
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assessments Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3.5 px-6">Student Mentee</th>
                                    <th className="py-3.5 px-6">Milestone</th>
                                    <th className="py-3.5 px-6">Assessor Role</th>
                                    <th className="py-3.5 px-6">Performance Score</th>
                                    <th className="py-3.5 px-6 text-right">Academic Remarks & Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {filteredAssessments.length > 0 ? (
                                    filteredAssessments.map((a) => (
                                        <tr key={a.id} className="hover:bg-[#181a24]/50 transition-colors">
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-purple-400 text-xs uppercase">
                                                        {a.student?.user?.name ? a.student.user.name.charAt(0) : 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-100">{a.student?.user?.name || 'Student'}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono">{a.student?.admissionNumber || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    a.type?.toLowerCase().includes('mid')
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                    {a.type}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-300 capitalize font-mono text-[11px]">
                                                {a.evaluatorType || 'University Supervisor'}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-slate-100">{a.score}/100</span>
                                                        <span className={`text-[10px] font-semibold ${
                                                            a.score >= 80 ? 'text-emerald-400' : a.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                                                        }`}>
                                                            {a.score >= 80 ? 'Excellent' : a.score >= 60 ? 'Satisfactory' : 'Needs Review'}
                                                        </span>
                                                    </div>
                                                    <div className="w-24 bg-[#181a24] rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-1.5 rounded-full ${
                                                                a.score >= 80 ? 'bg-emerald-500' : a.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                                            }`}
                                                            style={{ width: `${Math.min(a.score, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 text-right text-slate-400 text-xs italic max-w-xs truncate">
                                                {a.feedback || '—'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                                            No assessment evaluations matching the current criteria.
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Evaluate Student Mentee</h3>
                                <p className="text-xs text-slate-400">Institutional grading rubric & competency evaluation</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Student Mentee</label>
                                <select
                                    value={form.studentId}
                                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                    required
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.name} ({s.admissionNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Milestone Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                >
                                    <option value="mid-term">Mid-Term Supervisory Assessment</option>
                                    <option value="end-of-attachment">Final End-of-Attachment Assessment</option>
                                </select>
                            </div>

                            {/* Rubric Breakdown */}
                            <div className="p-4 rounded-xl bg-[#181a24] border border-[#22242f] space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Rubric (0-100)</span>
                                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-xs font-bold">
                                        Calculated Average: {calculatedAvgScore}/100
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 block">Technical (100)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={form.technicalScore}
                                            onChange={(e) => setForm({ ...form, technicalScore: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-2.5 py-2 text-center text-xs text-slate-100 font-mono focus:border-purple-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 block">Discipline (100)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={form.disciplineScore}
                                            onChange={(e) => setForm({ ...form, disciplineScore: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-2.5 py-2 text-center text-xs text-slate-100 font-mono focus:border-purple-500 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-slate-400 block">Logbooks (100)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={form.documentationScore}
                                            onChange={(e) => setForm({ ...form, documentationScore: e.target.value })}
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-2.5 py-2 text-center text-xs text-slate-100 font-mono focus:border-purple-500 outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Academic Feedback & Certification</label>
                                <textarea
                                    rows={3}
                                    value={form.feedback}
                                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#181a24] border border-[#22242f] text-xs text-slate-200 placeholder-slate-500 resize-none outline-none focus:border-purple-500 font-sans"
                                    placeholder="Provide constructive assessment comments, technical observations, and academic remarks..."
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-1.5"
                                >
                                    <Check size={14} />
                                    <span>{submitting ? 'Submitting...' : 'Submit Evaluation'}</span>
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
