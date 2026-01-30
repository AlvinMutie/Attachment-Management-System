import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Lock,
    School as SchoolIcon,
    Building,
    CheckCircle2,
    Settings,
    LogOut,
    Shield,
    Globe,
    ImageIcon,
    MapPin,
    Upload,
    Link
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth, applyTheme } from '../../context/AuthContext';
import { getMySchool, updateMySchool } from '../../utils/schoolApi';

const AdminProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [schoolData, setSchoolData] = useState({
        name: '',
        address: '',
        contactEmail: '',
        primaryColor: '#2563eb'
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'

    useEffect(() => {
        fetchSchool();
    }, []);

    const fetchSchool = async () => {
        try {
            setLoading(true);
            const response = await getMySchool();
            setSchoolData(response.data);
            if (response.data.logo) {
                setLogoPreview(response.data.logo.startsWith('http') ? response.data.logo : `http://localhost:5000${response.data.logo}`);
            }
        } catch (error) {
            console.error('Failed to fetch school data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            Object.keys(schoolData).forEach(key => {
                data.append(key, schoolData[key]);
            });
            if (uploadMode === 'file' && logoFile) {
                data.append('logoFile', logoFile);
            }

            await updateMySchool(data);
            setIsEditing(false);
            alert('Institutional branding updated successfully');
            if (schoolData.primaryColor) {
                applyTheme(schoolData.primaryColor);
            }
            fetchSchool(); // Refresh data to get the new logo path
        } catch (error) {
            alert('Failed to update institutional data');
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="school_admin">
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-8 animate-fade-in">
                {/* Header / Identity */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-600/10 to-transparent p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform overflow-hidden">
                            {logoPreview ? (
                                <img src={logoPreview} alt={schoolData.name} className="w-full h-full object-cover" />
                            ) : (
                                <SchoolIcon className="text-blue-500" size={64} />
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="text-white" size={16} />
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter">{user?.name}</h1>
                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg shadow-blue-600/20">
                                Institution Administrator
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">{schoolData.name} • {schoolData.address || 'Main Campus'}</p>
                        <div className="flex wrap gap-4 pt-2">
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Globe size={14} className="text-blue-500" />
                                <span>Global Sync Active</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Shield size={14} className="text-purple-500" />
                                <span>Primary Admin Representative</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:ml-auto">
                        <button
                            className={`btn-primary px-8 ${isEditing ? 'bg-emerald-600 shadow-emerald-900/40 hover:bg-emerald-500' : ''}`}
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        >
                            {isEditing ? 'Save All Changes' : 'Modify Settings'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Admin Detail & Institutional Data */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-8 space-y-6">
                            <h3 className="text-lg font-black text-white flex items-center space-x-2 uppercase tracking-widest text-[10px]">
                                <Building className="text-blue-500" size={18} />
                                <span>Institutional Identity</span>
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Institutional Logo</label>
                                    <div className="w-full aspect-video rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner relative group">
                                        {logoPreview || (uploadMode === 'url' && schoolData.logo) ? (
                                            <img src={(uploadMode === 'file' && logoPreview) ? logoPreview : (schoolData.logo.startsWith('http') ? schoolData.logo : `http://localhost:5000${schoolData.logo}`)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <ImageIcon size={32} className="text-slate-700" />
                                                <span className="text-[10px] font-black text-slate-700 uppercase">NO LOGO REGISTERED</span>
                                            </div>
                                        )}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                                                <p className="text-[10px] font-black uppercase text-white tracking-widest leading-relaxed">Modify branding asset below</p>
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadMode('file')}
                                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${uploadMode === 'file' ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                                >
                                                    <Upload size={14} />
                                                    File
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadMode('url')}
                                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${uploadMode === 'url' ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                                >
                                                    <Link size={14} />
                                                    URL
                                                </button>
                                            </div>

                                            {uploadMode === 'file' ? (
                                                <label className="input-field flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all border-dashed border-2 py-3">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Upload size={14} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{logoFile ? logoFile.name : 'Choose Logo File'}</span>
                                                    </div>
                                                </label>
                                            ) : (
                                                <div className="relative">
                                                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                    <input
                                                        type="url"
                                                        className="input-field pl-12 text-xs"
                                                        placeholder="Logo URL (e.g. https://...)"
                                                        value={schoolData.logo}
                                                        onChange={(e) => setSchoolData({ ...schoolData, logo: e.target.value })}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2 pt-2">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand Accent</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                                                        <button
                                                            key={color}
                                                            type="button"
                                                            onClick={() => setSchoolData({ ...schoolData, primaryColor: color })}
                                                            className={`w-6 h-6 rounded-md border-2 transition-all ${schoolData.primaryColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                    <input
                                                        type="text"
                                                        value={schoolData.primaryColor}
                                                        onChange={(e) => setSchoolData({ ...schoolData, primaryColor: e.target.value })}
                                                        className="input-field text-[9px] font-mono uppercase h-6 py-0 px-2 flex-1"
                                                        placeholder="#HEX"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity Name</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="input-field text-sm"
                                                value={schoolData.name}
                                                onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-white">{schoolData.name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Point</p>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                className="input-field text-sm"
                                                value={schoolData.contactEmail}
                                                onChange={(e) => setSchoolData({ ...schoolData, contactEmail: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-slate-300">{schoolData.contactEmail}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Operations</p>
                                        {isEditing ? (
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input
                                                    type="text"
                                                    className="input-field pl-12 text-sm"
                                                    value={schoolData.address}
                                                    onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm font-bold text-slate-300">{schoolData.address || "No address provided"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600/10 text-red-500 rounded-2xl border border-red-600/20 hover:bg-red-600/20 transition-all font-black text-xs uppercase tracking-widest"
                        >
                            <LogOut size={18} />
                            <span>Sign Out from Terminal</span>
                        </button>
                    </div>

                    {/* Account Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Admin Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="email" readOnly className="input-field pl-12 opacity-50" defaultValue={user?.email} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Contact Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" readOnly className="input-field pl-12 opacity-50" defaultValue={user?.name} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Security Credentials</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input type="password" readOnly={!isEditing} className="input-field pl-12" defaultValue="••••••••" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input type="password" readOnly={!isEditing} className="input-field pl-12" placeholder="Leave empty to keep" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Note: User credential modification is strictly auditable.</p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white">Institutional Reports</p>
                                    <p className="text-xs text-slate-500">Automatically receive monthly student performance spreadsheets.</p>
                                </div>
                                <div className="w-14 h-8 bg-blue-600 rounded-full p-1 cursor-pointer flex items-center justify-end px-1.5 transition-colors">
                                    <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminProfile;
