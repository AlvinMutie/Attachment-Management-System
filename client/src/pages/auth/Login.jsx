import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="min-h-screen flex bg-slate-950 text-white">
            {/* Left Panel */}
            <div className="hidden lg:flex flex-col justify-between w-[42%] bg-slate-900 border-r border-white/5 p-12">
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-bold text-white tracking-wide">AMS Portal</span>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white leading-tight mb-3">
                                Attachment<br />Management System
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                A centralised platform for managing student internships, logbooks, attendance, and institutional reporting.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Students', desc: 'Submit logbooks & track attendance' },
                                { label: 'Supervisors', desc: 'Review reports & validate presence' },
                                { label: 'Schools', desc: 'Manage placements & generate reports' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">{item.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-600">
                    For portal access issues, contact your institution's administrator.
                </p>
            </div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-[400px] space-y-8">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-bold text-sm text-white">AMS Portal</span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white">Sign in</h2>
                        <p className="text-slate-400 text-sm mt-1">Enter your credentials to access your account.</p>
                    </div>

                    {error && (
                        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-colors"
                                    placeholder="you@institution.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="border-t border-white/5 pt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Registering a new institution?{' '}
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                Get started
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
