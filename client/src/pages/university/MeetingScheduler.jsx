import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    User,
    Briefcase,
    Plus,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Filter,
    Search,
    ChevronRight,
    Users,
    Check,
    X,
    CalendarCheck
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { createMeeting, getMeetings } from '../../utils/meetingApi';
import { getMyStudents } from '../../utils/universityApi';
import { LoadingSkeleton } from '../../components/ui';

const MeetingScheduler = () => {
    const [meetings, setMeetings] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        studentId: '',
        industrySupervisorId: '',
        type: 'physical',
        scheduledAt: '',
        purpose: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [meetingRes, studentRes] = await Promise.all([
                getMeetings().catch(() => ({ data: { data: [] } })),
                getMyStudents().catch(() => ({ data: { data: [] } }))
            ]);
            setMeetings(meetingRes.data?.data || []);
            setStudents(studentRes.data?.data || []);
        } catch (error) {
            console.error('Failed to load scheduler data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelect = (e) => {
        const student = students.find(s => s.id === e.target.value);
        if (student) {
            setFormData({
                ...formData,
                studentId: student.id,
                industrySupervisorId: student.industrySupervisor?.id || ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createMeeting(formData);
            setShowModal(false);
            setFormData({
                studentId: '',
                industrySupervisorId: '',
                type: 'physical',
                scheduledAt: '',
                purpose: ''
            });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to schedule meeting');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredMeetings = meetings.filter(m => {
        const matchesQuery =
            (m.purpose || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.student?.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.industrySupervisor?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesQuery) return false;
        if (statusFilter === 'all') return true;
        return m.status === statusFilter;
    });

    const confirmedCount = meetings.filter(m => m.status === 'confirmed').length;
    const pendingCount = meetings.filter(m => m.status === 'pending').length;
    const physicalCount = meetings.filter(m => m.type === 'physical').length;
    const remoteCount = meetings.filter(m => m.type === 'remote').length;

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
                {/* Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10 shrink-0">
                                <CalendarCheck size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Field Supervision
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {meetings.length} Scheduled Visits
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Supervision Visit Scheduler
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Coordinate physical site visits and virtual check-ins with interns and host industry mentors.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} />
                                <span>Schedule Visit</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        onClick={() => setStatusFilter('confirmed')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'confirmed' ? 'border-emerald-500/50 bg-emerald-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed Visits</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{confirmedCount}</span>
                            <span className="text-xs text-slate-500">visits</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Dual confirmed</span>
                            <span className="text-emerald-400 font-medium">Ready for execution</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('pending')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'pending' ? 'border-amber-500/50 bg-amber-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Confirmation</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Clock size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{pendingCount}</span>
                            <span className="text-xs text-slate-500">invites</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Awaiting response</span>
                            <span className="text-amber-400 font-medium">Student / Industry</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On-Site Physical</span>
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                                <MapPin size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-orange-400 font-mono">{physicalCount}</span>
                            <span className="text-xs text-slate-500">site visits</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Workplace locations</span>
                            <span className="text-orange-400 font-medium">Direct inspection</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Virtual Check-Ins</span>
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <Video size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-400 font-mono">{remoteCount}</span>
                            <span className="text-xs text-slate-500">remote sessions</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Video conference</span>
                            <span className="text-purple-400 font-medium">Online sync</span>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by purpose, student name, or supervisor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Status:
                        </span>
                        {[
                            { id: 'all', label: 'All Visits' },
                            { id: 'confirmed', label: 'Confirmed' },
                            { id: 'pending', label: 'Pending' },
                            { id: 'rescheduling', label: 'Rescheduled' },
                            { id: 'cancelled', label: 'Cancelled' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                                    statusFilter === tab.id
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Visit Cards Stream */}
                <div className="grid gap-4">
                    {filteredMeetings.length > 0 ? (
                        filteredMeetings.map((meeting) => {
                            const isPhysical = meeting.type === 'physical';
                            const dateObj = new Date(meeting.scheduledAt);

                            return (
                                <div
                                    key={meeting.id}
                                    className="bg-[#12141c] border border-[#22242f] hover:border-[#2a2d3d] rounded-2xl p-6 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                                            isPhysical
                                                ? 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                                                : 'bg-purple-500/10 border-purple-500/25 text-purple-400'
                                        }`}>
                                            {isPhysical ? <MapPin size={26} /> : <Video size={26} />}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base font-bold text-slate-100">{meeting.purpose}</h3>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    meeting.status === 'confirmed'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : meeting.status === 'pending'
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            : meeting.status === 'rescheduling'
                                                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        meeting.status === 'confirmed' ? 'bg-emerald-400' :
                                                        meeting.status === 'pending' ? 'bg-amber-400' :
                                                        meeting.status === 'rescheduling' ? 'bg-sky-400' : 'bg-rose-400'
                                                    }`} />
                                                    {meeting.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-slate-500" />
                                                    <span className="font-mono text-slate-300">{dateObj.toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={13} className="text-slate-500" />
                                                    <span className="font-mono text-slate-300">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User size={13} className="text-slate-500" />
                                                    <span>Student: <strong className="text-slate-200">{meeting.student?.user?.name || 'Intern'}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase size={13} className="text-slate-500" />
                                                    <span>Host: <strong className="text-slate-200">{meeting.industrySupervisor?.name || 'Workplace Supervisor'}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dual Acceptance State Pill Box */}
                                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto justify-between md:justify-start pt-2 md:pt-0 border-t md:border-t-0 border-[#1e2230]">
                                        <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-[#181a24] border border-[#22242f] text-[10px] font-mono">
                                            <span className="text-slate-400 uppercase font-semibold">Student</span>
                                            <span className={`font-bold uppercase ${
                                                meeting.studentStatus === 'accepted' ? 'text-emerald-400' : 'text-amber-400'
                                            }`}>
                                                {meeting.studentStatus || 'pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-[#181a24] border border-[#22242f] text-[10px] font-mono">
                                            <span className="text-slate-400 uppercase font-semibold">Industry</span>
                                            <span className={`font-bold uppercase ${
                                                meeting.industryStatus === 'accepted' ? 'text-emerald-400' : 'text-amber-400'
                                            }`}>
                                                {meeting.industryStatus || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-12 text-center space-y-3">
                            <CalendarCheck size={36} className="mx-auto text-slate-600" />
                            <h3 className="text-base font-bold text-slate-200">No scheduled visits found</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                No field meetings matching your criteria. Initiate a new visit request to begin coordination.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Meeting Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Schedule Field Supervision Visit</h3>
                                <p className="text-xs text-slate-400">Initiate site visit request with intern and industry mentor</p>
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
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Target Student</label>
                                <select
                                    onChange={handleStudentSelect}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                    required
                                >
                                    <option value="">Select a student mentee...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.name} — {s.admissionNumber} ({s.course || 'Degree'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Linked Industry Mentor</label>
                                <input
                                    type="text"
                                    value={students.find(s => s.id === formData.studentId)?.industrySupervisor?.name || 'Automatic Lookup on Selection'}
                                    disabled
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-400 select-none opacity-80"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Meeting Venue Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="physical">Physical On-Site Visit</option>
                                        <option value="remote">Virtual Conference</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Supervision Objective / Purpose</label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g., Mid-term on-site inspection, technical project review, and logbook verification..."
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-[#181a24] border border-[#22242f] text-xs text-slate-200 placeholder-slate-500 resize-none outline-none focus:border-purple-500 font-sans"
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
                                    <span>{submitting ? 'Sending Invites...' : 'Send Visit Invitations'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default MeetingScheduler;
