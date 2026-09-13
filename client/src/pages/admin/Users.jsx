import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    CheckCircle2,
    Download,
    GraduationCap,
    Briefcase,
    ShieldCheck,
    Mail,
    RefreshCw
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import * as adminApi from '../../utils/adminApi';
import { LoadingSkeleton } from '../../components/ui';

const UserDirectory = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const [studRes, supRes] = await Promise.allSettled([
                adminApi.getStudents({ limit: 100 }),
                adminApi.getSupervisors()
            ]);

            if (studRes.status === 'fulfilled' && studRes.value?.data?.success) {
                setStudents(studRes.value.data.data.students || []);
            }
            if (supRes.status === 'fulfilled' && supRes.value?.data?.success) {
                setSupervisors(supRes.value.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load user directory', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredStudents = students.filter(s =>
        (s.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.admissionNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStaff = supervisors.filter(s =>
        (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExportCSV = () => {
        const isStudentTab = activeTab === 'students';
        const data = isStudentTab ? filteredStudents : filteredStaff;
        if (data.length === 0) {
            alert('No records to export.');
            return;
        }

        const headers = isStudentTab
            ? ['Name', 'Admission Number', 'Email', 'Department', 'Course', 'Placement Status']
            : ['Name', 'Email', 'Role', 'Assigned Mentees'];

        const rows = isStudentTab
            ? filteredStudents.map(s => [
                `"${s.user?.name || 'N/A'}"`,
                `"${s.admissionNumber || 'N/A'}"`,
                `"${s.user?.email || 'N/A'}"`,
                `"${s.department || 'N/A'}"`,
                `"${s.course || 'N/A'}"`,
                `"${s.placementStatus || 'DRAFT'}"`
            ])
            : filteredStaff.map(s => [
                `"${s.name || 'N/A'}"`,
                `"${s.email || 'N/A'}"`,
                `"${s.role || 'Supervisor'}"`,
                `"${s.assignedStudentsCount || 0}"`
            ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${isStudentTab ? 'Student_Registry' : 'Staff_Directory'}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading && students.length === 0 && supervisors.length === 0) {
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
                {/* Header Section */}
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
                                        Identity Registry
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {students.length + supervisors.length} Total Accounts
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Institutional User Directory
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Comprehensive administrative roster of enrolled students, faculty supervisors, and industry workplace mentors.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleExportCSV}
                                className="px-4 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <Download size={14} />
                                <span>Export Active Directory</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters & Tabs */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or admission ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                                activeTab === 'students'
                                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                                    : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                            }`}
                        >
                            Enrolled Students ({students.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                                activeTab === 'staff'
                                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                                    : 'bg-[#181a24] text-slate-400 hover:text-slate-200 border border-[#22242f]'
                            }`}
                        >
                            Staff & Mentors ({supervisors.length})
                        </button>
                    </div>
                </div>

                {/* Directory Table */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#181a24] text-slate-400 font-semibold border-b border-[#22242f]">
                                <tr>
                                    <th className="py-3.5 px-6">User Account</th>
                                    <th className="py-3.5 px-6">{activeTab === 'students' ? 'Identifier / ADM' : 'Email Address'}</th>
                                    <th className="py-3.5 px-6">{activeTab === 'students' ? 'Academic Program' : 'Role / Title'}</th>
                                    <th className="py-3.5 px-6 text-right">{activeTab === 'students' ? 'Placement Status' : 'Mentee Load'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e2230]">
                                {activeTab === 'students' ? (
                                    filteredStudents.length > 0 ? (
                                        filteredStudents.map((s) => (
                                            <tr key={s.id} className="hover:bg-[#181a24]/50 transition-colors">
                                                <td className="py-3.5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs uppercase">
                                                            {s.user?.name ? s.user.name.charAt(0) : 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-100">{s.user?.name || 'Student'}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">{s.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-300 font-mono text-[11px]">
                                                    {s.admissionNumber || 'N/A'}
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-300">
                                                    <p className="font-medium text-slate-200">{s.course || 'Degree Program'}</p>
                                                    <p className="text-[10px] text-slate-500">{s.department || 'Computing'}</p>
                                                </td>
                                                <td className="py-3.5 px-6 text-right">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        s.placementStatus === 'APPROVED' || s.placementStatus === 'ACTIVE'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                        {s.placementStatus || 'DRAFT'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-slate-500 text-xs">
                                                No student accounts match the query.
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    filteredStaff.length > 0 ? (
                                        filteredStaff.map((st) => (
                                            <tr key={st.id} className="hover:bg-[#181a24]/50 transition-colors">
                                                <td className="py-3.5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs uppercase">
                                                            {st.name ? st.name.charAt(0) : 'M'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-100">{st.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">{st.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-6 text-slate-300 font-mono text-[11px]">
                                                    {st.email}
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        st.role === 'university_supervisor'
                                                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    }`}>
                                                        {st.role === 'university_supervisor' ? 'Faculty Lead' : 'Industry Mentor'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6 text-right font-mono text-slate-200">
                                                    {st.assignedStudentsCount || 0} mentees
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-slate-500 text-xs">
                                                No staff accounts match the query.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDirectory;
