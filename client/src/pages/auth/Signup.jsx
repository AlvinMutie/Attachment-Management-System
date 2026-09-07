import React, { useState } from 'react';
import { Building2, Mail, Globe, User, ArrowRight, ArrowLeft, CheckCircle2, Home, Shield, Sparkles, School } from 'lucide-react';
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

    // ── Success State ──────────────────────────────────────────────
    if (step === 3) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#080c14] p-6 selection:bg-indigo-500/30 overflow-hidden relative font-sans">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 rounded-2xl bg-[#101626] border border-[#1f293d] shadow-2xl text-center space-y-6 relative z-10"
                >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 text-emerald-400">
                        <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">Registration Submitted</h2>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                            Initialization request for <span className="text-white font-semibold">{formData.schoolName}</span> has been logged.
                            Access verification credentials will be dispatched to <span className="text-indigo-400 font-semibold">{formData.adminEmail}</span> after internal audit.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_25px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <span>Return to Sign In</span>
                        <ArrowRight size={14} />
                    </button>
                </motion.div>
            </div>
        );
    }

    // ── Main Form ──────────────────────────────────────────────────
    return (
        <div className="min-h-screen w-full flex bg-[#080c14] text-white selection:bg-indigo-500/30 overflow-hidden relative font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Nav Overlays */}
            <div className="absolute top-6 left-6 z-50">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101626]/80 border border-[#1f293d] text-slate-300 hover:text-white hover:border-slate-500 hover:bg-[#162035] transition-all group backdrop-blur-md"
                >
                    <Home size={14} className="group-hover:-translate-y-0.5 transition-transform text-indigo-400" />
                    <span className="text-xs font-semibold tracking-wide">Portal Home</span>
                </Link>
            </div>

            {/* Left Panel: Attio + Stripe Institutional Spotlight */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex flex-col justify-between w-[46%] bg-[#0c101d] border-r border-[#1f293d] p-12 xl:p-16 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <span className="font-extrabold text-lg text-white tracking-tight">AttachPro</span>
                                <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-400">Institutional Expansion</span>
                            </div>
                        </div>

                        {/* Hero Text */}
                        <div className="mt-14 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                                <Sparkles size={13} className="text-indigo-400" />
                                Institutional Onboarding
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                                Connect your faculty <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                                    in under 3 minutes.
                                </span>
                            </h1>
                            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-md">
                                Register your university or technical institute to enable secure department isolation, automated faculty workflows, and real-time student tracking.
                            </p>
                        </div>
                    </div>

                    {/* Bento Key Value Pills */}
                    <div className="space-y-3 my-8">
                        {[
                            'Multi-department isolation & RBAC hierarchy',
                            'Automated university supervisor assignment queues',
                            'Industry partner portals & digital evaluation rubrics',
                            'Automated ISO 27001 compliant audit logs',
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.08) }}
                                className="flex items-center gap-3 text-xs text-slate-300 font-medium p-2.5 rounded-lg bg-[#101626]/50 border border-[#1f293d]/50"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                {item}
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Status */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#1f293d]/80 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <Shield size={14} className="text-indigo-400" />
                            <span className="font-medium text-slate-400">Institutional Provisioning Protocol</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">Fast 24h SLA</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 xl:p-16 relative h-full overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="w-full max-w-[440px] space-y-8 relative z-10"
                >
                    {/* Mobile Brand */}
                    <div className="flex items-center gap-3 lg:hidden mb-6">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <School size={18} className="text-white" />
                        </div>
                        <div>
                            <span className="font-extrabold text-base text-white tracking-tight">AttachPro</span>
                            <span className="block text-[9px] uppercase font-bold tracking-widest text-indigo-400">Institution Registration</span>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {[1, 2].map((i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                            step >= i 
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                                                : 'bg-[#101626] text-slate-500 border border-[#1f293d]'
                                        }`}>
                                            {step > i ? '✓' : i}
                                        </div>
                                        <span className={`text-xs font-semibold transition-colors ${step >= i ? 'text-white' : 'text-slate-500'}`}>
                                            {i === 1 ? 'School' : 'Lead Admin'}
                                        </span>
                                    </div>
                                    {i < 2 && <div className={`flex-1 h-0.5 transition-colors ${step > 1 ? 'bg-indigo-600' : 'bg-[#1f293d]'}`} />}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {step === 1 ? 'Institution Profile' : 'Lead Administrator'}
                            </h2>
                            <p className="text-slate-400 text-xs sm:text-sm font-normal">
                                {step === 1 ? 'Enter your official educational institution details.' : 'Designate the primary system manager for your school.'}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs leading-relaxed"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-4"
                            >
                                {step === 1 ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">University / College Name</label>
                                            <div className="relative group">
                                                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-[#101626] border border-[#1f293d] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    placeholder="Nairobi Technical University"
                                                    value={formData.schoolName}
                                                    onChange={update('schoolName')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Official Website (Optional)</label>
                                            <div className="relative group">
                                                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="url"
                                                    className="w-full bg-[#101626] border border-[#1f293d] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    placeholder="https://www.institution.ac.ke"
                                                    value={formData.schoolWebsite}
                                                    onChange={update('schoolWebsite')}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Primary Contact Full Name</label>
                                            <div className="relative group">
                                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-[#101626] border border-[#1f293d] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                                    placeholder="Dr. Jane Doe"
                                                    value={formData.adminName}
                                                    onChange={update('adminName')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Institutional Email Address</label>
                                            <div className="relative group">
                                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-[#101626] border border-[#1f293d] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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

                        <div className="flex gap-3 pt-2">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[#101626] border border-[#1f293d] rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#162035] transition-all"
                                >
                                    <ArrowLeft size={15} />
                                    <span>Back</span>
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white transition-all shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_12px_30px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{step === 1 ? 'Next: Admin Setup' : 'Complete Registration'}</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="border-t border-[#1f293d] pt-6 text-center">
                        <p className="text-xs text-slate-400">
                            Already registered?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 group ml-1">
                                Sign In
                                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterSchool;

