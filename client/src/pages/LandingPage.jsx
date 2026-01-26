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
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-110 ${color}`}>
            <Icon size={36} />
        </div>
        <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-slate-500 text-[11px] leading-relaxed font-bold tracking-tight uppercase opacity-60 px-2">{description}</p>
    </div>
);

const LandingPage = () => {
    const [openFaq, setOpenFaq] = React.useState(null);

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

    const stakeholders = [
        {
            role: "Students",
            benefit: "Digital Logbooks & Clock-in",
            description: "Say goodbye to lost paperwork. Submit logs daily and verify attendance with a secure industrial QR system.",
            icon: QrCode,
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            role: "Industry Supervisors",
            benefit: "Seamless Oversight",
            description: "Review and approve student logbooks in seconds. Monitor attendance through an intuitive real-time radar.",
            icon: Users,
            color: "bg-green-500/10 text-green-500"
        },
        {
            role: "Schools",
            benefit: "Institutional Compliance",
            description: "Full visibility over all student placements. Generate automated reports and academic assessments with ease.",
            icon: Building2,
            color: "bg-purple-500/10 text-purple-500"
        }
    ];

    const faqs = [
        {
            q: "How fast can we deploy AttachPro?",
            a: "Most institutions are fully operational within 48 hours. Our onboarding team handles the initial school and supervisor setup for you."
        },
        {
            q: "Can students submit logbooks offline?",
            a: "Yes. Students can draft and save their logbooks offline. Once they reconnect to a network, their progress is automatically synced to the cloud."
        },
        {
            q: "Is the QR attendance tamper-proof?",
            a: "Absolutely. Our tokens are time-weighted and encrypted with student IDs and timestamps, preventing unauthorized sharing or remote check-ins."
        },
        {
            q: "Does it support existing school IDs?",
            a: "AttachPro can be configured to use your existing institutional IDs, ensuring a familiar experience for both students and administration."
        }
    ];

    return (
        <div className="page-container bg-white font-sans selection:bg-blue-600/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-40 overflow-hidden min-h-[85vh] flex items-center bg-slate-950">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
                    <div className="absolute top-[20%] left-[10%] w-[30%] h-[40%] bg-blue-400/5 blur-[100px] rounded-full" />
                </div>

                <div className="content-width relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-white space-y-8 animate-fade-in">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                <Zap size={14} fill="currentColor" />
                                <span>Revolutionizing Attachments</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                                Streamline <span className="text-blue-500">Internship</span> Management
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                                A cutting-edge platform for schools to efficiently manage student attachments, logbooks, and attendance with professional precision.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                <Link to="/signup" className="bg-blue-600 text-white px-12 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 active:scale-95 text-center">
                                    Get Started Free
                                </Link>
                                <a href="#features" className="flex items-center justify-center space-x-3 text-slate-400 hover:text-white transition-colors font-black text-xs uppercase tracking-widest group">
                                    <span>Explore Ecosystem</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* High Fidelity Dashboard Mockup */}
                        <div className="relative animate-float hidden lg:block" style={{ perspective: '1000px' }}>
                            <div className="absolute -inset-10 bg-blue-600/20 blur-[100px] rounded-full z-0 opacity-50" />

                            <div className="relative z-10 glass-card p-6 border border-white/20 shadow-2xl overflow-hidden max-w-xl bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem]">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                        <div className="space-y-1">
                                            <div className="w-12 h-1 bg-blue-600 rounded-full" />
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Student Portal</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center">
                                            <Users size={18} className="text-blue-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Score', val: '92%', color: 'text-green-500', icon: CheckCircle },
                                            { label: 'Logs', val: '8/12', color: 'text-blue-500', icon: FileText },
                                            { label: 'Days', val: '24', color: 'text-purple-500', icon: BarChart3 }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                                                <stat.icon size={16} className={`${stat.color} mx-auto mb-2`} />
                                                <p className="text-[8px] text-slate-500 uppercase font-black tracking-tighter mb-1">{stat.label}</p>
                                                <p className={`text-base font-black ${stat.color}`}>{stat.val}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-5 gap-4">
                                        <div className="col-span-3 space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="bg-white/5 p-4 rounded-2xl border-l-4 border-blue-600">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="w-16 h-2 bg-slate-700 rounded-full" />
                                                        <div className="w-10 h-2 bg-green-500/20 rounded-full" />
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-800 rounded-full mb-1.5 opacity-40" />
                                                    <div className="w-2/3 h-1.5 bg-slate-800 rounded-full opacity-30" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="col-span-2 bg-gradient-to-b from-blue-600/20 to-transparent p-5 rounded-3xl flex flex-col items-center justify-center space-y-4 border border-blue-500/20 shadow-inner">
                                            <div className="w-full aspect-square bg-white rounded-2xl p-3 flex items-center justify-center shadow-2xl">
                                                <QrCode className="text-slate-950 w-full h-full" strokeWidth={1} />
                                            </div>
                                            <div className="w-12 h-1.5 bg-blue-400/30 rounded-full animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="bg-orange-600/10 border border-orange-500/20 p-5 rounded-2xl flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center shadow-inner">
                                            <AlertCircle className="text-orange-500" size={20} />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <div className="w-full h-2 bg-orange-500/20 rounded-full" />
                                            <div className="w-2/3 h-2 bg-orange-500/10 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/20 via-transparent to-transparent pointer-events-none" />
                            </div>

                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/30 blur-3xl opacity-60" />
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/20 blur-3xl opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-24 bg-white border-b border-slate-100 overflow-hidden">
                <div className="content-width text-center">
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-16 opacity-70">
                        Institutional Grade Infrastructure
                    </p>

                    {/* Animated Slider Container */}
                    <div className="relative group">
                        {/* Gradient Masks for edges */}
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                        <motion.div
                            className="flex items-center space-x-16 md:space-x-32 whitespace-nowrap"
                            animate={{
                                x: ["10%", "-10%"]
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    duration: 12,
                                    ease: "easeInOut"
                                }
                            }}
                        >
                            {[
                                { name: 'Northway', sub: 'University', color: 'bg-slate-900' },
                                { name: 'Greenville', sub: 'Institute', color: 'bg-green-600' },
                                { name: 'Westfield', sub: 'College', color: 'bg-blue-800' },
                                { name: 'Easton', sub: 'Technical', color: 'bg-indigo-700' },
                                { name: 'Lakeside', sub: 'Academy', color: 'bg-sky-700' },
                                { name: 'Summit', sub: 'Polytech', color: 'bg-emerald-700' }
                            ].map((uni, i) => (
                                <div key={i} className="inline-flex items-center space-x-4 opacity-50 hover:opacity-100 transition-all cursor-pointer grayscale hover:grayscale-0">
                                    <div className={`w-12 h-12 ${uni.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                        <Building2 size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xl font-black text-slate-800 leading-tight">{uni.name}</p>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{uni.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stakeholder Personas */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="py-32 bg-white"
            >
                <div className="content-width">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                            Built for Every Stakeholder.
                        </h2>
                        <p className="text-slate-500 text-lg font-medium">A unified ecosystem where schools, mentors, and students collaborate without friction.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {stakeholders.map((s, i) => (
                            <div key={i} className="glass-card p-10 border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${s.color}`}>
                                    <s.icon size={28} />
                                </div>
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 block">{s.role}</span>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{s.benefit}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{s.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Features (Essentials) */}
            <motion.section
                id="features"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="py-32 bg-slate-50/50"
            >
                <div className="content-width">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase tracking-wider">
                            Seamless Integration Essentials
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={CheckCircle}
                            title="Live Dashboards"
                            description="Monitor attachment status in real-time"
                            color="bg-sky-500/10 text-sky-600"
                        />
                        <FeatureCard
                            icon={QrCode}
                            title="QR Attendance"
                            description="Tamper-proof digital clocking system"
                            color="bg-blue-500/10 text-blue-600"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Peer Reviews"
                            description="Streamlined industrial mentorship flow"
                            color="bg-purple-500/10 text-purple-600"
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Smart Analytics"
                            description="Automated logbook performance scoring"
                            color="bg-indigo-500/10 text-indigo-600"
                        />
                    </div>
                </div>
            </motion.section>

            {/* How it Works (Process) */}
            <motion.section
                id="how-it-works"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="py-32 bg-white border-t border-slate-50"
            >
                <div className="content-width">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">The Modernized Workflow</h2>
                        <p className="text-slate-500 font-medium font-sans">Moving from paperwork to precision in three steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16">
                        {[
                            { step: 1, title: 'Register & Setup', desc: 'Administrators onboard their institution and industrial partners, setting up the foundation for secure student oversight.', icon: PlayCircle },
                            { step: 2, title: 'Track & Monitor', desc: 'Students log daily activities and verify presence via QR. Supervisors review submissions and provide real-time feedback.', icon: QrCode },
                            { step: 3, title: 'Analyze & Certify', desc: 'The platform aggregates data into comprehensive reports, automating the final assessment and certification process.', icon: BarChart3 }
                        ].map((process, i) => (
                            <div key={i} className="space-y-8 group transition-all">
                                <div className="flex items-center space-x-5">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-blue-600/30 group-hover:scale-110 transition-transform">
                                        {process.step}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">{process.title}</h3>
                                </div>
                                <p className="text-slate-500 leading-relaxed font-medium">{process.desc}</p>
                                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner overflow-hidden aspect-[1.2/1] flex items-center justify-center relative">
                                    <process.icon size={64} className="text-blue-100 absolute -bottom-4 -right-4 rotate-12" />
                                    <process.icon size={48} className="text-blue-200 relative z-10" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Security & Data Section */}
            <section className="py-32 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full" />

                <div className="content-width relative z-10">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center space-x-3 text-blue-400 bg-blue-400/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20">
                                <Shield size={14} />
                                <span>Institutional Trust</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                                Your Institutional <br /> Data is <span className="text-blue-500">Sacrosanct.</span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                                We prioritize data integrity and privacy at every layer. Our protocol ensures that sensitive academic and industrial information remains secure and accessible only to authorized personnel.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 shadow-inner">
                                        <Shield size={20} />
                                    </div>
                                    <h4 className="text-white font-bold text-sm">AES-256 Encryption</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">Top-tier encryption for all data in transit and at rest.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 shadow-inner">
                                        <Shield size={20} />
                                    </div>
                                    <h4 className="text-white font-bold text-sm">Granular Permissions</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">Define exactly who sees what with role-based controls.</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-12 border-blue-500/20 bg-blue-600/5 relative group cursor-default">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 blur-3xl group-hover:bg-blue-600/40 transition-all opacity-50" />
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center space-x-6">
                                    <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/40">
                                        <Shield size={32} />
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-xl">Privacy First</p>
                                        <p className="text-blue-400 text-sm font-bold opacity-80 uppercase tracking-widest">Active Protection</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest">System Integrity</span>
                                        <span className="text-green-500 font-black">99.9% UPTIME</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                        <div className="w-[99.9%] h-full bg-gradient-to-r from-blue-600 to-green-500" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 pt-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-1.5 bg-blue-500/20 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Smart FAQ Section */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="py-32 bg-white"
            >
                <div className="content-width">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                            Frequently Asked <span className="text-blue-600">Questions.</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium">Everything you need to know about the AttachPro rollout.</p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors group"
                                >
                                    <span className="text-slate-900 font-black text-sm tracking-tight group-hover:text-blue-600 transition-colors">{faq.q}</span>
                                    <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-blue-600 text-white' : 'text-slate-500'}`}>
                                        <ChevronRight size={18} />
                                    </div>
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFaq === i ? 'auto' : 0,
                                        opacity: openFaq === i ? 1 : 0
                                    }}
                                    className="overflow-hidden bg-slate-50/50"
                                >
                                    <div className="px-8 pb-8 text-slate-500 text-[13px] leading-relaxed font-medium">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Strategic CTA */}
            <section className="py-32 bg-white border-t border-slate-50">
                <div className="content-width text-center">
                    <div className="max-w-4xl mx-auto glass-card p-16 border-blue-500/20 bg-slate-950 shadow-2xl rounded-[3rem] space-y-10">
                        <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
                            Elevate Your Attachment <br /> Standards Today.
                        </h2>
                        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Join the new era of academic oversight. Zero paperwork, maximum accountability.</p>
                        <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-6">
                            <Link to="/signup" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 active:scale-95">
                                Start Deployment
                            </Link>
                            <Link to="/login" className="text-slate-400 hover:text-white transition-colors font-black text-xs uppercase tracking-widest px-8">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
