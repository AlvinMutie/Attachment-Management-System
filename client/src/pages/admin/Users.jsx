import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    MoreVertical,
    Mail,
    Shield,
    CheckCircle2,
    XCircle,
    Download,
    Settings
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

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

    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-12 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <span className="section-label">Identity Registry</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter">User Management</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">Administering 1,282 active platform accounts.</p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-white/5 text-slate-300 px-6 py-3.5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 hover:bg-white/10 transition-all">
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                        <button className="btn-primary px-8 py-3.5 flex items-center space-x-3 text-xs font-black uppercase tracking-widest">
                            <UserPlus size={18} />
                            <span>Bulk Import</span>
                        </button>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or email..."
                            className="input-field pl-12 h-14"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="glass-card flex p-1.5 border border-white/5 h-14">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            Students
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            Staff Users
                        </button>
                    </div>
                    <button className="glass-card flex items-center justify-center space-x-3 text-slate-400 hover:text-white transition-all border border-white/5 h-14 p-4 text-[10px] font-black uppercase tracking-widest">
                        <Filter size={18} />
                        <span>Advanced Filters</span>
                    </button>
                </div>

                {/* Directory Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <th className="px-8 py-6">{activeTab === 'students' ? 'Student Identity' : 'Staff Identity'}</th>
                                    <th className="px-8 py-6">{activeTab === 'students' ? 'Department' : 'Assigned Role'}</th>
                                    <th className="px-8 py-6">{activeTab === 'students' ? 'Supervisor' : 'Network Count'}</th>
                                    <th className="px-8 py-6">Verification</th>
                                    <th className="px-8 py-6 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {activeTab === 'students' ? (
                                    students.map((s, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-blue-500 border border-white/5 uppercase tracking-tighter">
                                                        {s.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white tracking-tight">{s.name}</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-slate-400 text-xs font-bold">{s.dept} Faculty</td>
                                            <td className="px-8 py-6 text-slate-400 text-xs font-bold">{s.supervisor}</td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-600/20 text-green-400' :
                                                        s.status === 'Pending' ? 'bg-orange-600/20 text-orange-400' : 'bg-red-600/20 text-red-400'
                                                    }`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="text-slate-500 hover:text-white transition-all bg-white/5 p-2.5 rounded-xl border border-white/5">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    staff.map((s, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-purple-500 border border-white/5 uppercase tracking-tighter">
                                                        {s.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white tracking-tight">{s.name}</p>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-600/10 px-3 py-1 rounded-full tracking-widest">{s.role}</span>
                                            </td>
                                            <td className="px-8 py-6 text-slate-400 text-xs font-bold group-hover:text-white transition-colors">
                                                {s.students} Mentees
                                            </td>
                                            <td className="px-8 py-6">
                                                <CheckCircle2 className="text-green-500" size={18} />
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="text-slate-500 hover:text-white transition-all bg-white/5 p-2.5 rounded-xl border border-white/5">
                                                    <Settings size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Batch Actions footer */}
                <div className="flex items-center justify-between px-4 py-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-600/10 border-dashed animate-pulse">
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center space-x-3">
                        <Shield size={16} />
                        <span>Ready for system-wide database sync...</span>
                    </p>
                    <button className="text-blue-500 text-xs font-black uppercase tracking-widest hover:underline">Synchronize Now</button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDirectory;
