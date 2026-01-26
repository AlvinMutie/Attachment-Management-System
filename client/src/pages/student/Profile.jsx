import React, { useState } from 'react';
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    MapPin,
    Building,
    GraduationCap,
    Calendar,
    CheckCircle2,
    Settings,
    LogOut,
    Briefcase
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const ProfileCard = ({ title, children }) => (
    <div className="glass-card p-8 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <Settings className="text-blue-500" size={18} />
            <span className="uppercase tracking-widest text-xs">{title}</span>
        </h3>
        {children}
    </div>
);

const StudentProfile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Mock data for Student
    const studentData = {
        name: user?.name || 'Alvin Mutie',
        email: user?.email || 'alvin.mutie@students.uni.edu',
        regNumber: 'SIT/0024/2022',
        course: 'B.Sc. Information Technology',
        school: 'School of Computing & Informatics',
        university: 'Modern University of Technology',
        placement: 'Safaricom PLC',
        department: 'Cloud & Infrastructure',
        supervisor: 'Eng. Sarah Jenkins',
        universitySupervisor: 'Dr. James Okoth',
        startDate: '05 Jan 2026',
        endDate: '28 Mar 2026',
        status: 'Active Placement'
    };

    return (
        <DashboardLayout role="student">
            <div className="space-y-8 animate-fade-in">
                {/* Header / Identity */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-600/10 to-transparent p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform overflow-hidden">
                            <User className="text-blue-500" size={64} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="text-white" size={16} />
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter">{studentData.name}</h1>
                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                                {studentData.status}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">{studentData.regNumber} • {studentData.course}</p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Building size={14} className="text-blue-500" />
                                <span>{studentData.placement}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <Calendar size={14} className="text-purple-500" />
                                <span>Ends {studentData.endDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:ml-auto">
                        <button className="btn-primary px-8" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Save Profile' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Academic & Placement Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <ProfileCard title="Academic Details">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <GraduationCap className="text-blue-500 shrink-0" size={20} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Institution</p>
                                        <p className="text-sm font-bold text-white leading-tight">{studentData.university}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="text-purple-500 shrink-0" size={20} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">School/Faculty</p>
                                        <p className="text-sm font-bold text-slate-300 leading-tight">{studentData.school}</p>
                                    </div>
                                </div>
                            </div>
                        </ProfileCard>

                        <ProfileCard title="Placement Support">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <Briefcase className="text-green-500 shrink-0" size={20} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Industry Supervisor</p>
                                        <p className="text-sm font-bold text-white leading-tight">{studentData.supervisor}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <Shield className="text-orange-500 shrink-0" size={20} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Academic Supervisor</p>
                                        <p className="text-sm font-bold text-slate-300 leading-tight">{studentData.universitySupervisor}</p>
                                    </div>
                                </div>
                            </div>
                        </ProfileCard>
                    </div>

                    {/* Personal Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" readOnly={!isEditing} className="input-field pl-12" defaultValue={studentData.name} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Personal Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="email" readOnly={!isEditing} className="input-field pl-12" defaultValue={studentData.email} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Account Security</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Update Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input type="password" readOnly={!isEditing} className="input-field pl-12" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input type="password" readOnly={!isEditing} className="input-field pl-12" placeholder="Confirm new password" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white">Email Notifications</p>
                                    <p className="text-xs text-slate-500 font-medium">Get notified when a supervisor comments on your logbook</p>
                                </div>
                                <div className="w-14 h-8 bg-blue-600 rounded-full p-1 cursor-pointer flex items-center justify-end px-1.5 transition-colors">
                                    <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 border-l-4 border-l-red-600 bg-red-600/[0.02] flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Sign Out</h3>
                                <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Terminate your current session securely</p>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-8 py-3 bg-red-600/10 text-red-500 rounded-xl border border-red-600/20 hover:bg-red-600/20 transition-all font-black text-xs uppercase tracking-widest"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentProfile;
