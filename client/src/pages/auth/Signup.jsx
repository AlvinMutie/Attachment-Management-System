import React, { useState } from 'react';
import { Building2, Mail, Globe, User, ArrowRight, ArrowLeft, CheckCircle2, Home, Shield, School, Check } from 'lucide-react';
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
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0e12] p-6 selection:bg-violet-500/30 overflow-hidden relative font-sans figma-canvas-dots">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 rounded-xl bg-[#12141c] border border-[#22242f] shadow-xl text-center space-y-5 relative z-10"
                >
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-semibold text-white tracking-tight">Registration Submitted</h2>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Registration request for <span className="text-slate-200 font-medium">{formData.schoolName}</span> has been received.
                            Verification details have been queued for <span className="text-violet-400 font-medium">{formData.adminEmail}</span>.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2"
                    >
                        <span>Return to Sign In</span>
                        <ArrowRight size={13} />
                    </button>
                </motion.div>
            </div>
        );
    }

    // ── Main Form ──────────────────────────────────────────────────
    return (
        <div className="min-h-screen w-full flex bg-[#0d0e12] text-slate-100 selection:bg-violet-500/30 overflow-hidden relative font-sans figma-canvas-dots">
            {/* Top Bar Navigation */}
            <div className="absolute top-6 left-6 z-50">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#15171f] border border-[#22242f] text-slate-300 hover:text-white hover:border-slate-600 transition-all group backdrop-blur-md shadow-sm"
                >
                    <Home size={14} className="text-violet-400 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-xs font-medium tracking-tight">Back to Overview</span>
                </Link>
            </div>

            {/* Left Panel: Institution Workflow */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex flex-col justify-between w-[46%] bg-[#12141c] border-r border-[#22242f] p-12 xl:p-16 relative overflow-hidden"
            >
                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                                ⌘
                            </div>
                            <div>
                                <span className="font-semibold text-base text-white tracking-tight">Attachment OS</span>
                                <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">Institutional Setup</span>
                            </div>
                        </div>

                        {/* Headings */}
                        <div className="mt-16 space-y-3">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium">
                                Department Setup
                            </div>
                            <h1 className="text-3xl xl:text-4xl font-semibold text-white tracking-tight leading-snug">
                                Onboard your institution <br />
                                in minutes.
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                Set up department hierarchies, faculty supervisor rosters, and automated student logbook evaluation schedules.
                            </p>
                        </div>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-2.5 my-8">
                        {[
                            'Isolated departmental records and RBAC permissions',
                            'Automated university supervisor assignment queues',
                            'Industry supervisor evaluation rubrics and grading',
                            'Exportable compliance audit trails and PDF grade summaries'
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2.5 text-xs text-slate-300 font-normal p-2.5 rounded-md bg-[#15171f] border border-[#22242f]"
                            >
                                <Check size={14} className="text-emerald-400 shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#22242f] text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <Shield size={14} className="text-violet-400" />
                            <span className="text-slate-400 text-[11px]">Academic Data Isolation Enabled</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-600">Enterprise Ready</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 xl:p-16 relative h-full overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-[420px] space-y-6 relative z-10"
                >
                    {/* Step indicator */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            {[1, 2].map((i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold transition-all ${
                                            step >= i 
                                                ? 'bg-violet-600 text-white' 
                                                : 'bg-[#15171f] text-slate-500 border border-[#22242f]'
                                        }`}>
                                            {step > i ? '✓' : i}
                                        </div>
                                        <span className={`text-xs font-medium transition-colors ${step >= i ? 'text-white' : 'text-slate-500'}`}>
                                            {i === 1 ? 'School Details' : 'Administrator'}
                                        </span>
                                    </div>
                                    {i < 2 && <div className={`flex-1 h-px transition-colors ${step > 1 ? 'bg-violet-600' : 'bg-[#22242f]'}`} />}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold text-white tracking-tight">
                                {step === 1 ? 'Register your institution' : 'Lead administrator setup'}
                            </h2>
                            <p className="text-slate-400 text-xs font-normal">
                                {step === 1 ? 'Provide the official name and website of your institution.' : 'Specify the contact details for the institutional administrator.'}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {step === 1 ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-300">University / College Name</label>
                                            <div className="relative">
                                                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
                                                    placeholder="e.g. University of Nairobi"
                                                    value={formData.schoolName}
                                                    onChange={update('schoolName')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-300">Official Website (Optional)</label>
                                            <div className="relative">
                                                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="url"
                                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
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
                                            <label className="text-xs font-medium text-slate-300">Admin Full Name</label>
                                            <div className="relative">
                                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
                                                    placeholder="Dr. Margaret Wanjiku"
                                                    value={formData.adminName}
                                                    onChange={update('adminName')}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-300">Institutional Email Address</label>
                                            <div className="relative">
                                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
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

                        <div className="flex gap-2.5 pt-2">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#15171f] border border-[#22242f] rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-[#181a24] transition-all"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Back</span>
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-xs font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{step === 1 ? 'Continue to Admin Setup' : 'Submit Registration'}</span>
                                        <ArrowRight size={13} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="border-t border-[#22242f] pt-5 text-center">
                        <p className="text-xs text-slate-400">
                            Already registered?{' '}
                            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1">
                                Sign In
                                <span>→</span>
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterSchool;
