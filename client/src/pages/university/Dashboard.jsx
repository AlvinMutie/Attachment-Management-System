import React, { useState, useEffect } from 'react';
import {
    Users,
    MapPin,
    ClipboardCheck,
    MessageSquare,
    FilePlus,
    ArrowUpRight,
    Filter,
    TrendingUp,
    Calendar,
    GraduationCap,
    BookOpen
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getMyStudents, getUniversityAssessments } from '../../utils/universityApi';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-8 flex flex-col justify-between h-full bg-gradient-to-br from-white/[0.04] to-transparent border-white/5 hover:border-blue-500/20 transition-all group rounded-m3-large overflow-hidden relative">
        <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{label}</p>
            <div className={`p-3 rounded-2xl bg-white/5 ${color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="text-4xl font-black text-white tracking-tighter relative z-10">{value}</p>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 blur-xl rounded-full" />
    </div>
);

const UniversitySupervisorDashboard = () => {
    const [students, setStudents] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [studRes, assRes] = await Promise.all([
                    getMyStudents().catch(() => ({ data: { data: [] } })),
                    getUniversityAssessments().catch(() => ({ data: { data: [] } }))
                ]);
                setStudents(studRes.data?.data || []);
                setAssessments(assRes.data?.data || []);
            } catch (err) {
                console.error('Failed to load academic dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const totalStudents = students.length;
    const totalAssessments = assessments.length;
    const activePlacements = students.filter(s => ['APPROVED', 'ACTIVE'].includes(s.placementStatus)).length;

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-12 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-blue-600/5 p-10 rounded-m3-xl border border-blue-600/10 backdrop-blur-md">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 ring-1 ring-white/20">
                            <GraduationCap className="text-white" size={44} />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-70">Academic Oversight</span>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">University <span className="text-blue-500">Supervisor</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">Monitoring student academic progress, scheduling assessments, and verifying compliance.</p>
                        </div>
                    </div>
                </div>

                {/* Academic Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={Users} label="Supervised Mentees" value={totalStudents} color="text-blue-400" />
                    <StatCard icon={ClipboardCheck} label="Active Placements" value={activePlacements} color="text-emerald-400" />
                    <StatCard icon={TrendingUp} label="Completed Evaluations" value={totalAssessments} color="text-purple-400" />
                </div>

                {/* Main Table: Student Monitoring */}
                <div className="glass-card !rounded-m3-xl overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-5">
                            <GraduationCap className="text-blue-500" size={28} />
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Supervised Student Cohort</h3>
                        </div>
                        <a href="/university/assessments" className="btn-primary px-6 py-2.5 text-xs">
                            Academic Assessments
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">
                                    <th className="px-10 py-6">Mentee Identity</th>
                                    <th className="px-10 py-6">Industry Placement</th>
                                    <th className="px-10 py-6">Logbooks Submitted</th>
                                    <th className="px-10 py-6">Attendance Logs</th>
                                    <th className="px-10 py-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {students.length > 0 ? (
                                    students.map((s) => (
                                        <tr key={s.id} className="hover:bg-white/[0.03] transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                    <div>
                                                        <p className="text-lg font-black text-white tracking-tighter">{s.user?.name}</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mt-0.5">{s.admissionNumber} • {s.course || s.department}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-slate-300 text-sm font-extrabold uppercase tracking-widest">
                                                {s.organizationName || 'Not Assigned'}
                                            </td>
                                            <td className="px-10 py-8 text-slate-300 text-sm font-bold">
                                                {s.logbooks?.length || 0} Reports
                                            </td>
                                            <td className="px-10 py-8 text-slate-300 text-sm font-bold">
                                                {s.attendance?.length || 0} Days
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border ${s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE'
                                                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-amber-600/20 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    {s.placementStatus || 'DRAFT'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            No students currently assigned to your supervision.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UniversitySupervisorDashboard;
