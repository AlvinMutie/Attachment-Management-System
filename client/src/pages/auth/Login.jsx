import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Home, ArrowRight, Layers, FileCheck, Users } from 'lucide-react';
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

            {/* Left Panel: Linear / Figma Workflow Spotlight */}
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
                                <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-mono">Academic Portal</span>
                            </div>
                        </div>

                        {/* Headings */}
                        <div className="mt-16 space-y-3">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium">
                                Institutional Sign-In
                            </div>
                            <h1 className="text-3xl xl:text-4xl font-semibold text-white tracking-tight leading-snug">
                                Designed for real-time <br />
                                attachment tracking.
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                Manage weekly logbooks, supervisor grading, and faculty compliance records in one unified workspace.
                            </p>
                        </div>
                    </div>

                    {/* Role Overview Tiles */}
                    <div className="space-y-3 my-8">
                        {[
                            {
                                icon: Layers,
                                title: 'Logbook Submissions & Grading',
                                desc: 'Students submit reflections; supervisors review and assign rubric scores.',
                                color: 'border-violet-500/20 text-violet-400'
                            },
                            {
                                icon: Users,
                                title: 'Dual Supervisor Collaboration',
                                desc: 'Seamless coordination between university faculty and workplace mentors.',
                                color: 'border-sky-500/20 text-sky-400'
                            },
                            {
                                icon: FileCheck,
                                title: 'Direct Faculty Audit Trail',
                                desc: 'Automatic timestamps and attendance records for academic credit verification.',
                                color: 'border-emerald-500/20 text-emerald-400'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-3.5 rounded-lg bg-[#15171f] border border-[#22242f] flex items-start gap-3"
                            >
                                <div className={`w-7 h-7 rounded-md bg-[#181a24] border ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                                    <item.icon size={15} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-200">{item.title}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Status */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#22242f] text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-slate-400 text-[11px]">System Status: All systems normal</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-600">Build v2.4.0</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel – Sign In Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 xl:p-16 relative h-full overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-[400px] space-y-6 relative z-10"
                >
                    {/* Header */}
                    <div className="space-y-1.5">
                        <h2 className="text-2xl font-semibold text-white tracking-tight">Sign in to your account</h2>
                        <p className="text-slate-400 text-xs font-normal">
                            Enter your institutional email to access your workspace.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2.5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed">
                            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">Email address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
                                    placeholder="student@university.ac.ke"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-slate-300">Password</label>
                            </div>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-xs font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Continue to Portal</span>
                                    <ArrowRight size={13} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="border-t border-[#22242f] pt-5 text-center">
                        <p className="text-xs text-slate-400">
                            Looking to onboard your institution?{' '}
                            <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1">
                                Register school
                                <span>→</span>
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
