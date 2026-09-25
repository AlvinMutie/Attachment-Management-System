import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Check,
    RotateCcw,
    GraduationCap,
    FileText,
    Activity,
    Compass,
    Bell,
    Users
} from 'lucide-react';

export const SupervisionWorkflowIllustration = () => {
    // 0: Active Workspace | 1: Log Submitted | 2: Industry Feedback Recorded | 3: University Review Scheduled
    const [sceneState, setSceneState] = useState(2);
    const [loadingTarget, setLoadingTarget] = useState(null); // 'log' | 'industry' | 'university' | null
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    // Transitions with brief, realistic transient loading states (500–700ms)
    const triggerTransition = (nextState) => {
        if (nextState === 1) {
            setLoadingTarget('log');
            setTimeout(() => {
                setSceneState(1);
                setLoadingTarget(null);
            }, 600);
        } else if (nextState === 2) {
            setLoadingTarget('industry');
            setTimeout(() => {
                setSceneState(2);
                setLoadingTarget(null);
            }, 650);
        } else if (nextState === 3) {
            setLoadingTarget('university');
            setTimeout(() => {
                setSceneState(3);
                setLoadingTarget(null);
            }, 600);
        } else {
            setSceneState(0);
            setLoadingTarget(null);
        }
    };

    // Subtle autonomous product interaction cycle with calm settling periods
    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setInterval(() => {
            setSceneState((prev) => {
                const next = prev >= 3 ? 0 : prev + 1;
                triggerTransition(next);
                return prev; // actual state set inside triggerTransition
            });
        }, 5200);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused]);

    const weekDays = [
        { day: 'M', active: true, label: 'Mon' },
        { day: 'T', active: true, label: 'Tue' },
        { day: 'W', active: true, label: 'Wed' },
        { day: 'T', active: true, label: 'Thu' },
        { day: 'F', active: sceneState >= 1 && loadingTarget !== 'log', label: 'Fri' }
    ];

    const timelineWeeks = [
        { week: 1, done: true },
        { week: 2, done: true },
        { week: 3, done: true },
        { week: 4, done: true },
        { week: 5, done: true },
        { week: 6, done: true },
        { week: 7, current: true, done: sceneState >= 1 },
        { week: 8, done: false },
        { week: 9, done: false },
        { week: 10, done: false },
        { week: 11, done: false },
        { week: 12, done: false }
    ];

    return (
        <div
            className="w-full max-w-5xl mx-auto my-8 relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Top Interactive Scene Controller */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-900 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-300 dark:border-cyan-500/20">
                        Interactive Scene • 02 Supervision
                    </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#12141c] border border-[#d6d0c2] dark:border-[#22242f] rounded-xl shadow-xs">
                    {[
                        { id: 0, label: '01 Active Workspace' },
                        { id: 1, label: '02 Log Submitted' },
                        { id: 2, label: '03 Industry Review' },
                        { id: 3, label: '04 Univ Review' }
                    ].map((step) => (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => {
                                setIsPaused(true);
                                triggerTransition(step.id);
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
                            triggerTransition(0);
                        }}
                        className="p-1 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors ml-0.5 cursor-pointer"
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
                            <Activity size={13} className="text-violet-600 dark:text-violet-400" />
                            <span>attachpro.app / attachments / ATT-2026-0142</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 hidden sm:inline-block">
                            Oversight Console
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>Attachment Active</span>
                        </span>
                    </div>
                </div>

                {/* Spatial Living Interface Environment */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* ========================================================================= */}
                    {/* DOMINANT HERO WORKSPACE: Attachment Progress & Weekly Logs (7.5 Cols)    */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-md space-y-4 relative">
                        
                        {/* Workspace Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div>
                                <h4 className="text-sm sm:text-base font-black text-[#0a0d14] dark:text-white">
                                    Software Engineering Attachment
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-[#5b6276] dark:text-slate-400 font-medium mt-0.5">
                                    <span>Student: Daniel Carter</span>
                                    <span>•</span>
                                    <span>Host: Acme Technologies</span>
                                </div>
                            </div>

                            <span className="self-start sm:self-auto text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20">
                                Week 7 of 12
                            </span>
                        </div>

                        {/* Attachment Progress Timeline Bar */}
                        <div className="space-y-1.5 bg-[#faf9f6] dark:bg-[#181a26] p-3 rounded-xl border border-[#e2ddd3] dark:border-[#282c3e]">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-bold text-[#0a0d14] dark:text-white">Overall Milestone Progress</span>
                                <span className="font-black text-violet-700 dark:text-violet-400">
                                    {sceneState >= 1 ? '58% Completed' : '55% Completed'}
                                </span>
                            </div>

                            {/* Weekly Step Timeline Strip */}
                            <div className="grid grid-cols-12 gap-1 pt-1">
                                {timelineWeeks.map((t) => (
                                    <div key={t.week} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`h-2 w-full rounded-sm transition-all duration-300 ${
                                                t.done
                                                    ? 'bg-violet-600 dark:bg-violet-500'
                                                    : t.current
                                                    ? 'bg-violet-400 dark:bg-violet-600 animate-pulse'
                                                    : 'bg-[#e2ddd3] dark:bg-[#282c3e]'
                                            }`}
                                        />
                                        <span className={`text-[8px] font-mono ${
                                            t.current
                                                ? 'font-bold text-violet-700 dark:text-violet-400'
                                                : 'text-[#8e95a5] dark:text-slate-500'
                                        }`}>
                                            W{t.week}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Weekly Activity & Entries */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5b6276] dark:text-slate-400">
                                    Week 7 Technical Reflection & Log
                                </span>
                                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                                    5 of 5 Days Logged
                                </span>
                            </div>

                            {/* Daily Log Entries Stack */}
                            <div className="space-y-1.5 text-xs">
                                <div className="p-2 rounded-lg bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] font-bold text-violet-700 dark:text-violet-400 bg-white dark:bg-[#12141c] px-1.5 py-0.5 rounded border border-[#e2ddd3] dark:border-[#242738]">
                                            Mon
                                        </span>
                                        <span className="font-medium text-[#22283a] dark:text-slate-200 text-[11px]">
                                            Backend REST API integration & route handlers
                                        </span>
                                    </div>
                                    <Check size={13} className="text-emerald-600 shrink-0" />
                                </div>

                                <div className="p-2 rounded-lg bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] font-bold text-violet-700 dark:text-violet-400 bg-white dark:bg-[#12141c] px-1.5 py-0.5 rounded border border-[#e2ddd3] dark:border-[#242738]">
                                            Wed
                                        </span>
                                        <span className="font-medium text-[#22283a] dark:text-slate-200 text-[11px]">
                                            Database schema indexing & token authentication
                                        </span>
                                    </div>
                                    <Check size={13} className="text-emerald-600 shrink-0" />
                                </div>

                                {/* Friday Entry with Live Saving/Submitting State */}
                                <motion.div
                                    className={`p-2 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                                        sceneState >= 1 && loadingTarget !== 'log'
                                            ? 'bg-violet-50/70 dark:bg-violet-950/30 border-violet-500'
                                            : loadingTarget === 'log'
                                            ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400/80'
                                            : 'bg-[#faf9f6] dark:bg-[#181a26] border-[#e2ddd3] dark:border-[#282c3e]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] font-bold text-violet-700 dark:text-violet-400 bg-white dark:bg-[#12141c] px-1.5 py-0.5 rounded border border-[#e2ddd3] dark:border-[#242738]">
                                            Fri
                                        </span>
                                        {loadingTarget === 'log' ? (
                                            <span className="font-medium text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                                <span>Saving weekly log submission...</span>
                                            </span>
                                        ) : (
                                            <span className="font-medium text-[#22283a] dark:text-slate-200 text-[11px]">
                                                End-of-week revision compilation & mentor sign-off
                                            </span>
                                        )}
                                    </div>

                                    {loadingTarget === 'log' ? (
                                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Clock size={11} className="animate-spin" /> Saving
                                        </span>
                                    ) : sceneState >= 1 ? (
                                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Submitted (Just now)
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-mono text-slate-400">Drafting</span>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* On-Site Attendance Matrix Strip */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#5b6276] dark:text-slate-400 border-t border-[#e5e0d5] dark:border-[#202330]">
                            <div className="flex items-center gap-2">
                                <span>Attendance: <strong className="text-[#0a0d14] dark:text-white">32 / 35 Days (91.4%)</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {weekDays.map((d, i) => (
                                    <span
                                        key={i}
                                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold border transition-colors duration-300 ${
                                            d.active
                                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30'
                                                : 'bg-[#ece8dc] dark:bg-[#202330] text-slate-400 border-transparent'
                                        }`}
                                    >
                                        {d.day}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* CONTEXTUAL OVERLAPPING PANELS: Industry + University Oversight (5 Cols)   */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* CONTEXTUAL DRAWER 1: Industry Supervisor Feedback Panel */}
                        <motion.div
                            className={`bg-white dark:bg-[#141620] border-2 rounded-2xl p-4 shadow-md space-y-3 transition-all duration-300 ${
                                sceneState >= 2 && loadingTarget !== 'industry'
                                    ? 'border-cyan-500/80 dark:border-cyan-500/60 ring-2 ring-cyan-500/10'
                                    : loadingTarget === 'industry'
                                    ? 'border-cyan-400/80'
                                    : 'border-[#e2ddd3] dark:border-[#22242f]'
                            }`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-cyan-600/15 text-cyan-700 dark:text-cyan-400 flex items-center justify-center">
                                        <Briefcase size={15} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">
                                            Industry Supervisor
                                        </h5>
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            Michael Anderson • Lead Mentor
                                        </span>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
                                    sceneState >= 2 && loadingTarget !== 'industry'
                                        ? 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-900 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/20'
                                        : loadingTarget === 'industry'
                                        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-300'
                                        : 'bg-[#ece8dd] dark:bg-[#1f2230] text-slate-400 border-transparent'
                                }`}>
                                    {loadingTarget === 'industry' ? 'Syncing...' : sceneState >= 2 ? 'Feedback Recorded' : 'Review Pending'}
                                </span>
                            </div>

                            {/* Feedback Quote or Subtle Loading Skeleton */}
                            <div className="bg-[#f6f5ee] dark:bg-[#1a1d2b] p-2.5 rounded-xl border border-[#e2ddd3] dark:border-[#282c3e] space-y-1">
                                {loadingTarget === 'industry' ? (
                                    <div className="space-y-1.5 py-1 animate-pulse">
                                        <div className="h-2.5 bg-[#e2ddd3] dark:bg-[#282c3e] rounded w-5/6" />
                                        <div className="h-2.5 bg-[#e2ddd3] dark:bg-[#282c3e] rounded w-2/3" />
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-[#22283a] dark:text-slate-200 italic leading-relaxed">
                                        "Good progress on the API integration. Next week, focus on error handling and testing coverage."
                                    </p>
                                )}
                                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                    <span>{loadingTarget === 'industry' ? 'Fetching review...' : 'Reviewed just now'}</span>
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                        <Check size={11} /> Signed Off
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* CONTEXTUAL DRAWER 2: University Supervisor Schedule Window */}
                        <motion.div
                            className={`bg-white dark:bg-[#141620] border-2 rounded-2xl p-4 shadow-md space-y-3 transition-all duration-300 ${
                                sceneState === 3 && loadingTarget !== 'university'
                                    ? 'border-violet-500/80 dark:border-violet-500/60 ring-2 ring-violet-500/10'
                                    : loadingTarget === 'university'
                                    ? 'border-violet-400/80'
                                    : 'border-[#e2ddd3] dark:border-[#22242f]'
                            }`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-violet-600/15 text-violet-700 dark:text-violet-400 flex items-center justify-center">
                                        <GraduationCap size={15} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">
                                            University Supervisor
                                        </h5>
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            Dr. Emily Johnson • Academic Faculty
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono font-bold bg-violet-100 dark:bg-violet-500/10 text-violet-900 dark:text-violet-300 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                                    Academic
                                </span>
                            </div>

                            {/* Schedule & Review Details */}
                            <div className="space-y-1.5 text-xs">
                                {loadingTarget === 'university' ? (
                                    <div className="p-2 rounded-lg bg-[#f6f5ee] dark:bg-[#1a1d2b] border border-[#e2ddd3] dark:border-[#282c3e] space-y-2 animate-pulse">
                                        <div className="h-2.5 bg-[#e2ddd3] dark:bg-[#282c3e] rounded w-3/4" />
                                        <div className="h-2.5 bg-[#e2ddd3] dark:bg-[#282c3e] rounded w-1/2" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f6f5ee] dark:bg-[#1a1d2b] border border-[#e2ddd3] dark:border-[#282c3e]">
                                            <span className="text-[#4b5563] dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                                <Calendar size={13} className="text-violet-600 dark:text-violet-400" />
                                                <span>Next Field Visit</span>
                                            </span>
                                            <span className="font-mono font-bold text-[#0a0d14] dark:text-white text-[11px]">
                                                Thursday • 10:30 AM
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f6f5ee] dark:bg-[#1a1d2b] border border-[#e2ddd3] dark:border-[#282c3e]">
                                            <span className="text-[#4b5563] dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                                <Compass size={13} className="text-violet-600 dark:text-violet-400" />
                                                <span>Review Type</span>
                                            </span>
                                            <span className="font-mono font-bold text-violet-700 dark:text-violet-400 text-[11px]">
                                                Mid-Term Evaluation
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Living Product Supervision Activity Stream */}
                <div className="mt-5 pt-3.5 border-t border-[#e2ddd3] dark:border-[#1f2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="flex items-center gap-1 font-bold text-[#0a0d14] dark:text-white mr-1">
                            <Bell size={13} className="text-violet-600 dark:text-violet-400" />
                            <span>Live Activity:</span>
                        </span>
                        
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key="act-log"
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20"
                            >
                                <Check size={10} /> Weekly log submitted
                            </motion.span>
                            
                            {sceneState >= 2 && (
                                <motion.span
                                    key="act-ind"
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-1 text-cyan-900 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/20"
                                >
                                    <Check size={10} /> Industry supervisor reviewed Week 7
                                </motion.span>
                            )}

                            {sceneState === 3 && (
                                <motion.span
                                    key="act-univ"
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-1 text-violet-900 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20"
                                >
                                    <Check size={10} /> University review scheduled for Thursday
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    <span className="self-start sm:self-center text-[11px] font-mono font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-300 dark:border-violet-500/20 whitespace-nowrap">
                        Continuous Tripartite Alignment
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SupervisionWorkflowIllustration;
