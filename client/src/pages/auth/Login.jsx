import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Home, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const rolePaths = {
        'student': '/student/dashboard',
        'industry_supervisor': '/industry/dashboard',
        'university_supervisor': '/university/dashboard',
        'attachment_coordinator': '/coordinator/dashboard',
        'school_admin': '/school_admin/dashboard',
        'super_admin': '/superadmin/dashboard'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            navigate(rolePaths[user.role] || '/');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please verify your email and password.');
        } finally {
            setLoading(false);
        }
    };

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
                {/* Background Pattern */}
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
                                <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-400">Enterprise AMS</span>
                            </div>
                        </div>

                        {/* Hero Text */}
                        <div className="mt-14 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                                <Sparkles size={13} className="text-indigo-400 animate-pulse" />
                                Unified Attachment Infrastructure
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                                Precision oversight <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                                    for academic excellence.
                                </span>
                            </h1>
                            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-md">
                                Seamlessly connect students, university assessors, and industry supervisors under one auditable, real-time command center.
                            </p>
                        </div>
                    </div>

                    {/* Bento Feature Cards */}
                    <div className="space-y-3 my-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: 'Cryptographic Logbook Verification',
                                desc: 'Tamper-proof weekly reflections with institutional audit trails.',
                                tag: 'Zero Friction'
                            },
                            {
                                icon: Zap,
                                title: 'Real-Time Evaluation Engine',
                                desc: 'Multi-criteria rubrics, instant grading, and automated notifications.',
                                tag: 'Active'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="p-4 rounded-xl bg-[#101626]/80 border border-[#1f293d] hover:border-slate-600 transition-all flex items-start gap-3.5 backdrop-blur-sm shadow-sm"
                            >
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <item.icon size={16} className="text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-slate-200 tracking-tight">{item.title}</p>
                                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                            {item.tag}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Status Footnote */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#1f293d]/80 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-medium text-slate-400">All Systems Operational</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">TLS 1.3 / ISO 27001</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel – Interactive Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 xl:p-16 relative h-full overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="w-full max-w-[420px] space-y-8 relative z-10"
                >
                    {/* Mobile Brand */}
                    <div className="flex items-center gap-3 lg:hidden mb-6">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-extrabold text-base text-white tracking-tight">AttachPro</span>
                            <span className="block text-[9px] uppercase font-bold tracking-widest text-indigo-400">AMS Platform</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Sign In</h2>
                        <p className="text-slate-400 text-sm font-normal">
                            Enter your institutional credentials to access your portal.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs leading-relaxed"
                        >
                            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300">Work Email</label>
                            <div className="relative group">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[#101626] border border-[#1f293d] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="name@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-300">Password</label>
                                <span className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer">Forgot password?</span>
                            </div>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-[#101626] border border-[#1f293d] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white transition-all shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_12px_30px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="border-t border-[#1f293d] pt-6 text-center">
                        <p className="text-xs text-slate-400">
                            Need to register an institution?{' '}
                            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 group ml-1">
                                Register Institution
                                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;

