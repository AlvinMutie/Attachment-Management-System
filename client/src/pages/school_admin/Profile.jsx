import React, { useState, useEffect } from 'react';
import {
    User, Mail, Lock, School as SchoolIcon,
    Building, CheckCircle2, LogOut, Globe,
    ImageIcon, MapPin, Upload, Link as LinkIcon
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth, applyTheme } from '../../context/AuthContext';
import { getMySchool, updateMySchool } from '../../utils/schoolApi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const AdminProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
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
            fetchSchool();
        } catch (error) {
            alert('Failed to update institutional data');
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="school_admin">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="school_admin">
            <div className="space-y-6 max-w-5xl mx-auto p-6">
                {/* Header / Identity */}
                <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#12141c] border border-[#22242f] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            {logoPreview ? (
                                <img src={logoPreview} alt={schoolData.name} className="w-full h-full object-cover" />
                            ) : (
                                <SchoolIcon className="text-violet-400" size={28} />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">Institutional Governance</span>
                                <Badge variant="success">Verified Campus</Badge>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mt-0.5">{user?.name}</h1>
                            <p className="text-xs text-slate-400 mt-0.5">{schoolData.name} • {schoolData.address || 'Main Campus'}</p>
                        </div>
                    </div>
                    <Button
                        variant={isEditing ? 'primary' : 'outline'}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Institutional Profile'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Branding column */}
                    <div className="space-y-6">
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Building className="text-violet-400" size={16} />
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Campus Branding</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="w-full aspect-video rounded-lg bg-[#12141c] border border-[#22242f] flex items-center justify-center overflow-hidden">
                                    {logoPreview || (uploadMode === 'url' && schoolData.logo) ? (
                                        <img src={(uploadMode === 'file' && logoPreview) ? logoPreview : (schoolData.logo.startsWith('http') ? schoolData.logo : `http://localhost:5000${schoolData.logo}`)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 text-slate-500">
                                            <ImageIcon size={24} />
                                            <span className="text-[11px]">No Logo Configured</span>
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="space-y-3 pt-2">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setUploadMode('file')}
                                                className={`flex-1 py-1 rounded text-xs font-medium ${uploadMode === 'file' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}
                                            >
                                                Upload File
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setUploadMode('url')}
                                                className={`flex-1 py-1 rounded text-xs font-medium ${uploadMode === 'url' ? 'bg-violet-600 text-white' : 'bg-[#12141c] text-slate-400 border border-[#22242f]'}`}
                                            >
                                                Image URL
                                            </button>
                                        </div>

                                        {uploadMode === 'file' ? (
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-violet-500/10 file:text-violet-400" />
                                        ) : (
                                            <input
                                                type="url"
                                                className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                                                placeholder="https://..."
                                                value={schoolData.logo}
                                                onChange={(e) => setSchoolData({ ...schoolData, logo: e.target.value })}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[#22242f] pt-3 space-y-2 text-xs">
                                <div>
                                    <span className="text-slate-500 text-[11px] block">Campus Name:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1"
                                            value={schoolData.name}
                                            onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-slate-200 font-semibold">{schoolData.name}</span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-slate-500 text-[11px] block">Contact Email:</span>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-1.5 text-xs text-slate-200 mt-1"
                                            value={schoolData.contactEmail}
                                            onChange={(e) => setSchoolData({ ...schoolData, contactEmail: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-slate-300 font-mono text-[11px]">{schoolData.contactEmail}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="danger"
                            className="w-full"
                            onClick={logout}
                            icon={LogOut}
                        >
                            Sign Out
                        </Button>
                    </div>

                    {/* Account Settings */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-[#15171f] border border-[#22242f] rounded-xl p-6 space-y-4">
                            <h3 className="text-base font-bold text-slate-100">Administrator Identity</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                                    <input type="email" readOnly className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-400 opacity-60" defaultValue={user?.email} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Administrator Name</label>
                                    <input type="text" readOnly className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-400 opacity-60" defaultValue={user?.name} />
                                </div>
                            </div>

                            <div className="border-t border-[#22242f] pt-4 mt-2">
                                <h4 className="text-xs font-semibold text-slate-300 mb-3">Security Credentials</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Password</label>
                                        <input type="password" readOnly={!isEditing} className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" defaultValue="••••••••" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">New Password</label>
                                        <input type="password" readOnly={!isEditing} className="w-full bg-[#12141c] border border-[#22242f] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500" placeholder="Leave empty to keep current" />
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
