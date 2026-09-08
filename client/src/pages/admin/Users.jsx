import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    MoreVertical,
    CheckCircle2,
    Download,
    Settings
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const UserDirectory = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [searchQuery, setSearchQuery] = useState('');

    const students = [
        { name: 'Alvin Mutie', id: 'BIT-2024-001', dept: 'IT', email: 'alvin@mut.edu', status: 'Active', supervisor: 'Eng. Sarah' },
        { name: 'Sarah Wilson', id: 'BIT-2024-005', dept: 'CS', email: 'sarah@mut.edu', status: 'Active', supervisor: 'Eng. Sarah' },
        { name: 'John Peterson', id: 'BIT-2024-009', dept: 'SE', email: 'john@mut.edu', status: 'Pending', supervisor: 'N/A' },
        { name: 'Maria Garcia', id: 'BIT-2024-012', dept: 'CS', email: 'maria@mut.edu', status: 'Active', supervisor: 'Dr. James' },
        { name: 'David Smith', id: 'BIT-2024-015', dept: 'IT', email: 'david@mut.edu', status: 'Inactive', supervisor: 'Eng. Sarah' },
    ];

    const staff = [
        { name: 'Eng. Sarah Jenkins', role: 'Industry Supervisor', dept: 'Cloud Dept', email: 's.jenkins@safaricom.com', students: 8 },
        { name: 'Dr. James Okoth', role: 'University Supervisor', dept: 'Computing', email: 'j.okoth@mut.edu', students: 15 },
        { name: 'Prof. Alice Wang', role: 'University Supervisor', dept: 'Informatics', email: 'a.wang@mut.edu', students: 12 },
    ];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-6 max-w-7xl mx-auto p-6">
                {/* Header Section */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">Identity Registry</span>
                                <Badge variant="neutral">Verified Cohort</Badge>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">Institutional User Directory</h1>
                            <p className="text-xs text-slate-400 mt-0.5">Administrative roster of all active students and faculty supervisors.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button variant="outline" icon={Download}>
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or email..."
                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-1 bg-[#12141c] p-1 rounded-lg border border-[#22242f] w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeTab === 'students' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Students ({students.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${activeTab === 'staff' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Staff & Supervisors ({staff.length})
                        </button>
                    </div>
                </div>

                {/* Directory Table */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#12141c] border-b border-[#22242f]">
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{activeTab === 'students' ? 'Student Identity' : 'Staff Identity'}</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{activeTab === 'students' ? 'Department' : 'Assigned Role'}</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{activeTab === 'students' ? 'Supervisor' : 'Mentee Count'}</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#22242f]">
                                {activeTab === 'students' ? (
                                    filteredStudents.map((s, i) => (
                                        <tr key={i} className="hover:bg-[#181a24]/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#181a24] border border-[#22242f] rounded-full flex items-center justify-center text-xs font-semibold text-violet-400">
                                                        {s.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-200">{s.name}</p>
                                                        <p className="text-[11px] text-slate-500 font-mono">{s.id} • {s.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-300 text-xs">{s.dept} Faculty</td>
                                            <td className="px-5 py-3.5 text-slate-300 text-xs">{s.supervisor}</td>
                                            <td className="px-5 py-3.5">
                                                <Badge variant={s.status === 'Active' ? 'success' : s.status === 'Pending' ? 'warning' : 'danger'}>
                                                    {s.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredStaff.map((s, i) => (
                                        <tr key={i} className="hover:bg-[#181a24]/50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#181a24] border border-[#22242f] rounded-full flex items-center justify-center text-xs font-semibold text-violet-400">
                                                        {s.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-200">{s.name}</p>
                                                        <p className="text-[11px] text-slate-500">{s.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <Badge variant="purple">{s.role}</Badge>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-300 text-xs">
                                                {s.students} Mentees
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <Badge variant="success">Verified</Badge>
                                            </td>
                                        </tr>
                                    ))
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
