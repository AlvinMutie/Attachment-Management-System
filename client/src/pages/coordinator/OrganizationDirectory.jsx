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
    X
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

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
            const res = await coordinatorApi.getOrganizations({ search: searchTerm });
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
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to create organization:', error);
            setFeedback({
                type: 'error',
                text: error.response?.data?.message || 'Failed to register organization'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-violet-600/15 border border-violet-500/25 rounded-lg flex items-center justify-center text-violet-300">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Institutional Partners</span>
                        <h1 className="text-xl font-semibold text-white tracking-tight">
                            Host Organizations & Industry Directory
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Accredited industry host companies, verified internship sites, and active student quotas.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="secondary"
                        onClick={loadOrganizations}
                        className="flex items-center gap-1.5 text-xs py-1.5 px-3"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Refresh</span>
                    </Button>
                    <Button
                        onClick={() => {
                            setFeedback(null);
                            setModalOpen(true);
                        }}
                        className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Organization</span>
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#22242f]">
                <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                    <input
                        placeholder="Search company or industry sector..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#181a24] border border-[#22242f] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 font-sans"
                    />
                </form>

                <div className="text-xs text-slate-400">
                    <span className="font-mono text-white font-medium">{organizations.length}</span> Partner Organizations
                </div>
            </div>

            {/* Organizations Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <LoadingSkeleton key={i} className="h-40 rounded-lg" />
                    ))}
                </div>
            ) : organizations.length === 0 ? (
                <div className="craft-card p-10 text-center space-y-1.5">
                    <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-1 opacity-70" />
                    <h3 className="text-xs font-semibold text-white">No organizations found</h3>
                    <p className="text-[11px] text-slate-400">Click "Add Organization" to register a host company.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {organizations.map(org => (
                        <div key={org.id} className="craft-card p-4 flex flex-col justify-between space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">{org.name}</h3>
                                        <Badge variant="indigo" size="sm" className="mt-1">
                                            {org.industry || 'General Industry'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 bg-[#181a24] text-slate-300 border border-[#22242f] px-2 py-0.5 rounded text-[11px] font-medium">
                                        <Users className="w-3 h-3 text-violet-400" />
                                        <span>{org.activeInternsCount || 0} Interns</span>
                                    </div>
                                </div>

                                <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-[#22242f]">
                                    {org.contactPerson && (
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                                            <span>Contact: {org.contactPerson}</span>
                                        </div>
                                    )}
                                    {org.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                                            <span>{org.phone}</span>
                                        </div>
                                    )}
                                    {org.email && (
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                                            <span>{org.email}</span>
                                        </div>
                                    )}
                                    {org.address && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                            <span className="truncate">{org.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Organization Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-2 border-b border-[#22242f]">
                            <h3 className="text-sm font-semibold text-white">Register Host Organization</h3>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                                <X size={15} />
                            </button>
                        </div>

                        <form onSubmit={handleAddOrganization} className="space-y-3 text-xs">
                            {feedback && (
                                <div className={`p-2.5 rounded-md flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'}`}>
                                    {feedback.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                                    <span>{feedback.text}</span>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">
                                    Company / Organization Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Safaricom PLC"
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Industry Sector</label>
                                <input
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    placeholder="e.g. Software, Banking, Telecommunications"
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Physical Location</label>
                                <input
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="e.g. Westlands, Nairobi"
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300">Phone</label>
                                    <input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+254 700 000000"
                                        className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-300">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="hr@company.com"
                                        className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">Contact Person</label>
                                <input
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    placeholder="e.g. Jane Doe (HR Director)"
                                    className="w-full p-2 rounded-md bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22242f]">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setModalOpen(false)}
                                    className="text-xs py-1.5 px-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting || !formData.name.trim()}
                                    className="text-xs py-1.5 px-3"
                                >
                                    {submitting ? 'Registering...' : 'Register Organization'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
