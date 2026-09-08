import React, { useState, useEffect } from 'react';
import {
    Search,
    BookOpen,
    CheckCircle2,
    Building2,
    RefreshCw,
    History,
    AlertCircle,
    UserCheck,
    X
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

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
                }, 1000);
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
                return <Badge variant="success" size="sm">Approved</Badge>;
            case 'ACTIVE':
                return <Badge variant="indigo" size="sm">Active</Badge>;
            case 'PENDING_APPROVAL':
                return <Badge variant="warning" size="sm">Pending</Badge>;
            case 'REJECTED':
                return <Badge variant="danger" size="sm">Rejected</Badge>;
            default:
                return <Badge variant="neutral" size="sm">Draft</Badge>;
        }
    };

    const eligibleSupervisors = supervisors.filter(s => {
        if (!assignTarget) return false;
        if (assignTarget.type === 'industry') return s.role === 'industry_supervisor';
        if (assignTarget.type === 'university') return s.role === 'university_supervisor';
        return false;
    });

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-violet-600/15 border border-violet-500/25 rounded-lg flex items-center justify-center text-violet-300">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Institutional Registry</span>
                        <h1 className="text-xl font-semibold text-white tracking-tight">
                            Placement Coordination & Allocation
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Audit attachment applications, assign academic supervisors, and track lifecycle transitions.
                        </p>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    onClick={loadPlacements}
                    className="flex items-center gap-1.5 text-xs py-1.5 px-3 self-start md:self-auto"
                >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Refresh</span>
                </Button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#22242f]">
                {/* Tabs */}
                <div className="segmented-tabs overflow-x-auto">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`segmented-tab-btn text-xs ${
                                statusFilter === tab.id ? 'active' : ''
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-xs w-full">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                        <input
                            type="text"
                            placeholder="Search student, admission..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 font-sans"
                        />
                    </div>
                </form>
            </div>

            {/* Placements Table */}
            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <LoadingSkeleton key={i} className="h-14 rounded-md" />
                    ))}
                </div>
            ) : placements.length === 0 ? (
                <div className="craft-card p-10 text-center space-y-1.5">
                    <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-1 opacity-70" />
                    <h3 className="text-xs font-semibold text-white">No placements found</h3>
                    <p className="text-[11px] text-slate-400">Try changing the status filter or search parameters.</p>
                </div>
            ) : (
                <div className="craft-card p-5 space-y-3">
                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#12141c] text-slate-400 font-medium border-b border-[#22242f]">
                                <tr>
                                    <th className="py-2.5 px-5">Student</th>
                                    <th className="py-2.5 px-5">Admission No</th>
                                    <th className="py-2.5 px-5">Host Organization</th>
                                    <th className="py-2.5 px-5">Industry Mentor</th>
                                    <th className="py-2.5 px-5">University Supervisor</th>
                                    <th className="py-2.5 px-5">Status</th>
                                    <th className="py-2.5 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#22242f]">
                                {placements.map(p => {
                                    const studentUser = p.user || {};
                                    const hasIndustry = Boolean(p.industrySupervisor);
                                    const hasUni = Boolean(p.universitySupervisor);

                                    return (
                                        <tr key={p.id} className="hover:bg-[#181a24] transition-colors">
                                            <td className="py-2.5 px-5">
                                                <div>
                                                    <p className="font-medium text-white">{studentUser.name || 'Student'}</p>
                                                    <p className="text-[10px] text-slate-500">{studentUser.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-5 font-mono text-[11px] text-slate-300">
                                                {p.admissionNumber || 'N/A'}
                                            </td>
                                            <td className="py-2.5 px-5 text-slate-300">
                                                <div className="font-medium text-slate-200">{p.organizationName || 'Not Set'}</div>
                                                <div className="text-[10px] text-slate-500">{p.organizationAddress || '—'}</div>
                                            </td>
                                            <td className="py-2.5 px-5">
                                                {hasIndustry ? (
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <span className="text-slate-200 font-medium">{p.industrySupervisor.name}</span>
                                                            <div className="text-[10px] text-slate-500">{p.industrySupervisor.email}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => openAssignModal(p, 'industry', true)}
                                                            className="text-[10px] text-violet-400 hover:text-violet-300 font-medium ml-1"
                                                        >
                                                            Reassign
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openAssignModal(p, 'industry', false)}
                                                        className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 rounded border border-amber-500/20 font-medium"
                                                    >
                                                        + Assign Industry
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-2.5 px-5">
                                                {hasUni ? (
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <span className="text-slate-200 font-medium">{p.universitySupervisor.name}</span>
                                                            <div className="text-[10px] text-slate-500">{p.universitySupervisor.email}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => openAssignModal(p, 'university', true)}
                                                            className="text-[10px] text-violet-400 hover:text-violet-300 font-medium ml-1"
                                                        >
                                                            Reassign
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openAssignModal(p, 'university', false)}
                                                        className="px-2 py-0.5 text-[10px] bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 rounded border border-violet-500/20 font-medium"
                                                    >
                                                        + Assign Faculty
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-2.5 px-5">
                                                {getStatusBadge(p.placementStatus)}
                                            </td>
                                            <td className="py-2.5 px-5 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => handleViewDetail(p)}
                                                    className="text-[11px] py-1 px-2.5"
                                                >
                                                    Audit Dossier
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

            {/* Placement Detail & History Modal */}
            {selectedPlacement && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl bg-[#12141c] border border-[#22242f] rounded-xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Placement Dossier</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Student: {selectedPlacement.user?.name || 'Student'}</p>
                            </div>
                            <button onClick={() => setSelectedPlacement(null)} className="text-slate-400 hover:text-white p-1">
                                <X size={15} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="space-y-3 py-4">
                                <LoadingSkeleton className="h-6 w-1/3 rounded-md" />
                                <LoadingSkeleton className="h-20 rounded-md" />
                                <LoadingSkeleton className="h-32 rounded-md" />
                            </div>
                        ) : detailData ? (
                            <div className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#181a24] p-3.5 rounded-lg border border-[#22242f]">
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-slate-200 uppercase tracking-wide text-[10px]">Student Record</h4>
                                        <p><span className="text-slate-400">Name:</span> {detailData.student?.user?.name}</p>
                                        <p><span className="text-slate-400">Email:</span> {detailData.student?.user?.email}</p>
                                        <p><span className="text-slate-400">Admission:</span> <span className="font-mono">{detailData.student?.admissionNumber}</span></p>
                                        <p><span className="text-slate-400">Department:</span> {detailData.student?.department || '—'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-slate-200 uppercase tracking-wide text-[10px]">Host Organization</h4>
                                        <p><span className="text-slate-400">Company:</span> {detailData.student?.organizationName || 'Not Set'}</p>
                                        <p><span className="text-slate-400">Address:</span> {detailData.student?.organizationAddress || '—'}</p>
                                        <p><span className="text-slate-400">Contact:</span> {detailData.student?.contactPerson || '—'}</p>
                                    </div>
                                </div>

                                {detailData.readiness && (
                                    <div className="p-3.5 border border-[#22242f] rounded-lg bg-[#181a24] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-white flex items-center gap-1.5">
                                                <CheckCircle2 className={`w-3.5 h-3.5 ${detailData.readiness.ready ? 'text-emerald-400' : 'text-amber-400'}`} />
                                                <span>Readiness Score: {detailData.readiness.score}%</span>
                                            </h4>
                                            <Badge variant={detailData.readiness.ready ? 'success' : 'warning'} size="sm">
                                                {detailData.readiness.ready ? 'Ready for Completion' : `${detailData.readiness.blockers?.length || 0} Blockers`}
                                            </Badge>
                                        </div>
                                        {detailData.readiness.blockers?.length > 0 && (
                                            <ul className="list-disc list-inside space-y-0.5 text-rose-400 text-[11px]">
                                                {detailData.readiness.blockers.map((b, idx) => (
                                                    <li key={idx}>{b}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}

                                {/* Assignment History */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-white uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                                        <History className="w-3.5 h-3.5 text-violet-400" />
                                        Supervisor Allocation Audit History
                                    </h4>
                                    {detailData.student?.assignmentHistory?.length === 0 ? (
                                        <p className="text-slate-500 italic py-2">No historical supervisor reassignments recorded.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {detailData.student.assignmentHistory.map((hist, idx) => (
                                                <div key={idx} className="p-2.5 border border-[#22242f] rounded-md bg-[#181a24] flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={hist.status === 'active' ? 'success' : 'neutral'} size="sm">
                                                                {hist.status.toUpperCase()}
                                                            </Badge>
                                                            <span className="font-medium text-white">
                                                                {hist.supervisorType === 'industry' ? 'Industry' : 'University'} Mentor: {hist.supervisor?.name || 'Supervisor'}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-400 text-[11px] mt-1">
                                                            Assigned by: <span className="text-slate-200">{hist.assigner?.name || 'Admin'}</span> | Reason: {hist.reason || 'Standard allocation'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-[10px] text-slate-500">
                                                        <div>{new Date(hist.assignedAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Assign / Reassign Supervisor Modal */}
            {assignModalOpen && assignTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-xl p-5 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                            <h3 className="text-sm font-semibold text-white">
                                {assignTarget.isReassignment ? 'Reassign' : 'Assign'} {assignTarget.type === 'industry' ? 'Industry' : 'University'} Supervisor
                            </h3>
                            <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                                <X size={15} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAssignment} className="space-y-3 text-xs">
                            {feedbackMsg && (
                                <div className={`p-2.5 rounded-md flex items-center gap-2 ${feedbackMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'}`}>
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{feedbackMsg.text}</span>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Target Student</label>
                                <div className="p-2 bg-[#181a24] rounded-md border border-[#22242f] text-slate-200 font-medium">
                                    {assignTarget.student.user?.name} ({assignTarget.student.admissionNumber})
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">
                                    Select {assignTarget.type === 'industry' ? 'Industry' : 'University'} Supervisor <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={selectedSupervisorId}
                                    onChange={(e) => setSelectedSupervisorId(e.target.value)}
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500"
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

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">
                                    Reason for Allocation / Reassignment <span className="text-slate-500 font-normal">(Audit log requirement)</span>
                                </label>
                                <textarea
                                    value={reassignReason}
                                    onChange={(e) => setReassignReason(e.target.value)}
                                    placeholder="e.g. Workload rebalancing, faculty rotation, host company adjustment..."
                                    rows={3}
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 resize-none outline-none focus:border-violet-500 font-sans"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22242f]">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setAssignModalOpen(false)}
                                    className="text-xs py-1.5 px-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={assignSubmitting || !selectedSupervisorId}
                                    className="text-xs py-1.5 px-3"
                                >
                                    {assignSubmitting ? 'Saving...' : assignTarget.isReassignment ? 'Confirm Reassignment' : 'Confirm Assignment'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
