import React from 'react';
import {
    Users,
    Calendar,
    Download,
    Building2,
    ShieldCheck,
    School,
    Activity,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Badge, Button } from '../../components/ui';

const SchoolAdminDashboard = () => {
    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Section */}
                <div className="craft-card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                            <School size={24} />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium mb-1">
                                Institutional Governance
                            </div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                                School Administration Hub
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Institutional registry governance, cohort telemetry, and statutory audit readiness.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link to="/school_admin/analytics">
                            <Button variant="secondary" className="text-xs py-1.5 px-3 flex items-center gap-1.5">
                                <Activity size={13} />
                                <span>View Analytics</span>
                            </Button>
                        </Link>
                        <Link to="/school_admin/students">
                            <Button variant="primary" className="text-xs py-1.5 px-3 flex items-center gap-1.5">
                                <Users size={13} />
                                <span>Student Registry</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Core Institution Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Total Registered</span>
                            <Users className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="kpi-metric-value mt-2">1,240</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Current term</span>
                            <span className="font-mono text-emerald-400">+12% enrolled</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Host Partners</span>
                            <Building2 className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                        <div className="kpi-metric-value text-sky-400 mt-2">85</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Active corporate hosts</span>
                            <span className="font-mono text-slate-300">Verified</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Faculty Supervisors</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="kpi-metric-value text-emerald-400 mt-2">42</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Assigned mentors</span>
                            <span className="font-mono text-slate-300">Active roster</span>
                        </div>
                    </div>

                    <div className="craft-card p-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium">Readiness Index</span>
                            <Activity className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="kpi-metric-value text-amber-400 mt-2">88%</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22242f] text-[11px] text-slate-400">
                            <span>Attachment pass rate</span>
                            <span className="font-mono text-amber-300">Audited</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-5">
                    {/* Active Cohort Overview */}
                    <div className="lg:col-span-2 craft-card p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                            <div>
                                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Cohort Registry Sample</h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">Active students and placement states</p>
                            </div>
                            <Link to="/school_admin/students">
                                <Button size="sm" variant="secondary" className="text-xs py-1 px-2.5">
                                    <span>Full Registry</span>
                                    <ArrowRight size={12} className="ml-1" />
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-2">
                            {[
                                { name: 'Alvin Mutie', dept: 'IT Systems', email: 'alvin@mut.ac.ke', status: 'In Attachment', variant: 'success' },
                                { name: 'Sarah Wilson', dept: 'Computer Science', email: 'sarah@mut.ac.ke', status: 'In Attachment', variant: 'success' },
                                { name: 'John Peterson', dept: 'Software Engineering', email: 'john@mut.ac.ke', status: 'Pending Review', variant: 'warning' }
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-[#181a24] rounded-md border border-[#22242f] text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-md bg-violet-600/15 border border-violet-500/20 text-violet-300 font-bold flex items-center justify-center">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{user.name}</h4>
                                            <p className="text-[11px] text-slate-500">{user.dept} • {user.email}</p>
                                        </div>
                                    </div>
                                    <Badge variant={user.variant} size="sm">
                                        {user.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Term Overview */}
                    <div className="lg:col-span-1 craft-card p-5 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">Attachment Cycle</h3>
                                <Calendar className="text-violet-400" size={15} />
                            </div>
                            <div className="space-y-2 text-xs">
                                <div>
                                    <p className="text-[10px] uppercase font-medium text-slate-500">Current Academic Term</p>
                                    <p className="text-sm font-semibold text-white mt-0.5">Jan – April 2026</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-medium text-slate-500">Registry Status</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                        <span className="text-emerald-400 font-medium">Active Academic Cycle</span>
                                    </div>
                                </div>
                                <div className="pt-2 space-y-1.5">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-400">Cycle Elapsed</span>
                                        <span className="font-mono text-white">45%</span>
                                    </div>
                                    <div className="w-full bg-[#181a24] h-1.5 rounded-full overflow-hidden border border-[#22242f]">
                                        <div className="bg-violet-500 h-full rounded-full w-[45%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link to="/school_admin/analytics" className="block">
                                <Button variant="secondary" className="w-full text-xs py-2">
                                    Export Regulatory Report
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SchoolAdminDashboard;
