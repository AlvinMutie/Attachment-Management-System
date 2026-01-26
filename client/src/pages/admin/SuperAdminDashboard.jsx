import React from 'react';
import {
    ShieldCheck,
    BarChart3,
    Plus,
    Building2,
    Settings,
    Globe,
    Bell,
    Search
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const SuperAdminDashboard = () => {
    return (
        <DashboardLayout role="super_admin">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
                            <ShieldCheck className="text-blue-500" size={32} />
                            <span>Platform Control</span>
                        </h1>
                        <p className="text-slate-400 mt-1 uppercase text-xs font-black tracking-widest">Global SaaS Administration</p>
                    </div>
                    <div className="flex space-x-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input type="text" placeholder="Search schools..." className="input-field w-64 pl-10 h-10 text-sm" />
                        </div>
                        <button className="btn-primary px-4 py-2 flex items-center space-x-2 h-10">
                            <Plus size={18} />
                            <span>Add School</span>
                        </button>
                    </div>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Institutions', value: '42', icon: Building2, color: 'text-blue-400' },
                        { label: 'Active Subscriptions', value: '38', icon: Globe, color: 'text-green-400' },
                        { label: 'Global Students', value: '12.4k', icon: BarChart3, color: 'text-purple-400' },
                        { label: 'System Uptime', value: '99.98%', icon: ShieldCheck, color: 'text-yellow-400' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                                <stat.icon className={stat.color} size={18} />
                            </div>
                            <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Institution Managed Table */}
                    <div className="lg:col-span-2 glass-card overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Institutional Partners</h3>
                            <button className="text-blue-400 text-sm font-bold hover:underline">Platform Reports</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Institution Name</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Users</th>
                                        <th className="px-6 py-4">Plan</th>
                                        <th className="px-6 py-4 text-right">Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { name: 'Modern Uni of Tech', contact: 'admin@mut.edu', users: '1.2k', plan: 'Enterprise' },
                                        { name: 'Greenville Academy', contact: 'it@greenville.edu', users: '450', plan: 'Professional' },
                                        { name: 'City Design College', contact: 'dean@citydesign.org', users: '82', plan: 'Basic' },
                                    ].map((school, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white text-sm">{school.name}</td>
                                            <td className="px-6 py-4 text-slate-400 text-xs">{school.contact}</td>
                                            <td className="px-6 py-4 text-slate-300 text-xs">{school.users}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">{school.plan}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-500 hover:text-white p-1">
                                                    <Settings size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Platform Notifications & Health */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 space-y-6 bg-gradient-to-tr from-slate-900 to-transparent">
                            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                                <Bell className="text-blue-500" size={18} />
                                <span>Global Alerts</span>
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { type: 'Critical', msg: 'School admin login failures high for Region 2.', time: '10m ago', color: 'bg-red-500' },
                                    { type: 'Update', msg: 'System maintenance scheduled for 02:00 AM.', time: '2h ago', color: 'bg-blue-500' },
                                    { type: 'New Org', msg: 'Kenya Poly has requested enterprise onboarding.', time: '5h ago', color: 'bg-green-500' }
                                ].map((n, i) => (
                                    <div key={i} className="flex space-x-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className={`w-1 h-8 rounded-full shrink-0 ${n.color}`} />
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-black text-slate-500">{n.type} • {n.time}</p>
                                            <p className="text-xs text-slate-300 italic">"{n.msg}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-primary w-full py-2.5 text-xs uppercase tracking-widest font-black">Broadcast Announcement</button>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4">SaaS Performance</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Database Load</span>
                                    <span className="text-green-400 font-bold">12%</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[12%]" />
                                </div>
                                <div className="flex items-center justify-between text-xs pt-2">
                                    <span className="text-slate-400">API Latency</span>
                                    <span className="text-blue-400 font-bold">42ms</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[28%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SuperAdminDashboard;
