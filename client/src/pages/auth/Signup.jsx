import React, { useState } from 'react';
import { Building2, Mail, Lock, Globe, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterSchool = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        schoolName: '',
        schoolWebsite: '',
        adminName: '',
        adminEmail: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step < 2) {
            setStep(2);
            return;
        }
        setLoading(true);
        // Simulate registration
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 2000);
    };

    if (step === 3) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 bg-mesh relative overflow-hidden">
                <div className="glass-card w-full max-w-[500px] p-12 text-center space-y-8 animate-fade-in">
                    <div className="w-24 h-24 bg-green-600/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={56} />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">Request Received!</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        We've received your registration for <span className="text-white font-bold">{formData.schoolName}</span>.
                        Our team will verify your institution and send the administrator credentials to {formData.adminEmail} within 24 hours.
                    </p>
                    <button onClick={() => navigate('/')} className="btn-primary w-full py-4 text-sm uppercase tracking-widest">
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 bg-mesh relative overflow-hidden">
            {/* Decorative Blurs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

            <div className="glass-card w-full max-w-[500px] p-10 space-y-10 relative z-10 animate-fade-in">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 text-blue-500 mb-4 border border-blue-500/20 shadow-inner">
                        <Building2 size={40} className="opacity-80" />
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">Register School</h2>
                    <p className="text-slate-500 font-medium">Join AttachPro institutional network</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between px-2">
                    <div className={`h-1 w-[45%] rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-blue-600' : 'bg-white/10'}`} />
                    <div className={`h-1 w-[45%] rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-blue-600' : 'bg-white/10'}`} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Institution Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="input-field pl-12"
                                        placeholder="e.g. Modern University of Technology"
                                        value={formData.schoolName}
                                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Official Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="url"
                                        required
                                        className="input-field pl-12"
                                        placeholder="https://www.school.edu"
                                        value={formData.schoolWebsite}
                                        onChange={(e) => setFormData({ ...formData, schoolWebsite: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Admin Full Name</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="input-field pl-12"
                                        placeholder="Full Name"
                                        value={formData.adminName}
                                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Admin Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="input-field pl-12"
                                        placeholder="admin@school.edu"
                                        value={formData.adminEmail}
                                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 text-sm uppercase tracking-widest font-black"
                    >
                        {loading ? 'Processing...' : (
                            <div className="flex items-center justify-center space-x-2">
                                <span>{step === 1 ? 'Next Step' : 'Request Onboarding'}</span>
                                <ArrowRight size={18} />
                            </div>
                        )}
                    </button>

                    {step === 2 && (
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Go Back
                        </button>
                    )}
                </form>

                <div className="pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-xs font-medium">
                        Already registered? <Link to="/login" className="text-blue-500 hover:underline font-bold">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterSchool;
