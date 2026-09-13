import React, { useState, useEffect } from 'react';
import {
    Users, Search, Plus, Upload, Mail,
    UserCheck, FileSpreadsheet, CheckCircle,
    XCircle, Loader2, Check, X, Filter,
    Building2, RefreshCw, GraduationCap, ShieldCheck,
    AlertCircle, ArrowRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import * as adminApi from '../../utils/adminApi';
import { LoadingSkeleton } from '../../components/ui';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modals
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResults, setUploadResults] = useState(null);
    const [file, setFile] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: '',
        email: '',
        admissionNumber: '',
        department: '',
        course: '',
        yearOfStudy: 'Year 3',
        password: 'ChangeMe123!'
    });
    const [creating, setCreating] = useState(false);

    const [selectedStudentForReview, setSelectedStudentForReview] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [reviewingPlacement, setReviewingPlacement] = useState(false);

    const [selectedStudentForAssign, setSelectedStudentForAssign] = useState(null);
    const [assignSupervisorId, setAssignSupervisorId] = useState('');
    const [assignType, setAssignType] = useState('industry');
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchSupervisors();
    }, [searchTerm, statusFilter]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getStudents({ search: searchTerm, status: statusFilter });
            if (response.data.success) {
                setStudents(response.data.data.students || []);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSupervisors = async () => {
        try {
            const response = await adminApi.getSupervisors();
            if (response.data.success) {
                setSupervisors(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch supervisors:', error);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await adminApi.createStudent(createForm);
            setShowCreateModal(false);
            setCreateForm({
                name: '',
                email: '',
                admissionNumber: '',
                department: '',
                course: '',
                yearOfStudy: 'Year 3',
                password: 'ChangeMe123!'
            });
            fetchStudents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to onboard student');
        } finally {
            setCreating(false);
        }
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('csvFile', file);

            const response = await adminApi.bulkOnboardStudents(formData);

            if (response.data.success) {
                setUploadResults(response.data.data);
                fetchStudents();
            }
        } catch (error) {
            console.error('Bulk upload failed:', error);
            alert('Bulk onboarding failed. Please verify CSV column headers.');
        } finally {
            setUploading(false);
        }
    };

    const handleReviewPlacement = async (status) => {
        if (!selectedStudentForReview) return;
        setReviewingPlacement(true);
        try {
            await adminApi.reviewPlacement(selectedStudentForReview.id, {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : undefined
            });
            setSelectedStudentForReview(null);
            setRejectionReason('');
            fetchStudents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to review placement application');
        } finally {
            setReviewingPlacement(false);
        }
    };

    const handleAssignSupervisor = async (e) => {
        e.preventDefault();
        if (!selectedStudentForAssign || !assignSupervisorId) return;
        setAssigning(true);
        try {
            await adminApi.assignSupervisor({
                studentId: selectedStudentForAssign.id,
                supervisorId: assignSupervisorId,
                type: assignType
            });
            setSelectedStudentForAssign(null);
            setAssignSupervisorId('');
            fetchStudents();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to assign supervisor');
        } finally {
            setAssigning(false);
        }
    };

    const filteredSupervisors = supervisors.filter(s =>
        assignType === 'industry' ? s.role === 'industry_supervisor' : s.role === 'university_supervisor'
    );

    const totalStudentsCount = students.length;
    const approvedCount = students.filter(s => s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE').length;
    const submittedCount = students.filter(s => s.placementStatus === 'SUBMITTED').length;
    const unassignedCount = students.filter(s => !s.universitySupervisorId || !s.industrySupervisorId).length;

    if (loading && students.length === 0) {
        return (
            <DashboardLayout role="school_admin">
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
        <DashboardLayout role="school_admin">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
                                <Users size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Registry Governance
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {totalStudentsCount} Enrolled Students
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Student Registry & Intake Management
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Single-student and bulk CSV student onboarding, placement approval clearance, and dual supervisor allocations.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <Upload size={14} />
                                <span>Bulk CSV Import</span>
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} />
                                <span>Add Single Student</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        onClick={() => setStatusFilter('')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === '' ? 'border-amber-500/50 bg-amber-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalStudentsCount}</span>
                            <span className="text-xs text-slate-500">students</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Campus Registry</span>
                            <span className="text-amber-400 font-medium">100% active</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('APPROVED')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'APPROVED' ? 'border-emerald-500/50 bg-emerald-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Placements</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{approvedCount}</span>
                            <span className="text-xs text-slate-500">placed</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Cleared in industry</span>
                            <span className="text-emerald-400 font-mono font-medium">
                                {totalStudentsCount > 0 ? `${Math.round((approvedCount / totalStudentsCount) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('SUBMITTED')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'SUBMITTED' ? 'border-sky-500/50 bg-sky-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Submitted Applications</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <AlertCircle size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">{submittedCount}</span>
                            <span className="text-xs text-slate-500">awaiting review</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Pending endorsement</span>
                            <span className="text-sky-400 font-medium">Queue</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unassigned Mentees</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <UserCheck size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-400 font-mono">{unassignedCount}</span>
                            <span className="text-xs text-slate-500">pending mentors</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Missing pairing</span>
                            <span className="text-rose-400 font-medium">{unassignedCount > 0 ? 'Requires match' : '0 unassigned'}</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by student name, admission number, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Status:
                        </span>
                        {[
                            { id: '', label: 'All Registry' },
                            { id: 'APPROVED', label: 'Approved' },
                            { id: 'SUBMITTED', label: 'Submitted' },
                            { id: 'DRAFT', label: 'Draft' },
                            { id: 'REJECTED', label: 'Rejected' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                                    statusFilter === tab.id
                                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Student Registry Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3.5 px-6">Student Intern</th>
                                    <th className="py-3.5 px-6">Department & Course</th>
                                    <th className="py-3.5 px-6">Host Employer</th>
                                    <th className="py-3.5 px-6">Supervisors</th>
                                    <th className="py-3.5 px-6">Placement Status</th>
                                    <th className="py-3.5 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {students.length > 0 ? (
                                    students.map((s) => (
                                        <tr key={s.id} className="hover:bg-[#181a24]/50 transition-colors">
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-amber-400 text-xs uppercase">
                                                        {s.user?.name ? s.user.name.charAt(0) : 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-100">{s.user?.name || 'Student'}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono">{s.admissionNumber} • {s.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-300">
                                                <div>
                                                    <p className="font-medium text-slate-200">{s.department || 'Computing'}</p>
                                                    <p className="text-[10px] text-slate-500">{s.course || 'Degree'}</p>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-300">
                                                <p className="font-medium text-slate-200">{s.organizationName || 'Not Set'}</p>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <div className="space-y-1 text-[10px]">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-slate-500">Uni:</span>
                                                        <span className="text-slate-200 font-medium">
                                                            {s.universitySupervisor?.name || (
                                                                <button
                                                                    onClick={() => { setSelectedStudentForAssign(s); setAssignType('university'); }}
                                                                    className="text-amber-400 hover:underline"
                                                                >
                                                                    + Assign
                                                                </button>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-slate-500">Ind:</span>
                                                        <span className="text-slate-200 font-medium">
                                                            {s.industrySupervisor?.name || (
                                                                <button
                                                                    onClick={() => { setSelectedStudentForAssign(s); setAssignType('industry'); }}
                                                                    className="text-amber-400 hover:underline"
                                                                >
                                                                    + Assign
                                                                </button>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : s.placementStatus === 'SUBMITTED'
                                                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                                            : s.placementStatus === 'REJECTED'
                                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE' ? 'bg-emerald-400' :
                                                        s.placementStatus === 'SUBMITTED' ? 'bg-sky-400' :
                                                        s.placementStatus === 'REJECTED' ? 'bg-rose-400' : 'bg-slate-400'
                                                    }`} />
                                                    {s.placementStatus || 'DRAFT'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                {s.placementStatus === 'SUBMITTED' ? (
                                                    <button
                                                        onClick={() => setSelectedStudentForReview(s)}
                                                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-1 shadow-md shadow-amber-600/20"
                                                    >
                                                        <span>Review Placement</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-500 text-[11px] font-mono">Up-to-date</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                                            No student records found matching the active filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Single Student Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Onboard Single Student</h3>
                                <p className="text-xs text-slate-400">Register new student record into institutional database</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={createForm.name}
                                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                        placeholder="Jane Doe"
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={createForm.email}
                                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                        placeholder="jane.doe@university.edu"
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Admission Number</label>
                                    <input
                                        type="text"
                                        value={createForm.admissionNumber}
                                        onChange={(e) => setCreateForm({ ...createForm, admissionNumber: e.target.value })}
                                        placeholder="BIT-2026-042"
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
                                    <input
                                        type="text"
                                        value={createForm.department}
                                        onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                                        placeholder="Computing & Informatics"
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Course / Degree Program</label>
                                    <input
                                        type="text"
                                        value={createForm.course}
                                        onChange={(e) => setCreateForm({ ...createForm, course: e.target.value })}
                                        placeholder="BSc Information Technology"
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Year of Study</label>
                                    <select
                                        value={createForm.yearOfStudy}
                                        onChange={(e) => setCreateForm({ ...createForm, yearOfStudy: e.target.value })}
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="Year 2">Year 2</option>
                                        <option value="Year 3">Year 3</option>
                                        <option value="Year 4">Year 4</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
                                >
                                    <Check size={14} />
                                    <span>{creating ? 'Creating...' : 'Register Student'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk CSV Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Bulk CSV Student Onboarding</h3>
                                <p className="text-xs text-slate-400">Import cohort records from official institutional spreadsheet</p>
                            </div>
                            <button
                                onClick={() => { setShowUploadModal(false); setUploadResults(null); }}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {uploadResults ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs space-y-1">
                                    <p className="font-bold">Bulk Intake Completed!</p>
                                    <p className="text-[11px] text-slate-300">
                                        Successfully registered: <strong>{uploadResults.created || uploadResults.count || 0}</strong> students.
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setShowUploadModal(false); setUploadResults(null); }}
                                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleBulkUpload} className="space-y-4 text-xs">
                                <div className="p-4 rounded-xl bg-[#181a24] border border-[#22242f] space-y-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required CSV Columns</span>
                                    <p className="text-[11px] font-mono text-amber-400">name, email, admissionNumber, department, course, yearOfStudy</p>
                                </div>

                                <div className="border-2 border-dashed border-[#22242f] hover:border-amber-500/40 rounded-2xl p-6 text-center space-y-2 cursor-pointer bg-[#181a24]/50">
                                    <Upload className="mx-auto text-amber-400" size={28} />
                                    <p className="text-xs text-slate-200 font-semibold">Select CSV Spreadsheet File</p>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
                                    >
                                        <Upload size={14} />
                                        <span>{uploading ? 'Importing...' : 'Upload & Process'}</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Review Placement Modal */}
            {selectedStudentForReview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Review Placement Application</h3>
                                <p className="text-xs text-slate-400">{selectedStudentForReview.user?.name} ({selectedStudentForReview.admissionNumber})</p>
                            </div>
                            <button
                                onClick={() => setSelectedStudentForReview(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f] space-y-1">
                                <span className="text-[10px] font-bold uppercase text-slate-400">Host Employer Details</span>
                                <p className="font-bold text-slate-200">{selectedStudentForReview.organizationName || 'N/A'}</p>
                                <p className="text-[11px] text-slate-400">{selectedStudentForReview.address || 'Workplace location not specified'}</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rejection Reason (If rejecting)</label>
                                <textarea
                                    rows={2}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="State why this application requires revision or was declined..."
                                    className="w-full p-2.5 rounded-xl bg-[#181a24] border border-[#22242f] text-xs text-slate-200 placeholder-slate-500 resize-none outline-none focus:border-amber-500 font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                            <button
                                type="button"
                                disabled={reviewingPlacement}
                                onClick={() => handleReviewPlacement('REJECTED')}
                                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold"
                            >
                                Decline
                            </button>
                            <button
                                type="button"
                                disabled={reviewingPlacement}
                                onClick={() => handleReviewPlacement('APPROVED')}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                            >
                                <Check size={14} />
                                <span>{reviewingPlacement ? 'Authorizing...' : 'Approve Placement'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Supervisor Modal */}
            {selectedStudentForAssign && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">
                                    Assign {assignType === 'industry' ? 'Industry Mentor' : 'Faculty Supervisor'}
                                </h3>
                                <p className="text-xs text-slate-400">For {selectedStudentForAssign.user?.name} ({selectedStudentForAssign.admissionNumber})</p>
                            </div>
                            <button
                                onClick={() => setSelectedStudentForAssign(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAssignSupervisor} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                    Select Supervisor
                                </label>
                                <select
                                    value={assignSupervisorId}
                                    onChange={(e) => setAssignSupervisorId(e.target.value)}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                                    required
                                >
                                    <option value="">Choose from available mentors...</option>
                                    {filteredSupervisors.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStudentForAssign(null)}
                                    className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assigning}
                                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
                                >
                                    <Check size={14} />
                                    <span>{assigning ? 'Allocating...' : 'Confirm Allocation'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentManagement;
