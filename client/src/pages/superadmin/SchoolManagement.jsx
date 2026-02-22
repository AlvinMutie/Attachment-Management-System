import { useEffect, useState } from 'react';
import {
    Search, Plus, Edit3, Lock, Unlock, Users,
    Building2, Upload, Link, Filter, ChevronLeft,
    ChevronRight, X, Globe, Mail
} from 'lucide-react';
import {
    getSchools, createSchool, updateSchool,
    toggleSchoolStatus
} from '../../utils/superadminApi';

const CreateSchoolModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        contactEmail: '',
        address: '',
        primaryColor: '#3b82f6',
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="glass-card w-full max-w-2xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Plus className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Register Institution</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Add new academic node</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Logo Upload */}
                        <div className="col-span-full flex items-start space-x-6">
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center overflow-hidden">
                                {logoPreview || (uploadMode === 'url' && formData.logo) ? (
                                    <img src={uploadMode === 'file' ? logoPreview : formData.logo} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Globe size={32} className="text-slate-700" />
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institutional Logo</p>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('file')}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${uploadMode === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                                    >
                                        Upload File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMode('url')}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${uploadMode === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                                    >
                                        Logo URL
                                    </button>
                                </div>
                                {uploadMode === 'file' ? (
                                    <input type="file" onChange={handleFileChange} className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20" />
                                ) : (
                                    <input type="url" placeholder="Paste image URL here" className="input-field text-xs" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} />
                                )}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Institution Name</label>
                            <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Contact Email</label>
                            <input type="email" className="input-field" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} required />
                        </div>

                        {/* Admin Account */}
                        <div className="col-span-full border-t border-white/5 pt-8">
                            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-6">Primary Administrator</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
                                    <input type="text" className="input-field" value={formData.adminName} onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} required />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Admin Email</label>
                                    <input type="email" className="input-field" value={formData.adminEmail} onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} required />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Initial Password</label>
                                    <input type="password" className="input-field" value={formData.adminPassword} onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })} required />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end space-x-4">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all">Cancel</button>
                    <button onClick={handleSubmit} className="btn-primary">Register Institution</button>
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
        primaryColor: school?.primaryColor || '#3b82f6'
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="glass-card w-full max-w-xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Edit3 className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Edit Institution</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Update registry profile</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                            {logoPreview || (uploadMode === 'url' && formData.logo) ? (
                                <img src={uploadMode === 'file' ? logoPreview : formData.logo} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 size={32} className="text-slate-700" />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4 mb-6">
                        <button type="button" onClick={() => setUploadMode('file')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${uploadMode === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>File</button>
                        <button type="button" onClick={() => setUploadMode('url')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${uploadMode === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>URL</button>
                    </div>

                    {uploadMode === 'file' ? (
                        <input type="file" onChange={handleFileChange} className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20" />
                    ) : (
                        <input type="url" placeholder="Logo URL" className="input-field" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} />
                    )}

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Institution Name</label>
                        <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Contact Email</label>
                        <input type="email" className="input-field" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} required />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">HQ Address</label>
                        <input type="text" className="input-field" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                </form>

                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end space-x-4">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all">Abort</button>
                    <button onClick={handleSubmit} className="btn-primary">Update Profile</button>
                </div>
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
        <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">School <span className="text-blue-500">Registry</span></h1>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Manage institutional accounts and system access.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary"
                >
                    <Plus size={18} />
                    <span>Register Institution</span>
                </button>
            </header>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by institution name or admin email..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <Filter className="text-slate-500" size={18} />
                    <select
                        className="input-field text-xs font-bold uppercase tracking-widest"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institution Details</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Students</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-6"><div className="h-4 bg-slate-800 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : (
                                schools.map((school) => (
                                    <tr key={school.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/5 overflow-hidden flex items-center justify-center">
                                                    {school.logo ? (
                                                        <img src={school.logo.startsWith('http') ? school.logo : `http://localhost:5000${school.logo}`} alt={school.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="text-slate-500" size={18} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white uppercase tracking-tight">{school.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-medium">ID: {school.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-300 font-medium">{school.adminEmail}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Root Administrator</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm font-bold text-white">{school.studentCount || 0}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Enrolled</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${school.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {school.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => { setSelectedSchool(school); setIsEditModalOpen(true); }}
                                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-all"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(school)}
                                                    className={`p-2 rounded-lg transition-all ${school.status === 'active' ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-600/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-600/10'}`}
                                                >
                                                    {school.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
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
                <div className="p-6 bg-slate-900/30 flex items-center justify-between border-t border-white/5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Total Registry Records: <span className="text-white">{pagination.total}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-xs font-bold text-blue-400">
                            {pagination.page} / {pagination.totalPages}
                        </div>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
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
