import React, { useState, useEffect } from 'react';
import {
    Users, Search, Plus, Upload, Mail,
    UserCheck, FileSpreadsheet, CheckCircle,
    XCircle, Loader2, Check, X
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

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
            alert('Bulk onboarding failed. Please verify CSV column headers.');
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

    const getPlacementBadgeVariant = (status) => {
        switch (status) {
            case 'APPROVED':
            case 'ACTIVE':
                return 'success';
            case 'PENDING_APPROVAL':
            case 'SUBMITTED':
                return 'warning';
            case 'REJECTED':
                return 'danger';
            default:
                return 'neutral';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            {/* Header Section */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">School Administration</span>
                            <span className="text-xs text-slate-400">Total Enrolled: {students.length}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">Student & Placement Registry</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Review attachment placements, manage supervisor pairings, and onboard student cohorts.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        onClick={() => setShowUploadModal(true)}
                        variant="outline"
                        icon={Upload}
                    >
                        Bulk CSV Onboard
                    </Button>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        variant="primary"
                        icon={Plus}
                    >
                        New Student
                    </Button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                    <input
                        type="text"
                        placeholder="Search student by name, email, or admission number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                </div>
                <div className="w-full sm:w-60">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                    >
                        <option value="">All Placement Statuses</option>
                        <option value="PENDING_APPROVAL">Pending Approval</option>
                        <option value="APPROVED">Approved Placements</option>
                        <option value="REJECTED">Rejected Placements</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#22242f] bg-[#12141c]">
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Host Company</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Supervisors</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#22242f]">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-5 py-4"><div className="h-4 bg-[#181a24] rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-[#181a24]/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#181a24] border border-[#22242f] flex items-center justify-center text-xs font-semibold text-violet-400">
                                                    {student.user?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-200">{student.user?.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-mono">{student.admissionNumber} • {student.course || student.department}</p>
                                                    <p className="text-[10px] text-slate-500">{student.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div>
                                                <p className="text-xs font-medium text-slate-200">{student.organizationName || 'No Organization'}</p>
                                                <p className="text-[11px] text-slate-500">{student.contactPerson || student.organizationAddress || '---'}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 space-y-1">
                                            <div className="text-[11px]">
                                                <span className="text-slate-500 mr-1.5">Industry:</span>
                                                {student.industrySupervisor ? (
                                                    <span className="text-emerald-400 font-medium">{student.industrySupervisor.name}</span>
                                                ) : (
                                                    <span className="text-slate-500 italic">Unassigned</span>
                                                )}
                                            </div>
                                            <div className="text-[11px]">
                                                <span className="text-slate-500 mr-1.5">University:</span>
                                                {student.universitySupervisor ? (
                                                    <span className="text-violet-400 font-medium">{student.universitySupervisor.name}</span>
                                                ) : (
                                                    <span className="text-slate-500 italic">Unassigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={getPlacementBadgeVariant(student.placementStatus)}>
                                                {student.placementStatus || 'DRAFT'}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 text-right space-x-2">
                                            {student.placementStatus === 'PENDING_APPROVAL' && (
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => setSelectedStudentForReview(student)}
                                                >
                                                    Review
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedStudentForAssign(student);
                                                    setAssignType('industry');
                                                    setAssignSupervisorId(student.industrySupervisorId || '');
                                                }}
                                            >
                                                Assign
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                                        No student records found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Placement Review Modal */}
            {selectedStudentForReview && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-[#15171f] border border-[#22242f] rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#22242f] pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-100">Review Placement Application</h3>
                                <p className="text-xs text-slate-400">Student: {selectedStudentForReview.user?.name}</p>
                            </div>
                            <button onClick={() => setSelectedStudentForReview(null)} className="text-slate-400 hover:text-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="p-3.5 rounded-lg bg-[#12141c] border border-[#22242f] space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Organization:</span>
                                    <span className="text-slate-200 font-semibold">{selectedStudentForReview.organizationName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Address:</span>
                                    <span className="text-slate-300">{selectedStudentForReview.organizationAddress || '---'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Contact Person:</span>
                                    <span className="text-slate-300">{selectedStudentForReview.contactPerson} ({selectedStudentForReview.organizationPhone})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Duration:</span>
                                    <span className="text-slate-300">{selectedStudentForReview.startDate} to {selectedStudentForReview.endDate}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Rejection Reason (if declining)</label>
                                <textarea
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain why the placement details require revision..."
                                    className="w-full bg-[#12141c] border border-[#22242f] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-violet-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22242f]">
                            <Button
                                type="button"
                                variant="danger"
                                disabled={reviewingPlacement}
                                onClick={() => handlePlacementReview('REJECTED')}
                            >
                                Decline
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                disabled={reviewingPlacement}
                                onClick={() => handlePlacementReview('APPROVED')}
                                icon={Check}
                            >
                                {reviewingPlacement ? 'Processing...' : 'Approve Placement'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Supervisor Modal */}
            {selectedStudentForAssign && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-[#15171f] border border-[#22242f] rounded-xl w-full max-w-md shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#22242f] pb-3">
                            <div>
                                <h3 className="text-base font-bold text-slate-100">Assign Supervisor</h3>
                                <p className="text-xs text-slate-400">Student: {selectedStudentForAssign.user?.name}</p>
                            </div>
                            <button onClick={() => setSelectedStudentForAssign(null)} className="text-slate-400 hover:text-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAssignSupervisor} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Supervisor Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setAssignType('industry'); setAssignSupervisorId(''); }}
                                        className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${assignType === 'industry' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}
                                    >
                                        Industry Supervisor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setAssignType('university'); setAssignSupervisorId(''); }}
                                        className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${assignType === 'university' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}
                                    >
                                        University Supervisor
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Select Supervisor</label>
                                <select
                                    value={assignSupervisorId}
                                    onChange={(e) => setAssignSupervisorId(e.target.value)}
                                    className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                    required
                                >
                                    <option value="">Choose a registered supervisor...</option>
                                    {supervisors
                                        .filter(s => s.role === `${assignType}_supervisor`)
                                        .map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22242f]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setSelectedStudentForAssign(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={assigning || !assignSupervisorId}
                                >
                                    {assigning ? 'Assigning...' : 'Confirm Assignment'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Single Student Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-[#15171f] border border-[#22242f] rounded-xl w-full max-w-md shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#22242f] pb-3">
                            <h3 className="text-base font-bold text-slate-100">Onboard New Student</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateStudent} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                    className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                    placeholder="e.g. John Kamau"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Institutional Email</label>
                                <input
                                    type="email"
                                    required
                                    value={createForm.email}
                                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                    className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                    placeholder="e.g. j.kamau@student.edu"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Admission Number</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.admissionNumber}
                                    onChange={(e) => setCreateForm({ ...createForm, admissionNumber: e.target.value })}
                                    className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                    placeholder="e.g. ADM-2026-001"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.department}
                                        onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
                                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                        placeholder="Computer Science"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Course</label>
                                    <input
                                        type="text"
                                        value={createForm.course}
                                        onChange={(e) => setCreateForm({ ...createForm, course: e.target.value })}
                                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                        placeholder="BSc Software Eng"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22242f]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={creating}
                                >
                                    {creating ? 'Onboarding...' : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-[#15171f] border border-[#22242f] rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#22242f] pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                                    <FileSpreadsheet size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-100">Bulk Onboard Students</h3>
                                    <p className="text-xs text-slate-400">Import student roster via structured CSV</p>
                                </div>
                            </div>
                            <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        {!uploadResults ? (
                            <div className="space-y-4">
                                <div className="p-6 border-2 border-dashed border-[#22242f] rounded-xl flex flex-col items-center justify-center space-y-3 hover:border-violet-500/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <Upload size={24} className="text-slate-400" />
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-slate-200">{file ? file.name : "Select Institutional CSV File"}</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Click or drag file here</p>
                                    </div>
                                </div>

                                <div className="bg-[#12141c] border border-[#22242f] p-3.5 rounded-lg text-xs text-slate-400 space-y-1">
                                    <p className="font-semibold text-slate-300">CSV Structure Requirements:</p>
                                    <p>Headers: <span className="font-mono text-violet-400">name, email, admissionNumber, department</span></p>
                                    <p>Default initial password: <span className="font-mono text-slate-300">ChangeMe123!</span></p>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                                    <Button
                                        variant="primary"
                                        disabled={!file || uploading}
                                        onClick={handleBulkUpload}
                                    >
                                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                        <span className="ml-1.5">{uploading ? "Importing..." : "Process Import"}</span>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-emerald-400 font-semibold">Successfully Onboarded</p>
                                        <p className="text-2xl font-bold text-slate-100 mt-0.5">{uploadResults.successful} records</p>
                                    </div>
                                    <CheckCircle size={28} className="text-emerald-500" />
                                </div>

                                {uploadResults.failed > 0 && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-rose-400 font-semibold">Failed Records: {uploadResults.failed}</p>
                                        </div>
                                        <div className="max-h-28 overflow-y-auto space-y-1 text-xs text-rose-300 font-mono">
                                            {uploadResults.errors?.map((err, i) => (
                                                <p key={i}>{err}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setUploadResults(null);
                                        setFile(null);
                                    }}
                                >
                                    Done
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
