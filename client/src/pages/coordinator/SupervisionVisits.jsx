import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Calendar,
    Clock,
    User,
    Building2,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Search
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Card, Badge, Button, LoadingSkeleton } from '../../components/ui';

export default function SupervisionVisits() {
    const [loading, setLoading] = useState(true);
    const [supervisionData, setSupervisionData] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await coordinatorApi.getSupervisionOversight();
            if (res.success) {
                setSupervisionData(res.data);
            }
        } catch (error) {
            console.error('Failed to load supervision visits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const summary = supervisionData?.summary || {};
    const meetings = supervisionData?.meetings || [];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
            case 'confirmed':
                return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Conducted</Badge>;
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Pending</Badge>;
            case 'cancelled':
                return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">Cancelled</Badge>;
            default:
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        Academic Supervision & On-Site Visits
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track mandatory institutional site visits, supervisor-intern consultations, and verification meetings.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadData}
                    className="flex items-center gap-2 self-start md:self-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Supervision Visits</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{summary.total || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Scheduled or conducted</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Visits</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{summary.upcomingCount || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Scheduled for future dates</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed / Verified</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{summary.completedCount || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Successfully conducted</p>
                </Card>

                <Card className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending / Overdue</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{summary.pendingCount || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Awaiting confirmation</p>
                </Card>
            </div>

            {/* Visits Table */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <LoadingSkeleton key={i} className="h-16 rounded-xl" />
                    ))}
                </div>
            ) : meetings.length === 0 ? (
                <Card className="p-12 text-center border border-dashed">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No supervision visits scheduled</h3>
                    <p className="text-xs text-slate-500 mt-1">Supervision visits initiated by university supervisors will appear here.</p>
                </Card>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Initiating Supervisor</th>
                                    <th className="p-4">Industry Supervisor</th>
                                    <th className="p-4">Scheduled Time</th>
                                    <th className="p-4">Venue / Link</th>
                                    <th className="p-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                {meetings.map(m => (
                                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">{m.student?.user?.name || 'Student'}</div>
                                            <div className="text-[11px] text-slate-500">{m.student?.admissionNumber}</div>
                                        </td>
                                        <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                                            {m.initiator?.name || 'University Supervisor'}
                                        </td>
                                        <td className="p-4">
                                            {m.industrySupervisor?.name || 'Industry Supervisor'}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                {m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : '—'}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {m.scheduledAt ? new Date(m.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {m.venue || 'On-site workplace'}
                                        </td>
                                        <td className="p-4 text-right">
                                            {getStatusBadge(m.status)}
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
