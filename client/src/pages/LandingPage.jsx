import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    PlayCircle,
    BarChart3,
    Users,
    QrCode,
    FileText,
    ChevronRight,
    Globe,
    Shield,
    Zap,
    Building2,
    AlertCircle,
    ArrowRight,
    MousePointer2,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const M3Card = ({ children, className = "" }) => (
    <div className={`glass-card p-10 border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:shadow-[0_0_50px_rgba(37,99,235,0.15)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {children}
    </div>
);

const LandingPage = () => {
    const [openFaq, setOpenFaq] = React.useState(null);
    const [isDarkMode, setIsDarkMode] = React.useState(true);

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

    const stakeholders = [
        {
            role: "Students",
            benefit: "Universal Activity Hub",
            description: "Say goodbye to lost paperwork. Submit technical logs and verify presence with an encrypted industrial QR system.",
            icon: QrCode,
            color: "text-blue-400"
        },
        {
            role: "Industry Supervisors",
            benefit: "Operational Intelligence",
            description: "Review and validate student logbooks in seconds. Monitor attendance through an intuitive real-time radar.",
            icon: Users,
            color: "text-emerald-400"
        },
        {
            role: "Schools",
            benefit: "Academic Transparency",
            description: "Full visibility over all student placements. Generate automated reports and academic assessments with AI-powered insights.",
            icon: Building2,
            color: "text-purple-400"
        }
    ];

    const faqs = [
        {
            q: "How fast can we onboard our institution?",
            a: "Most schools are fully operational within 48 hours. Our onboarding engine handles the mass-import of students and supervisor hierarchies automatically."
        },
        {
            q: "Can students submit logbooks offline?",
            a: "Yes. The platform is designed for field resilience. Students can draft logs offline and sync them instantly once a network connection is established."
        },
        {
            q: "Is the QR attendance truly secure?",
            a: "Absolutely. Our QR tokens are time-weighted and cryptographically linked to student biometric identifiers, preventing any unauthorized clock-ins."
        },
        {
            q: "Does it support custom brand identities?",
            a: "Yes. Every institution gets a dedicated branding engine to customize platform colors, logos, and identity to maintain trust with students."
        }
    ];

    return (
        <div className={`page-container font-sans selection:bg-[var(--brand-primary)]/30 transition-colors duration-1000 overflow-x-hidden ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <Navbar />

            {/* Theme Toggle Button */}
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`fixed bottom-10 right-10 z-[100] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90 border backdrop-blur-xl ${isDarkMode ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-slate-900/10 border-slate-200 text-slate-900 hover:bg-slate-900/20'}`}
                title="Toggle Theme"
            >
                {isDarkMode ? <Sparkles size={24} /> : <Zap size={24} />}
            </button>

            {/* Hero Section */}
            <section className="relative pt-32 pb-40 md:pt-40 md:pb-60 min-h-screen flex items-center">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] blur-[150px] rounded-full animate-float-slow transition-opacity duration-1000 ${isDarkMode ? 'bg-[var(--brand-primary)]/20 opacity-100' : 'bg-blue-600/10 opacity-50'}`} />
                    <div className={`absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] blur-[150px] rounded-full animate-float transition-opacity duration-1000 ${isDarkMode ? 'bg-purple-600/10 opacity-100' : 'bg-purple-600/5 opacity-30'}`} />
                </div>

                <div className="content-width relative z-10">
                    <div className="max-w-4xl space-y-12 animate-fade-in">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`inline-flex items-center space-x-3 px-6 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-[0.3em] backdrop-blur-md ${isDarkMode ? 'bg-white/5 border-white/10 text-[var(--brand-primary)]' : 'bg-blue-600/5 border-blue-600/10 text-blue-600'}`}
                        >
                            <Sparkles size={16} fill="currentColor" />
                            <span>Empowering Next-Gen Attachments</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter"
                        >
                            The Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] via-blue-400 to-cyan-400">Institutional</span> <br />
                            Oversight.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-xl md:text-2xl font-medium max-w-2xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                            AMS is a premium enterprise ecosystem for managing student internships with real-time monitoring, AI-assisted reporting, and secure digital evidence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-8 pt-6"
                        >
                            <Link to="/signup" className="group relative px-12 py-5 bg-[var(--brand-primary)] rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.6)] transition-all hover:scale-105 active:scale-95 text-center overflow-hidden text-white">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10">Initialize Portal</span>
                            </Link>
                            <a href="#vision" className={`flex items-center justify-center space-x-4 transition-all font-black text-xs uppercase tracking-[0.2em] group ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                                <span className={`border-b-2 border-transparent transition-all ${isDarkMode ? 'group-hover:border-white' : 'group-hover:border-slate-900'}`}>Explore Platform Vision</span>
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Dashboard Ghost */}
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[50%] opacity-20 hidden xl:block pointer-events-none select-none">
                    <div className={`glass-card p-8 border-white/10 scale-125 rotate-6 ${isDarkMode ? 'bg-white/[0.03]' : 'bg-slate-900/[0.03]'}`}>
                        <div className="space-y-6">
                            <div className={`h-4 w-40 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-slate-900/20'}`} />
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`h-32 rounded-3xl ${isDarkMode ? 'bg-white/10' : 'bg-slate-900/10'}`} />
                                <div className="h-32 bg-[var(--brand-primary)]/20 rounded-3xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Institutional Trust Strip - Infinite Loop */}
            <section className={`py-20 border-y relative overflow-hidden whitespace-nowrap ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-slate-100/50'}`}>
                <div className="flex w-fit">
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32"
                    >
                        {[...Array(2)].map((_, groupIndex) => (
                            <React.Fragment key={groupIndex}>
                                {['Academy Group', 'Tech Institute', 'Westfield Uni', 'Global Polytechnic', 'Northway College'].map((name, i) => (
                                    <div key={`${groupIndex}-${i}`} className="flex items-center space-x-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-opacity">
                                        <Building2 size={24} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
                                        <span className={`font-black uppercase tracking-[0.3em] text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{name}</span>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <section id="vision" className="py-40 relative">
                <div className="content-width">
                    <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
                        <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${!isDarkMode && 'text-slate-900'}`}>Engineered for <span className="text-[var(--brand-primary)]">Precision.</span></h2>
                        <p className={`text-xl font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>A unified infrastructure where schools, supervisors, and students operate within a single source of truth.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {stakeholders.map((s, i) => (
                            <div key={i} className={`glass-card p-10 border hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden ${isDarkMode ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]' : 'bg-white border-slate-200 hover:shadow-xl shadow-slate-200'}`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border shadow-inner ${s.color} ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                    <s.icon size={32} />
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-primary)] block">{s.role}</span>
                                    <h3 className={`text-2xl font-black group-hover:translate-x-2 transition-transform ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{s.benefit}</h3>
                                    <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>{s.description}</p>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white group-hover:border-transparent transition-all ${isDarkMode ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Intelligence Feature Breakdown */}
            <section id="features" className={`py-40 border-y ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="content-width">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className={`text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Advanced Core <br /> <span className="text-[var(--brand-primary)]">Intelligence.</span></h2>
                                <p className={`text-lg leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Platform-wide systems built to ensure compliance, integrity, and operational excellence.</p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { title: "Real-time Presence Radar", icon: Globe, desc: "Monitor student clock-ins across multiple geographical sites instantly." },
                                    { title: "AI Reporting Engine", icon: Sparkles, desc: "Automatically refine student logbooks for high-impact technical reporting." },
                                    { title: "Biometric QR Vault", icon: Shield, desc: "Encrypted verification system that eliminates attendance fraud." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0 border border-[var(--brand-primary)]/20 shadow-[0_0_20px_rgba(37,99,235,0.1)] group-hover:scale-110 transition-transform">
                                            <item.icon size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className={`font-black uppercase tracking-widest text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                                            <p className={`text-[13px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive UI Preview */}
                        <div className="relative">
                            <div className={`absolute -inset-20 bg-[var(--brand-primary)]/10 blur-[100px] rounded-full opacity-50`} />
                            <div className={`relative glass-card !p-0 border overflow-hidden shadow-2xl rounded-[3rem] backdrop-blur-2xl ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-slate-200'}`}>
                                <div className={`p-8 border-b flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full border text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        Presence.hub
                                    </div>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Global Status</p>
                                            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>92.4% Active</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`w-3 h-${i * 2 + 4} bg-[var(--brand-primary)] rounded-full opacity-${i * 20}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                                                    <div className={`w-24 h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-300'}`} />
                                                </div>
                                                <div className="w-12 h-4 bg-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-full flex items-center justify-center">LIVE</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-40">
                <div className="content-width">
                    <div className="grid lg:grid-cols-3 gap-20">
                        <div className="space-y-6 lg:sticky lg:top-40 h-fit">
                            <h2 className={`text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Operations <br /> <span className="text-[var(--brand-primary)]">Intelligence.</span></h2>
                            <p className={`font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Common clarifications for institutional deployment leads.</p>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className={`group border rounded-[2rem] overflow-hidden transition-all ${isDarkMode ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]' : 'border-slate-200 bg-white hover:shadow-lg shadow-slate-200/50'}`}>
                                    <button
                                        onClick={() => toggleFaq(i)}
                                        className="w-full px-10 py-8 text-left flex items-center justify-between"
                                    >
                                        <span className={`font-black text-sm uppercase tracking-widest group-hover:text-[var(--brand-primary)] transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{faq.q}</span>
                                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${openFaq === i ? 'rotate-90 bg-[var(--brand-primary)] border-transparent text-white' : 'text-slate-500 border-slate-200'}`}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </button>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                                        className={`overflow-hidden ${isDarkMode ? 'bg-slate-900/40' : 'bg-slate-50'}`}
                                    >
                                        <div className={`px-10 pb-10 text-[14px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Integrated CTA */}
            <section className="py-40 relative">
                <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-gradient-to-b from-transparent via-[var(--brand-primary)]/5 to-transparent' : 'bg-slate-50'}`} />
                <div className="content-width relative z-10 text-center space-y-12">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <h2 className={`text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Elevate Your <br />
                            <span className="text-[var(--brand-primary)]">Standards</span> Today.
                        </h2>
                        <p className={`text-xl font-medium max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Digitize accountability and professional oversight with Institutional-grade infrastructure.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link to="/signup" className={`px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'bg-white text-slate-950 shadow-white/10' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                            Initialize Portal
                        </Link>
                        <Link to="/login" className={`px-10 py-4 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 group transition-colors ${isDarkMode ? 'text-white hover:text-[var(--brand-primary)]' : 'text-slate-900 hover:text-blue-600'}`}>
                            System Login
                            <MousePointer2 size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
