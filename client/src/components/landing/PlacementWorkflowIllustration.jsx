import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Building2,
    Briefcase,
    CheckCircle2,
    Clock,
    Check,
    RotateCcw,
    Sparkles,
    GraduationCap,
    SlidersHorizontal,
    FileCheck2,
    ShieldCheck,
    Send,
    MapPin,
    Calendar,
    Users,
    BadgeCheck,
    ArrowUpRight
} from 'lucide-react';

export const PlacementWorkflowIllustration = () => {
    // 0: Browse & Match | 1: Submit Application | 2: Placement Active
    const [sceneState, setSceneState] = useState(2);
    const [isPaused, setIsPaused] = useState(false);

    // Subtle autonomous product interaction cycle
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setSceneState((prev) => (prev >= 2 ? 0 : prev + 1));
        }, 4800);
        return () => clearInterval(timer);
    }, [isPaused]);

    return (
        <div
            className="w-full max-w-5xl mx-auto my-8 relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Top Interactive Scene Controller */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-violet-800 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-md border border-violet-300 dark:border-violet-500/20">
                        Interactive Scene • 01 Placement
                    </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#12141c] border border-[#d6d0c2] dark:border-[#22242f] rounded-xl shadow-xs">
                    {[
                        { id: 0, label: '01 Browse & Match' },
                        { id: 1, label: '02 Submit Application' },
                        { id: 2, label: '03 Placement Active' }
                    ].map((step) => (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => {
                                setIsPaused(true);
                                setSceneState(step.id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                sceneState === step.id
                                    ? 'bg-violet-600 text-white shadow-xs'
                                    : 'text-[#4b5563] dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-[#f4f2ea] dark:hover:bg-[#181a24]'
                            }`}
                        >
                            {step.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setIsPaused(true);
                            setSceneState(0);
                        }}
                        className="p-1 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors ml-0.5"
                        title="Replay sequence"
                        aria-label="Replay sequence"
                    >
                        <RotateCcw size={13} />
                    </button>
                </div>
            </div>

            {/* Living Product Stage Container */}
            <div className="relative rounded-3xl bg-[#faf9f6] dark:bg-[#0f1117] border-2 border-[#e2ddd3] dark:border-[#22242f] p-4 sm:p-7 shadow-xl dark:shadow-2xl overflow-hidden">
                
                {/* Subtle Grid Canvas Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e0d5_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2333_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

                {/* Subtle Window Header / Browser Chrome */}
                <div className="relative z-10 flex items-center justify-between pb-3.5 mb-5 border-b border-[#e2ddd3] dark:border-[#1f2230]">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e2ddd3] dark:bg-[#282c3c]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e2ddd3] dark:bg-[#282c3c]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#e2ddd3] dark:bg-[#282c3c]" />
                        </div>
                        <div className="h-4 w-px bg-[#e2ddd3] dark:bg-[#22242f] mx-1" />
                        <span className="text-xs font-mono font-bold text-[#0a0d14] dark:text-slate-200 flex items-center gap-1.5">
                            <Building2 size={13} className="text-violet-600 dark:text-violet-400" />
                            <span>attachpro.app / opportunities</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 hidden sm:inline-block">
                            Candidate Portal
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                            Documents Verified
                        </span>
                    </div>
                </div>

                {/* Spatial Composition: Dominant Hero Interface + Overlapping Contextual Panels */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* ========================================================================= */}
                    {/* DOMINANT HERO INTERFACE: Attachment Opportunities Explorer (7 Cols)      */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5 relative">
                        
                        {/* Search Bar with Active Cursor Micro-Interaction */}
                        <div className="flex items-center gap-2 pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div className="flex-1 flex items-center gap-2 bg-[#f6f5ee] dark:bg-[#1b1e2b] px-3 py-1.5 rounded-xl border border-[#e2ddd3] dark:border-[#282c3e] text-xs">
                                <Search size={14} className="text-[#5b6276] dark:text-slate-400 shrink-0" />
                                <span className="font-semibold text-[#0a0d14] dark:text-slate-200">
                                    Software Engineering Intern
                                </span>
                                <span className="w-1.5 h-3.5 bg-violet-600 animate-pulse ml-0.5" />
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1.5 rounded-xl bg-[#f6f5ee] dark:bg-[#1b1e2b] border border-[#e2ddd3] dark:border-[#282c3e] text-[#4b5563] dark:text-slate-300">
                                <SlidersHorizontal size={12} />
                                <span className="hidden sm:inline">Filters</span>
                            </div>
                        </div>

                        {/* Opportunity Listings Stack */}
                        <div className="space-y-2.5">
                            
                            {/* PRIMARY HERO OPPORTUNITY CARD */}
                            <motion.div
                                className={`rounded-xl p-3.5 border-2 transition-all duration-300 relative ${
                                    sceneState >= 1
                                        ? 'bg-violet-50/60 dark:bg-violet-950/25 border-violet-500 shadow-sm'
                                        : 'bg-[#fbfbfa] dark:bg-[#181a26] border-violet-500/40'
                                }`}
                                animate={{ scale: sceneState === 1 ? 1.01 : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-700 dark:text-violet-400 shrink-0 mt-0.5">
                                            <Briefcase size={17} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs sm:text-sm font-black text-[#0a0d14] dark:text-white">
                                                    Software Engineering Intern
                                                </h4>
                                                <span className="text-[9px] font-mono font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/20 px-1.5 py-0.2 rounded border border-violet-300 dark:border-violet-500/30">
                                                    Recommended
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#4b5563] dark:text-slate-400 font-medium mt-0.5">
                                                Host Organization • Enterprise Partner
                                            </p>
                                        </div>
                                    </div>

                                    {/* Real-time Status Badge */}
                                    <div>
                                        {sceneState === 0 && (
                                            <span className="text-[10px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                                                1 Slot Open
                                            </span>
                                        )}
                                        {sceneState === 1 && (
                                            <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/20 flex items-center gap-1">
                                                <Clock size={11} className="animate-spin" /> In Review
                                            </span>
                                        )}
                                        {sceneState === 2 && (
                                            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 flex items-center gap-1">
                                                <CheckCircle2 size={11} /> Placement Active
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Meta Attributes */}
                                <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                    <span className="inline-flex items-center gap-1 bg-white dark:bg-[#12141c] px-2 py-0.5 rounded border border-[#e2ddd3] dark:border-[#282c3e]">
                                        <Calendar size={11} /> 12-Week Term
                                    </span>
                                    <span className="inline-flex items-center gap-1 bg-white dark:bg-[#12141c] px-2 py-0.5 rounded border border-[#e2ddd3] dark:border-[#282c3e]">
                                        <MapPin size={11} /> On-Site Industry Mentor
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold bg-white dark:bg-[#12141c] px-2 py-0.5 rounded border border-[#e2ddd3] dark:border-[#282c3e]">
                                        <Check size={11} /> Prerequisites Met
                                    </span>
                                </div>
                            </motion.div>

                            {/* SECONDARY BACKGROUND LISTING (Contextual Depth) */}
                            <div className="rounded-xl p-3 bg-[#fbfbfa] dark:bg-[#161824] border border-[#e2ddd3] dark:border-[#242738] opacity-65 hover:opacity-100 transition-opacity">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#ece8dc] dark:bg-[#202332] flex items-center justify-center text-[#5b6276] dark:text-slate-400 text-xs">
                                            <Building2 size={14} />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold text-[#0a0d14] dark:text-slate-200">
                                                Network Systems & Support Attachee
                                            </h5>
                                            <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">
                                                Regional Telecommunications Partner
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-mono text-[#5b6276] dark:text-slate-400 bg-white dark:bg-[#12141c] px-2 py-0.5 rounded border border-[#e2ddd3] dark:border-[#26293a]">
                                        2 Slots Available
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#5b6276] dark:text-slate-400 border-t border-[#e5e0d5] dark:border-[#202330]">
                            <span>Verified Host Directory</span>
                            <span className="font-bold text-violet-700 dark:text-violet-400">Institutional Governance Active</span>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* OVERLAPPING CONTEXTUAL UI FRAGMENTS (5 Cols)                              */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* FRAGMENT 1: Floating Student Candidate Context Panel */}
                        <motion.div
                            className="bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 shadow-md relative"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex items-center justify-between pb-2.5 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-violet-600/15 text-violet-700 dark:text-violet-400 flex items-center justify-center">
                                        <GraduationCap size={15} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">
                                            Student Profile
                                        </h5>
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            BSc Information Technology
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded">
                                    Year 3
                                </span>
                            </div>

                            {/* Verified Prerequisite Checklist */}
                            <div className="mt-2.5 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between text-[11px] p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b]">
                                    <span className="text-[#4b5563] dark:text-slate-400 flex items-center gap-1.5">
                                        <FileCheck2 size={13} className="text-violet-600 dark:text-violet-400" />
                                        <span>Introductory Letter</span>
                                    </span>
                                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                        <Check size={11} /> Verified
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b]">
                                    <span className="text-[#4b5563] dark:text-slate-400 flex items-center gap-1.5">
                                        <ShieldCheck size={13} className="text-violet-600 dark:text-violet-400" />
                                        <span>Insurance Clearance</span>
                                    </span>
                                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                        <Check size={11} /> Verified
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* FRAGMENT 2: Interactive Dynamic Workflow State Card */}
                        <AnimatePresence mode="wait">
                            
                            {/* STATE 0: Ready to Apply */}
                            {sceneState === 0 && (
                                <motion.div
                                    key="state-0"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-white dark:bg-[#141620] border-2 border-violet-500/50 rounded-2xl p-4 shadow-md space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-[#0a0d14] dark:text-white">
                                            Application Dossier
                                        </span>
                                        <span className="text-[10px] font-mono text-violet-700 dark:text-violet-400 font-bold bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-500/20">
                                            Ready
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#4b5563] dark:text-slate-400 leading-relaxed">
                                        Prerequisites verified. One-click transmission to host organization and university coordinator.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSceneState(1)}
                                        className="w-full py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        <Send size={13} />
                                        <span>Submit Application</span>
                                    </button>
                                </motion.div>
                            )}

                            {/* STATE 1: Application Dispatched & In Review */}
                            {sceneState === 1 && (
                                <motion.div
                                    key="state-1"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-white dark:bg-[#141620] border-2 border-amber-500/60 rounded-2xl p-4 shadow-md space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-amber-600 animate-spin" />
                                            <span className="text-xs font-black text-[#0a0d14] dark:text-white">
                                                Application Submitted
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/20">
                                            Under Review
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1.5 text-[11px] font-medium text-[#374151] dark:text-slate-300">
                                        <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b]">
                                            <span>University Review</span>
                                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">✓ Approved</span>
                                        </div>
                                        <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b]">
                                            <span>Industry Review</span>
                                            <span className="font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                                <Clock size={10} /> In Progress
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400 pt-1">
                                        Awaiting workplace mentor sign-off
                                    </div>
                                </motion.div>
                            )}

                            {/* STATE 2: Placement Confirmed & Supervisors Appointed */}
                            {sceneState === 2 && (
                                <motion.div
                                    key="state-2"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-white dark:bg-[#141620] border-2 border-emerald-500/70 rounded-2xl p-4 shadow-md space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 size={15} className="text-emerald-600" />
                                            <span className="text-xs font-black text-[#0a0d14] dark:text-white">
                                                Placement Confirmed
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-mono font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                                            Active Enrolment
                                        </span>
                                    </div>

                                    {/* Multi-Stakeholder Supervisor Allocation */}
                                    <div className="space-y-1.5 text-[11px]">
                                        <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b]">
                                            <span className="text-[#4b5563] dark:text-slate-400 font-medium">University Supervisor</span>
                                            <span className="font-mono font-bold text-violet-700 dark:text-violet-400">Assigned</span>
                                        </div>
                                        <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b]">
                                            <span className="text-[#4b5563] dark:text-slate-400 font-medium">Industry Supervisor</span>
                                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">Assigned</span>
                                        </div>
                                    </div>

                                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5 p-1.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                                        <span>75% Attendance Guard</span>
                                        <span className="font-bold">Active Tracking</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Living Product Bottom Context Bar */}
                <div className="mt-5 pt-3.5 border-t border-[#e2ddd3] dark:border-[#1f2230] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#4b5563] dark:text-slate-400 font-medium">
                        <Users size={14} className="text-violet-600 dark:text-violet-400" />
                        <span>Connected Stakeholders: Student • Host Organization • University Faculty</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20">
                            Institutional Governance Active
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementWorkflowIllustration;
