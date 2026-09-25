import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    QrCode,
    FileText,
    Compass,
    Sliders,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Check,
    RotateCcw,
    Lock,
    Calendar,
    Award,
    Activity,
    Users,
    FileSpreadsheet,
    Sparkles,
    Eye
} from 'lucide-react';

const STAGES = [
    {
        id: 0,
        number: '01',
        name: 'Placement',
        title: 'Placement Verification',
        badge: 'Contract Locked',
        desc: 'Host company verification, insurance clearance, and coordinator agreement lock-in.',
        icon: Building2
    },
    {
        id: 1,
        number: '02',
        name: 'Check-In',
        title: 'Daily Check-In & Presence',
        badge: 'Anti-Spoofing',
        desc: 'Daily presence tracking with on-site verified timestamps and real-time 75% policy compliance monitoring.',
        icon: QrCode
    },
    {
        id: 2,
        number: '03',
        name: 'Logbook',
        title: 'Weekly Logbook Revisions',
        badge: 'Mentor Sign-Off',
        desc: 'Technical reflections logged by students, revised with mentor notes, and locked upon approval.',
        icon: FileText
    },
    {
        id: 3,
        number: '04',
        name: 'Faculty Visit',
        title: 'On-Site Faculty Visits',
        badge: 'Field Oversight',
        desc: 'Academic faculty schedule on-site supervision visits, conduct student interviews, and inspect workplace conditions.',
        icon: Compass
    },
    {
        id: 4,
        number: '05',
        name: 'Evaluation',
        title: 'Dual-Perspective Rubrics',
        badge: 'Standardized',
        desc: 'Combined assessment pairing industry mentor workplace competency with faculty academic defense grading.',
        icon: Sliders
    },
    {
        id: 5,
        number: '06',
        name: 'Closure',
        title: 'Final Clearance & Closure',
        badge: 'Audit Ready',
        desc: 'Automated compilation of all logs, attendance records, and evaluations into a sealed institutional dossier.',
        icon: ShieldCheck
    }
];

