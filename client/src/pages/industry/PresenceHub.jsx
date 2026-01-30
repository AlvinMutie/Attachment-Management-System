import React, { useEffect, useState } from 'react';
import { Activity, MapPin, Mail, Search, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight, User, GraduationCap, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { getLivePresence } from '../../utils/supervisorApi';

const PresenceHub = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPresence();
        const interval = setInterval(fetchPresence, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchPresence = async () => {
        try {
            const response = await getLivePresence();
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch presence data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'present':
                return (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Now</span>
                    </div>
                );
            case 'absent':
                return (
                    <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                        <XCircle size={10} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Off-site</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-500/10 px-3 py-1 rounded-full border border-slate-500/20">
                        <Clock size={10} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pending Sync</span>
                    </div>
                );
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="industry_supervisor">
            <div className="space-y-10 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-[var(--brand-primary-subtle)] to-transparent p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-primary)] opacity-[0.03] blur-[100px] -mr-32 -mt-32" />
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-20 h-20 bg-[var(--brand-primary)] rounded-3xl flex items-center justify-center shadow-2xl shadow-[var(--brand-primary-glow)] ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-500">
                            <Activity size={40} className="text-white animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--brand-primary)] opacity-70">Live Oversight</span>
                                <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Student <span className="text-[var(--brand-primary)]">Presence</span> Hub</h1>
                            <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed">Real-time monitoring of active attachment nodes and operational status.</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80 group z-10">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-primary)] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find student node..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-14 py-4 !rounded-2xl border-white/10 focus:border-[var(--brand-primary)] transition-all bg-white/[0.03]"
                        />
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card p-6 border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.02] to-transparent">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Now</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-3xl font-black text-emerald-400 tracking-tighter">{students.filter(s => s.presenceStatus === 'present').length}</h4>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Activity size={20} className="text-emerald-500" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-rose-500/10 bg-gradient-to-br from-rose-500/[0.02] to-transparent">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Off-Site</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-3xl font-black text-rose-400 tracking-tighter">{students.filter(s => s.presenceStatus === 'absent').length}</h4>
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                <AlertCircle size={20} className="text-rose-500" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-slate-500/10 bg-gradient-to-br from-slate-500/[0.02] to-transparent">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Assigned</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-3xl font-black text-white tracking-tighter">{students.length}</h4>
                            <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
                                <Users size={20} className="text-slate-400" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-purple-500/10 bg-gradient-to-br from-purple-500/[0.02] to-transparent">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pending Sync</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-3xl font-black text-purple-400 tracking-tighter">{students.filter(s => s.presenceStatus === 'not-scanned').length}</h4>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Clock size={20} className="text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid View */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <div className="w-16 h-16 border-4 border-[var(--brand-primary-subtle)] border-t-[var(--brand-primary)] rounded-full animate-spin shadow-[0_0_30px_var(--brand-primary-glow)]" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Initializing Presence Grid...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="glass-card p-8 group hover:border-[var(--brand-primary-glow)] transition-all duration-500 relative flex flex-col justify-between h-full">
                                <div className="space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500 ring-2 ring-transparent group-hover:ring-[var(--brand-primary-glow)]">
                                                {student.photo ? (
                                                    <img src={`http://localhost:5000${student.photo}`} alt={student.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <User className="text-slate-700" size={32} />
                                                        <span className="text-[8px] font-black text-slate-800 uppercase">NO PHOTO</span>
                                                    </div>
                                                )}
                                            </div>
                                            {student.presenceStatus === 'present' && (
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                    <CheckCircle2 className="text-white" size={12} />
                                                </div>
                                            )}
                                        </div>
                                        <StatusBadge status={student.presenceStatus} />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-white tracking-tighter group-hover:text-[var(--brand-primary)] transition-colors">{student.name}</h3>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest bg-white/[0.03] w-fit px-3 py-1 rounded-lg">
                                            <span className="text-[var(--brand-primary)]">ID:</span> {student.admissionNumber}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                                <Mail size={14} />
                                            </div>
                                            <span className="truncate">{student.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                                                <GraduationCap size={14} />
                                            </div>
                                            <span className="truncate">{student.course}</span>
                                        </div>
                                    </div>

                                    {student.latestLogbook && (
                                        <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 group-hover:bg-[var(--brand-primary-subtle)] transition-all duration-500">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                                Recent Activity
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] border ${student.latestLogbook.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    student.latestLogbook.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    Week {student.latestLogbook.weekNumber} • {student.latestLogbook.status}
                                                    {student.latestLogbook.attachments?.length > 0 && (
                                                        <span className="ml-2 flex items-center gap-1 text-[var(--brand-primary)]">
                                                            <FileText size={8} />
                                                            {student.latestLogbook.attachments.length} Artifacts
                                                        </span>
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button className="mt-8 w-full py-4 bg-white/5 hover:bg-[var(--brand-primary)] text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border border-white/5 hover:scale-[1.02] active:scale-95 group-hover:border-[var(--brand-primary-glow)] flex items-center justify-center gap-2">
                                    Analyze Logs
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {students.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-96 space-y-6 glass-card !bg-transparent border-dashed">
                        <div className="w-24 h-24 rounded-[3rem] bg-white/5 flex items-center justify-center text-slate-700 ring-4 ring-white/5">
                            <Users size={40} />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">No Nodes Assigned</h3>
                            <p className="text-slate-500 font-medium max-w-sm">There are currently no students linked to your operational oversight. Please contact the institution administrator.</p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PresenceHub;
