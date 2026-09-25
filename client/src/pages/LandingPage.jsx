import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    QrCode,
    FileText,
    ArrowRight,
    ChevronRight,
    ShieldCheck,
    Check,
    Briefcase,
    GraduationCap,
    Compass,
    Building2,
    Clock,
    AlertCircle,
    CheckCircle2,
    Lock,
    Download,
    Users,
    Activity,
    Layers,
    Sliders,
    Sparkles,
    Terminal,
    ArrowUpRight,
    Zap,
    Globe,
    Cpu,
    CheckSquare,
    FileSpreadsheet
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProductCockpit from '../components/landing/ProductCockpit';

const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const stats = [
        { label: 'Active Placements', value: '14,800+', note: 'Enrolled across campuses', trend: '+28%' },
        { label: 'Verified Logbooks', value: '99.2%', note: 'Weekly reviews completed', trend: 'Audit-ready' },
        { label: 'Partner Institutions', value: '62+', note: 'Universities & colleges', trend: 'Multi-tenant' },
        { label: 'Host Employers', value: '1,200+', note: 'Active industry mentors', trend: 'Verified' }
    ];

    const lifecycleStages = [
        {
            step: '01',
            title: 'Placement Verification',
            desc: 'Host company registration, insurance clearance, and automated coordinator approval workflows.',
            icon: Building2
        },
        {
            step: '02',
            title: 'Daily Check-In & Rotating QR',
            desc: 'Proof-of-presence verification with rotating 30-second on-site QR cryptographic tokens.',
            icon: QrCode
        },
        {
            step: '03',
            title: 'Weekly Logbook Revisions',
            desc: 'Technical reflections drafted by students, reviewed with inline industry supervisor notes & approval locks.',
            icon: FileText
        },
        {
            step: '04',
            title: 'On-Site Faculty Visits',
            desc: 'Academic supervisors document physical field visits, student progress, rubric evaluations, and defense milestones.',
            icon: Compass
        },
        {
            step: '05',
            title: 'Standardized Rubrics',
            desc: 'Dual-perspective grading: Industry workplace competency assessment + University academic defense rubric.',
            icon: Sliders
        },
        {
            step: '06',
            title: 'Credit Board Sign-Off',
            desc: 'Instant sanitized audit dossier and automated completion readiness diagnostic verification.',
            icon: ShieldCheck
        }
    ];

    const pillars = [
        {
            title: '75% Attendance Compliance Rule',
            desc: 'Real-time telemetry algorithms compute minimum required on-site attendance thresholds and trigger early interventions before credit forfeiture.',
            icon: CheckSquare,
            badge: 'Policy Engine',
            color: 'violet'
        },
        {
            title: 'Cryptographic Presence Hub',
            desc: 'Eliminate attendance fraud with rotating 30-second TOTP QR tokens verifiable strictly within verified host company GPS coordinates.',
            icon: QrCode,
            badge: 'Anti-Spoofing',
            color: 'cyan'
        },
        {
            title: 'Dual Evaluation Rubrics',
            desc: 'Standardized assessment rubrics pairing industry mentor workplace competency with faculty academic defense grading.',
            icon: Sliders,
            badge: 'Dual Grading',
            color: 'emerald'
        },
        {
            title: 'Instant Board Audit Dossiers',
            desc: 'One-click automated compilation of all weekly logbook reflections, attendance signatures, and supervisor feedback into sealed packets.',
            icon: FileSpreadsheet,
            badge: 'Accreditation Ready',
            color: 'amber'
        }
    ];

    const securityFeatures = [
        {
            title: 'Multi-Tenant Logical Isolation',
            desc: 'Each university campus and school faculty operates within isolated data partitions, ensuring student records and faculty rosters remain private.',
            icon: Lock
        },
        {
            title: 'Role-Based Access Control (RBAC)',
            desc: 'Strict permission matrix separating Students, Workplace Mentors, Visiting Supervisors, Attachment Coordinators, and Institutional Admins.',
            icon: ShieldCheck
        },
        {
            title: 'Immutable Activity Ledger',
            desc: 'Every logbook approval, rubric mark, visit note, and attendance check-in is logged with cryptographic correlation IDs and timestamps.',
            icon: Terminal
        },
        {
            title: 'Enterprise Data Sovereignty',
            desc: 'Institutions maintain full ownership of all attachment records with instant CSV/PDF data exports and automated disaster recovery.',
            icon: Globe
        }
    ];

    const faqs = [
        {
            q: "How does the rotating QR daily attendance verification work?",
            a: "Students check in using a rotating 30-second on-site QR token generated by the supervisor or via the secure student check-in terminal. The system calculates compliance against the institutional 75% threshold in real time."
        },
        {
            q: "How does the logbook revision workflow operate?",
            a: "When a student submits a weekly logbook, the assigned industry supervisor can either approve it or return it with specific revision guidance. The student revises and resubmits the entry. Once approved, the record is permanently locked."
        },
        {
            q: "How are faculty supervisors assigned and balanced?",
            a: "Attachment coordinators have a dedicated console showing all unassigned students, supervisor caseload saturation meters, and reassignment controls with an immutable history trail."
        },
        {
            q: "Can institutional data be exported for academic boards and audits?",
            a: "Yes. Coordinators and School Admins can generate sanitized, audit-ready CSV exports for placements, attendance logs, weekly logbooks, and graded assessments with a single click."
        },
        {
            q: "Is cross-institutional data isolated?",
            a: "Yes. The AMS architecture implements strict multi-tenant isolation, ensuring that each school's student dossiers, supervisor allocations, and audit logs remain strictly isolated."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0d0e12] font-sans text-slate-100 selection:bg-violet-500/30 overflow-x-hidden transition-colors duration-200">
            <Navbar />

            {/* ========================================================================= */}
            {/* 1. HERO SECTION WITH ANGLED GLOWING MESH BACKDROP                        */}
            {/* ========================================================================= */}
            <section className="relative pt-28 sm:pt-36 pb-12 overflow-hidden">
                {/* Angled multi-color mesh gradient backdrop */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute -top-32 -left-20 w-[600px] h-[500px] bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-transparent blur-[140px] rounded-full transform -rotate-12" />
                    <div className="absolute top-10 right-0 w-[550px] h-[450px] bg-gradient-to-bl from-cyan-500/25 via-teal-500/15 to-transparent blur-[130px] rounded-full" />
                    <div className="absolute top-48 left-1/3 w-[500px] h-[350px] bg-gradient-to-tr from-fuchsia-600/20 via-rose-500/10 to-transparent blur-[120px] rounded-full" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2333_1px,transparent_1px),linear-gradient(to_bottom,#1f2333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    {/* Command Pill */}
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#151722]/90 border border-[#2b2e42] text-xs text-slate-300 mb-6 shadow-xl backdrop-blur-md hover:border-violet-500/40 transition-colors cursor-default">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-semibold tracking-tight">Institutional Attachment Infrastructure</span>
                        <span className="text-slate-600 font-mono">•</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#202336] text-[10px] font-mono text-violet-300 border border-[#343852]">
                            v2.4 Active
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
                        The Modern Operating System for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-indigo-300">
                            University Attachments.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                        A unified, policy-compliant workspace connecting student attachees, workplace industry mentors, faculty supervisors, and university coordinators under verifiable academic governance.
                    </p>

                    {/* Dual Action CTAs - High Contrast & Clearly Visible */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <Link to="/login" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto px-7 py-3.5 bg-violet-600 hover:bg-violet-500 !text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 text-sm border border-violet-400/30"
                            >
                                <span>Sign In to Portal</span>
                                <ArrowRight size={16} />
                            </Button>
                        </Link>
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto px-6 py-3.5 border-[#2e3244] bg-[#151722] hover:bg-[#1f2230] text-slate-100 hover:text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Building2 size={16} className="text-violet-400" />
                                <span>Register Institution</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Live Telemetry Status Strip */}
                    <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 py-2 rounded-xl bg-[#12141c]/80 border border-[#22242f] text-xs text-slate-400 font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>99.98% Uptime SLA</span>
                        </div>
                        <span className="text-slate-700 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5">
                            <Lock size={12} className="text-violet-400" />
                            <span>Multi-Tenant Isolated</span>
                        </div>
                        <span className="text-slate-700 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-cyan-400" />
                            <span>Verifiable Audit Ledger</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 2. NATIVE WORKSPACE COCKPIT (NAV TARGET: #workspaces)                      */}
            {/* ========================================================================= */}
            <section id="workspaces" className="relative w-full py-12 scroll-mt-20">
                <ProductCockpit />
            </section>

            {/* ========================================================================= */}
            {/* 3. METRIC BENCHMARKS & STATS STRIP                                        */}
            {/* ========================================================================= */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2f3244] transition-all duration-200 group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                                <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                    {stat.trend}
                                </span>
                            </div>
                            <span className="text-3xl font-bold text-white font-mono block mt-2 group-hover:text-violet-300 transition-colors">
                                {stat.value}
                            </span>
                            <span className="text-xs text-slate-500 block mt-1">{stat.note}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 4. 6-STAGE ATTACHMENT LIFECYCLE (NAV TARGET: #lifecycle)                  */}
            {/* ========================================================================= */}
            <section id="lifecycle" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-500/20">
                        End-to-End Governance
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                        The 6-Stage Industrial Attachment Lifecycle
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Verifiable milestones structured for university degree compliance, credit boards, and employer partnerships.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lifecycleStages.map((stage, idx) => {
                        const Icon = stage.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-[#12141c] border border-[#22242f] hover:border-[#2f3244] rounded-2xl p-6 transition-all duration-300 space-y-4 hover:shadow-xl hover:shadow-black/40 group relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                                        <Icon size={22} />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-500 bg-[#181a24] px-2.5 py-1 rounded-lg border border-[#22242f]">
                                        STAGE {stage.step}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                                        {stage.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                        {stage.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 5. CORE INSTITUTIONAL PILLARS (NAV TARGET: #pillars)                      */}
            {/* ========================================================================= */}
            <section id="pillars" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                        Institutional Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                        Key Pillars of Attachment Excellence
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Engineered to enforce university policies, prevent attendance fraud, and streamline academic grading.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-[#12141c] border border-[#22242f] rounded-2xl p-6 hover:border-[#2f3244] transition-all group relative overflow-hidden space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
                                        {pillar.badge}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 6. COMPLIANCE & MULTI-TENANT SECURITY (NAV TARGET: #security)             */}
            {/* ========================================================================= */}
            <section id="security" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        Enterprise Grade Security
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                        Academic Governance & Data Sovereignty
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Institutional data isolation, tamper-evident audit trails, and strict role-based access.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {securityFeatures.map((sec, idx) => {
                        const Icon = sec.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-[#12141c] border border-[#22242f] rounded-2xl p-5 hover:border-[#2f3244] transition-all flex flex-col justify-between space-y-3"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1.5">{sec.title}</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">{sec.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 7. FREQUENTLY ASKED QUESTIONS (NAV TARGET: #faq)                          */}
            {/* ========================================================================= */}
            <section id="faq" className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Key institutional questions regarding deployment and compliance.</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="rounded-xl bg-[#12141c] border border-[#22242f] overflow-hidden transition-all">
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                            >
                                <span>{faq.q}</span>
                                <ChevronRight
                                    size={16}
                                    className={`text-slate-500 transition-transform duration-200 ${
                                        openFaq === idx ? 'rotate-90 text-violet-400' : ''
                                    }`}
                                />
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#1e2230] pt-3">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 8. FINAL CTA BANNER                                                       */}
            {/* ========================================================================= */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/70 via-indigo-950/60 to-slate-950/80 border border-violet-500/40 p-8 sm:p-12 text-center shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Transform Industrial Attachment Governance Today.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
                        Deploy AttachPro for your university faculty or company mentorship network in minutes.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-500 !text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 text-xs uppercase tracking-wider border border-violet-400/40 flex items-center justify-center gap-2"
                            >
                                <span>Register Your Campus</span>
                                <ArrowRight size={15} />
                            </Button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto px-7 py-3.5 border-[#3d4257] bg-[#12141c]/90 text-slate-100 hover:text-white hover:bg-[#1a1d28] font-semibold rounded-xl text-xs flex items-center justify-center"
                            >
                                <span>Access Existing Account</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
