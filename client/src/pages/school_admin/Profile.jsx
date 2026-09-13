import React, { useState, useEffect } from 'react';
import {
    User, Mail, Lock, School as SchoolIcon,
    Building, CheckCircle2, LogOut, Globe,
    ImageIcon, MapPin, Upload, Link as LinkIcon,
    Shield, Sparkles, Check, Save, Edit3, Palette
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth, applyTheme } from '../../context/AuthContext';
import { getMySchool, updateMySchool } from '../../utils/schoolApi';
import { Badge, Button, LoadingSkeleton } from '../../components/ui';

const AdminProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [schoolData, setSchoolData] = useState({
        name: '',
        address: '',
        contactEmail: '',
        primaryColor: '#7c3aed'
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [uploadMode, setUploadMode] = useState('file');

    useEffect(() => {
        fetchSchool();
    }, []);

    const fetchSchool = async () => {
        try {
            setLoading(true);
            const response = await getMySchool();
            if (response.data) {
                setSchoolData(response.data);
                if (response.data.logo) {
                    setLogoPreview(response.data.logo.startsWith('http') ? response.data.logo : `http://localhost:5000${response.data.logo}`);
                }
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
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            if (schoolData.primaryColor) {
                applyTheme(schoolData.primaryColor);
            }
            fetchSchool();
        } catch (error) {
            alert('Failed to update institutional data');
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="school_admin">
                <div className="space-y-6 max-w-7xl mx-auto p-4">
                    <LoadingSkeleton className="h-32 rounded-2xl bg-[#15171f] border border-[#22242f]" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LoadingSkeleton className="h-80 rounded-2xl bg-[#15171f] border border-[#22242f]" />
                        <LoadingSkeleton className="md:col-span-2 h-80 rounded-2xl bg-[#15171f] border border-[#22242f]" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="school_admin">
            <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
                {/* 1. Header Hero Dossier */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-[#181a24] border border-[#22242f] flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt={schoolData.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <SchoolIcon className="text-amber-400" size={32} />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f1117]" title="Verified Campus Admin" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                        {user?.name || 'Campus Administrator'}
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        <Shield size={12} className="text-amber-400" />
                                        Institutional Administrator
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                    <span className="text-slate-200 font-semibold">{schoolData.name || 'University Campus'}</span>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-slate-400 flex items-center gap-1">
                                        <MapPin size={13} className="text-amber-400" /> {schoolData.address || 'Main Campus'}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="font-mono text-slate-400">{schoolData.contactEmail || user?.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 w-full md:w-auto">
                            {isEditing ? (
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 sm:flex-none text-xs py-2 px-3.5 border border-[#2a2e40]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        className="flex-1 sm:flex-none text-xs py-2 px-4 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                                    >
                                        <Save size={14} />
                                        <span>Save Branding</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto text-xs py-2 px-4 font-semibold flex items-center justify-center gap-1.5 border-[#2a2e40]"
                                >
                                    <Edit3 size={14} />
                                    <span>Edit Campus Profile</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {saveSuccess && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>Institutional branding and administrator profile updated successfully.</span>
                    </div>
                )}

                {/* 2. Main 2-Column Configuration Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Campus Identity & Branding (4 Cols) */}
                    <div className="lg:col-span-4 space-y-5">
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 space-y-4 shadow-md">
                            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <Building size={14} className="text-amber-400" />
                                    Campus Branding
                                </h3>
                                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    Tenant Logo
                                </span>
                            </div>

                            {/* Logo Display / Uploader */}
                            <div className="space-y-3">
                                <div className="w-full aspect-video rounded-xl bg-[#181a24] border border-[#22242f] flex items-center justify-center overflow-hidden">
                                    {logoPreview || (uploadMode === 'url' && schoolData.logo) ? (
                                        <img
                                            src={(uploadMode === 'file' && logoPreview) ? logoPreview : (schoolData.logo.startsWith('http') ? schoolData.logo : `http://localhost:5000${schoolData.logo}`)}
                                            alt="Campus Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <ImageIcon size={28} className="text-slate-600" />
                                            <span className="text-xs">No Logo Configured</span>
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="space-y-2.5 pt-1">
                                        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-[#0e1017] border border-[#22242f]">
                                            <button
                                                type="button"
                                                onClick={() => setUploadMode('file')}
                                                className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                                                    uploadMode === 'file' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                Upload File
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setUploadMode('url')}
                                                className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                                                    uploadMode === 'url' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                Image URL
                                            </button>
                                        </div>

                                        {uploadMode === 'file' ? (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-amber-500/10 file:text-amber-400 cursor-pointer"
                                            />
                                        ) : (
                                            <input
                                                type="url"
                                                className="w-full bg-[#181a24] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                                placeholder="https://example.edu/logo.png"
                                                value={schoolData.logo || ''}
                                                onChange={(e) => setSchoolData({ ...schoolData, logo: e.target.value })}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Campus Metadata */}
                            <div className="space-y-3 pt-3 border-t border-[#1e2230] text-xs">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institution Name</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-amber-500"
                                            value={schoolData.name}
                                            onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                                        />
                                    ) : (
                                        <p className="font-semibold text-white">{schoolData.name || 'Not set'}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campus Address</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-amber-500"
                                            value={schoolData.address || ''}
                                            onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                                        />
                                    ) : (
                                        <p className="font-semibold text-slate-300">{schoolData.address || 'Main Campus'}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Official Contact Email</span>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="w-full p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-amber-500"
                                            value={schoolData.contactEmail || ''}
                                            onChange={(e) => setSchoolData({ ...schoolData, contactEmail: e.target.value })}
                                        />
                                    ) : (
                                        <p className="font-mono font-semibold text-slate-300">{schoolData.contactEmail || 'admin@school.edu'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 p-3.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition-all font-bold text-xs"
                        >
                            <LogOut size={15} />
                            <span>Sign Out of Administrator Account</span>
                        </button>
                    </div>

                    {/* Right Column: Admin Identity & Security (8 Cols) */}
                    <div className="lg:col-span-8 space-y-5">
                        <div className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-5 shadow-md">
                            <div className="flex items-center justify-between pb-3.5 border-b border-[#1e2230]">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Administrator Identity & Security</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Campus governance credentials and administrative access settings.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <User size={13} className="text-amber-400" /> Administrator Name
                                        </label>
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-full p-2.5 rounded-lg bg-[#10121a] border border-[#1e2230] text-xs text-slate-400 opacity-70 cursor-not-allowed"
                                            defaultValue={user?.name}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                            <Mail size={13} className="text-amber-400" /> Administrative Email
                                        </label>
                                        <input
                                            type="email"
                                            readOnly
                                            className="w-full p-2.5 rounded-lg bg-[#10121a] border border-[#1e2230] text-xs text-slate-400 opacity-70 cursor-not-allowed"
                                            defaultValue={user?.email}
                                        />
                                    </div>
                                </div>

                                {/* Security Credentials Section */}
                                <div className="pt-4 border-t border-[#1e2230] space-y-3.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                            <Lock size={13} className="text-amber-400" /> Security Credentials
                                        </h4>
                                        <span className="text-[10px] text-slate-500">Root Campus Authority</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">Current Password</label>
                                            <input
                                                type="password"
                                                readOnly={!isEditing}
                                                defaultValue="••••••••••••"
                                                className="w-full p-2.5 rounded-lg bg-[#10121a] border border-[#1e2230] text-xs text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">New Password</label>
                                            <input
                                                type="password"
                                                readOnly={!isEditing}
                                                placeholder={isEditing ? 'Leave blank to keep current' : '••••••••••••'}
                                                className={`w-full p-2.5 rounded-lg border text-xs outline-none transition-colors ${
                                                    isEditing
                                                        ? 'bg-[#181a24] border-[#22242f] text-white focus:border-amber-500'
                                                        : 'bg-[#10121a] border-[#1e2230] text-slate-400 cursor-not-allowed'
                                                }`}
                                            />
                                        </div>
                                    </div>
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

