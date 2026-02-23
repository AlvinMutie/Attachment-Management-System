import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Home } from 'lucide-react';
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
        'school_admin': '/school_admin/dashboard',
        'super_admin': '/superadmin/dashboard'
    };

    const containerVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            navigate(rolePaths[user.role] || '/');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    <div className="flex items-center gap-3 mb-12 mt-4 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/20">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-black text-xl text-white tracking-widest uppercase">AttachPro</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8 scrollbar-hide pb-10">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                                UNIVERSAL <br />
                                <span className="text-blue-500">OVERSIGHT</span> ENGINE.
                            </h1>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                                The definitive institutional portal for managing student attachments with precision and security.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Student Hub', desc: 'Secure logbooks & presence verification' },
                                { label: 'Supervisor Control', desc: 'Real-time validation & assessments' },
                                { label: 'Admin Intelligence', desc: 'Strategic oversight & reporting' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group"
                                >
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0 group-hover:scale-125 transition-transform" />
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 pt-8 border-t border-white/5 mt-auto bg-slate-900">
                    <div className="w-8 h-px bg-slate-800" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                        System Integrity Validated
                    </p>
                </div>
            </motion.div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-20 relative h-full overflow-y-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/[0.03] blur-[120px] rounded-full pointer-events-none" />

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

                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">System Access</h2>
                        <p className="text-slate-400 text-base font-medium">Enter high-level credentials to initialize your session.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-start gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium"
                        >
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Universal Identity</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl pl-12 pr-5 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all shadow-inner"
                                    placeholder="email@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Access Token</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl pl-12 pr-12 py-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-slate-900/50 transition-all shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                            ) : (
                                <span className="relative z-10">Initialize Session</span>
                            )}
                        </button>
                    </form>

                    <div className="border-t border-white/[0.05] pt-10 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Registering new infrastructure?{' '}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-bold ml-1 inline-flex items-center gap-1 group">
                                Get Started
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Login;
