import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Ban, CheckCircle, Users as UsersIcon, Shield, Globe, Mail, MapPin, School, Upload, Link } from 'lucide-react';
import { getSchools, createSchool, updateSchool, toggleSchoolStatus } from '../../utils/superadminApi';

const SchoolManagement = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });

    useEffect(() => {
        fetchSchools();
    }, [searchTerm, statusFilter, pagination.page]);

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

    const handleToggleStatus = async (school) => {
        const newStatus = school.status === 'active' ? 'suspended' : 'active';
        if (confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} ${school.name}?`)) {
            try {
                await toggleSchoolStatus(school.id, newStatus);
                fetchSchools();
            } catch (error) {
                alert('Failed to update school status');
            }
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            suspended: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            trial: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        };
        return (
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-indigo-600/5 p-10 rounded-m3-xl border border-indigo-600/10 backdrop-blur-md animate-fade-in">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 ring-1 ring-white/20">
                        <School size={44} className="text-white" />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400 opacity-70">Governance Layer</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Institution <span className="text-indigo-500">Registry</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">Scale and manage global academic nodes and institutional compliance.</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary px-10 py-4 group !rounded-2xl"
                >
                    <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Onboard Node</span>
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, ID or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field appearance-none cursor-pointer"
                    >
                        <option value="">Status: All Nodes</option>
                        <option value="active">Nodes: Active</option>
                        <option value="suspended">Nodes: Suspended</option>
                        <option value="trial">Nodes: Trial</option>
                    </select>
                </div>
            </div>

            {/* Schools Table */}
            <div className="glass-card !rounded-m3-xl overflow-hidden border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institution</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Network Info</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">State</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Capacity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {schools.map((school) => (
                                    <tr key={school.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform overflow-hidden">
                                                    {school.logo ? (
                                                        <img
                                                            src={school.logo.startsWith('http') ? school.logo : `http://localhost:5000${school.logo}`}
                                                            alt={school.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <School size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white tracking-tight">{school.name}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                                                        <MapPin size={10} className="text-indigo-500" />
                                                        {school.address || "No HQ Address Registered"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-300 font-medium">
                                                <Mail size={14} className="text-slate-500" />
                                                {school.contactEmail}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(school.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center z-10">
                                                        <UsersIcon size={12} className="text-white" />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-white tracking-tight">{school.userCount || 0}</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-black">Active</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSchool(school);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20"
                                                    title="Modify Record"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(school)}
                                                    className={`p-2 rounded-lg transition-all border ${school.status === 'active'
                                                        ? 'bg-rose-600/10 text-rose-400 border-rose-500/20 hover:bg-rose-600 hover:text-white'
                                                        : 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                                                        }`}
                                                    title={school.status === 'active' ? 'Revoke Access' : 'Restore Access'}
                                                >
                                                    {school.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && schools.length > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Registry Index: {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} OF {pagination.total} NODES
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="px-6 py-2 glass-card rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="px-6 py-2 glass-card rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/10 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showCreateModal && <CreateSchoolModal onClose={() => setShowCreateModal(false)} onSuccess={fetchSchools} />}
            {showEditModal && <EditSchoolModal school={selectedSchool} onClose={() => setShowEditModal(false)} onSuccess={fetchSchools} />}
        </div>
    );
};

// Simplified modal components with premium styling
const CreateSchoolModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        contactEmail: '',
        address: '',
        primaryColor: '#2563eb', // Default to platform blue
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'

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
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (uploadMode === 'file' && logoFile) {
                data.append('logoFile', logoFile);
            }

            await createSchool(data);
            alert('Institution successfully registered');
            onSuccess();
            onClose();
        } catch (error) {
            alert('Registration protocol failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="glass-card w-full max-w-2xl animate-fade-in border-indigo-500/20 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-1 ring-white/20">
                            <Plus className="text-white" size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Onboard Institution</h2>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Deploy primary node</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                    {/* Section 1: Institutional Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Institutional Identity</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-32 space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Logo Preview</label>
                                <div className="w-32 h-32 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group relative">
                                    {(uploadMode === 'file' && logoPreview) || (uploadMode === 'url' && formData.logo) ? (
                                        <img src={uploadMode === 'file' ? logoPreview : formData.logo} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Globe size={24} className="text-slate-700" />
                                            <span className="text-[8px] font-black text-slate-700 uppercase">NO LOGO</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('file')}
                                        className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${uploadMode === 'file' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                    >
                                        <Upload size={14} />
                                        Upload File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('url')}
                                        className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${uploadMode === 'url' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                    >
                                        <Link size={14} />
                                        Image URL
                                    </button>
                                </div>

                                {uploadMode === 'file' ? (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Branding Asset</label>
                                        <label className="input-field flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all border-dashed border-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Upload size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{logoFile ? logoFile.name : 'Select Image File'}</span>
                                            </div>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Branding Asset (Logo URL)</label>
                                        <div className="relative">
                                            <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="url"
                                                placeholder="https://example.com/logo.png"
                                                value={formData.logo}
                                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                                className="input-field pl-12"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Institution Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Modern University of Technology"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Brand Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, primaryColor: color })}
                                            className={`w-10 h-10 rounded-xl border-2 transition-all ${formData.primaryColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={formData.primaryColor}
                                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                            className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-white/10 cursor-pointer overflow-hidden opacity-0 absolute inset-0 z-10"
                                        />
                                        <div
                                            className="w-10 h-10 rounded-xl border-2 border-white/10 flex items-center justify-center bg-slate-800 text-white/50 text-[10px] font-bold"
                                            style={{ borderColor: !['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].includes(formData.primaryColor) ? 'white' : 'transparent' }}
                                        >
                                            HEX
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <input
                                            type="text"
                                            value={formData.primaryColor}
                                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                            className="input-field text-xs font-mono uppercase"
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
                                <input
                                    type="email"
                                    placeholder="contact@school.edu"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">HQ Physical Address</label>
                                <input
                                    type="text"
                                    placeholder="City, Region, Country"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Access Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Access Management</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Root Administrator Name</label>
                                <input
                                    type="text"
                                    placeholder="Full Legal Name"
                                    value={formData.adminName}
                                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Network ID (Email)</label>
                                    <input
                                        type="email"
                                        placeholder="admin@school.edu"
                                        value={formData.adminEmail}
                                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Secret (Password)</label>
                                    <input
                                        type="password"
                                        placeholder="Create Secure Secret"
                                        value={formData.adminPassword}
                                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex gap-4">
                    <button onClick={handleSubmit} className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest">
                        Deploy Institution
                    </button>
                    <button onClick={onClose} className="px-8 py-4 glass-card rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        Abort Protocol
                    </button>
                </div>
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
        primaryColor: school?.primaryColor || '#2563eb'
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
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (uploadMode === 'file' && logoFile) {
                data.append('logoFile', logoFile);
            }

            await updateSchool(school.id, data);
            alert('Institution records updated');
            onSuccess();
            onClose();
        } catch (error) {
            alert('Update protocol failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="glass-card p-10 w-full max-w-xl animate-fade-in border-indigo-500/20 shadow-indigo-500/10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20 ring-1 ring-white/20">
                        <Edit className="text-white" size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Modify Node</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Update registry data</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                            {logoPreview || (uploadMode === 'url' && formData.logo) ? (
                                <img src={uploadMode === 'file' ? logoPreview : formData.logo} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <School size={32} className="text-slate-700" />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setUploadMode('file')}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${uploadMode === 'file' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                        >
                            <Upload size={14} />
                            Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setUploadMode('url')}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${uploadMode === 'url' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                        >
                            <Link size={14} />
                            Image URL
                        </button>
                    </div>

                    {uploadMode === 'file' ? (
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload New Logo</label>
                            <label className="input-field flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all border-dashed border-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Upload size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{logoFile ? logoFile.name : 'Select New Image'}</span>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo URL</label>
                                <div className="relative">
                                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="url"
                                        placeholder="Logo URL"
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        className="input-field pl-12"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
                            <input
                                type="text"
                                placeholder="Institution Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Brand Color</label>
                            <div className="flex flex-wrap gap-2">
                                {['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, primaryColor: color })}
                                        className={`w-8 h-8 rounded-lg border-2 transition-all ${formData.primaryColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <input
                                    type="text"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    className="input-field text-[10px] font-mono uppercase h-8 py-0 px-2 flex-1"
                                    placeholder="#HEX"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                        <input
                            type="email"
                            placeholder="Official Email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">HQ Address</label>
                        <input
                            type="text"
                            placeholder="HQ Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div className="flex gap-4 pt-6">
                        <button type="submit" className="btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest">
                            Update Registry
                        </button>
                        <button type="button" onClick={onClose} className="px-8 py-4 glass-card rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            Abort
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SchoolManagement;
