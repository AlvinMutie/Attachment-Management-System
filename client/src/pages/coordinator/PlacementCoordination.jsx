import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    UserCheck,
    CheckCircle2,
    Clock,
    XCircle,
    Building2,
    User,
    Calendar,
    ArrowRight,
    RefreshCw,
    History,
    AlertCircle,
    BookOpen
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Card, Badge, Button, Input, Modal, LoadingSkeleton } from '../../components/ui';

export default function PlacementCoordination() {
    const [loading, setLoading] = useState(true);
    const [placements, setPlacements] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailData, setDetailData] = useState(null);

    // Assignment & Reassignment modal state
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assignTarget, setAssignTarget] = useState(null); // { student, type: 'industry' | 'university', isReassignment: boolean }
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [reassignReason, setReassignReason] = useState('');
    const [assignSubmitting, setAssignSubmitting] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState(null);

    const loadPlacements = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'ALL') params.status = statusFilter;
            if (searchTerm) params.search = searchTerm;

            const [placeRes, supRes] = await Promise.all([
                coordinatorApi.getPlacements(params),
                coordinatorApi.getSupervisors()
            ]);

            if (placeRes.success) setPlacements(placeRes.data || []);
            if (supRes.success) setSupervisors(supRes.data || []);
        } catch (error) {
            console.error('Failed to load placements data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlacements();
    }, [statusFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadPlacements();
    };

    const handleViewDetail = async (placement) => {
        setSelectedPlacement(placement);
        try {
            setDetailLoading(true);
            const res = await coordinatorApi.getPlacementById(placement.id);
            if (res.success) {
                setDetailData(res.data);
            }
        } catch (error) {
            console.error('Failed to load placement detail:', error);
        } finally {
            setDetailLoading(false);
        }
    };

    const openAssignModal = (student, type, isReassignment = false) => {
        setAssignTarget({ student, type, isReassignment });
        setSelectedSupervisorId('');
        setReassignReason('');
        setFeedbackMsg(null);
        setAssignModalOpen(true);
    };

    const handleSaveAssignment = async (e) => {
        e.preventDefault();
        if (!selectedSupervisorId) return;

        try {
            setAssignSubmitting(true);
            let res;
            if (assignTarget.isReassignment) {
                res = await coordinatorApi.reassignSupervisor({
                    studentId: assignTarget.student.id,
                    supervisorId: selectedSupervisorId,
                    type: assignTarget.type,
                    reason: reassignReason || 'Academic coordinator reallocation'
                });
            } else {
                res = await coordinatorApi.assignSupervisor({
                    studentId: assignTarget.student.id,
                    supervisorId: selectedSupervisorId,
                    type: assignTarget.type,
                    reason: reassignReason || 'Initial supervisor allocation'
                });
            }

            if (res.success) {
                setFeedbackMsg({ type: 'success', text: res.message });
                setTimeout(() => {
                    setAssignModalOpen(false);
                    loadPlacements();
                    if (selectedPlacement && selectedPlacement.id === assignTarget.student.id) {
                        handleViewDetail(selectedPlacement);
                    }
                }, 1200);
            }
        } catch (error) {
            console.error('Failed to save supervisor assignment:', error);
            setFeedbackMsg({
                type: 'error',
                text: error.response?.data?.message || 'Failed to complete supervisor assignment'
            });
        } finally {
            setAssignSubmitting(false);
        }
    };

    const filterTabs = [
        { id: 'ALL', label: 'All Placements' },
        { id: 'DRAFT', label: 'Drafts' },
        { id: 'PENDING_APPROVAL', label: 'Pending Approval' },
        { id: 'APPROVED', label: 'Approved' },
        { id: 'ACTIVE', label: 'Active' },
        { id: 'UNASSIGNED', label: 'Unassigned' }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Approved</Badge>;
            case 'ACTIVE':
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">Active</Badge>;
            case 'PENDING_APPROVAL':
                return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Pending</Badge>;
            case 'REJECTED':
                return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">Rejected</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Draft</Badge>;
        }
    };

    const eligibleSupervisors = supervisors.filter(s => {
        if (!assignTarget) return false;
        if (assignTarget.type === 'industry') return s.role === 'industry_supervisor';
        if (assignTarget.type === 'university') return s.role === 'university_supervisor';
        return false;
    });

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        Placement Coordination & Allocation
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Review attachment applications, allocate academic supervisors, and audit assignment history.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadPlacements}
                    className="flex items-center gap-2 self-start md:self-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                statusFilter === tab.id
                                    ? 'bg-teal-600 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm w-full">
                    <Input
                        placeholder="Search student, admission, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-xs"
                    />
                    <Button type="submit" size="sm" variant="outline">
                        <Search className="w-4 h-4" />
                    </Button>
                </form>
            </div>

            {/* Placements Table */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <LoadingSkeleton key={i} className="h-16 rounded-xl" />
                    ))}
                </div>
            ) : placements.length === 0 ? (
                <Card className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No placements match current criteria</h3>
                    <p className="text-xs text-slate-500 mt-1">Try changing the status filter or search parameters.</p>
                </Card>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Admission & Dept</th>
                                    <th className="p-4">Host Company</th>
                                    <th className="p-4">Industry Supervisor</th>
                                    <th className="p-4">University Supervisor</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                {placements.map(p => {
                                    const studentUser = p.user || {};
                                    const hasIndustry = Boolean(p.industrySupervisor);
                                    const hasUni = Boolean(p.universitySupervisor);

                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                                {studentUser.name || 'Unnamed Student'}
                                                <div className="text-[11px] font-normal text-slate-500">{studentUser.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                    {p.admissionNumber || 'N/A'}
                                                </span>
                                                <div className="text-[11px] text-slate-500 mt-0.5">{p.department || 'General'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">{p.organizationName || 'Not Assigned'}</div>
                                                <div className="text-[11px] text-slate-500">{p.organizationAddress || '—'}</div>
                                            </td>
                                            <td className="p-4">
                                                {hasIndustry ? (
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <span className="font-medium">{p.industrySupervisor.name}</span>
                                                            <div className="text-[10px] text-slate-400">{p.industrySupervisor.email}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => openAssignModal(p, 'industry', true)}
                                                            className="text-[10px] text-teal-600 hover:underline font-semibold"
                                                        >
                                                            Reassign
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openAssignModal(p, 'industry', false)}
                                                        className="px-2 py-1 text-[11px] bg-amber-50 text-amber-700 hover:bg-amber-100 rounded border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-semibold"
                                                    >
                                                        + Assign Industry
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {hasUni ? (
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <span className="font-medium">{p.universitySupervisor.name}</span>
                                                            <div className="text-[10px] text-slate-400">{p.universitySupervisor.email}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => openAssignModal(p, 'university', true)}
                                                            className="text-[10px] text-teal-600 hover:underline font-semibold"
                                                        >
                                                            Reassign
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openAssignModal(p, 'university', false)}
                                                        className="px-2 py-1 text-[11px] bg-purple-50 text-purple-700 hover:bg-purple-100 rounded border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 font-semibold"
                                                    >
                                                        + Assign Uni Sup
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(p.placementStatus)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewDetail(p)}
                                                    className="text-xs"
                                                >
                                                    Dossier & History
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Placement Detail & History Drawer / Modal */}
            {selectedPlacement && (
                <Modal
                    isOpen={Boolean(selectedPlacement)}
                    onClose={() => setSelectedPlacement(null)}
                    title={`Student Placement Dossier — ${selectedPlacement.user?.name || 'Student'}`}
                    maxWidth="max-w-3xl"
                >
                    {detailLoading ? (
                        <div className="space-y-4 py-6">
                            <LoadingSkeleton className="h-6 w-1/3" />
                            <LoadingSkeleton className="h-24 rounded-lg" />
                            <LoadingSkeleton className="h-48 rounded-lg" />
                        </div>
                    ) : detailData ? (
                        <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
                            {/* Top Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">Student Information</h4>
                                    <p><span className="font-medium text-slate-500">Name:</span> {detailData.student?.user?.name}</p>
                                    <p><span className="font-medium text-slate-500">Email:</span> {detailData.student?.user?.email}</p>
                                    <p><span className="font-medium text-slate-500">Admission:</span> {detailData.student?.admissionNumber}</p>
                                    <p><span className="font-medium text-slate-500">Department:</span> {detailData.student?.department || '—'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">Host Organization</h4>
                                    <p><span className="font-medium text-slate-500">Company:</span> {detailData.student?.organizationName || 'Not Set'}</p>
                                    <p><span className="font-medium text-slate-500">Address:</span> {detailData.student?.organizationAddress || '—'}</p>
                                    <p><span className="font-medium text-slate-500">Contact:</span> {detailData.student?.contactPerson || '—'} ({detailData.student?.organizationPhone || '—'})</p>
                                    <p><span className="font-medium text-slate-500">Dates:</span> {detailData.student?.startDate ? new Date(detailData.student.startDate).toLocaleDateString() : '—'} to {detailData.student?.endDate ? new Date(detailData.student.endDate).toLocaleDateString() : '—'}</p>
                                </div>
                            </div>

                            {/* Readiness Snapshot */}
                            {detailData.readiness && (
                                <div className="p-4 border rounded-xl bg-white dark:bg-slate-900">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <CheckCircle2 className={`w-4 h-4 ${detailData.readiness.ready ? 'text-emerald-500' : 'text-amber-500'}`} />
                                            Completion Readiness Score: {detailData.readiness.score}%
                                        </h4>
                                        <Badge className={detailData.readiness.ready ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                                            {detailData.readiness.ready ? 'READINESS VERIFIED' : `${detailData.readiness.blockers?.length || 0} BLOCKERS`}
                                        </Badge>
                                    </div>
                                    {detailData.readiness.blockers?.length > 0 && (
                                        <ul className="list-disc list-inside space-y-1 text-rose-600 dark:text-rose-400 text-[11px]">
                                            {detailData.readiness.blockers.map((b, idx) => (
                                                <li key={idx}>{b}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Assignment History Timeline */}
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3 flex items-center gap-2">
                                    <History className="w-4 h-4 text-teal-600" />
                                    Supervisor Allocation & Reassignment Audit Trail
                                </h4>
                                {detailData.student?.assignmentHistory?.length === 0 ? (
                                    <p className="text-slate-400 italic">No historical supervisor assignment changes recorded.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {detailData.student.assignmentHistory.map((hist, idx) => (
                                            <div key={idx} className="p-3 border rounded-lg bg-slate-50/70 dark:bg-slate-800/40 flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={hist.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}>
                                                            {hist.status.toUpperCase()}
                                                        </Badge>
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {hist.supervisorType === 'industry' ? 'Industry' : 'University'} Supervisor: {hist.supervisor?.name || 'Supervisor'}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-500 text-[11px] mt-1">
                                                        Assigned by: <span className="font-medium text-slate-700 dark:text-slate-300">{hist.assigner?.name || 'Administrator'}</span> | Reason: {hist.reason || 'None specified'}
                                                    </p>
                                                </div>
                                                <div className="text-right text-[10px] text-slate-400">
                                                    <div>From: {new Date(hist.assignedAt).toLocaleDateString()}</div>
                                                    {hist.endedAt && <div>Ended: {new Date(hist.endedAt).toLocaleDateString()}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </Modal>
            )}

            {/* Assign / Reassign Supervisor Modal */}
            {assignModalOpen && assignTarget && (
                <Modal
                    isOpen={assignModalOpen}
                    onClose={() => setAssignModalOpen(false)}
                    title={`${assignTarget.isReassignment ? 'Reassign' : 'Assign'} ${assignTarget.type === 'industry' ? 'Industry' : 'University'} Supervisor`}
                    maxWidth="max-w-md"
                >
                    <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
                        {feedbackMsg && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 ${feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{feedbackMsg.text}</span>
                            </div>
                        )}

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Target Student
                            </label>
                            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-900 dark:text-white">
                                {assignTarget.student.user?.name} ({assignTarget.student.admissionNumber})
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Select {assignTarget.type === 'industry' ? 'Industry' : 'University'} Supervisor <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={selectedSupervisorId}
                                onChange={(e) => setSelectedSupervisorId(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                                required
                            >
                                <option value="">-- Choose Supervisor --</option>
                                {eligibleSupervisors.map(sup => (
                                    <option key={sup.id} value={sup.id}>
                                        {sup.name} ({sup.assignedStudentsCount || 0} students assigned)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Allocation / Reassignment Reason <span className="text-slate-400 font-normal">(Audit log requirement)</span>
                            </label>
                            <textarea
                                value={reassignReason}
                                onChange={(e) => setReassignReason(e.target.value)}
                                placeholder="e.g. Supervisor capacity rebalancing, company change, academic department rotation..."
                                rows={3}
                                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAssignModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={assignSubmitting || !selectedSupervisorId}
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                                {assignSubmitting ? 'Saving...' : assignTarget.isReassignment ? 'Confirm Reassignment' : 'Confirm Assignment'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
