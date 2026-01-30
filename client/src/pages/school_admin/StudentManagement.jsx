import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Upload,
    Link,
    Mail,
    Building2,
    UserCheck,
    ShieldAlert,
    MoreVertical,
    Download,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import * as adminApi from '../../utils/adminApi';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResults, setUploadResults] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, [searchTerm]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getStudents({ search: searchTerm });
            if (response.data.success) {
                setStudents(response.data.data.students);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('csvFile', file);

            const response = await adminApi.bulkOnboardStudents(formData);

            if (response.data.success) {
                setUploadResults(response.data.data);
                fetchStudents();
            }
        } catch (error) {
            console.error('Bulk upload failed:', error);
            alert('Bulk onboarding protocol failed. Verify CSV structure.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-600/5 p-10 rounded-m3-xl border border-emerald-600/10 backdrop-blur-md">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-600/40">
                        <Users size={44} className="text-white" />
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400">Personnel Layer</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Student <span className="text-emerald-500">Registry</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">Orchestrate and monitor the global institutional student roster.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="btn-primary px-10 py-4 group bg-slate-900 border-white/10 hover:bg-slate-800 !rounded-2xl"
                    >
                        <Upload size={22} className="group-hover:translate-y-[-2px] transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Bulk Onboard</span>
                    </button>
                    <button className="btn-primary px-10 py-4 group !rounded-2xl">
                        <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">New Node</span>
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="glass-card p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search student by identity, email or admission registry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-card overflow-hidden !rounded-m3-xl shadow-2xl border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Info</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Oversight Link</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Activity State</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                <UserCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white tracking-tight">{student.user.name}</p>
                                                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                                                    <Mail size={10} className="text-emerald-500" />
                                                    {student.user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-300">{student.admissionNumber}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-black">{student.department}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {student.industrySupervisor ? (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 w-fit">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-black uppercase text-emerald-400">{student.industrySupervisor.name}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/5 border border-rose-500/10 w-fit">
                                                <ShieldAlert size={12} className="text-rose-500" />
                                                <span className="text-[10px] font-black uppercase text-rose-400">No Supervisor</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${student.user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <span className="text-[11px] font-bold text-white uppercase tracking-widest">{student.user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bulk Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
                    <div className="glass-card w-full max-w-xl animate-fade-in border-emerald-500/20 shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                    <FileSpreadsheet size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Bulk Onboard students</h3>
                            </div>
                            <button onClick={() => setShowUploadModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {!uploadResults ? (
                                <div className="space-y-6">
                                    <div className="p-10 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-4 hover:border-emerald-500/50 transition-all cursor-pointer relative group">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-colors">
                                            <Upload size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-white uppercase tracking-widest">{file ? file.name : "Select Institutional CSV"}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Maximum Scale: 2,000 Nodes</p>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl space-y-3">
                                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldAlert size={14} />
                                            Data Protocol Requirements
                                        </h4>
                                        <p className="text-[10px] text-slate-400 leading-relaxed uppercase">CSV must include headers: <span className="text-white font-bold">name, email, admissionNumber, department</span>. System defaults password to <span className="text-white font-bold">ChangeMe123!</span>.</p>
                                    </div>

                                    <button
                                        disabled={!file || uploading}
                                        onClick={handleBulkUpload}
                                        className="w-full btn-primary py-5 !rounded-2xl transition-all disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={20} />}
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">{uploading ? "Deploying..." : "Execute Deployment"}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Successful Nodes</p>
                                            <h4 className="text-4xl font-black text-white tracking-tighter">{uploadResults.successful}</h4>
                                        </div>
                                        <CheckCircle size={40} className="text-emerald-500 opacity-50" />
                                    </div>

                                    {uploadResults.failed > 0 && (
                                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Failed Nodes</p>
                                                <h4 className="text-2xl font-black text-white tracking-tighter">{uploadResults.failed}</h4>
                                            </div>
                                            <div className="max-h-32 overflow-y-auto space-y-2 no-scrollbar">
                                                {uploadResults.errors.map((err, i) => (
                                                    <p key={i} className="text-[9px] text-rose-400 uppercase font-black opacity-80">{err}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setUploadResults(null);
                                            setFile(null);
                                        }}
                                        className="w-full py-4 glass-card rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Finalize Protocol
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
