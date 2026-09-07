import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    BarChart3,
    Users,
    QrCode,
    FileText,
    Globe,
    Shield,
    Zap,
    Building2,
    ArrowRight,
    Sparkles,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    Calendar,
    Clock,
    Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState('student');
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

    const stats = [
        { label: 'Active Placements', value: '12,450+', change: '+18% this term' },
        { label: 'Verified Logbooks', value: '98.6%', change: 'Tamper-resistant' },
        { label: 'Partner Institutions', value: '45+', change: 'Nationwide' },
        { label: 'Host Organizations', value: '850+', change: 'Verified Directory' }
    ];

    const tabPreviews = {
        student: {
            title: 'Unified Student Attachment Workspace',
            subtitle: 'Log daily attendance, draft weekly technical entries, and receive inline supervisor revisions.',
            badge: 'Student Experience',
            metrics: [
                { label: 'Attendance Rate', val: '94.5%', status: 'Compliant' },
                { label: 'Approved Logbooks', val: '8 / 10 Weeks', status: 'On Track' },
                { label: 'Academic Risk', val: 'Low (0/100)', status: 'Optimal' }
            ],
            features: [
                'Time-weighted QR attendance check-in with GPS verification',
                'Structured weekly logbook editor with instant supervisor feedback loops',
                'Automated academic milestone and completion countdown'
            ]
        },
        supervisor: {
            title: 'Industry & University Supervisor Hub',
            subtitle: 'Streamline supervisee oversight, approve weekly logbooks with one click, and record visits.',
            badge: 'Supervisor Cockpit',
            metrics: [
                { label: 'Active Supervisees', val: '6 Students', status: 'Optimal Capacity' },
                { label: 'Pending Reviews', val: '2 Logbooks', status: 'Action Required' },
                { label: 'Visits Recorded', val: '1 / 2 Complete', status: 'Midterm Done' }
            ],
            features: [
                'One-click weekly logbook approval or revision guidance notes',
                'Supervision visit scheduling and on-site meeting logs',
                'Objective grading rubric with standardized assessment forms'
            ]
        },
        coordinator: {
            title: 'Coordinator & Admin Command Center',
            subtitle: 'Institutional oversight, supervisor allocation, host company directories, and completion readiness.',
            badge: 'Academic Oversight',
            metrics: [
                { label: 'Total Cohort', val: '450 Students', status: 'Multi-Tenant Scoped' },
                { label: 'Intervention Queue', val: '3 Students', status: 'High Priority' },
                { label: 'Data Integrity', val: '99.2%', status: 'Audited' }
            ],
            features: [
                'Automated early-warning intervention queue for at-risk students',
                'Supervisor capacity monitoring and auditable reassignment trail',
                'One-click institutional CSV and PDF reporting engine'
            ]
        }
    };

    const preview = tabPreviews[activeTab];

    const faqs = [
        {
            q: "How fast can an institution onboard students and faculty?",
            a: "Institutions can onboard within hours. Our multi-tenant architecture supports CSV batch importing of students, department configurations, and supervisor allocations with zero downtime."
        },
        {
            q: "How does the academic compliance and attendance engine work?",
            a: "AMS enforces a centralized 75% attendance policy rule. The system automatically computes daily attendance ratios, flags declining trends, and warns coordinators of potential completion blockers weeks before graduation deadlines."
        },
        {
            q: "Can logbooks be rejected and resubmitted for correction?",
            a: "Yes. AMS features a full state machine (Submitted -> Rejected with Feedback -> Student Revision -> Resubmitted -> Approved). Approved records are permanently locked against unauthorized tampering."
        },
        {
            q: "Is institutional data securely isolated between schools?",
            a: "Yes. Multi-tenancy is enforced at the database and session layer. Each school's data, custom branding, and student records remain strictly isolated with zero cross-tenant leakage."
        }
    ];

    return (
        <div className="min-h-screen bg-[#080c14] font-sans text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
            <Navbar />

            {/* Ambient Hero Mesh Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[180px]" />
                <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-sky-600/08 rounded-full blur-[180px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/08 rounded-full blur-[160px]" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-6xl mx-auto px-4 sm:px-6 z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101626] border border-[#1f293d] text-xs font-medium text-indigo-300 mb-8 shadow-sm">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span>Next-Generation Industrial Attachment Management</span>
                    <ChevronRight size={14} className="text-slate-500" />
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
                    The Modern Platform for <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Attachment Operations</span>
                </h1>

                <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Connect students, industry supervisors, academic coordinators, and university administrators in an enterprise workspace designed for verified attendance, digital logbooks, and academic compliance.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/login">
                        <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-600/20" endIcon={ArrowRight}>
                            Access Portal
                        </Button>
                    </Link>
                    <Link to="/request-access">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            Request Institutional Access
                        </Button>
                    </Link>
                </div>

                {/* Key Metrics Strip */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto text-left">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="kpi-metric-tile">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</span>
                            <span className="kpi-metric-value">{stat.value}</span>
                            <span className="text-[11px] font-medium text-indigo-300/90 mt-1">{stat.change}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Interactive Product Preview Bento */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 z-10">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Built for Every Stakeholder</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Switch views to explore the dedicated experiences tailored for each role.</p>

                    <div className="mt-6 inline-flex p-1 bg-[#0d1322] border border-[#1f293d] rounded-full">
                        {['student', 'supervisor', 'coordinator'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all capitalize cursor-pointer ${
                                    activeTab === tab
                                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {tab === 'student' ? 'Student Workspace' : tab === 'supervisor' ? 'Supervisor Portal' : 'Coordinator Cockpit'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bento Preview Card */}
                <div className="bento-card p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.06] pb-6">
                        <div>
                            <Badge variant="primary" size="sm" dot>{preview.badge}</Badge>
                            <h3 className="text-xl font-bold text-white mt-2">{preview.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">{preview.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {preview.metrics.map((m, idx) => (
                                <div key={idx} className="bg-[#0b0f19] p-3 rounded-xl border border-[#1f293d] text-center">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{m.label}</span>
                                    <span className="text-sm font-bold text-white block mt-0.5">{m.val}</span>
                                    <span className="text-[9px] text-emerald-400 font-medium block mt-0.5">{m.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {preview.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-[#0d1322]/80 p-4 rounded-xl border border-white/[0.04]">
                                <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-slate-300 leading-relaxed">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Capability Pillars (Attio + Stripe Grid) */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 z-10">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Enterprise Industrial Operations</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Engineered to eliminate paperwork, verify attendance, and ensure academic compliance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bento-card p-6 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-4">
                                <QrCode size={20} />
                            </div>
                            <h4 className="text-base font-bold text-white">Verified Attendance & QR Check-ins</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                Time-weighted, tamper-resistant QR check-in protocol allowing supervisors to confirm physical workplace presence with zero manual logbooks.
                            </p>
                        </div>
                        <span className="text-[11px] font-semibold text-indigo-400 mt-4 flex items-center gap-1">75% Policy Enforced <ChevronRight size={12} /></span>
                    </div>

                    <div className="bento-card p-6 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4">
                                <FileText size={20} />
                            </div>
                            <h4 className="text-base font-bold text-white">Digital Logbooks & Revisions</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                Complete weekly logbook lifecycle with revision state machines. Industry supervisors review, provide inline feedback, and lock approved logs.
                            </p>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 mt-4 flex items-center gap-1">Immutable History <ChevronRight size={12} /></span>
                    </div>

                    <div className="bento-card p-6 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 mb-4">
                                <ShieldCheck size={20} />
                            </div>
                            <h4 className="text-base font-bold text-white">Explainable Risk Scoring (0–100)</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                Continuous diagnostic risk engine evaluating attendance drops, missing supervisor visits, and pending logbook blockers before graduation deadlines.
                            </p>
                        </div>
                        <span className="text-[11px] font-semibold text-sky-400 mt-4 flex items-center gap-1">Deterministic Diagnostics <ChevronRight size={12} /></span>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 z-10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-xs text-slate-400 mt-1">Everything you need to know about the AMS architecture and deployment.</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bento-card overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-white cursor-pointer select-none"
                            >
                                <span>{faq.q}</span>
                                <ChevronRight size={16} className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-90 text-indigo-400' : ''}`} />
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 sm:px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 z-10">
                <div className="bento-card p-8 sm:p-12 text-center relative overflow-hidden bg-gradient-to-b from-indigo-950/40 to-[#0b0f19]">
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Ready to Modernize Your Attachment Lifecycle?</h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
                        Join leading academic institutions managing student industrial attachments with verified attendance, digital logbooks, and centralized academic compliance.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/login">
                            <Button size="lg" endIcon={ArrowRight}>Sign In to Portal</Button>
                        </Link>
                        <Link to="/request-access">
                            <Button variant="outline" size="lg">Contact Coordinator</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
