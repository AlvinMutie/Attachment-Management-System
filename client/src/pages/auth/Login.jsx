import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, demoLogin } = useAuth();
    const navigate = useNavigate();

    const rolePaths = {
        'student': '/student/dashboard',
        'industry_supervisor': '/industry/dashboard',
        'university_supervisor': '/university/dashboard',
        'school_admin': '/school_admin/dashboard',
        'super_admin': '/super_admin/dashboard'
    };

    const handleDemoLogin = (role) => {
        const user = demoLogin(role);
        navigate(rolePaths[user.role] || '/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            console.log('Logged in as:', user.role);
            navigate(rolePaths[user.role] || '/');
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 bg-mesh relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

            <div className="glass-card w-full max-w-[440px] p-10 space-y-10 relative z-10 animate-fade-in shadow-blue-900/40">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 text-blue-500 mb-4 border border-blue-500/20 shadow-inner">
                        <Zap size={40} fill="currentColor" className="opacity-80" />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 font-medium">Continue to your AttachPro account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-3 transition-all">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="email"
                                required
                                className="input-field w-full pl-10"
                                placeholder="name@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="password"
                                required
                                className="input-field w-full pl-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary w-full py-3 text-lg mt-4 flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="pt-6 border-t border-white/5 space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] text-center">Quick Access for Demo</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { role: 'student', label: 'Student', color: 'hover:border-blue-500/50' },
                            { role: 'industry_supervisor', label: 'Industry', color: 'hover:border-green-500/50' },
                            { role: 'university_supervisor', label: 'University', color: 'hover:border-purple-500/50' },
                            { role: 'school_admin', label: 'Admin', color: 'hover:border-orange-500/50' },
                            { role: 'super_admin', label: 'Super Admin', color: 'hover:border-red-500/50', span: true },
                        ].map((demo) => (
                            <button
                                key={demo.role}
                                onClick={() => handleDemoLogin(demo.role)}
                                className={`text-[10px] font-black uppercase tracking-widest py-3 bg-white/5 border border-white/5 rounded-xl transition-all ${demo.color} ${demo.span ? 'col-span-2' : ''} text-slate-400 hover:text-white hover:bg-white/10`}
                            >
                                {demo.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-4">
                    <p className="text-sm text-slate-500">
                        For academic portal assistance, contact your department.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
