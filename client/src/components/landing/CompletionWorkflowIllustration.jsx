import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    Check,
    RotateCcw,
    ShieldCheck,
    Award,
    FileCheck,
    ClipboardCheck,
    Building2,
    Calendar,
    Activity,
    Lock
} from 'lucide-react';

export const CompletionWorkflowIllustration = () => {
    // 0: Verifying Records | 1: Attendance Verified | 2: Reviews Recorded | 3: Report Confirmed | 4: Attachment Complete
    const [sceneState, setSceneState] = useState(4);
    const [loadingTarget, setLoadingTarget] = useState(null); // 'attendance' | 'reviews' | 'report' | 'final' | null
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    // Transitions with brief, believable transient loading states (450–700ms)
    const triggerTransition = (nextState) => {
        if (nextState === 1) {
            setLoadingTarget('attendance');
            setTimeout(() => {
                setSceneState(1);
                setLoadingTarget(null);
            }, 550);
        } else if (nextState === 2) {
            setLoadingTarget('reviews');
            setTimeout(() => {
                setSceneState(2);
                setLoadingTarget(null);
            }, 600);
        } else if (nextState === 3) {
            setLoadingTarget('report');
            setTimeout(() => {
                setSceneState(3);
                setLoadingTarget(null);
            }, 550);
        } else if (nextState === 4) {
            setLoadingTarget('final');
            setTimeout(() => {
                setSceneState(4);
                setLoadingTarget(null);
            }, 650);
        } else {
            setSceneState(0);
            setLoadingTarget(null);
        }
    };

    // Autonomous calm product interaction cycle
    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setInterval(() => {
            setSceneState((prev) => {
                const next = prev >= 4 ? 0 : prev + 1;
                triggerTransition(next);
                return prev;
            });
        }, 5200);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused]);

    // Unique Scene 04 Squiggly Progress calculation (Verify -> Review -> Finalize -> Complete)
    const squiggleProgress = sceneState === 0 ? 0.2 : sceneState === 1 ? 0.45 : sceneState === 2 ? 0.7 : sceneState === 3 ? 0.88 : 1.0;

    return (
        <div
            className="w-full max-w-5xl mx-auto my-8 relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Top Interactive Scene Controller */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-500/20">
                        Interactive Scene • 04 Completion
                    </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#12141c] border border-[#d6d0c2] dark:border-[#22242f] rounded-xl shadow-xs">
                    {[
                        { id: 0, label: '01 Verify' },
                        { id: 1, label: '02 Attendance' },
                        { id: 2, label: '03 Reviews' },
                        { id: 3, label: '04 Report' },
                        { id: 4, label: '05 Complete' }
                    ].map((step) => (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => {
                                setIsPaused(true);
                                triggerTransition(step.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                sceneState === step.id
                                    ? 'bg-emerald-600 text-white shadow-xs'
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
                        className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ml-0.5 cursor-pointer"
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
                            <FileCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                            <span>attachpro.app / attachments / ATT-2026-0142 / completion</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 hidden sm:inline-block">
                            Institutional Record
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            sceneState === 4
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20'
                                : 'bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/20'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sceneState === 4 ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`} />
                            <span>{sceneState === 4 ? 'Completed & Locked' : 'Audit In Progress'}</span>
                        </span>
                    </div>
                </div>

                {/* Spatial Living Interface Environment */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* ========================================================================= */}
                    {/* DOMINANT HERO WORKSPACE: Attachment Completion Workspace (7.5 Cols)       */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-md space-y-4 relative">
                        
                        {/* Header Profile & Completion Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div>
                                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 block">
                                    Final Clearance & Closure
                                </span>
                                <h4 className="text-sm sm:text-base font-black text-[#0a0d14] dark:text-white mt-0.5">
                                    Attachment Completion Record
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5b6276] dark:text-slate-400 font-medium mt-1">
                                    <span>Student: Brian Mwangi</span>
                                    <span>•</span>
                                    <span>BSc IT (Class 2026)</span>
                                    <span>•</span>
                                    <span>Acme Technologies</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                                    sceneState === 4
                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20'
                                        : 'bg-[#f6f5ee] dark:bg-[#181a26] text-[#0a0d14] dark:text-slate-300 border-[#e2ddd3] dark:border-[#282c3e]'
                                }`}>
                                    {sceneState === 4 ? (
                                        <>
                                            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                                            <span>✓ Completed</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={13} className="text-amber-600 animate-spin" />
                                            <span>Reviewing</span>
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Structured Vertical Verification Sequence */}
                        <div className="space-y-2.5">
                            
                            {/* REQUIREMENT 01: Attendance Verification */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#0a0d14] dark:text-white block">
                                            Attendance Policy Requirement
                                        </span>
                                        <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            32 / 35 Verified Days recorded (&gt;75% institutional threshold)
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    {loadingTarget === 'attendance' ? (
                                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Clock size={10} className="animate-spin" /> Verifying...
                                        </span>
                                    ) : sceneState >= 1 ? (
                                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                            <Check size={13} /> Verified
                                        </span>
                                    ) : (
                                        <span className="text-xs font-mono text-slate-400">Pending</span>
                                    )}
                                </div>
                            </div>

                            {/* REQUIREMENT 02: Weekly Logbook Submissions */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                                        <FileCheck size={16} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#0a0d14] dark:text-white block">
                                            Weekly Logbooks
                                        </span>
                                        <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            10 / 10 Weeks Submitted & Mentor Approved
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    {sceneState >= 1 ? (
                                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                            <Check size={13} /> Complete
                                        </span>
                                    ) : (
                                        <span className="text-xs font-mono text-slate-400">Pending</span>
                                    )}
                                </div>
                            </div>

                            {/* REQUIREMENT 03: Dual Supervisor Reviews & Sign-Offs */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center">
                                        <Building2 size={16} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#0a0d14] dark:text-white block">
                                            Dual Supervisor Evaluations
                                        </span>
                                        <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            Industry Mentor (48/50) & Academic Supervisor (46/50)
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    {loadingTarget === 'reviews' ? (
                                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Clock size={10} className="animate-spin" /> Recording...
                                        </span>
                                    ) : sceneState >= 2 ? (
                                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                            <Check size={13} /> Recorded
                                        </span>
                                    ) : (
                                        <span className="text-xs font-mono text-slate-400">Pending</span>
                                    )}
                                </div>
                            </div>

                            {/* REQUIREMENT 04: Final Attachment Report Dossier */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-600/10 text-violet-700 dark:text-violet-400 flex items-center justify-center">
                                        <ClipboardCheck size={16} />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-[#0a0d14] dark:text-white block">
                                            Final Attachment Report
                                        </span>
                                        <span className="text-[11px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            Complete Dossier ATT-2026-FINAL Submitted
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    {loadingTarget === 'report' ? (
                                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Clock size={10} className="animate-spin" /> Verifying...
                                        </span>
                                    ) : sceneState >= 3 ? (
                                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                            <Check size={13} /> Submitted
                                        </span>
                                    ) : (
                                        <span className="text-xs font-mono text-slate-400">Pending</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Document Footer Summary */}
                        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#5b6276] dark:text-slate-400 border-t border-[#e5e0d5] dark:border-[#202330]">
                            <span className="flex items-center gap-1">
                                <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                                <span>Record Hash: ATT-2026-COMPLETE</span>
                            </span>
                            {sceneState === 4 ? (
                                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                    <ShieldCheck size={13} /> Ready for Academic Credit Board
                                </span>
                            ) : (
                                <span className="font-bold text-amber-700 dark:text-amber-400">Validating Milestones</span>
                            )}
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* CONTEXTUAL VERIFICATION PANELS + SIGNATURE SQUIGGLY LOADER (5 Cols)      */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* FRAGMENT 1: Contextual Verification Review Drawer */}
                        <div className="bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 shadow-md space-y-2.5">
                            <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                                        <Award size={15} />
                                    </div>
                                    <h5 className="text-xs font-black text-[#0a0d14] dark:text-white">
                                        Faculty Clearance Status
                                    </h5>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                    Grade: 94 / 100
                                </span>
                            </div>

                            <p className="text-[11px] text-[#374151] dark:text-slate-300 leading-relaxed font-medium bg-[#f6f5ee] dark:bg-[#1a1d2b] p-2.5 rounded-lg border border-[#e2ddd3] dark:border-[#282c3e]">
                                All required attachment logs, attendance thresholds, and assessment rubrics have been verified and submitted for academic credit award.
                            </p>
                        </div>

                        {/* FRAGMENT 2: Dual Assessment Context Summary */}
                        <div className="bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 shadow-md space-y-2.5">
                            <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <h5 className="text-xs font-black text-[#0a0d14] dark:text-white">
                                    Assessment Endorsements
                                </h5>
                                <span className="text-[10px] font-mono text-[#5b6276] dark:text-slate-400">
                                    Dual Signatures
                                </span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                                <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b] text-[11px]">
                                    <span className="text-[#22283a] dark:text-slate-200 font-medium">Industry: James Kariuki</span>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">✓ Endorsed</span>
                                </div>
                                <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b] text-[11px]">
                                    <span className="text-[#22283a] dark:text-slate-200 font-medium">Faculty: Dr. Angela Mwende</span>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">✓ Endorsed</span>
                                </div>
                            </div>
                        </div>

                        {/* FRAGMENT 3: The Signature Material 3 Squiggly Completion Tracker */}
                        <div className="bg-white dark:bg-[#141620] border-2 border-emerald-500/50 rounded-2xl p-4 shadow-md space-y-2 relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-black text-[#0a0d14] dark:text-white">
                                        Closure Verification Flow
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                                    {Math.round(squiggleProgress * 100)}%
                                </span>
                            </div>

                            {/* Tactile Material 3 Serpentine Completion Path */}
                            <div className="relative py-2 px-1">
                                <svg className="w-full h-10 overflow-visible" viewBox="0 0 280 32" fill="none">
                                    {/* Background reference guide */}
                                    <path
                                        d="M 10 8 C 50 8, 50 24, 90 24 S 130 8, 170 8 S 210 24, 250 24 L 270 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="text-[#e2ddd3] dark:text-[#282c3e]"
                                    />
                                    {/* Tactile animated squiggly progress path */}
                                    <motion.path
                                        d="M 10 8 C 50 8, 50 24, 90 24 S 130 8, 170 8 S 210 24, 250 24 L 270 24"
                                        stroke="url(#completion-squiggle-gradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0.2 }}
                                        animate={{ pathLength: squiggleProgress }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="completion-squiggle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#059669" />
                                            <stop offset="50%" stopColor="#10b981" />
                                            <stop offset="100%" stopColor="#34d399" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Lifecycle Closure State Label */}
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#5b6276] dark:text-slate-400 pt-0.5">
                                <span>Verify → Review → Finalize</span>
                                {sceneState === 4 ? (
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400">✓ Attachment Complete</span>
                                ) : (
                                    <span className="font-bold text-amber-700 dark:text-amber-400">Finalizing</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Living Product Activity Stream */}
                <div className="mt-5 pt-3.5 border-t border-[#e2ddd3] dark:border-[#1f2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="flex items-center gap-1 font-bold text-[#0a0d14] dark:text-white mr-1">
                            <Activity size={13} className="text-emerald-600 dark:text-emerald-400" />
                            <span>Closure Events:</span>
                        </span>
                        
                        <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                            <Check size={10} /> 10 Weekly logs approved
                        </span>

                        {sceneState >= 1 && (
                            <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                                <Check size={10} /> Attendance verified (32/35 days)
                            </span>
                        )}

                        {sceneState >= 2 && (
                            <span className="inline-flex items-center gap-1 text-cyan-900 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-500/20">
                                <Check size={10} /> Dual evaluations recorded
                            </span>
                        )}

                        {sceneState >= 4 && (
                            <span className="inline-flex items-center gap-1 text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-bold">
                                <Check size={10} /> Attachment completed
                            </span>
                        )}
                    </div>

                    <span className="self-start sm:self-center text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20 whitespace-nowrap">
                        Graduation Clearance Locked
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CompletionWorkflowIllustration;
