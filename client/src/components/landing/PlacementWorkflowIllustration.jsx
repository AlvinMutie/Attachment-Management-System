import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    Building2,
    CheckCircle2,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    FileCheck2,
    Clock,
    UserCheck,
    Check,
    ExternalLink,
    Play,
    RotateCcw,
    Lock,
    Zap,
    Briefcase
} from 'lucide-react';

export const PlacementWorkflowIllustration = () => {
    // Stage 1: Student Match & Draft | Stage 2: Application Dispatched | Stage 3: Institutional Placement Confirmed
    const [activeStage, setActiveStage] = useState(3);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto cycle through workflow stages for subtle live SaaS showcase
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveStage((prev) => (prev >= 3 ? 1 : prev + 1));
        }, 4500);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    return (
        <div
            className="w-full max-w-5xl mx-auto my-8 relative select-none"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Header Stage Navigation / Controller Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 px-2">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600"></span>
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-violet-800 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-1 rounded-md border border-violet-300 dark:border-violet-500/20">
                        Workflow 01 • Interactive Architecture
                    </span>
                </div>

                {/* Step Selector Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#12141c] border border-[#d6d0c2] dark:border-[#22242f] rounded-xl shadow-xs">
                    {[
                        { step: 1, label: '01 Student Match' },
                        { step: 2, label: '02 Dispatch' },
                        { step: 3, label: '03 Placement Lock' }
                    ].map((s) => (
                        <button
                            key={s.step}
                            type="button"
                            onClick={() => {
                                setIsAutoPlaying(false);
                                setActiveStage(s.step);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                activeStage === s.step
                                    ? 'bg-violet-600 text-white shadow-xs shadow-violet-600/30'
                                    : 'text-[#4b5563] dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-[#f4f2ea] dark:hover:bg-[#181a24]'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setActiveStage(1)}
                        className="p-1 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors ml-1"
                        title="Replay sequence"
                    >
                        <RotateCcw size={13} />
                    </button>
                </div>
            </div>

            {/* Main Layered Interactive Canvas */}
            <div className="relative rounded-3xl bg-white dark:bg-[#101218] border-2 border-[#e2ddd3] dark:border-[#22242f] p-5 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Background Ambient Mesh & Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e0d5_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2333_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-600/10 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

                {/* Workflow Title Header inside Canvas */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#e2ddd3] dark:border-[#1f2230]">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">
                                Pipeline Flow
                            </span>
                            <span className="text-[#bbb3a0] dark:text-slate-600">•</span>
                            <span className="text-[11px] font-mono text-[#4b5563] dark:text-slate-400">
                                Real-Time State: {activeStage === 1 ? '1/3 Student Eligibility' : activeStage === 2 ? '2/3 Application In-Review' : '3/3 Legally Enrolled & Sealed'}
                            </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-0.5">
                            Automated Student-to-Industry Placement Sequence
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#f4f2ea] dark:bg-[#161822] text-[#0a0d14] dark:text-slate-200 border border-[#d6d0c2] dark:border-[#282c3e]">
                            <Zap size={12} className="text-amber-500 fill-amber-500" />
                            <span>Zero-Latency Routing</span>
                        </span>
                    </div>
                </div>

                {/* Interactive Multi-Card Workflow Grid */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 items-center">
                    
                    {/* ========================================================================= */}
                    {/* CARD 1: Student Application Dossier (Col 1-4)                             */}
                    {/* ========================================================================= */}
                    <motion.div
                        className="lg:col-span-4 bg-[#fbfbfa] dark:bg-[#151720] border-2 border-[#dcd6c8] dark:border-[#262938] rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-violet-500/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Status bar */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold text-xs">
                                    <GraduationCap size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">Student Candidate</h4>
                                    <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">Reg: CS/2023/1084</span>
                                </div>
                            </div>
                            <span className="text-[9px] font-mono font-bold bg-violet-100 dark:bg-violet-500/10 text-violet-900 dark:text-violet-300 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                                Verified
                            </span>
                        </div>

                        {/* Student Details */}
                        <div className="mt-3.5 space-y-2.5">
                            <div>
                                <span className="text-sm font-black text-[#0a0d14] dark:text-white block">
                                    Elena Albright
                                </span>
                                <span className="text-[11px] text-[#374151] dark:text-slate-400 font-medium">
                                    B.Sc. Software Engineering (Year 3)
                                </span>
                            </div>

                            {/* Prerequisite chips */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                                <div className="bg-white dark:bg-[#1b1e2b] border border-[#e2ddd3] dark:border-[#2b2f42] rounded-lg p-2 text-left">
                                    <span className="text-[9px] font-mono text-[#5b6276] dark:text-slate-400 block">Cumulative GPA</span>
                                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono">3.88 / 4.00</span>
                                </div>
                                <div className="bg-white dark:bg-[#1b1e2b] border border-[#e2ddd3] dark:border-[#2b2f42] rounded-lg p-2 text-left">
                                    <span className="text-[9px] font-mono text-[#5b6276] dark:text-slate-400 block">Faculty Clearance</span>
                                    <span className="text-xs font-black text-violet-700 dark:text-violet-400 font-mono flex items-center gap-1">
                                        <Check size={12} /> Approved
                                    </span>
                                </div>
                            </div>

                            {/* Required Documents checklist */}
                            <div className="pt-2 space-y-1.5 text-[11px] font-medium text-[#22283a] dark:text-slate-300">
                                <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1b1e2b] border border-[#e5e0d5] dark:border-[#272b3c]">
                                    <span className="flex items-center gap-1.5">
                                        <FileCheck2 size={13} className="text-violet-600 dark:text-violet-400" />
                                        <span>Institutional Intro Letter</span>
                                    </span>
                                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1b1e2b] border border-[#e5e0d5] dark:border-[#272b3c]">
                                    <span className="flex items-center gap-1.5">
                                        <ShieldCheck size={13} className="text-violet-600 dark:text-violet-400" />
                                        <span>Third-Party Insurance</span>
                                    </span>
                                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </div>

                        {/* Application state footer */}
                        <div className="mt-4 pt-3 border-t border-[#e5e0d5] dark:border-[#202330] flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                Checksum: <span className="font-bold">sha256:7f8a9e</span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 flex items-center gap-1">
                                <Check size={11} /> Ready
                            </span>
                        </div>
                    </motion.div>

                    {/* ========================================================================= */}
                    {/* CONNECTOR / PIPELINE INTERMEDIATE (Col 5)                                 */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 px-2 py-2">
                        
                        {/* Dynamic Connector SVG with animated stroke and moving packet */}
                        <div className="w-full relative flex flex-col items-center">
                            {/* Opportunity Target Badge */}
                            <div className="w-full bg-[#fbfbfa] dark:bg-[#151720] border-2 border-[#dcd6c8] dark:border-[#262938] rounded-xl p-3 shadow-sm mb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-md bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                                            <Building2 size={15} />
                                        </div>
                                        <div>
                                            <h5 className="text-[11px] font-black text-[#0a0d14] dark:text-white leading-none">Safaricom PLC</h5>
                                            <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">Cloud & SRE Track</span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold bg-cyan-100 dark:bg-cyan-500/10 text-cyan-900 dark:text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/20">
                                        1 Slot Avail.
                                    </span>
                                </div>
                            </div>

                            {/* Animated SVG Data Pipeline */}
                            <div className="relative w-full h-12 flex items-center justify-center">
                                <svg className="w-full h-8 overflow-visible" viewBox="0 0 240 24" fill="none">
                                    <path
                                        d="M 10 12 L 230 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                        className="text-[#cfc8b8] dark:text-[#2e3244]"
                                    />
                                    <motion.path
                                        d="M 10 12 L 230 12"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="3"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: activeStage >= 2 ? 1 : 0.4 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#7c3aed" />
                                            <stop offset="50%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Pulsing Data Packet */}
                                <motion.div
                                    className="absolute w-5 h-5 rounded-full bg-violet-600 border-2 border-white dark:border-[#101218] shadow-md flex items-center justify-center"
                                    animate={{
                                        left: activeStage === 1 ? '10%' : activeStage === 2 ? '50%' : '90%'
                                    }}
                                    transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 15 }}
                                >
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                </motion.div>
                            </div>

                            {/* Step Indicator Node */}
                            <div className="mt-1 flex items-center gap-2">
                                <AnimatePresence mode="wait">
                                    {activeStage === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-3 py-1 rounded-full border border-violet-300 dark:border-violet-500/20"
                                        >
                                            <Clock size={12} className="animate-spin" />
                                            <span>Validating Match Criteria</span>
                                        </motion.div>
                                    )}
                                    {activeStage === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-500/20"
                                        >
                                            <Sparkles size={12} className="animate-pulse" />
                                            <span>Application Dispatched to Mentor</span>
                                        </motion.div>
                                    )}
                                    {activeStage === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/20"
                                        >
                                            <CheckCircle2 size={12} />
                                            <span>Coordinator Sign-Off & Lock</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* CARD 2: Verified Placement Accord & Seal (Col 8-12)                       */}
                    {/* ========================================================================= */}
                    <motion.div
                        className="lg:col-span-4 bg-[#fbfbfa] dark:bg-[#151720] border-2 border-[#dcd6c8] dark:border-[#262938] rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-emerald-500/50"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Placement Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                                    <ShieldCheck size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">Placement Accord</h4>
                                    <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">ID: PLC-2026-8941</span>
                                </div>
                            </div>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
                                activeStage === 3
                                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20'
                                    : 'bg-[#e5e0d5] dark:bg-[#222638] text-[#5b6276] dark:text-slate-400 border-[#cfc8b8] dark:border-[#2c3044]'
                            }`}>
                                {activeStage === 3 ? 'Active Enrolled' : 'Pending Review'}
                            </span>
                        </div>

                        {/* Placement Body Details */}
                        <div className="mt-3.5 space-y-2.5">
                            <div>
                                <span className="text-sm font-black text-[#0a0d14] dark:text-white block">
                                    Safaricom PLC • HQ Nairobi
                                </span>
                                <span className="text-[11px] text-[#374151] dark:text-slate-400 font-medium">
                                    Duration: 12 Weeks (May 2026 - Aug 2026)
                                </span>
                            </div>

                            {/* Mentorship Pair Matrix */}
                            <div className="space-y-1.5 pt-1">
                                <div className="bg-white dark:bg-[#1b1e2b] border border-[#e2ddd3] dark:border-[#2b2f42] rounded-lg p-2 flex items-center justify-between">
                                    <div>
                                        <span className="text-[9px] font-mono text-[#5b6276] dark:text-slate-400 block">Industry Supervisor</span>
                                        <span className="text-[11px] font-black text-[#0a0d14] dark:text-slate-200">Eng. Sarah Chen</span>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                                        Assigned
                                    </span>
                                </div>

                                <div className="bg-white dark:bg-[#1b1e2b] border border-[#e2ddd3] dark:border-[#2b2f42] rounded-lg p-2 flex items-center justify-between">
                                    <div>
                                        <span className="text-[9px] font-mono text-[#5b6276] dark:text-slate-400 block">Visiting Faculty Supervisor</span>
                                        <span className="text-[11px] font-black text-[#0a0d14] dark:text-slate-200">Dr. Patrick Kimani</span>
                                    </div>
                                    <span className="text-[9px] font-mono font-bold bg-violet-100 dark:bg-violet-500/10 text-violet-800 dark:text-violet-400 px-1.5 py-0.5 rounded">
                                        Appointed
                                    </span>
                                </div>
                            </div>

                            {/* Compliance Policy Initialization */}
                            <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono text-[#374151] dark:text-slate-300 bg-white dark:bg-[#1b1e2b] p-2 rounded-lg border border-[#e5e0d5] dark:border-[#272b3c]">
                                <span className="flex items-center gap-1.5 font-bold">
                                    <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                                    <span>75% Attendance Guard</span>
                                </span>
                                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                                    Active Telemetry
                                </span>
                            </div>
                        </div>

                        {/* Placement Footer Seal */}
                        <div className="mt-4 pt-3 border-t border-[#e5e0d5] dark:border-[#202330] flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                Institutional Ledger Block #8492
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                <ShieldCheck size={12} /> Cryptographic Seal
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Metric & Micro-Insights Strip */}
                <div className="mt-6 pt-4 border-t border-[#e2ddd3] dark:border-[#1f2230] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-[#fbfbfa] dark:bg-[#151720] border border-[#e2ddd3] dark:border-[#242738] rounded-xl p-2.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block">Avg Placement Turnaround</span>
                        <span className="text-sm font-black font-mono text-[#0a0d14] dark:text-white mt-0.5 block">&lt; 48 Hours</span>
                    </div>
                    <div className="bg-[#fbfbfa] dark:bg-[#151720] border border-[#e2ddd3] dark:border-[#242738] rounded-xl p-2.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block">Insurance Verification</span>
                        <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400 mt-0.5 block">100% Automated</span>
                    </div>
                    <div className="bg-[#fbfbfa] dark:bg-[#151720] border border-[#e2ddd3] dark:border-[#242738] rounded-xl p-2.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block">Supervisor Allocation</span>
                        <span className="text-sm font-black font-mono text-violet-700 dark:text-violet-400 mt-0.5 block">Dual-Matched</span>
                    </div>
                    <div className="bg-[#fbfbfa] dark:bg-[#151720] border border-[#e2ddd3] dark:border-[#242738] rounded-xl p-2.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block">Audit Integrity</span>
                        <span className="text-sm font-black font-mono text-cyan-700 dark:text-cyan-400 mt-0.5 block">Immutable</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementWorkflowIllustration;
