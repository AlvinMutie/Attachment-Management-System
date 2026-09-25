import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    FileSpreadsheet,
    LogIn
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProductCockpit from '../components/landing/ProductCockpit';
import PlacementWorkflowIllustration from '../components/landing/PlacementWorkflowIllustration';
import SupervisionWorkflowIllustration from '../components/landing/SupervisionWorkflowIllustration';
import ReportingWorkflowIllustration from '../components/landing/ReportingWorkflowIllustration';

const fadeInUp = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
    initial: {},
    whileInView: {},
    viewport: { once: true, margin: "-60px" },
    transition: { staggerChildren: 0.08 }
};

const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

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
            badge: 'Policy Engine'
        },
        {
            title: 'Cryptographic Presence Hub',
            desc: 'Eliminate attendance fraud with rotating 30-second TOTP QR tokens verifiable strictly within verified host company GPS coordinates.',
            icon: QrCode,
            badge: 'Anti-Spoofing'
        },
        {
            title: 'Dual Evaluation Rubrics',
            desc: 'Standardized assessment rubrics pairing industry mentor workplace competency with faculty academic defense grading.',
            icon: Sliders,
            badge: 'Dual Grading'
        },
        {
            title: 'Instant Board Audit Dossiers',
            desc: 'One-click automated compilation of all weekly logbook reflections, attendance signatures, and supervisor feedback into sealed packets.',
            icon: FileSpreadsheet,
            badge: 'Accreditation Ready'
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
        <div className="min-h-screen bg-[#f7f6f1] dark:bg-[#0d0e12] font-sans text-[#0a0d14] dark:text-slate-100 selection:bg-violet-500/30 overflow-x-hidden transition-colors duration-200">
            <Navbar />

            {/* ========================================================================= */}
            {/* 1. HERO SECTION                                                           */}
            {/* ========================================================================= */}
            <section className="relative pt-32 sm:pt-40 pb-16 overflow-hidden">
                {/* Angled multi-color mesh gradient backdrop */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute -top-32 -left-20 w-[600px] h-[500px] bg-gradient-to-br from-violet-600/20 dark:from-violet-600/30 via-indigo-600/15 dark:via-indigo-600/20 to-transparent blur-[140px] rounded-full transform -rotate-12" />
                    <div className="absolute top-10 right-0 w-[550px] h-[450px] bg-gradient-to-bl from-cyan-500/20 dark:from-cyan-500/25 via-teal-500/10 dark:via-teal-500/15 to-transparent blur-[130px] rounded-full" />
                    <div className="absolute top-48 left-1/3 w-[500px] h-[350px] bg-gradient-to-tr from-fuchsia-600/15 dark:from-fuchsia-600/20 via-rose-500/10 to-transparent blur-[120px] rounded-full" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e0d5_1px,transparent_1px),linear-gradient(to_bottom,#e5e0d5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2333_1px,transparent_1px),linear-gradient(to_bottom,#1f2333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Main Headline with high saturation light & dark gradients */}
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#0a0d14] dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
                            The Modern Operating System for{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 dark:from-violet-400 dark:via-cyan-300 dark:to-indigo-300">
                                University Attachments.
                            </span>
                        </h1>

                        {/* Subtitle with deep readable contrast */}
                        <p className="mt-6 text-sm sm:text-base md:text-lg text-[#22283a] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-semibold">
                            A unified, policy-compliant workspace connecting student attachees, workplace industry mentors, faculty supervisors, and university coordinators under verifiable academic governance.
                        </p>

                        {/* Dual Action CTAs - Crisp, High Contrast in Both Themes */}
                        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                            <Link to="/login" className="w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-extrabold rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 text-sm border border-violet-400/40 transition-all cursor-pointer select-none active:scale-[0.98]"
                                >
                                    <LogIn size={16} />
                                    <span>Sign In</span>
                                    <ArrowRight size={16} />
                                </button>
                            </Link>
                            <Link to="/signup" className="w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-[#151722] hover:bg-[#f5f3ec] dark:hover:bg-[#1f2230] text-[#0a0d14] dark:text-white font-extrabold rounded-xl border-2 border-[#cfc8b8] dark:border-[#2e3244] shadow-sm flex items-center justify-center gap-2 text-sm transition-all cursor-pointer select-none active:scale-[0.98]"
                                >
                                    <Building2 size={16} className="text-violet-600 dark:text-violet-400" />
                                    <span>Register</span>
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* 2. NATIVE WORKSPACE COCKPIT (NAV TARGET: #workspaces)                      */}
            {/* ========================================================================= */}
            <motion.section
                id="workspaces"
                className="relative w-full py-12 scroll-mt-20"
                {...fadeInUp}
            >
                <ProductCockpit />
            </motion.section>


            {/* ========================================================================= */}
            {/* 4. WORKFLOW SHOWCASE: 01 — PLACEMENT                                      */}
            {/* ========================================================================= */}
            <section id="workflow" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
                <motion.div className="text-center max-w-3xl mx-auto mb-4" {...fadeInUp}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-300 dark:border-violet-500/20">
                        Workflow Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-3">
                        One workflow. Every stakeholder.
                    </h2>
                    <p className="text-sm text-[#374151] dark:text-slate-400 font-medium mt-2">
                        <span className="font-bold text-[#0a0d14] dark:text-white">01 — Placement:</span> From student candidate matching and verified employer requisitions to institutional coordinator lock-in.
                    </p>
                </motion.div>

                <motion.div {...fadeInUp}>
                    <PlacementWorkflowIllustration />
                </motion.div>
            </section>

            {/* ========================================================================= */}
            {/* 5. WORKFLOW SHOWCASE: 02 — SUPERVISION                                    */}
            {/* ========================================================================= */}
            <section id="supervision" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
                <motion.div className="text-center max-w-3xl mx-auto mb-4" {...fadeInUp}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-300 dark:border-cyan-500/20">
                        Continuous Oversight
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-3">
                        Everyone stays aligned.
                    </h2>
                    <p className="text-sm text-[#374151] dark:text-slate-400 font-medium mt-2">
                        <span className="font-bold text-[#0a0d14] dark:text-white">02 — Supervision:</span> Keep students, university supervisors, and industry supervisors connected throughout the attachment.
                    </p>
                </motion.div>

                <motion.div {...fadeInUp}>
                    <SupervisionWorkflowIllustration />
                </motion.div>
            </section>

            {/* ========================================================================= */}
            {/* 6. WORKFLOW SHOWCASE: 03 — REPORTING                                      */}
            {/* ========================================================================= */}
            <section id="reporting" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
                <motion.div className="text-center max-w-3xl mx-auto mb-4" {...fadeInUp}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-300 dark:border-indigo-500/20">
                        Structured Output
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-3">
                        Activity becomes a structured report.
                    </h2>
                    <p className="text-sm text-[#374151] dark:text-slate-400 font-medium mt-2">
                        <span className="font-bold text-[#0a0d14] dark:text-white">03 — Reporting:</span> Weekly logs, attendance records, and dual mentor reviews are assembled into an audit-ready academic dossier.
                    </p>
                </motion.div>

                <motion.div {...fadeInUp}>
                    <ReportingWorkflowIllustration />
                </motion.div>
            </section>

            {/* ========================================================================= */}
            {/* 7. 6-STAGE ATTACHMENT LIFECYCLE (NAV TARGET: #lifecycle)                  */}
            {/* ========================================================================= */}
            <section id="lifecycle" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-300 dark:border-violet-500/20">
                        End-to-End Governance
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-3">
                        The 6-Stage Industrial Attachment Lifecycle
                    </h2>
                    <p className="text-sm text-[#374151] dark:text-slate-400 font-medium mt-2">
                        Verifiable milestones structured for university degree compliance, credit boards, and employer partnerships.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-60px" }}
                >
                    {lifecycleStages.map((stage, idx) => {
                        const Icon = stage.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f] hover:border-violet-500/40 dark:hover:border-[#2f3244] rounded-2xl p-6 transition-all duration-300 space-y-4 shadow-xs hover:shadow-lg group relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                                        <Icon size={22} />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-[#4b5563] dark:text-slate-400 bg-[#f4f2ea] dark:bg-[#181a24] px-2.5 py-1 rounded-lg border border-[#e2ddd3] dark:border-[#22242f]">
                                        STAGE {stage.step}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#0a0d14] dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                                        {stage.title}
                                    </h3>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium mt-1.5 leading-relaxed">
                                        {stage.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* ========================================================================= */}
            {/* 5. CORE INSTITUTIONAL PILLARS (NAV TARGET: #pillars)                      */}
            {/* ========================================================================= */}
            <section id="pillars" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-300 dark:border-cyan-500/20">
                        Institutional Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-3">
                        Key Pillars of Attachment Excellence
                    </h2>
                    <p className="text-sm text-[#374151] dark:text-slate-400 font-medium mt-2">
                        Engineered to enforce university policies, prevent attendance fraud, and streamline academic grading.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-60px" }}
                >
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-6 hover:border-violet-500/40 dark:hover:border-[#2f3244] transition-all group relative overflow-hidden space-y-4 shadow-xs hover:shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-cyan-900 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/20 px-2.5 py-1 rounded-md">
                                        {pillar.badge}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#0a0d14] dark:text-white group-hover:text-violet-600 dark:group-hover:text-cyan-300 transition-colors">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium mt-2 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* ========================================================================= */}
            {/* 6. COMPLIANCE & MULTI-TENANT SECURITY (NAV TARGET: #security)             */}
            {/* ========================================================================= */}
            <section id="security" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <motion.div className="text-center max-w-3xl mx-auto mb-12" {...fadeInUp}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-500/20">
                        Enterprise Grade Security
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-3">
                        Academic Governance & Data Sovereignty
                    </h2>
                    <p className="text-sm text-[#374151] dark:text-slate-400 font-medium mt-2">
                        Institutional data isolation, tamper-evident audit trails, and strict role-based access.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-60px" }}
                >
                    {securityFeatures.map((sec, idx) => {
                        const Icon = sec.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-5 hover:border-violet-500/40 dark:hover:border-[#2f3244] transition-all flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#0a0d14] dark:text-white mb-1.5">{sec.title}</h4>
                                    <p className="text-[11px] text-[#374151] dark:text-slate-400 font-medium leading-relaxed">{sec.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* ========================================================================= */}
            {/* 7. FREQUENTLY ASKED QUESTIONS (NAV TARGET: #faq)                          */}
            {/* ========================================================================= */}
            <section id="faq" className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
                <motion.div className="text-center mb-10" {...fadeInUp}>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0a0d14] dark:text-white tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-xs sm:text-sm text-[#374151] dark:text-slate-400 font-medium mt-1">Key institutional questions regarding deployment and compliance.</p>
                </motion.div>

                <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-60px" }}
                >
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeInUp}
                            className="rounded-xl bg-white dark:bg-[#12141c] border border-[#e2ddd3] dark:border-[#22242f] overflow-hidden transition-all shadow-xs"
                        >
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#0a0d14] dark:text-slate-200 hover:text-violet-600 dark:hover:text-white transition-colors cursor-pointer"
                            >
                                <span>{faq.q}</span>
                                <ChevronRight
                                    size={16}
                                    className={`text-[#4b5563] dark:text-slate-500 transition-transform duration-200 ${
                                        openFaq === idx ? 'rotate-90 text-violet-600 dark:text-violet-400' : ''
                                    }`}
                                />
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 pb-4 text-xs text-[#374151] dark:text-slate-400 font-medium leading-relaxed border-t border-[#e2ddd3] dark:border-[#1e2230] pt-3">
                                    {faq.a}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ========================================================================= */}
            {/* 8. FINAL CTA BANNER                                                       */}
            {/* ========================================================================= */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
                <motion.div
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/80 via-indigo-950/70 to-slate-950/90 border border-violet-500/40 p-8 sm:p-12 text-center shadow-2xl"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        Transform Industrial Attachment Governance Today.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto mt-3 leading-relaxed font-medium">
                        Deploy AttachPro for your university faculty or company mentorship network in minutes.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-extrabold rounded-xl shadow-lg shadow-violet-600/30 text-sm border border-violet-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98]"
                            >
                                <span>Register</span>
                                <ArrowRight size={16} />
                            </button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold rounded-xl border border-white shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer select-none active:scale-[0.98]"
                            >
                                <LogIn size={16} className="text-violet-600" />
                                <span>Sign In</span>
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