export const LifecycleGovernanceWorkspace = () => {
    const [activeStage, setActiveStage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timerRef = useRef(null);

    // Auto-advance lifecycle stages (4.8s rhythm)
    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setInterval(() => {
            setActiveStage((prev) => (prev >= STAGES.length - 1 ? 0 : prev + 1));
        }, 4800);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused]);

    const handleStageSelect = (index) => {
        setIsPaused(true);
        setIsTransitioning(true);
        setActiveStage(index);
        setTimeout(() => setIsTransitioning(false), 250);
    };

    const current = STAGES[activeStage];
    const progressPercent = ((activeStage + 1) / STAGES.length) * 100;

    return (
        <div
            className="w-full max-w-6xl mx-auto my-8 relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Header & Stage Scrubber */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                        <span className="text-xs font-mono font-bold tracking-wider uppercase text-violet-900 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-md border border-violet-300 dark:border-violet-500/20">
                            Interactive Governance Workspace
                        </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-1">
                        One attachment. Six governed stages.
                    </h3>
                </div>

                {/* Scrubber & Replay */}
                <div className="flex items-center gap-2 self-start md:self-center">
                    <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 font-bold hidden sm:inline-block">
                        Stage {activeStage + 1} of 6
                    </span>
                    <button
                        type="button"
                        onClick={() => handleStageSelect(0)}
                        className="px-2.5 py-1 text-xs font-mono font-bold text-[#4b5563] dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 bg-white dark:bg-[#141620] border border-[#d6d0c2] dark:border-[#22242f] rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Restart Lifecycle Progression"
                        aria-label="Restart Lifecycle Progression"
                    >
                        <RotateCcw size={12} />
                        <span>Restart</span>
                    </button>
                </div>
            </div>

            {/* 6-Stage Integrated Progression Timeline Bar */}
            <div className="relative mb-6">
                {/* Background Track */}
                <div className="hidden lg:block absolute top-1/2 left-6 right-6 h-0.5 bg-[#ded9cb] dark:bg-[#222432] -translate-y-1/2 z-0" />
                
                {/* Active Highlight Line */}
                <div
                    className="hidden lg:block absolute top-1/2 left-6 h-0.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
                    style={{ width: `calc(${progressPercent}% - 48px)` }}
                />

                {/* 6 Stage Tab Elements (Horizontally Scrollable on Mobile) */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none relative z-10">
                    {STAGES.map((stage, idx) => {
                        const Icon = stage.icon;
                        const isActive = activeStage === idx;
                        const isPast = activeStage > idx;

                        return (
                            <button
                                key={stage.id}
                                type="button"
                                onClick={() => handleStageSelect(idx)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all duration-200 shrink-0 cursor-pointer ${
                                    isActive
                                        ? 'bg-white dark:bg-[#141620] border-violet-500 shadow-md ring-2 ring-violet-500/10'
                                        : isPast
                                        ? 'bg-[#f4f2ea] dark:bg-[#12141c] border-[#ded9cb] dark:border-[#202330] text-[#0a0d14] dark:text-slate-300'
                                        : 'bg-[#faf9f6] dark:bg-[#0f1117] border-[#e2ddd3] dark:border-[#1c1f2b] text-[#5b6276] dark:text-slate-500 hover:border-violet-400/40'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                                    isActive
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : isPast
                                        ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400'
                                        : 'bg-[#e5e0d5] dark:bg-[#1a1d28] text-[#5b6276] dark:text-slate-400'
                                }`}>
                                    {isPast ? <Check size={13} /> : stage.number}
                                </div>
                                <div className="hidden sm:block">
                                    <span className={`text-xs font-bold block leading-tight ${isActive ? 'text-[#0a0d14] dark:text-white' : 'text-[#374151] dark:text-slate-400'}`}>
                                        {stage.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-500 leading-tight">
                                        Stage {stage.number}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* DOMINANT HERO WORKSPACE: Active Stage Governance Canvas */}
            <div className="relative rounded-3xl bg-[#faf9f6] dark:bg-[#0f1117] border-2 border-[#e2ddd3] dark:border-[#22242f] p-4 sm:p-7 shadow-xl dark:shadow-2xl overflow-hidden min-h-[460px]">
                
                {/* Subtle Grid Canvas Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e0d5_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2333_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

                {/* Window Header / Browser Chrome */}
                <div className="relative z-10 flex items-center justify-between pb-3.5 mb-5 border-b border-[#e2ddd3] dark:border-[#1f2230]">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e2ddd3] dark:bg-[#282c3c]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e2ddd3] dark:bg-[#282c3c]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e2ddd3] dark:bg-[#282c3c]" />
                        </div>
                        <div className="h-4 w-px bg-[#e2ddd3] dark:bg-[#22242f] mx-1" />
                        <span className="text-xs font-mono font-bold text-[#0a0d14] dark:text-slate-200 flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-violet-600 dark:text-violet-400" />
                            <span>attachpro.app / governance / stage-{current.number.toLowerCase()}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-violet-100 dark:bg-violet-500/10 text-violet-900 dark:text-violet-300 border-violet-300 dark:border-violet-500/20">
                            {current.badge}
                        </span>
                    </div>
                </div>

                {/* Active Stage Dynamic View */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
                    >
                        {/* Dominant Left: Active Stage Product Canvas (7.5 Cols) */}
                        <div className="lg:col-span-7 bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
                            
                            {/* Stage Header Info */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div>
                                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-700 dark:text-violet-400 block">
                                        Stage {current.number} • Institutional Milestone
                                    </span>
                                    <h4 className="text-base sm:text-lg font-black text-[#0a0d14] dark:text-white mt-0.5">
                                        {current.title}
                                    </h4>
                                    <p className="text-xs text-[#5b6276] dark:text-slate-400 font-medium mt-1">
                                        {current.desc}
                                    </p>
                                </div>
                            </div>

                            {/* STAGE-SPECIFIC AUTHENTIC PRODUCT INTERFACE FRAGMENT */}
                            
                            {/* STAGE 01: Placement Verification */}
                            {current.id === 0 && (
                                <div className="space-y-2.5">
                                    <div className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                                Verified Student Placement Record
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                                <Check size={11} /> Approved
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Student</span>
                                                <span className="font-bold text-[#0a0d14] dark:text-white">Daniel Carter</span>
                                            </div>
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Host Employer</span>
                                                <span className="font-bold text-[#0a0d14] dark:text-white">Acme Technologies</span>
                                            </div>
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Duration</span>
                                                <span className="font-bold text-[#0a0d14] dark:text-white">12 Weeks (Summer Term)</span>
                                            </div>
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Coordinator Lock</span>
                                                <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">Locked by Sarah Williams</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STAGE 02: Daily Check-In & Presence Hub */}
                            {current.id === 1 && (
                                <div className="space-y-2.5">
                                    <div className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                                On-Site Check-In Verification
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2 py-0.5 rounded">
                                                Recorded Today
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block">Check-In Time</span>
                                                <span className="font-bold text-[#0a0d14] dark:text-white">08:42 AM</span>
                                            </div>
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block">Location Match</span>
                                                <span className="font-bold text-emerald-700 dark:text-emerald-400">HQ Geo-fenced</span>
                                            </div>
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block">Total Days</span>
                                                <span className="font-bold text-[#0a0d14] dark:text-white">32 / 35 Days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STAGE 03: Weekly Logbook Revisions */}
                            {current.id === 2 && (
                                <div className="space-y-2.5">
                                    <div className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                                Week 10 Logbook Submission
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                                <Check size={11} /> Mentor Approved
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#374151] dark:text-slate-300 bg-white dark:bg-[#141620] p-2.5 rounded border border-[#e5e0d5] dark:border-[#242738] leading-relaxed">
                                            "Finalized REST API endpoints for user authentication and integrated automated load testing routines."
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] font-mono text-[#5b6276] dark:text-slate-400">
                                            <span>Signed by: Michael Anderson</span>
                                            <span>Locked: Immutable Record</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STAGE 04: On-Site Faculty Visits */}
                            {current.id === 3 && (
                                <div className="space-y-2.5">
                                    <div className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                                Supervision Visit Documentation
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded">
                                                Visit Completed
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Academic Visiting Faculty</span>
                                                <span className="font-bold text-[#0a0d14] dark:text-white">Dr. Emily Johnson</span>
                                            </div>
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Visit Format</span>
                                                <span className="font-bold text-[#0a0d14] dark:text-white">Physical On-Site Inspection</span>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-[#374151] dark:text-slate-300 italic bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                            "Student is embedded well in the engineering team. Workplace conditions align with faculty accreditation guidelines."
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* STAGE 05: Standardized Dual Rubrics */}
                            {current.id === 4 && (
                                <div className="space-y-2.5">
                                    <div className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                                Combined Rubric Evaluations
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                                Total Score: 94 / 100
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Industry Mentor Rubric</span>
                                                <span className="font-bold text-indigo-700 dark:text-indigo-400 font-mono text-sm">48 / 50</span>
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block mt-0.5">Competency & Delivery</span>
                                            </div>
                                            <div className="bg-white dark:bg-[#141620] p-2 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block font-mono">Faculty Academic Defense</span>
                                                <span className="font-bold text-violet-700 dark:text-violet-400 font-mono text-sm">46 / 50</span>
                                                <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block mt-0.5">Oral Defense & Report</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STAGE 06: Final Clearance & Closure */}
                            {current.id === 5 && (
                                <div className="space-y-2.5">
                                    <div className="p-3.5 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                                Institutional Closure Clearance
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                Audit Dossier Sealed
                                            </span>
                                        </div>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-[#141620] border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[#374151] dark:text-slate-300 font-medium">10/10 Logbooks Signed</span>
                                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">✓ Complete</span>
                                            </div>
                                            <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-[#141620] border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[#374151] dark:text-slate-300 font-medium">Attendance &gt;75% Policy</span>
                                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">✓ 91.4% Compliant</span>
                                            </div>
                                            <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-[#141620] border border-[#e5e0d5] dark:border-[#242738]">
                                                <span className="text-[#374151] dark:text-slate-300 font-medium">Credit Board Clearance</span>
                                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">✓ Ready for Board</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Canvas Footer */}
                            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#5b6276] dark:text-slate-400 border-t border-[#e5e0d5] dark:border-[#202330]">
                                <span>Record Hash: ATT-GOV-2026-0{current.id + 1}</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                                    <ShieldCheck size={12} /> Policy Enforced
                                </span>
                            </div>
                        </div>

                        {/* Supporting Contextual Panels (5 Cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            
                            {/* Panel 1: Stage Key Indicator */}
                            <div className="bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 shadow-md space-y-2.5">
                                <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d5] dark:border-[#202330]">
                                    <h5 className="text-xs font-black text-[#0a0d14] dark:text-white">
                                        Milestone Governance Matrix
                                    </h5>
                                    <span className="text-[10px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded">
                                        Stage {current.number}
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#374151] dark:text-slate-300 leading-relaxed font-medium bg-[#f6f5ee] dark:bg-[#1a1d2b] p-2.5 rounded-lg border border-[#e2ddd3] dark:border-[#282c3e]">
                                    {current.id === 0 && "Ensures mutual commitment between student, host employer, and academic department prior to attachment start."}
                                    {current.id === 1 && "Eliminates attendance falsification using localized time-bound presence verification algorithms."}
                                    {current.id === 2 && "Enforces regular weekly reflections and timely supervisor feedback to keep learning on track."}
                                    {current.id === 3 && "Maintains continuous faculty contact with host organizations to verify training quality."}
                                    {current.id === 4 && "Balances industry performance evaluations with university academic rigor for fair grading."}
                                    {current.id === 5 && "Provides university credit boards with tamper-evident, audit-ready student dossiers."}
                                </p>
                            </div>

                            {/* Panel 2: Continuous Lifecycle Progression Tracker */}
                            <div className="bg-white dark:bg-[#141620] border-2 border-violet-500/40 rounded-2xl p-4 shadow-md space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-violet-600 dark:text-violet-400" />
                                        <span className="text-xs font-black text-[#0a0d14] dark:text-white">
                                            Lifecycle Engine
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-violet-700 dark:text-violet-300">
                                        {Math.round(progressPercent)}%
                                    </span>
                                </div>

                                {/* Tactile Progression Bar */}
                                <div className="w-full bg-[#e2ddd3] dark:bg-[#202330] h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 h-full rounded-full"
                                        initial={{ width: '16%' }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-mono text-[#5b6276] dark:text-slate-400 pt-0.5">
                                    <span>Milestone: Stage {current.number} / 06</span>
                                    <span className="font-bold text-violet-700 dark:text-violet-400">{current.badge}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Bottom Activity Matrix */}
                <div className="mt-5 pt-3.5 border-t border-[#e2ddd3] dark:border-[#1f2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="flex items-center gap-1 font-bold text-[#0a0d14] dark:text-white mr-1">
                            <Activity size={13} className="text-violet-600 dark:text-violet-400" />
                            <span>System State:</span>
                        </span>
                        
                        <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                            <Check size={10} /> Active Audit Trail
                        </span>

                        <span className="inline-flex items-center gap-1 text-violet-900 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                            <Check size={10} /> Continuous Governance Enforced
                        </span>
                    </div>

                    <span className="self-start sm:self-center text-[11px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-300 dark:border-violet-500/20 whitespace-nowrap">
                        Accreditation Compliant
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LifecycleGovernanceWorkspace;
