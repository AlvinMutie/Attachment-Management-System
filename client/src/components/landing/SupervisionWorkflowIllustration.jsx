import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    Briefcase,
    Building2,
    CheckCircle2,
    Clock,
    Check,
    RotateCcw,
    Users,
    Activity,
    FileText,
    CalendarCheck,
    ArrowRight,
    ArrowDown,
    ShieldCheck,
    SlidersHorizontal,
    Compass
} from 'lucide-react';

export const SupervisionWorkflowIllustration = () => {
    // Stage 1: Student Progress Active | Stage 2: Industry Feedback Submitted | Stage 3: University Review & Shared Alignment
    const [activeStage, setActiveStage] = useState(3);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Subtle, restrained automated cycle through the 3 supervision stages
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setActiveStage((prev) => (prev >= 3 ? 1 : prev + 1));
        }, 4200);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    return (
        <div
            className="w-full max-w-5xl mx-auto my-6 relative select-none"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Top Controller Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-violet-800 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-md border border-violet-300 dark:border-violet-500/20">
                        Workflow 02 • Supervision
                    </span>
                </div>

                {/* Step Selector Pills */}
                <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#12141c] border border-[#d6d0c2] dark:border-[#22242f] rounded-xl shadow-xs">
                    {[
                        { step: 1, label: '01 Progress' },
                        { step: 2, label: '02 Industry' },
                        { step: 3, label: '03 University' }
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
                        onClick={() => {
                            setIsAutoPlaying(false);
                            setActiveStage(1);
                        }}
                        className="p-1 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors ml-0.5"
                        title="Replay sequence"
                        aria-label="Replay sequence"
                    >
                        <RotateCcw size={13} />
                    </button>
                </div>
            </div>

            {/* Main Interactive Product Canvas */}
            <div className="relative rounded-3xl bg-white dark:bg-[#101218] border-2 border-[#e2ddd3] dark:border-[#22242f] p-5 sm:p-7 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e0d5_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2333_1px,transparent_1px)] bg-[size:20px_20px] opacity-35 pointer-events-none" />

                {/* Subtitle / Storyline Header */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#e2ddd3] dark:border-[#1f2230]">
                    <div>
                        <h3 className="text-base sm:text-lg font-black text-[#0a0d14] dark:text-white tracking-tight">
                            Student Progress ↔ Industry Feedback ↔ University Oversight
                        </h3>
                        <p className="text-xs text-[#4b5563] dark:text-slate-400 font-medium mt-0.5">
                            Continuous tripartite oversight ensuring student learning outcomes, weekly logbook sign-offs, and on-site visits.
                        </p>
                    </div>

                    <span className="self-start sm:self-center text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#f4f2ea] dark:bg-[#161822] text-[#0a0d14] dark:text-slate-200 border border-[#d6d0c2] dark:border-[#282c3e]">
                        Step {activeStage} of 3
                    </span>
                </div>

                {/* 3-Card Supervision Layout (Desktop: Horizontal Tripartite Grid | Mobile: Vertical Flow) */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-11 gap-4 mt-6 items-stretch">
                    
                    {/* ========================================================================= */}
                    {/* 01 — INDUSTRY SUPERVISOR (Workplace Mentor) (Col 1-3)                     */}
                    {/* ========================================================================= */}
                    <motion.div
                        className={`lg:col-span-3 flex flex-col justify-between bg-[#fbfbfa] dark:bg-[#141620] border-2 rounded-2xl p-4.5 shadow-xs transition-all duration-300 ${
                            activeStage >= 2
                                ? 'border-cyan-500/60 dark:border-cyan-500/40 ring-2 ring-cyan-500/10'
                                : 'border-[#dcd6c8] dark:border-[#242736]'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400">
                                        <Briefcase size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">Industry Supervisor</h4>
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">Workplace Mentor</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono font-bold bg-cyan-100 dark:bg-cyan-500/10 text-cyan-900 dark:text-cyan-300 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/20">
                                    On-Site
                                </span>
                            </div>

                            {/* Mentorship Oversight Details */}
                            <div className="mt-3.5 space-y-1">
                                <span className="text-xs font-black text-[#0a0d14] dark:text-white block">
                                    Weekly Logbook Review
                                </span>
                                <span className="text-[11px] text-[#4b5563] dark:text-slate-400 font-medium block">
                                    Workplace Technical Supervision
                                </span>
                            </div>

                            {/* Milestone checklist */}
                            <div className="mt-3.5 space-y-1.5">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block">
                                    Mentor Deliverables
                                </span>
                                <div className="space-y-1 text-[11px] font-medium text-[#22283a] dark:text-slate-300">
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1a1d28] border border-[#e5e0d5] dark:border-[#272b3c]">
                                        <span>Weekly Log Sign-off</span>
                                        <span className={`font-mono font-bold text-[10px] ${
                                            activeStage >= 2 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                                        }`}>
                                            {activeStage >= 2 ? '✓ Approved' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1a1d28] border border-[#e5e0d5] dark:border-[#272b3c]">
                                        <span>Attendance Confirmation</span>
                                        <span className={`font-mono font-bold text-[10px] ${
                                            activeStage >= 2 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                                        }`}>
                                            {activeStage >= 2 ? '✓ Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="mt-4 pt-3 border-t border-[#e5e0d5] dark:border-[#202330] flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                Latest Review
                            </span>
                            <AnimatePresence mode="wait">
                                {activeStage === 1 && (
                                    <motion.span
                                        key="ind1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[10px] font-mono font-bold text-[#5b6276] dark:text-slate-400 bg-[#ece8dd] dark:bg-[#1f2230] px-2 py-0.5 rounded"
                                    >
                                        Pending Log
                                    </motion.span>
                                )}
                                {activeStage >= 2 && (
                                    <motion.span
                                        key="ind2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 flex items-center gap-1"
                                    >
                                        <Check size={11} /> Feedback Submitted
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* ========================================================================= */}
                    {/* CONNECTOR 1 (Desktop: Horizontal line | Mobile: Vertical arrow)           */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-1 flex flex-col lg:flex-row items-center justify-center py-2 lg:py-0">
                        <div className="hidden lg:flex w-full items-center justify-center relative">
                            <div className={`h-0.5 w-full transition-colors duration-500 ${
                                activeStage >= 2 ? 'bg-cyan-600 dark:bg-cyan-500' : 'bg-[#d6d0c2] dark:bg-[#282c3c]'
                            }`} />
                            <motion.div
                                className="absolute w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-xs"
                                animate={{ scale: activeStage >= 2 ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <ArrowRight size={10} />
                            </motion.div>
                        </div>
                        <div className="lg:hidden flex items-center justify-center py-1">
                            <ArrowDown size={18} className={activeStage >= 2 ? 'text-cyan-600' : 'text-[#bbb3a0]'} />
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* 02 — STUDENT PROGRESS (Visual Anchor / Center Node) (Col 5-7)             */}
                    {/* ========================================================================= */}
                    <motion.div
                        className="lg:col-span-3 flex flex-col justify-between bg-[#fbfbfa] dark:bg-[#141620] border-2 border-violet-500/60 dark:border-violet-500/40 ring-2 ring-violet-500/10 rounded-2xl p-4.5 shadow-md relative overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-700 dark:text-violet-400">
                                        <GraduationCap size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">Student Progress</h4>
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">BSc Information Tech</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                                    Attachment Active
                                </span>
                            </div>

                            {/* Progress Gauge */}
                            <div className="mt-3.5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                        Attachment Progress
                                    </span>
                                    <span className="text-xs font-mono font-black text-violet-700 dark:text-violet-400">
                                        68% Completed
                                    </span>
                                </div>

                                {/* Animated Progress Bar */}
                                <div className="w-full h-2.5 bg-[#e5e0d5] dark:bg-[#202330] rounded-full overflow-hidden p-0.5">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: '68%' }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                    <span>Week 8 of 12</span>
                                    <span>4 Weeks Remaining</span>
                                </div>
                            </div>

                            {/* Core Activity Items */}
                            <div className="mt-3.5 space-y-1.5">
                                <div className="space-y-1 text-[11px] font-medium text-[#22283a] dark:text-slate-300">
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1a1d28] border border-[#e5e0d5] dark:border-[#272b3c]">
                                        <span className="flex items-center gap-1.5">
                                            <FileText size={13} className="text-violet-600 dark:text-violet-400" />
                                            <span>Weekly Log</span>
                                        </span>
                                        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px] flex items-center gap-0.5">
                                            <Check size={11} /> Submitted
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1a1d28] border border-[#e5e0d5] dark:border-[#272b3c]">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarCheck size={13} className="text-violet-600 dark:text-violet-400" />
                                            <span>Attendance</span>
                                        </span>
                                        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px] flex items-center gap-0.5">
                                            <Check size={11} /> Up to Date
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="mt-4 pt-3 border-t border-[#e5e0d5] dark:border-[#202330] flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                Oversight Status
                            </span>
                            <span className="text-[10px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                                In Continuous Review
                            </span>
                        </div>
                    </motion.div>

                    {/* ========================================================================= */}
                    {/* CONNECTOR 2 (Desktop: Horizontal line | Mobile: Vertical arrow)           */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-1 flex flex-col lg:flex-row items-center justify-center py-2 lg:py-0">
                        <div className="hidden lg:flex w-full items-center justify-center relative">
                            <div className={`h-0.5 w-full transition-colors duration-500 ${
                                activeStage >= 3 ? 'bg-violet-600 dark:bg-violet-500' : 'bg-[#d6d0c2] dark:bg-[#282c3c]'
                            }`} />
                            <motion.div
                                className="absolute w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xs"
                                animate={{ scale: activeStage >= 3 ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <ArrowRight size={10} />
                            </motion.div>
                        </div>
                        <div className="lg:hidden flex items-center justify-center py-1">
                            <ArrowDown size={18} className={activeStage >= 3 ? 'text-violet-600' : 'text-[#bbb3a0]'} />
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* 03 — UNIVERSITY SUPERVISOR (Academic Oversight) (Col 9-11)                */}
                    {/* ========================================================================= */}
                    <motion.div
                        className={`lg:col-span-3 flex flex-col justify-between bg-[#fbfbfa] dark:bg-[#141620] border-2 rounded-2xl p-4.5 shadow-xs transition-all duration-300 ${
                            activeStage === 3
                                ? 'border-violet-500/70 dark:border-violet-500/50 ring-2 ring-violet-500/10'
                                : 'border-[#dcd6c8] dark:border-[#242736]'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-700 dark:text-violet-400">
                                        <Building2 size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">University Supervisor</h4>
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">Academic Faculty</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono font-bold bg-violet-100 dark:bg-violet-500/10 text-violet-900 dark:text-violet-300 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                                    Faculty
                                </span>
                            </div>

                            {/* Academic Oversight Details */}
                            <div className="mt-3.5 space-y-1">
                                <span className="text-xs font-black text-[#0a0d14] dark:text-white block">
                                    Academic Defense & Visits
                                </span>
                                <span className="text-[11px] text-[#4b5563] dark:text-slate-400 font-medium block">
                                    Curriculum Alignment & Rubrics
                                </span>
                            </div>

                            {/* Oversight Milestones */}
                            <div className="mt-3.5 space-y-1.5">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400 block">
                                    Supervision Schedule
                                </span>
                                <div className="space-y-1 text-[11px] font-medium text-[#22283a] dark:text-slate-300">
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1a1d28] border border-[#e5e0d5] dark:border-[#272b3c]">
                                        <span className="flex items-center gap-1.5">
                                            <Compass size={13} className="text-violet-600 dark:text-violet-400" />
                                            <span>Next Field Visit</span>
                                        </span>
                                        <span className="text-violet-700 dark:text-violet-400 font-mono font-bold text-[10px]">
                                            Scheduled
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 px-2 rounded bg-white dark:bg-[#1a1d28] border border-[#e5e0d5] dark:border-[#272b3c]">
                                        <span className="flex items-center gap-1.5">
                                            <SlidersHorizontal size={13} className="text-violet-600 dark:text-violet-400" />
                                            <span>Rubric Evaluation</span>
                                        </span>
                                        <span className={`font-mono font-bold text-[10px] ${
                                            activeStage === 3 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                                        }`}>
                                            {activeStage === 3 ? '✓ Submitted' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="mt-4 pt-3 border-t border-[#e5e0d5] dark:border-[#202330] flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                Faculty Status
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                activeStage === 3
                                    ? 'text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20'
                                    : 'text-[#5b6276] dark:text-slate-400 bg-[#ece8dd] dark:bg-[#1f2230]'
                            }`}>
                                <CheckCircle2 size={11} /> {activeStage === 3 ? 'Review Complete' : 'Review Pending'}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Shared Activity & Alignment Stream (Bottom Layer) */}
                <div className="mt-6 pt-4 border-t border-[#e2ddd3] dark:border-[#1f2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-[#374151] dark:text-slate-300 font-medium">
                        <span className="flex items-center gap-1.5 font-bold text-[#0a0d14] dark:text-white">
                            <Activity size={14} className="text-violet-600 dark:text-violet-400" />
                            <span>Recent Activity:</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                            <Check size={11} /> Weekly log submitted
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border transition-colors ${
                            activeStage >= 2
                                ? 'text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200 dark:border-cyan-500/20'
                                : 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-transparent'
                        }`}>
                            <Check size={11} /> Industry feedback received
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border transition-colors ${
                            activeStage === 3
                                ? 'text-violet-800 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/5 border-violet-200 dark:border-violet-500/20'
                                : 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-transparent'
                        }`}>
                            <Check size={11} /> University review completed
                        </span>
                    </div>

                    <span className="self-start sm:self-center text-[11px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-300 dark:border-violet-500/20 whitespace-nowrap">
                        Everyone Stays Aligned
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SupervisionWorkflowIllustration;
