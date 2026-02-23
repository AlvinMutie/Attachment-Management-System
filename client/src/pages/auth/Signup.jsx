import React, { useState } from 'react';
import { Building2, Mail, Globe, User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto border border-green-500/20">
                        <CheckCircle size={32} className="text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Application Submitted</h2>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            We've received your registration for <span className="text-white font-medium">{formData.schoolName}</span>.
                            Our team will review and send credentials to <span className="text-white font-medium">{formData.adminEmail}</span> within 24 hours.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    // ── Main Form ──────────────────────────────────────────────────
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

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white leading-tight mb-3">
                                Register your<br />institution
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Join the AMS network to manage student attachments, logbooks, and institutional reporting in one place.
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            {[
                                'Approval-based registration review',
                                'Admin credentials sent within 24 hours',
                                'Onboard students and supervisors instantly',
                                'Full institutional reporting dashboard',
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-600">
                    Already registered? <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors">Sign in here.</Link>
                </p>
            </div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-[420px] space-y-8">
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

                    {/* Step indicator */}
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            {['Institution Details', 'Admin Account'].map((label, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > i + 1 ? 'bg-blue-600 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-500'}`}>
                                            {step > i + 1 ? '✓' : i + 1}
                                        </div>
                                        <span className={`text-xs font-medium transition-colors ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{label}</span>
                                    </div>
                                    {i < 1 && <div className={`flex-1 h-px transition-colors ${step > 1 ? 'bg-blue-600' : 'bg-white/10'}`} />}
                                </React.Fragment>
                            ))}
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            {step === 1 ? 'Institution details' : 'Administrator account'}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {step === 1 ? 'Tell us about your school or university.' : 'Who will manage this portal?'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Institution Name</label>
                                    <div className="relative">
                                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-colors"
                                            placeholder="e.g. Nairobi Technical University"
                                            value={formData.schoolName}
                                            onChange={update('schoolName')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Official Website</label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="url"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-colors"
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
                                    <label className="text-sm font-medium text-slate-300">Admin Full Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-colors"
                                            placeholder="Full Name"
                                            value={formData.adminName}
                                            onChange={update('adminName')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Admin Work Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.07] transition-colors"
                                            placeholder="admin@institution.ac.ke"
                                            value={formData.adminEmail}
                                            onChange={update('adminEmail')}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex gap-3 pt-1">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-slate-300 transition-colors"
                                >
                                    <ArrowLeft size={15} /> Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {step === 1 ? 'Continue' : 'Submit Application'}
                                        {!loading && <ArrowRight size={15} />}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="border-t border-white/5 pt-5 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterSchool;
