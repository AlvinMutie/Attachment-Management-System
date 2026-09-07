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
    CheckCircle2
} from 'lucide-react';
import { coordinatorApi } from '../../utils/coordinatorApi';
import { Card, Badge, Button, Input, Modal, LoadingSkeleton } from '../../components/ui';

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
                }, 1200);
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
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                        Host Organizations & Industry Partners
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Directory of accredited industry host companies, verified internship sites, and contact persons.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={loadOrganizations}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => {
                            setFeedback(null);
                            setModalOpen(true);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Organization
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
                    <Input
                        placeholder="Search company name, industry sector..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-xs"
                    />
                    <Button type="submit" size="sm" variant="outline">
                        <Search className="w-4 h-4" />
                    </Button>
                </form>

                <div className="text-xs font-semibold text-slate-500">
                    {organizations.length} Partner Organizations
                </div>
            </div>

            {/* Organizations Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <LoadingSkeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            ) : organizations.length === 0 ? (
                <Card className="p-12 text-center border border-dashed">
                    <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No organizations found</h3>
                    <p className="text-xs text-slate-500 mt-1">Click "Add Organization" to register a host company.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map(org => (
                        <Card key={org.id} className="p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-teal-500/50 transition flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base">{org.name}</h3>
                                        <Badge variant="outline" className="mt-1 text-[10px] border-teal-300 text-teal-700 dark:text-teal-300">
                                            {org.industry || 'General Industry'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-md text-xs font-semibold">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{org.activeInternsCount || 0} Interns</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    {org.contactPerson && (
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>Contact: {org.contactPerson}</span>
                                        </div>
                                    )}
                                    {org.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{org.phone}</span>
                                        </div>
                                    )}
                                    {org.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{org.email}</span>
                                        </div>
                                    )}
                                    {org.address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{org.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Organization Modal */}
            {modalOpen && (
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Register Host Organization"
                    maxWidth="max-w-md"
                >
                    <form onSubmit={handleAddOrganization} className="space-y-4 text-xs">
                        {feedback && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                <span>{feedback.text}</span>
                            </div>
                        )}

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Company / Organization Name <span className="text-rose-500">*</span>
                            </label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Acme Corporation Ltd"
                                className="text-xs"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Industry Sector
                            </label>
                            <Input
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                placeholder="e.g. Software Engineering, Telecommunications, Banking"
                                className="text-xs"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Physical Address / Office Location
                            </label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="e.g. 45 Tech Avenue, Westlands"
                                className="text-xs"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Contact Phone
                                </label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+254 700 000000"
                                    className="text-xs"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Contact Email
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="hr@company.com"
                                    className="text-xs"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Primary Contact Person
                            </label>
                            <Input
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                placeholder="e.g. Jane Doe (HR Director)"
                                className="text-xs"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting || !formData.name.trim()}
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                                {submitting ? 'Registering...' : 'Register Organization'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
