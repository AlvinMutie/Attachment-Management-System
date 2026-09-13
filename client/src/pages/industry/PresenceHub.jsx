import React, { useEffect, useState } from 'react';
import {
    Activity,
    MapPin,
    Mail,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    User,
    GraduationCap,
    Users,
    RefreshCw,
    QrCode,
    Filter,
    FileText,
    ArrowUpRight,
    PhoneCall,
    Check
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getLivePresence, markSupervisorAttendance } from '../../utils/supervisorApi';
import { LoadingSkeleton } from '../../components/ui';

const PresenceHub = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, present, absent, not-scanned

    const fetchPresence = async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const response = await getLivePresence();
            setStudents(response.data || []);
        } catch (error) {
            console.error('Failed to fetch presence data:', error);
        } finally {
            setLoading(false);
            if (isManual) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPresence();
        const interval = setInterval(() => fetchPresence(), 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const handleQuickCheckin = async (studentId) => {
        try {
            await markSupervisorAttendance({
                studentId,
                date: new Date().toISOString().split('T')[0],
                status: 'present',
                notes: 'Quick presence check-in via Presence Hub'
            });
            fetchPresence();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to mark attendance');
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.admissionNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (statusFilter === 'all') return true;
        return student.presenceStatus === statusFilter;
    });

    const presentCount = students.filter(s => s.presenceStatus === 'present').length;
    const absentCount = students.filter(s => s.presenceStatus === 'absent').length;
    const pendingCount = students.filter(s => s.presenceStatus === 'not-scanned' || !s.presenceStatus).length;

    if (loading) {
        return (
            <DashboardLayout role="industry_supervisor">
                <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                    <LoadingSkeleton className="h-28 rounded-2xl bg-[#12141c]" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-24 rounded-2xl bg-[#12141c]" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <LoadingSkeleton className="h-64 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-64 rounded-2xl bg-[#12141c]" />
                        <LoadingSkeleton className="h-64 rounded-2xl bg-[#12141c]" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
                                <Activity size={32} className="animate-pulse" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Live Operations
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400 text-[11px] font-mono">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                        30s Auto-Sync
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Real-time Presence Hub
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Continuous telemetry of assigned intern nodes, workplace check-in status, and recent activity streams.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => fetchPresence(true)}
                                disabled={refreshing}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={refreshing ? 'animate-spin text-emerald-400' : ''} />
                                <span>{refreshing ? 'Refreshing...' : 'Sync Now'}</span>
                            </button>
                            <a
                                href="/industry/dashboard"
                                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
                            >
                                <QrCode size={14} />
                                <span>Open Scanner</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div
                        onClick={() => setStatusFilter('present')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'present' ? 'border-emerald-500/50 bg-emerald-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active On-Site</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{presentCount}</span>
                            <span className="text-xs text-slate-500">interns</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Status: Verified</span>
                            <span className="text-emerald-400 font-semibold font-mono">
                                {students.length > 0 ? `${Math.round((presentCount / students.length) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('absent')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'absent' ? 'border-rose-500/50 bg-rose-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Off-Site / Absent</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                <XCircle size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-400 font-mono">{absentCount}</span>
                            <span className="text-xs text-slate-500">interns</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Requires follow-up</span>
                            <span className="text-rose-400 font-semibold">{absentCount > 0 ? 'Alert' : 'None'}</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('not-scanned')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'not-scanned' ? 'border-amber-500/50 bg-amber-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Clock-In</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Clock size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-amber-400 font-mono">{pendingCount}</span>
                            <span className="text-xs text-slate-500">interns</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Awaiting QR scan</span>
                            <span className="text-amber-400 font-medium">Pending today</span>
                        </div>
                    </div>

                    <div
                        onClick={() => setStatusFilter('all')}
                        className={`bg-[#12141c] border rounded-2xl p-5 cursor-pointer transition-all ${
                            statusFilter === 'all' ? 'border-violet-500/50 bg-violet-500/05' : 'border-[#22242f] hover:border-[#2a2d3d]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Supervised</span>
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{students.length}</span>
                            <span className="text-xs text-slate-500">registered</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Total cohort pool</span>
                            <span className="text-violet-400 font-medium">All active</span>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by name, admission ID, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                            <Filter size={12} /> Status:
                        </span>
                        {[
                            { id: 'all', label: 'All Interns' },
                            { id: 'present', label: 'Active Now' },
                            { id: 'absent', label: 'Off-site' },
                            { id: 'not-scanned', label: 'Pending Sync' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                                    statusFilter === tab.id
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                        : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Intern Presence Cards Grid */}
                {filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStudents.map((student) => {
                            const isPresent = student.presenceStatus === 'present';
                            const isAbsent = student.presenceStatus === 'absent';

                            return (
                                <div
                                    key={student.id}
                                    className="bg-[#12141c] border border-[#22242f] hover:border-[#2a2d3d] rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between space-y-5 hover:shadow-xl hover:shadow-black/40 group"
                                >
                                    <div className="space-y-4">
                                        {/* Card Header: Avatar + Presence Status */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-[#22242f] flex items-center justify-center font-bold text-base text-slate-200 overflow-hidden shadow-md">
                                                    {student.photo ? (
                                                        <img
                                                            src={`http://localhost:5000${student.photo}`}
                                                            alt={student.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>{student.name ? student.name.charAt(0) : 'S'}</span>
                                                    )}
                                                </div>
                                                {isPresent && (
                                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#12141c] rounded-full flex items-center justify-center shadow-md shadow-emerald-500/40">
                                                        <Check size={9} className="text-white font-bold" />
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                {isPresent ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        Active Now
                                                    </span>
                                                ) : isAbsent ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                                                        <XCircle size={10} />
                                                        Off-site
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                                        <Clock size={10} />
                                                        Pending Check-in
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Student Info */}
                                        <div className="space-y-1">
                                            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                                                {student.name}
                                            </h3>
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181a24] border border-[#22242f] text-[10px] font-mono text-slate-300">
                                                <span className="text-slate-500">ADM:</span> {student.admissionNumber}
                                            </div>
                                        </div>

                                        {/* Contact & Meta Details */}
                                        <div className="space-y-2 pt-3 border-t border-[#1e2230] text-xs">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Mail size={13} className="text-slate-500 shrink-0" />
                                                <span className="truncate font-mono text-[11px]">{student.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <GraduationCap size={13} className="text-slate-500 shrink-0" />
                                                <span className="truncate text-[11px]">{student.course || 'Degree in Computing / Engineering'}</span>
                                            </div>
                                        </div>

                                        {/* Latest Logbook Snippet */}
                                        {student.latestLogbook && (
                                            <div className="p-3 rounded-xl bg-[#181a24] border border-[#22242f] space-y-1 text-xs">
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <span className="font-bold text-slate-400 uppercase font-mono">Week {student.latestLogbook.weekNumber} Activity</span>
                                                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                                        student.latestLogbook.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        student.latestLogbook.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' :
                                                        'bg-amber-500/10 text-amber-400'
                                                    }`}>
                                                        {student.latestLogbook.status}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                                                    "{student.latestLogbook.summary || 'Weekly entry logged.'}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footers */}
                                    <div className="pt-4 border-t border-[#1e2230] flex items-center gap-2">
                                        {!isPresent ? (
                                            <button
                                                onClick={() => handleQuickCheckin(student.id)}
                                                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                                            >
                                                <Check size={14} />
                                                <span>Check-in Intern</span>
                                            </button>
                                        ) : (
                                            <a
                                                href="/industry/attendance"
                                                className="w-full py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                                            >
                                                <span>View Attendance Log</span>
                                                <ChevronRight size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-12 text-center space-y-3">
                        <Users size={36} className="mx-auto text-slate-600" />
                        <h3 className="text-base font-bold text-slate-200">No student interns found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            No students match your active search and status filter criteria. Try adjusting the filter or search query.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PresenceHub;
