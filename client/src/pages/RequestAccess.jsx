import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Mail, User, Phone, MapPin,
    MessageSquare, Send, CheckCircle, ArrowLeft,
    Globe
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RequestAccess = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('form'); // 'form' | 'success'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        schoolName: '',
        adminName: '',
        contactEmail: '',
        phoneNumber: '',
        address: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { schoolName, adminName, contactEmail } = formData;
        if (!schoolName || !adminName || !contactEmail) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_URL}/api/inquiry`, formData);
            setStep('success');
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="glass-card p-12 w-full max-w-lg text-center animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-600/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="text-emerald-400" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Application Received</h2>
                    <p className="text-slate-400 font-medium mb-2">
                        Thank you, <span className="text-white font-bold">{formData.adminName}</span>.
                    </p>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                        Your request to register <strong className="text-slate-300">{formData.schoolName}</strong> has been logged. Our team will review your application and get back to you at <strong className="text-blue-400">{formData.contactEmail}</strong> within 1–2 business days.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl animate-fade-in">
                {/* Header */}
                <div className="text-center mb-10">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-300 mb-8 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </button>
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 mx-auto mb-6">
                        <Globe size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Request <span className="text-blue-500">Access</span>
                    </h1>
                    <p className="text-slate-400 text-base mt-3 font-medium max-w-md mx-auto">
                        Interested in using our platform? Submit your institution's details and our team will be in touch.
                    </p>
                </div>

                {/* Form */}
                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Institution Info */}
                        <div className="border-b border-white/5 pb-6 space-y-5">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Institution Details</p>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                    Institution Name <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        name="schoolName"
                                        value={formData.schoolName}
                                        onChange={handleChange}
                                        placeholder="e.g. Greenwood Institute of Technology"
                                        className="input-field pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="City, Region, Country"
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="+1 234 567 8900"
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="border-b border-white/5 pb-6 space-y-5">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Primary Contact</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                        Your Full Name <span className="text-rose-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            name="adminName"
                                            value={formData.adminName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="input-field pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                        Email Address <span className="text-rose-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            placeholder="admin@school.edu"
                                            className="input-field pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Optional message */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                Additional Notes
                            </label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3.5 text-slate-500" size={18} />
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Tell us about your institution, how many students you have, any specific requirements..."
                                    className="input-field pl-10 resize-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                            <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium">Sign in</a>
                </p>
            </div>
        </div>
    );
};

export default RequestAccess;
