import React, { useState, useEffect } from 'react';
import {
    Building2,
    Search,
    Plus,
    Users,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    X,
    Check,
    Globe,
    ExternalLink
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { LoadingSkeleton } from '../../components/ui';

export default function OrganizationDirectory() {
    const [loading, setLoading] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    // Add Organization Form state
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const loadOrganizations = async () => {
        try {
            setLoading(true);
            const res = await coordinatorApi.getOrganizations({ search: searchTerm }).catch(() => ({ success: false }));
            if (res.success) {
                setOrganizations(res.data || []);
            }
        } catch (error) {
            console.error('Failed to load organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrganizations();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadOrganizations();
    };

    const handleAddOrganization = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        try {
            setSubmitting(true);
            setFeedback(null);
            const res = await coordinatorApi.createOrganization(formData);
            if (res.success) {
                setFeedback({ type: 'success', text: 'Organization registered successfully!' });
                setFormData({
                    name: '',
                    industry: '',
                    address: '',
                    phone: '',
                    email: '',
                    contactPerson: ''
                });
                setTimeout(() => {
                    setModalOpen(false);
                    loadOrganizations();
                }, 800);
            }
        } catch (error) {
            console.error('Failed to create organization:', error);
            setFeedback({
                type: 'error',
                text: error.response?.data?.message || 'Failed to register organization.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const totalOrgs = organizations.length;
    const activeOrgs = organizations.filter(o => (o.activeStudentsCount || 0) > 0).length;
    const totalInternsHosted = organizations.reduce((acc, o) => acc + (o.activeStudentsCount || 0), 0);

    if (loading && organizations.length === 0) {
        return (
            <DashboardLayout role="attachment_coordinator">
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
        <DashboardLayout role="attachment_coordinator">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/05 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10 shrink-0">
                                <Building2 size={32} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold uppercase tracking-wider">
                                        Corporate Partnerships
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-[11px] font-mono">
                                        {totalOrgs} Registered Hosts
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                                    Host Organizations & Industry Directory
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                                    Manage corporate partnerships, vetted internship host sites, contact liaisons, and student placement capacity.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={loadOrganizations}
                                className="px-3.5 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin text-teal-400' : ''} />
                                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                            <button
                                onClick={() => { setFeedback(null); setModalOpen(true); }}
                                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all"
                            >
                                <Plus size={16} />
                                <span>Register Partner</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4-KPI Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Partners</span>
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                                <Building2 size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalOrgs}</span>
                            <span className="text-xs text-slate-500">employers</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>MOU Directory</span>
                            <span className="text-teal-400 font-medium">All active</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Hosting Sites</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Briefcase size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400 font-mono">{activeOrgs}</span>
                            <span className="text-xs text-slate-500">organizations</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Currently hosting interns</span>
                            <span className="text-emerald-400 font-mono font-medium">
                                {totalOrgs > 0 ? `${Math.round((activeOrgs / totalOrgs) * 100)}%` : '0%'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Interns Placed</span>
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-purple-400 font-mono">{totalInternsHosted}</span>
                            <span className="text-xs text-slate-500">interns</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Cohort absorbed</span>
                            <span className="text-purple-400 font-medium">Industry positions</span>
                        </div>
                    </div>

                    <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2a2d3d] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Density</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <MapPin size={16} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-sky-400 font-mono">
                                {activeOrgs > 0 ? (totalInternsHosted / activeOrgs).toFixed(1) : '0'}
                            </span>
                            <span className="text-xs text-slate-500">students / org</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#1e2230] flex items-center justify-between text-[11px] text-slate-400">
                            <span>Capacity distribution</span>
                            <span className="text-sky-400 font-medium">Balanced</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#12141c] border border-[#22242f] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by organization name, sector, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#181a24] border border-[#22242f] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all font-sans"
                        />
                    </form>
                </div>

                {/* Organization Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.length > 0 ? (
                        organizations.map((org) => {
                            const activeStudents = org.activeStudentsCount || 0;

                            return (
                                <div
                                    key={org.id}
                                    className="bg-[#12141c] border border-[#22242f] hover:border-[#2a2d3d] rounded-2xl p-6 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-sm uppercase">
                                                {org.name.charAt(0)}
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                                {org.industry || 'Technology'}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-400 transition-colors">
                                                {org.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                                                <MapPin size={12} className="text-slate-500 shrink-0" />
                                                <span className="truncate">{org.address || 'Address not registered'}</span>
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-[#1e2230] space-y-1.5 text-xs">
                                            {org.email && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Mail size={12} className="text-slate-500 shrink-0" />
                                                    <span className="truncate font-mono text-[11px]">{org.email}</span>
                                                </div>
                                            )}
                                            {org.phone && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Phone size={12} className="text-slate-500 shrink-0" />
                                                    <span className="font-mono text-[11px]">{org.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#1e2230] flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                                            <Users size={14} className="text-teal-400" />
                                            <span className="font-bold">{activeStudents}</span>
                                            <span className="text-slate-500">interns hosted</span>
                                        </div>
                                        <span className="text-teal-400 text-xs font-semibold">Active Partner</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-[#12141c] border border-[#22242f] rounded-2xl p-12 text-center space-y-3">
                            <Building2 size={36} className="mx-auto text-slate-600" />
                            <h3 className="text-base font-bold text-slate-200">No organizations found</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                No employer partner records match your search. Register a new host organization to expand the directory.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Register Partner Organization Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-100">Register Host Organization</h3>
                                <p className="text-xs text-slate-400">Institutional employer partner and internship placement site</p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#181a24]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {feedback && (
                            <div className={`p-3 rounded-xl text-xs font-semibold ${
                                feedback.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                            }`}>
                                {feedback.text}
                            </div>
                        )}

                        <form onSubmit={handleAddOrganization} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Organization / Company Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Acme Technologies Ltd"
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Industry Sector</label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    placeholder="e.g. Software Engineering / Telecommunications"
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Physical Workplace Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="e.g. Technology Park, Block 4"
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Official Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="contact@org.com"
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Telephone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+254 700 000 000"
                                        className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Liaison Contact Person</label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    placeholder="e.g. HR Director / Internship Coordinator"
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2230]">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-[#181a24] hover:bg-[#202330] text-slate-400 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 flex items-center gap-1.5"
                                >
                                    <Check size={14} />
                                    <span>{submitting ? 'Registering...' : 'Register Partner'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
