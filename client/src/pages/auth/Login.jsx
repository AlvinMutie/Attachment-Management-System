import React, { useState } from 'react';
import {
    Mail, Lock, AlertCircle, Eye, EyeOff, Home,
    ArrowRight, Layers, FileCheck, Users,
    GraduationCap, Briefcase, Compass, ShieldCheck,
    Building2, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEMO_ACCOUNTS = [
    {
        role: 'student',
        label: 'Student',
        email: 'student_a@ams.com',
        password: 'password123',
        icon: GraduationCap,
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
        role: 'industry_supervisor',
        label: 'Industry Supervisor',
        email: 'supervisor_a@ams.com',
        password: 'password123',
        icon: Briefcase,
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
        role: 'university_supervisor',
        label: 'Uni Supervisor',
        email: 'unisup_a@ams.com',
        password: 'password123',
        icon: Users,
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
        role: 'attachment_coordinator',
        label: 'Coordinator',
        email: 'coordinator_a@ams.com',
        password: 'password123',
        icon: Compass,
        badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    },
    {
        role: 'school_admin',
        label: 'School Admin',
        email: 'schooladmin_a@ams.com',
        password: 'password123',
        icon: Building2,
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
        role: 'super_admin',
        label: 'Super Admin',
        email: 'superadmin@ams.com',
        password: 'password123',
        icon: ShieldCheck,
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    }
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [autoLoggingIn, setAutoLoggingIn] = useState(null);

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

    const handleLoginWithCredentials = async (targetEmail, targetPassword) => {
        setError('');
        setLoading(true);
        try {
            const user = await login(targetEmail, targetPassword);
            navigate(rolePaths[user.role] || '/');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please verify your email and password.');
        } finally {
            setLoading(false);
            setAutoLoggingIn(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLoginWithCredentials(email, password);
    };

    const handleQuickFill = (acc, autoSubmit = false) => {
        setEmail(acc.email);
        setPassword(acc.password);
        if (autoSubmit) {
            setAutoLoggingIn(acc.role);
            handleLoginWithCredentials(acc.email, acc.password);
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
                className="hidden lg:flex flex-col justify-between w-[44%] bg-[#12141c] border-r border-[#22242f] p-12 xl:p-14 relative overflow-hidden"
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
                        <div className="mt-12 space-y-2.5">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-medium">
                                Institutional Sign-In
                            </div>
                            <h1 className="text-3xl xl:text-4xl font-semibold text-white tracking-tight leading-snug">
                                Real-time academic <br />
                                attachment tracking.
                            </h1>
                            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                                Manage weekly logbooks, supervisor grading, and faculty compliance records in one unified workspace.
                            </p>
                        </div>
                    </div>

                    {/* Role Overview Tiles */}
                    <div className="space-y-2.5 my-6">
                        {[
                            {
                                icon: Layers,
                                title: 'Logbook Submissions & Grading',
                                desc: 'Students submit reflections; supervisors review and assign scores.',
                                color: 'border-violet-500/20 text-violet-400'
                            },
                            {
                                icon: Users,
                                title: 'Dual Supervisor Collaboration',
                                desc: 'Coordination between university faculty and workplace mentors.',
                                color: 'border-sky-500/20 text-sky-400'
                            },
                            {
                                icon: FileCheck,
                                title: 'Direct Faculty Audit Trail',
                                desc: 'Automatic attendance records for academic credit verification.',
                                color: 'border-emerald-500/20 text-emerald-400'
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-3 rounded-lg bg-[#15171f] border border-[#22242f] flex items-start gap-3"
                            >
                                <div className={`w-7 h-7 rounded-md bg-[#181a24] border ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                                    <item.icon size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-200">{item.title}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Status */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#22242f] text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-slate-400 text-[11px]">All systems normal</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-600">Build v2.4.0</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel – Sign In Form & Quick Demo Buttons */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 xl:p-12 relative h-full overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-[440px] space-y-5 relative z-10 my-auto"
                >
                    {/* Header */}
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold text-white tracking-tight">Sign in to your account</h2>
                        <p className="text-slate-400 text-xs font-normal">
                            Enter your credentials or click any demo account below for 1-click login.
                        </p>
                    </div>

                    {/* Quick Demo Test Accounts Panel */}
                    <div className="bg-[#12141c] border border-[#22242f] rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Zap size={13} className="text-amber-400" /> Quick Demo Accounts (1-Click)
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Password: password123</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {DEMO_ACCOUNTS.map((acc) => {
                                const Icon = acc.icon;
                                const isBusy = autoLoggingIn === acc.role;
                                return (
                                    <button
                                        key={acc.role}
                                        type="button"
                                        onClick={() => handleQuickFill(acc, true)}
                                        disabled={loading}
                                        title={`1-Click login as ${acc.label} (${acc.email})`}
                                        className="p-2 rounded-lg bg-[#15171f] border border-[#22242f] hover:border-violet-500/50 hover:bg-[#181a24] text-left transition-all group flex flex-col justify-between h-[52px]"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white truncate">
                                                {acc.label}
                                            </span>
                                            {isBusy ? (
                                                <div className="w-2.5 h-2.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Icon size={12} className="text-slate-500 group-hover:text-violet-400 shrink-0" />
                                            )}
                                        </div>
                                        <span className="text-[9px] text-slate-500 truncate font-mono">
                                            {acc.email.split('@')[0]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2.5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed">
                            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300">Email address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
                                    placeholder="user@ams.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-slate-300">Password</label>
                            </div>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-[#15171f] border border-[#22242f] rounded-md pl-10 pr-10 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all font-sans"
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
                            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-xs font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
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
                    <div className="border-t border-[#22242f] pt-4 text-center">
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
