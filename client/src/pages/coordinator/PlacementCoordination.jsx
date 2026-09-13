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
    X,
    Filter,
    ArrowRight,
    GraduationCap,
    Briefcase,
    Check,
    SlidersHorizontal,
    Mail,
    MapPin,
    Calendar
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { LoadingSkeleton } from '../../components/ui';

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
    const [assignTarget, setAssignTarget] = useState(null);
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
                coordinatorApi.getPlacements(params).catch(() => ({ success: false })),
                coordinatorApi.getSupervisors().catch(() => ({ success: false }))
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
                    type: assignTarget.type
                });
            }

            if (res.success) {
                setFeedbackMsg({ type: 'success', text: 'Supervisor allocation updated successfully.' });
                setTimeout(() => {
                    setAssignModalOpen(false);
                    loadPlacements();
                }, 800);
            }
        } catch (error) {
            console.error('Failed to update supervisor assignment:', error);
            setFeedbackMsg({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update assignment.'
            });
        } finally {
            setAssignSubmitting(false);
        }
    };

    const eligibleSupervisors = supervisors.filter(s => {
        if (!assignTarget) return true;
        if (assignTarget.type === 'industry') return s.role === 'industry_supervisor';
        return s.role === 'university_supervisor';
    });

    const totalCount = placements.length;
    const approvedCount = placements.filter(p => p.status === 'APPROVED').length;
    const submittedCount = placements.filter(p => p.status === 'SUBMITTED' || p.status === 'PENDING').length;
    const unassignedCount = placements.filter(p => !p.universitySupervisorId || !p.industrySupervisorId).length;

    if (loading && placements.length === 0) {
        return (
            <DashboardLayout role="attachment_coordinator">
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
        <DashboardLayout role="attachment_coordinator">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10 shrink-0">
                                <BookOpen size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Cohort Allocations
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {totalCount} Active Placements
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Placement Coordination & Matching
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Authorize student industrial attachments, pair academic and host supervisors, and resolve placement exceptions.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={loadPlacements}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin text-teal-400' : ''} />
                                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        onClick={() => setStatusFilter('ALL')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'ALL' ? 'border-teal-500/50 bg-teal-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applications</span>
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <BookOpen size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalCount}</span>
                            <span className="text-xs text-slate-500">records</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>All cohort intakes</span>
                            <span className="text-teal-400 font-medium">100% visible</span>
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
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{approvedCount}</span>
                            <span className="text-xs text-slate-500">cleared</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Active attachments</span>
                            <span className="text-emerald-400 font-mono font-medium">
                                {totalCount > 0 ? `${Math.round((approvedCount / totalCount) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('SUBMITTED')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'SUBMITTED' ? 'border-amber-500/50 bg-amber-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Review</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <AlertCircle size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{submittedCount}</span>
                            <span className="text-xs text-slate-500">awaiting</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Requires clearance</span>
                            <span className="text-amber-400 font-medium">Pending sign-off</span>
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
                            <span className="text-xs text-slate-500">missing supervisor</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Requires pairing</span>
                            <span className="text-rose-400 font-medium">{unassignedCount > 0 ? 'Action required' : 'Fully matched'}</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by student, admission ID, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all font-sans"
                        />
                    </form>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Status:
                        </span>
                        {[
                            { id: 'ALL', label: 'All Placements' },
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
                                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Placements Ledger Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3.5 px-6">Student Intern</th>
                                    <th className="py-3.5 px-6">Host Organization</th>
                                    <th className="py-3.5 px-6">University Supervisor</th>
                                    <th className="py-3.5 px-6">Industry Mentor</th>
                                    <th className="py-3.5 px-6">Placement Status</th>
                                    <th className="py-3.5 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {placements.length > 0 ? (
                                    placements.map((p) => (
                                        <tr key={p.id} className="hover:bg-[#181a24]/50 transition-colors">
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#22242f] flex items-center justify-center font-bold text-teal-400 text-xs uppercase">
                                                        {p.student?.user?.name ? p.student.user.name.charAt(0) : 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-100">{p.student?.user?.name || 'Student'}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono">{p.student?.admissionNumber} • {p.student?.course || 'Degree'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 text-slate-300">
                                                <div>
                                                    <p className="font-medium text-slate-200">{p.organizationName || 'Not Set'}</p>
                                                    <p className="text-[10px] text-slate-500">{p.roleTitle || 'Intern'}</p>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                {p.student?.universitySupervisor ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-slate-200">{p.student.universitySupervisor.name}</span>
                                                        <button
                                                            onClick={() => openAssignModal(p.student, 'university', true)}
                                                            className="text-[10px] text-teal-400 hover:underline"
                                                        >
                                                            Reassign
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openAssignModal(p.student, 'university', false)}
                                                        className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold"
                                                    >
                                                        + Assign Faculty
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                {p.student?.industrySupervisor ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-slate-200">{p.student.industrySupervisor.name}</span>
                                                        <button
                                                            onClick={() => openAssignModal(p.student, 'industry', true)}
                                                            className="text-[10px] text-teal-400 hover:underline"
                                                        >
                                                            Reassign
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => openAssignModal(p.student, 'industry', false)}
                                                        className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold"
                                                    >
                                                        + Assign Industry
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    p.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    p.status === 'SUBMITTED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    p.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                    'bg-slate-800 text-slate-300 border border-slate-700'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        p.status === 'APPROVED' ? 'bg-emerald-400' :
                                                        p.status === 'SUBMITTED' ? 'bg-amber-400' :
                                                        p.status === 'REJECTED' ? 'bg-rose-400' : 'bg-slate-400'
                                                    }`} />
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <button
                                                    onClick={() => handleViewDetail(p)}
                                                    className="px-3 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
                                                >
                                                    <span>Inspect</span>
                                                    <ArrowRight size={11} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                                            No placement applications found matching the selected filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Inspect Placement Detail Modal */}
            {selectedPlacement && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-xl bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <span className="px-2.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase">
                                    Placement Dossier
                                </span>
                                <h3 className="text-base font-bold text-slate-100">{selectedPlacement.student?.user?.name}</h3>
                                <p className="text-xs text-slate-400 font-mono">{selectedPlacement.student?.admissionNumber}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPlacement(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f] space-y-1">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Host Organization</span>
                                    <p className="font-bold text-slate-200">{selectedPlacement.organizationName || 'N/A'}</p>
                                    <p className="text-[11px] text-slate-400">{selectedPlacement.address || 'Address not listed'}</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f] space-y-1">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Role Title</span>
                                    <p className="font-bold text-slate-200">{selectedPlacement.roleTitle || 'Industrial Intern'}</p>
                                    <p className="text-[11px] text-slate-400">{selectedPlacement.startDate} to {selectedPlacement.endDate}</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#181a24] border border-[#22242f] space-y-2">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Supervisor Pairing Status</span>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div>
                                        <span className="text-slate-500 block">Faculty Supervisor:</span>
                                        <span className="text-slate-200 font-medium">
                                            {selectedPlacement.student?.universitySupervisor?.name || 'Not Allocated'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Industry Mentor:</span>
                                        <span className="text-slate-200 font-medium">
                                            {selectedPlacement.student?.industrySupervisor?.name || 'Not Allocated'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                            <button
                                type="button"
                                onClick={() => setSelectedPlacement(null)}
                                className="px-5 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-300 text-xs font-semibold"
                            >
                                Close Dossier
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign/Reassign Supervisor Modal */}
            {assignModalOpen && assignTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">
                                    {assignTarget.isReassignment ? 'Reassign Supervisor' : 'Assign Supervisor'}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {assignTarget.type === 'industry' ? 'Industry Workplace Mentor' : 'Faculty Academic Lead'} for {assignTarget.student?.user?.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setAssignModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {feedbackMsg && (
                            <div className={`p-3 rounded-xl text-xs font-semibold ${
                                feedbackMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                            }`}>
                                {feedbackMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleSaveAssignment} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                    Select {assignTarget.type === 'industry' ? 'Industry Mentor' : 'Faculty Supervisor'}
                                </label>
                                <select
                                    value={selectedSupervisorId}
                                    onChange={(e) => setSelectedSupervisorId(e.target.value)}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                                    required
                                >
                                    <option value="">Choose a supervisor...</option>
                                    {eligibleSupervisors.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.assignedStudentsCount || 0} mentees assigned)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {assignTarget.isReassignment && (
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Reassignment Rationale
                                    </label>
                                    <input
                                        type="text"
                                        value={reassignReason}
                                        onChange={(e) => setReassignReason(e.target.value)}
                                        placeholder="e.g. Faculty workload balancing, student relocation..."
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                                <button
                                    type="button"
                                    onClick={() => setAssignModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assignSubmitting}
                                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 flex items-center gap-1.5"
                                >
                                    <Check size={14} />
                                    <span>{assignSubmitting ? 'Saving...' : 'Confirm Assignment'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
