import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Upload,
    Mail,
    UserCheck,
    ShieldAlert,
    MoreVertical,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    Loader2,
    Briefcase,
    GraduationCap,
    Check,
    X,
    UserPlus,
    Filter
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';

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
                setStudents(response.data.data.students);
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
                setSupervisors(response.data.data);
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
            alert('Bulk onboarding protocol failed. Verify CSV structure.');
        } finally {
            setUploading(false);
        }
    };

    const handlePlacementReview = async (status) => {
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
            alert(err.response?.data?.message || 'Failed to review placement');
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

    const statusBadgeClass = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'ACTIVE':
                return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'PENDING_APPROVAL':
            case 'SUBMITTED':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'REJECTED':
                return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-600/5 p-10 rounded-m3-xl border border-emerald-600/10 backdrop-blur-md">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-600/40">
                        <Users size={44} className="text-white" />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400">Personnel & Placement Ops</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Student <span className="text-emerald-500">Registry</span></h1>
                        <p className="text-slate-500 font-medium max-w-md text-sm">Review placement applications, assign academic/industry supervisors, and onboard students.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="btn-primary px-8 py-4 group bg-slate-900 border-white/10 hover:bg-slate-800 !rounded-2xl flex items-center gap-2"
                    >
                        <Upload size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Bulk Onboard</span>
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary px-8 py-4 group !rounded-2xl flex items-center gap-2"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">New Student</span>
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search student by identity, email or admission registry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-12 h-14 w-full"
                    />
                </div>
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field h-14 w-full"
                    >
                        <option value="">All Placement Statuses</option>
                        <option value="PENDING_APPROVAL">Pending Review</option>
                        <option value="APPROVED">Approved Placements</option>
                        <option value="REJECTED">Rejected Placements</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-card overflow-hidden !rounded-m3-xl shadow-2xl border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Student Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Host Organization</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Supervisors</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Placement State</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                    <UserCheck size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white tracking-tight">{student.user?.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold">{student.admissionNumber} • {student.course || student.department}</p>
                                                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                        <Mail size={10} className="text-emerald-500" />
                                                        {student.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-300">{student.organizationName || 'No Organization'}</p>
                                                <p className="text-[10px] text-slate-500">{student.contactPerson || student.organizationAddress || '---'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 space-y-1.5">
                                            <div>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Industry</span>
                                                {student.industrySupervisor ? (
                                                    <span className="text-xs text-emerald-400 font-bold">{student.industrySupervisor.name}</span>
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">Unassigned</span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">University</span>
                                                {student.universitySupervisor ? (
                                                    <span className="text-xs text-purple-400 font-bold">{student.universitySupervisor.name}</span>
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">Unassigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${statusBadgeClass(student.placementStatus)}`}>
                                                {student.placementStatus || 'DRAFT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right space-x-2">
                                            {student.placementStatus === 'PENDING_APPROVAL' && (
                                                <button
                                                    onClick={() => setSelectedStudentForReview(student)}
                                                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    Review
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedStudentForAssign(student);
                                                    setAssignType('industry');
                                                    setAssignSupervisorId(student.industrySupervisorId || '');
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-xs font-bold uppercase tracking-widest"
                                            >
                                                Assign
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        No student records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Placement Review Modal */}
            {selectedStudentForReview && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in">
                    <div className="glass-card w-full max-w-xl p-8 space-y-6 border-amber-500/20 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-white">Review Attachment Placement</h3>
                                <p className="text-xs text-slate-400">Student: {selectedStudentForReview.user?.name}</p>
                            </div>
                            <button onClick={() => setSelectedStudentForReview(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold uppercase">Organization:</span>
                                    <span className="text-white font-bold">{selectedStudentForReview.organizationName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold uppercase">Address:</span>
                                    <span className="text-slate-300">{selectedStudentForReview.organizationAddress || '---'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold uppercase">Contact:</span>
                                    <span className="text-slate-300">{selectedStudentForReview.contactPerson} ({selectedStudentForReview.organizationPhone})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-bold uppercase">Duration:</span>
                                    <span className="text-slate-300">{selectedStudentForReview.startDate} to {selectedStudentForReview.endDate}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Rejection Reason (if declining)</label>
                                <textarea
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain why the placement details need revision..."
                                    className="input-field w-full p-3 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                disabled={reviewingPlacement}
                                onClick={() => handlePlacementReview('REJECTED')}
                                className="px-6 py-3 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-600/20 hover:bg-rose-600/20 text-xs font-bold uppercase tracking-widest"
                            >
                                Reject
                            </button>
                            <button
                                type="button"
                                disabled={reviewingPlacement}
                                onClick={() => handlePlacementReview('APPROVED')}
                                className="btn-primary px-8 py-3 text-xs flex items-center gap-2"
                            >
                                <Check size={16} />
                                <span>{reviewingPlacement ? 'Processing...' : 'Approve Placement'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Supervisor Modal */}
            {selectedStudentForAssign && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in">
                    <div className="glass-card w-full max-w-md p-8 space-y-6 border-blue-500/20 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-white">Assign Supervisor</h3>
                                <p className="text-xs text-slate-400">Student: {selectedStudentForAssign.user?.name}</p>
                            </div>
                            <button onClick={() => setSelectedStudentForAssign(null)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAssignSupervisor} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Supervisor Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setAssignType('industry'); setAssignSupervisorId(''); }}
                                        className={`py-2 px-4 rounded-xl text-xs font-bold uppercase ${assignType === 'industry' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                    >
                                        Industry
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setAssignType('university'); setAssignSupervisorId(''); }}
                                        className={`py-2 px-4 rounded-xl text-xs font-bold uppercase ${assignType === 'university' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}
                                    >
                                        University
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Supervisor</label>
                                <select
                                    value={assignSupervisorId}
                                    onChange={(e) => setAssignSupervisorId(e.target.value)}
                                    className="input-field w-full"
                                    required
                                >
                                    <option value="">Select a registered supervisor...</option>
                                    {supervisors
                                        .filter(s => s.role === `${assignType}_supervisor`)
                                        .map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStudentForAssign(null)}
                                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assigning || !assignSupervisorId}
                                    className="btn-primary px-8 py-3 text-xs"
                                >
                                    {assigning ? 'Assigning...' : 'Confirm Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Single Student Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in">
                    <div className="glass-card w-full max-w-md p-8 space-y-6 border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="text-xl font-black text-white">Onboard New Student</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateStudent} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="e.g. John Kamau"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Institutional Email</label>
                                <input
                                    type="email"
                                    required
                                    value={createForm.email}
                                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="e.g. j.kamau@student.edu"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Admission Number</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.admissionNumber}
                                    onChange={(e) => setCreateForm({ ...createForm, admissionNumber: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="e.g. ADM-2026-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Department</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.department}
                                    onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Course / Degree</label>
                                <input
                                    type="text"
                                    value={createForm.course}
                                    onChange={(e) => setCreateForm({ ...createForm, course: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="e.g. BSc Software Engineering"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="btn-primary px-8 py-3 text-xs"
                                >
                                    {creating ? 'Onboarding...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
                    <div className="glass-card w-full max-w-xl animate-fade-in border-emerald-500/20 shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                    <FileSpreadsheet size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Bulk Onboard students</h3>
                            </div>
                            <button onClick={() => setShowUploadModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {!uploadResults ? (
                                <div className="space-y-6">
                                    <div className="p-10 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-4 hover:border-emerald-500/50 transition-all cursor-pointer relative group">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-colors">
                                            <Upload size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-white uppercase tracking-widest">{file ? file.name : "Select Institutional CSV"}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Maximum Scale: 2,000 Nodes</p>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl space-y-3">
                                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldAlert size={14} />
                                            Data Protocol Requirements
                                        </h4>
                                        <p className="text-[10px] text-slate-400 leading-relaxed uppercase">CSV must include headers: <span className="text-white font-bold">name, email, admissionNumber, department</span>. Default password: <span className="text-white font-bold">ChangeMe123!</span>.</p>
                                    </div>

                                    <button
                                        disabled={!file || uploading}
                                        onClick={handleBulkUpload}
                                        className="w-full btn-primary py-5 !rounded-2xl transition-all disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={20} />}
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">{uploading ? "Deploying..." : "Execute Deployment"}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Successful Nodes</p>
                                            <h4 className="text-4xl font-black text-white tracking-tighter">{uploadResults.successful}</h4>
                                        </div>
                                        <CheckCircle size={40} className="text-emerald-500 opacity-50" />
                                    </div>

                                    {uploadResults.failed > 0 && (
                                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Failed Nodes</p>
                                                <h4 className="text-2xl font-black text-white tracking-tighter">{uploadResults.failed}</h4>
                                            </div>
                                            <div className="max-h-32 overflow-y-auto space-y-2 no-scrollbar">
                                                {uploadResults.errors.map((err, i) => (
                                                    <p key={i} className="text-[9px] text-rose-400 uppercase font-black opacity-80">{err}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setUploadResults(null);
                                            setFile(null);
                                        }}
                                        className="w-full py-4 glass-card rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Finalize Protocol
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
