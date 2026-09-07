import React, { useState, useEffect } from 'react';
import {
    Users,
    UserCheck,
    AlertTriangle,
    CheckCircle2,
    BookOpen,
    MapPin,
    Search,
    RefreshCw,
    TrendingUp,
    Shield
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Card, Badge, Button, Input, LoadingSkeleton } from '../../components/ui';

export default function SupervisorWorkload() {
    const [loading, setLoading] = useState(true);
    const [supervisors, setSupervisors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const loadSupervisors = async () => {
        try {
            setLoading(true);
            const res = await coordinatorApi.getSupervisors();
            if (res.success) {
                setSupervisors(res.data || []);
            }
        } catch (error) {
            console.error('Failed to load supervisor workload:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSupervisors();
    }, []);

    const filtered = supervisors.filter(s => {
        if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (s.name && s.name.toLowerCase().includes(term)) ||
                   (s.email && s.email.toLowerCase().includes(term));
        }
        return true;
    });

    const totalSupervisors = supervisors.length;
    const uniSupervisors = supervisors.filter(s => s.role === 'university_supervisor').length;
    const industrySupervisors = supervisors.filter(s => s.role === 'industry_supervisor').length;
    const totalAssignments = supervisors.reduce((acc, s) => acc + (s.assignedStudentsCount || 0), 0);
    const avgRatio = totalSupervisors > 0 ? (totalAssignments / totalSupervisors).toFixed(1) : 0;

    const getCapacityBadge = (status) => {
        switch (status) {
            case 'high':
                return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">High Load (≥15)</Badge>;
            case 'moderate':
                return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Moderate (8-14)</Badge>;
            default:
                return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Optimal (&lt;8)</Badge>;
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        Supervisor Workload & Capacity Management
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Monitor academic and industry supervisor allocations, capacity saturation, and pending responsibilities.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadSupervisors}
                    className="flex items-center gap-2 self-start md:self-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Matrix
                </Button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Supervisors</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalSupervisors}</p>
                    <p className="text-xs text-slate-500 mt-1">{uniSupervisors} University | {industrySupervisors} Industry</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Pairings</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{totalAssignments}</p>
                    <p className="text-xs text-slate-500 mt-1">Supervision allocations</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Cohort Ratio</p>
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">{avgRatio} : 1</p>
                    <p className="text-xs text-slate-500 mt-1">Students per supervisor</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Saturation Alerts</p>
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                        {supervisors.filter(s => s.capacityStatus === 'high').length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Supervisors exceeding threshold</p>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                    {['ALL', 'university_supervisor', 'industry_supervisor'].map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                roleFilter === role
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                        >
                            {role === 'ALL' ? 'All Roles' : role === 'university_supervisor' ? 'University Supervisors' : 'Industry Supervisors'}
                        </button>
                    ))}
                </div>

                <div className="w-full sm:w-64">
                    <Input
                        placeholder="Search supervisor name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-xs"
                    />
                </div>
            </div>

            {/* Workload Table */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <LoadingSkeleton key={i} className="h-16 rounded-xl" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <Card className="p-12 text-center border border-dashed">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No supervisors found</h3>
                    <p className="text-xs text-slate-500 mt-1">Try changing search filters.</p>
                </Card>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Supervisor</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-center">Assigned Students</th>
                                    <th className="p-4 text-center">Active Attachments</th>
                                    <th className="p-4 text-center">Pending Logbooks</th>
                                    <th className="p-4 text-center">Completed Assessments</th>
                                    <th className="p-4 text-center">Pending Visits</th>
                                    <th className="p-4 text-right">Capacity Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                {filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">{s.name}</div>
                                            <div className="text-[11px] text-slate-500">{s.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className={s.role === 'university_supervisor' ? 'border-purple-300 text-purple-700 dark:text-purple-300' : 'border-emerald-300 text-emerald-700 dark:text-emerald-300'}>
                                                {s.role === 'university_supervisor' ? 'University' : 'Industry'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-center font-bold text-slate-900 dark:text-white">
                                            {s.assignedStudentsCount || 0}
                                        </td>
                                        <td className="p-4 text-center text-emerald-600 font-semibold">
                                            {s.activeStudentsCount || 0}
                                        </td>
                                        <td className="p-4 text-center text-amber-600 font-semibold">
                                            {s.pendingLogbooksCount || 0}
                                        </td>
                                        <td className="p-4 text-center text-blue-600 font-semibold">
                                            {s.completedAssessmentsCount || 0}
                                        </td>
                                        <td className="p-4 text-center text-purple-600 font-semibold">
                                            {s.pendingSupervisionCount || 0}
                                        </td>
                                        <td className="p-4 text-right">
                                            {getCapacityBadge(s.capacityStatus)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
