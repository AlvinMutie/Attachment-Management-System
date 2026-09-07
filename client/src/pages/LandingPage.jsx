import React, { useState } from 'react';
import {
    CheckCircle2,
    QrCode,
    FileText,
    ArrowRight,
    Sparkles,
    ChevronRight,
    ShieldCheck,
    Check,
    UserCheck,
    Briefcase,
    GraduationCap,
    School,
    Compass
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
        { label: 'Active Placements', value: '12,450', note: 'Enrolled this semester' },
        { label: 'Verified Logbooks', value: '98.6%', note: 'Weekly reviews complete' },
        { label: 'Partner Schools', value: '45+', note: 'Institutional nodes' },
        { label: 'Host Companies', value: '850+', note: 'Active industry mentors' }
    ];

    const tabPreviews = {
        student: {
            role: 'Student Workspace',
            color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
            icon: GraduationCap,
            title: 'Daily Check-Ins, Logbooks & Milestones',
            subtitle: 'Log daily workplace presence, draft weekly technical reflections, and review supervisor feedback in real time.',
            items: [
                { title: 'Rotating 30s QR Token', desc: 'Instant presence check-in at workplace host location' },
                { title: 'Weekly Technical Logbook', desc: 'Draft, submit, and revise weekly reflections with supervisor notes' },
                { title: 'Completion Checklist', desc: 'Track all 8 university credit sign-off criteria' }
            ],
            mockData: {
                badge: 'Active Placement • Safaricom PLC',
                metric1: { label: 'Attendance', val: '94.2%' },
                metric2: { label: 'Approved Logbooks', val: '8 / 10 Weeks' },
                metric3: { label: 'Status', val: 'Eligible for Credit' }
            }
        },
        supervisor: {
            role: 'Supervisor Review Portal',
            color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
            icon: Briefcase,
            title: 'Weekly Logbook Approvals & Site Visit Logs',
            subtitle: 'Review intern reflections with inline revision feedback, log supervisory visits, and grade standardized rubric assessments.',
            items: [
                { title: 'One-Click Approvals', desc: 'Approve or return logbooks with specific guidance notes' },
                { title: 'Site Visit Assessment', desc: 'Document workplace visits and intern progress' },
                { title: 'Final Rubric Grading', desc: 'Grade standardized criteria directly into student record' }
            ],
            mockData: {
                badge: 'Faculty Supervisor • 6 Supervisees',
                metric1: { label: 'Pending Reviews', val: '2 Logbooks' },
                metric2: { label: 'Visits Recorded', val: '4 / 6 Complete' },
                metric3: { label: 'Action Needed', val: '1 Midterm Evaluation' }
            }
        },
        coordinator: {
            role: 'Coordinator & Admin Command',
            color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
            icon: Compass,
            title: 'Placement Pipeline & Risk Triage',
            subtitle: 'Track cohort progress, allocate faculty supervisors with capacity balancing, and intervene early on at-risk students.',
            items: [
                { title: 'Risk Intervention Queue', desc: 'Automated early alerts for attendance drops and missing logs' },
                { title: 'Workload Rebalancing', desc: 'Distribute supervisees across faculty supervisors evenly' },
                { title: 'CSV & PDF Audit Exports', desc: 'Instant sanitized data exports for university academic boards' }
            ],
            mockData: {
                badge: 'Department Coordinator • 450 Students',
                metric1: { label: 'Placed Students', val: '438 / 450' },
                metric2: { label: 'Attention Items', val: '3 Risk Cases' },
                metric3: { label: 'Readiness Rate', val: '88.4%' }
            }
        }
    };

    const current = tabPreviews[activeTab];

    const faqs = [
        {
            q: "How does the daily attendance verification work?",
            a: "Students can either scan a rotating 30-second on-site QR code or log their daily check-in through the secure web portal. The system calculates compliance against the institutional 75% threshold in real time."
        },
        {
            q: "How does logbook revision workflow operate?",
            a: "When a student submits a weekly logbook, their assigned industry supervisor can either approve it or reject it with constructive revision notes. The student can then modify and resubmit the entry. Once approved, the record is locked."
        },
        {
            q: "How are faculty supervisors assigned and balanced?",
            a: "Attachment coordinators have a dedicated console to view all unassigned students, inspect supervisor caseloads, and assign or reassign supervisees with a clear audit history trail."
        },
        {
            q: "Can we export institutional data for compliance audits?",
            a: "Yes. Administrators and coordinators can download sanitized, audit-ready CSV exports for placements, attendance logs, weekly logbooks, and graded assessments at any time."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0d0e12] font-sans text-slate-100 selection:bg-violet-500/30 overflow-x-hidden">
            <Navbar />

            {/* Hero Section with Canvas Grid & Figma-style Workspace Frame */}
            <section className="relative pt-32 pb-16 md:pt-36 md:pb-24 max-w-6xl mx-auto px-4 sm:px-6 text-center">
                {/* Clean Announcement Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151720] border border-[#262838] text-xs text-slate-300 mb-6 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    <span className="font-semibold text-white">Attachment Management System</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Production Ready</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
                    A purpose-built workspace for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-sky-300 to-indigo-300">
                        student attachments.
                    </span>
                </h1>

                <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    A unified platform for universities, students, and industry hosts. Track verified attendance, manage weekly logbook revisions, and conduct standardized supervisor assessments.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/login">
                        <Button size="lg" className="w-full sm:w-auto" endIcon={ArrowRight}>
                            Sign In to Portal
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            Register Institution
                        </Button>
                    </Link>
                </div>

                {/* Key Metrics Ribbon */}
                <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto text-left">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="kpi-metric-tile bg-[#13151d] border-[#222430]">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            <span className="kpi-metric-value mt-1">{stat.value}</span>
                            <span className="text-[11px] text-slate-400 mt-1">{stat.note}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Interactive Figma-Style Canvas Workspace Preview */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">One system, three dedicated workspaces</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Select a role to inspect the tailored workspace view.</p>

                    {/* Figma Floating Toolbar Selector */}
                    <div className="mt-5 inline-flex p-1 bg-[#12141c] border border-[#222432] rounded-xl shadow-md">
                        {[
                            { id: 'student', label: 'Student Workspace', icon: GraduationCap },
                            { id: 'supervisor', label: 'Supervisor Review', icon: Briefcase },
                            { id: 'coordinator', label: 'Coordinator Hub', icon: Compass }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#1e212d] text-white shadow-sm border border-[#2e3244]'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    <Icon size={14} className={isActive ? 'text-violet-400' : ''} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Figma Canvas Frame Wrapper */}
                <div className="rounded-2xl bg-[#12141c] border border-[#222432] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
                    {/* Top Canvas Status Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222432]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <current.icon size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white">{current.role}</span>
                                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                        Live View
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{current.title}</h3>
                            </div>
                        </div>

                        {/* Quick Stats Pills */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            <div className="p-2.5 rounded-lg bg-[#181a24] border border-[#252838] text-center min-w-[90px]">
                                <span className="text-[10px] text-slate-400 block">{current.mockData.metric1.label}</span>
                                <span className="text-xs font-bold text-white block mt-0.5 font-mono">{current.mockData.metric1.val}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-[#181a24] border border-[#252838] text-center min-w-[90px]">
                                <span className="text-[10px] text-slate-400 block">{current.mockData.metric2.label}</span>
                                <span className="text-xs font-bold text-emerald-400 block mt-0.5 font-mono">{current.mockData.metric2.val}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-[#181a24] border border-[#252838] text-center min-w-[90px]">
                                <span className="text-[10px] text-slate-400 block">{current.mockData.metric3.label}</span>
                                <span className="text-xs font-bold text-violet-400 block mt-0.5 truncate">{current.mockData.metric3.val}</span>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {current.items.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-[#181a24] border border-[#252838] space-y-1 hover:border-[#35394e] transition-colors">
                                <div className="flex items-center gap-2">
                                    <Check size={14} className="text-violet-400 shrink-0" />
                                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                                </div>
                                <p className="text-xs text-slate-400 leading-snug pl-5">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Capability Cards */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Engineered for academic integrity</h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Key features designed for real-world institutional operations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 rounded-2xl bg-[#12141c] border border-[#222432] flex flex-col justify-between space-y-4 hover:border-[#32364a] transition-all">
                        <div className="space-y-3">
                            <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                <QrCode size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-white">Verified Attendance & QR Check-Ins</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                30-second rotating QR tokens and daily web check-ins automatically calculate attendance ratios against the institutional 75% policy threshold.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#1e212d] text-[11px] font-semibold text-violet-400">
                            Automated Compliance Tracking
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12141c] border border-[#222432] flex flex-col justify-between space-y-4 hover:border-[#32364a] transition-all">
                        <div className="space-y-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <FileText size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-white">Structured Logbook Revisions</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Complete revision state lifecycle: Draft → Submit → Review / Request Revision → Resubmit → Approve. Approved records are permanently locked.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#1e212d] text-[11px] font-semibold text-emerald-400">
                            Immutable Revision History
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12141c] border border-[#222432] flex flex-col justify-between space-y-4 hover:border-[#32364a] transition-all">
                        <div className="space-y-3">
                            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                                <ShieldCheck size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-white">Early Risk Intervention Engine</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Deterministic triage engine flags students experiencing attendance drops, unassigned supervisors, or overdue assessments before graduation cutoffs.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#1e212d] text-[11px] font-semibold text-sky-400">
                            Proactive Academic Safety
                        </div>
                    </div>
                </div>
            </section>

            {/* Frequently Asked Questions */}
            <section className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Frequently asked questions</h2>
                    <p className="text-xs text-slate-400 mt-1">Clear answers on how the system works.</p>
                </div>

                <div className="space-y-2.5">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="rounded-xl bg-[#12141c] border border-[#222432] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white cursor-pointer select-none"
                            >
                                <span>{faq.q}</span>
                                <ChevronRight size={15} className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-90 text-violet-400' : ''}`} />
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#1a1c28] pt-3">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Box */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="p-8 sm:p-12 rounded-2xl bg-[#12141c] border border-[#222432] text-center relative overflow-hidden">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Ready to streamline your attachment program?</h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
                        Log in with your university credentials or register your school to set up student, supervisor, and coordinator workspaces.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/login">
                            <Button size="lg" endIcon={ArrowRight}>Sign In to Portal</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="outline" size="lg">Register School</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;

