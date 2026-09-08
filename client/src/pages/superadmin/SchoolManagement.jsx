import { useEffect, useState } from 'react';
import {
    Search, Plus, Edit3, Lock, Unlock,
    Building2, Filter, ChevronLeft,
    ChevronRight, X, Globe
} from 'lucide-react';
import {
    getSchools, createSchool, updateSchool
} from '../../utils/superadminApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const CreateSchoolModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        contactEmail: '',
        address: '',
        primaryColor: '#7c3aed',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [uploadMode, setUploadMode] = useState('file');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (uploadMode === 'file' && logoFile) data.append('logoFile', logoFile);

            await createSchool(data);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-5 border-b border-[#22242f] bg-[#12141c] flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-100 tracking-tight">Register Institution</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Add a new university or school node to the system</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#12141c] border border-[#22242f] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {logoPreview || (uploadMode === 'url' && formData.logo) ? (
                                <img src={uploadMode === 'file' ? logoPreview : formData.logo} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 size={24} className="text-slate-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Institution Logo</label>
                            <div className="flex gap-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setUploadMode('file')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${uploadMode === 'file' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}
                                >
                                    Upload File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadMode('url')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${uploadMode === 'url' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}
                                >
                                    Image URL
                                </button>
                            </div>
                            {uploadMode === 'file' ? (
                                <input type="file" onChange={handleFileChange} className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-violet-500/10 file:text-violet-400 hover:file:bg-violet-500/20" />
                            ) : (
                                <input type="url" placeholder="Paste image URL here" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Institution Name</label>
                            <input type="text" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact Email</label>
                            <input type="email" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} required />
                        </div>
                    </div>

                    <div className="border-t border-[#22242f] pt-4 mt-2">
                        <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3">Primary Administrator</p>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                                <input type="text" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.adminName} onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Admin Email</label>
                                    <input type="email" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.adminEmail} onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Initial Password</label>
                                    <input type="password" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.adminPassword} onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2 border-t border-[#22242f]">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Register Institution</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditSchoolModal = ({ school, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: school?.name || '',
        logo: school?.logo || '',
        contactEmail: school?.contactEmail || '',
        address: school?.address || '',
        primaryColor: school?.primaryColor || '#7c3aed'
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(school?.logo ? (school.logo.startsWith('http') ? school.logo : `http://localhost:5000${school.logo}`) : '');
    const [uploadMode, setUploadMode] = useState('file');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (uploadMode === 'file' && logoFile) data.append('logoFile', logoFile);

            await updateSchool(school.id, data);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Update failed:', error);
            alert('Update failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-5 border-b border-[#22242f] bg-[#12141c] flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-slate-100 tracking-tight">Edit Institution</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Update registry details for {school?.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#12141c] border border-[#22242f] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {logoPreview || (uploadMode === 'url' && formData.logo) ? (
                                <img src={uploadMode === 'file' ? logoPreview : formData.logo} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 size={24} className="text-slate-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Logo</label>
                            <div className="flex gap-2 mb-2">
                                <button type="button" onClick={() => setUploadMode('file')} className={`px-3 py-1 rounded text-xs font-medium ${uploadMode === 'file' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}>File</button>
                                <button type="button" onClick={() => setUploadMode('url')} className={`px-3 py-1 rounded text-xs font-medium ${uploadMode === 'url' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}>URL</button>
                            </div>
                            {uploadMode === 'file' ? (
                                <input type="file" onChange={handleFileChange} className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-violet-500/10 file:text-violet-400" />
                            ) : (
                                <input type="url" placeholder="Logo URL" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Institution Name</label>
                        <input type="text" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Contact Email</label>
                        <input type="email" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} required />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Campus Address</label>
                        <input type="text" className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </div>

                    <div className="pt-4 flex justify-end gap-2 border-t border-[#22242f]">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SchoolManagement = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const response = await getSchools({
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
                status: statusFilter
            });
            setSchools(response.data.schools);
            setPagination(prev => ({ ...prev, ...response.data.pagination }));
        } catch (error) {
            console.error('Failed to fetch schools:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, [searchTerm, statusFilter, pagination.page]);

    const handleToggleStatus = async (school) => {
        try {
            const newStatus = school.status === 'active' ? 'suspended' : 'active';
            await updateSchool(school.id, { status: newStatus });
            fetchSchools();
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">Institutional Governance</span>
                            <span className="text-xs text-slate-400">Total: {pagination.total}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">School Registry</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Manage partner institutions, admin delegates, and platform enrollment status.</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="primary"
                    icon={Plus}
                >
                    Register Institution
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                    <input
                        type="text"
                        placeholder="Search by institution name or admin email..."
                        className="w-full bg-[#12141c] border border-[#22242f] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        className="bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#15171f] border border-[#22242f] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#12141c] border-b border-[#22242f]">
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Institution</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Root Admin</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">Students</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#22242f]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-5 py-4"><div className="h-4 bg-[#181a24] rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : schools.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-8 text-center text-xs text-slate-400">
                                        No institutions found in registry.
                                    </td>
                                </tr>
                            ) : (
                                schools.map((school) => (
                                    <tr key={school.id} className="hover:bg-[#181a24]/50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-[#181a24] border border-[#22242f] overflow-hidden flex items-center justify-center">
                                                    {school.logo ? (
                                                        <img src={school.logo.startsWith('http') ? school.logo : `http://localhost:5000${school.logo}`} alt={school.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="text-slate-500" size={16} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-slate-200">{school.name}</div>
                                                    <div className="text-[10px] font-mono text-slate-500">#{school.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="text-xs text-slate-300">{school.adminEmail}</div>
                                            <div className="text-[10px] text-slate-500">Primary Administrator</div>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className="text-xs font-semibold text-slate-200">{school.studentCount || 0}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge variant={school.status === 'active' ? 'success' : 'danger'}>
                                                {school.status}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => { setSelectedSchool(school); setIsEditModalOpen(true); }}
                                                    className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-colors"
                                                    title="Edit Institution"
                                                >
                                                    <Edit3 size={15} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(school)}
                                                    className={`p-1.5 rounded-md transition-colors ${school.status === 'active' ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                                                    title={school.status === 'active' ? 'Suspend Institution' : 'Activate Institution'}
                                                >
                                                    {school.status === 'active' ? <Lock size={15} /> : <Unlock size={15} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-[#12141c] flex items-center justify-between border-t border-[#22242f] text-xs text-slate-400">
                    <div>
                        Total institutions: <span className="font-semibold text-slate-200">{pagination.total}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            icon={ChevronLeft}
                        >
                            Previous
                        </Button>
                        <span className="px-3 py-1 bg-[#15171f] border border-[#22242f] rounded text-xs font-semibold text-slate-300">
                            {pagination.page} / {pagination.totalPages || 1}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            icon={ChevronRight}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isCreateModalOpen && <CreateSchoolModal onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchSchools} />}
            {isEditModalOpen && <EditSchoolModal school={selectedSchool} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchSchools} />}
        </div>
    );
};

export default SchoolManagement;
