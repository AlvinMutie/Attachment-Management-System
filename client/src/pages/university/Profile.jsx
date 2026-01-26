import React, { useState } from 'react';
import {
    User,
    Mail,
    Lock,
    GraduationCap,
    Building,
    CheckCircle2,
    Settings,
    LogOut,
    Shield,
    BookOpen
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const AcademicProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const data = {
        name: user?.name || 'Dr. James Okoth',
        email: user?.email || 'j.okoth@modernuni.edu',
        role: 'Senior Academic Supervisor',
        department: 'Department of Computer Science',
        faculty: 'Faculty of Engineering & Tech',
        staffId: 'STF-5582-2022',
        institution: 'Modern University of Technology',
        activeMentees: 18,
        experience: '12 Years'
    };

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-8 animate-fade-in">
                {/* Header / Identity */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-600/10 to-transparent p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                            <GraduationCap className="text-white" size={64} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="text-white" size={16} />
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter">{data.name}</h1>
                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg shadow-blue-600/20">
                                {data.role}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">{data.department} • {data.institution}</p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <BookOpen size={14} className="text-blue-500" />
                                <span>{data.activeMentees} Assigned Students</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Shield size={14} className="text-purple-500" />
                                <span>Verified Staff Account</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:ml-auto">
                        <button className="btn-primary px-8" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Institutional Detail */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-8 space-y-6">
                            <h3 className="text-lg font-black text-white flex items-center space-x-2">
                                <Building className="text-blue-500" size={18} />
                                <span className="uppercase tracking-widest text-xs">Affiliation</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Staff ID</p>
                                    <p className="text-sm font-bold text-white">{data.staffId}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Faculty</p>
                                    <p className="text-sm font-bold text-slate-300">{data.faculty}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Seniority</p>
                                    <p className="text-sm font-bold text-slate-300">{data.experience}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600/10 text-red-500 rounded-2xl border border-red-600/20 hover:bg-red-600/20 transition-all font-black text-xs uppercase tracking-widest"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* Account Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Official Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="email" readOnly={!isEditing} className="input-field pl-12" defaultValue={data.email} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" readOnly={!isEditing} className="input-field pl-12" defaultValue={data.name} />
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
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white">System Alerts</p>
                                    <p className="text-xs text-slate-500">Enable notifications for student logbook submissions.</p>
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

export default AcademicProfile;
