import React, { useState } from 'react';
import { Building2, Mail, Globe, User, ArrowRight, ArrowLeft, CheckCircle, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const RegisterSchool = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        schoolName: '',
        schoolWebsite: '',
        adminName: '',
        adminEmail: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const update = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step < 2) { setStep(2); return; }
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/schools/register', formData);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // ── Success State ──────────────────────────────────────────────
    if (step === 3) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-screen w-full flex items-center justify-center bg-slate-950 p-6 selection:bg-blue-500/30 overflow-hidden"
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-600/5 blur-[120px] rounded-full" />
                </div>

                <div className="w-full max-w-md text-center space-y-8 relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl shadow-blue-500/10"
                    >
                        <CheckCircle size={40} className="text-blue-400" />
                    </motion.div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Registered</h2>
                        <p className="text-slate-400 text-base font-medium leading-relaxed">
                            Initialization request for <span className="text-white font-bold">{formData.schoolName}</span> submitted.
                            Verification credentials will be dispatched to <span className="text-blue-400 font-bold">{formData.adminEmail}</span> after internal audit.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0 overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10">Return to Portal Command</span>
                    </button>
                </div>
            </motion.div>
        );
    }

    // ── Main Form ──────────────────────────────────────────────────
    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-screen w-full flex bg-slate-950 text-white selection:bg-blue-500/30 overflow-hidden"
        >
            {/* Nav Overlays */}
            <div className="absolute top-8 left-8 z-50">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all group"
                >
                    <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Portal Home</span>
                </Link>
            </div>

            {/* Left Panel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="hidden lg:flex flex-col justify-between w-[45%] bg-slate-900 border-r border-white/5 py-10 px-12 md:p-16 relative overflow-hidden h-full"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center gap-3 mb-10 mt-4 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/20">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-black text-xl text-white tracking-widest uppercase">AttachPro</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-10 scrollbar-hide pb-10">
                        <div className="space-y-4">
                            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                                REGISTER <br />
                                <span className="text-blue-500">YOUR SCHOOL</span>
                            </h1>
                            <p className="text-slate-400 text-base xl:text-lg font-medium leading-relaxed max-w-md">
                                Onboard your institution to the unified oversight ecosystem. Precision management for next-gen attachments.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                'Multi-level institutional audit',
                                'Secure credential dispatch (24h SLA)',
                                'Seamless bulk-student onboarding',
                                'Advanced placement analytics engine',
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-center gap-4 text-sm text-slate-400 font-medium group"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform" />
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 pt-8 border-t border-white/5 mt-auto bg-slate-900">
                    <div className="w-8 h-px bg-slate-800" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                        Institutional Expansion Protocol
                    </p>
                </div>
            </motion.div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-20 relative h-full overflow-y-auto">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/[0.03] blur-[120px] rounded-full" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-[420px] space-y-10 relative z-10"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 lg:hidden mb-12">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-black text-lg text-white tracking-widest uppercase">AttachPro</span>
                    </div>

                    {/* Step indicator */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            {[1, 2].map((i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${step >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' : 'bg-slate-900 text-slate-600 border border-white/5'}`}>
                                            {step > i ? '✓' : i}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step >= i ? 'text-white' : 'text-slate-600'}`}>
                                            {i === 1 ? 'Institution' : 'Admin'}
                                        </span>
                                    </div>
                                    {i < 2 && <div className={`flex-1 h-px transition-colors ${step > 1 ? 'bg-blue-600' : 'bg-slate-800'}`} />}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="space-y-2 text-center lg:text-left">
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                                {step === 1 ? 'School Identity' : 'Authorized Lead'}
                            </h2>
                            <p className="text-slate-400 text-base font-medium">
                                {step === 1 ? 'Official registration of institutional assets.' : 'Administrative account provisioning.'}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {step === 1 ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Universal School Name</label>
                                            <div className="relative group">
                                                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl pl-12 pr-5 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all shadow-inner"
                                                    placeholder="Nairobi Technical University"
                                                    value={formData.schoolName}
                                                    onChange={update('schoolName')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Official Domain (Optional)</label>
                                            <div className="relative group">
                                                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="url"
                                                    className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl pl-12 pr-5 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all shadow-inner"
                                                    placeholder="https://www.institution.ac.ke"
                                                    value={formData.schoolWebsite}
                                                    onChange={update('schoolWebsite')}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Lead Identity</label>
                                            <div className="relative group">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl pl-12 pr-5 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all shadow-inner"
                                                    placeholder="Full Admin Name"
                                                    value={formData.adminName}
                                                    onChange={update('adminName')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Institutional Email</label>
                                            <div className="relative group">
                                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl pl-12 pr-5 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all shadow-inner"
                                                    placeholder="admin@institution.ac.ke"
                                                    value={formData.adminEmail}
                                                    onChange={update('adminEmail')}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex gap-4 pt-4">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 border border-white/[0.05] rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 relative group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                                ) : (
                                    <>
                                        <span className="relative z-10">{step === 1 ? 'Proceed' : 'Initialize Workflow'}</span>
                                        <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="border-t border-white/[0.05] pt-10 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Already part of the network?{' '}
                            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold ml-1 inline-flex items-center gap-1 group">
                                Sign In
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RegisterSchool;
