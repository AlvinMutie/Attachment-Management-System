import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Check,
    RotateCcw,
    GraduationCap,
    Briefcase,
    Activity,
    ShieldCheck,
    FileSpreadsheet,
    Eye,
    SlidersHorizontal,
    Sparkles,
    Download,
    Users
} from 'lucide-react';

export const ReportingWorkflowIllustration = () => {
    // 0: Preparing Report | 1: Logs Imported | 2: Attendance Added | 3: Supervisor Reviews Added | 4: Report Ready
    const [sceneState, setSceneState] = useState(4);
    const [loadingTarget, setLoadingTarget] = useState(null); // 'logs' | 'attendance' | 'reviews' | null
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    // Transitions with brief, realistic transient loading states (500–700ms)
    const triggerTransition = (nextState) => {
        if (nextState === 1) {
            setLoadingTarget('logs');
            setTimeout(() => {
                setSceneState(1);
                setLoadingTarget(null);
            }, 600);
        } else if (nextState === 2) {
            setLoadingTarget('attendance');
            setTimeout(() => {
                setSceneState(2);
                setLoadingTarget(null);
            }, 600);
        } else if (nextState === 3) {
            setLoadingTarget('reviews');
            setTimeout(() => {
                setSceneState(3);
                setLoadingTarget(null);
            }, 650);
        } else if (nextState === 4) {
            setSceneState(4);
            setLoadingTarget(null);
        } else {
            setSceneState(0);
            setLoadingTarget(null);
        }
    };

    // Autonomous product interaction cycle
    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setInterval(() => {
            setSceneState((prev) => {
                const next = prev >= 4 ? 0 : prev + 1;
                triggerTransition(next);
                return prev;
            });
        }, 5000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused]);

    // Squiggly M3 progress calculation
    const squiggleProgress = sceneState === 0 ? 0.15 : sceneState === 1 ? 0.4 : sceneState === 2 ? 0.65 : sceneState === 3 ? 0.85 : 1.0;

    return (
        <div
            className="w-full max-w-5xl mx-auto my-8 relative select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Top Interactive Scene Controller */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-indigo-900 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-300 dark:border-indigo-500/20">
                        Interactive Scene • 03 Reporting
                    </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#12141c] border border-[#d6d0c2] dark:border-[#22242f] rounded-xl shadow-xs">
                    {[
                        { id: 0, label: '01 Prep' },
                        { id: 1, label: '02 Logs' },
                        { id: 2, label: '03 Attendance' },
                        { id: 3, label: '04 Reviews' },
                        { id: 4, label: '05 Ready' }
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
                                    ? 'bg-indigo-600 text-white shadow-xs'
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
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-0.5 cursor-pointer"
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
                            <FileSpreadsheet size={13} className="text-indigo-600 dark:text-indigo-400" />
                            <span>attachpro.app / reports / ATT-2026-0142</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 hidden sm:inline-block">
                            Dossier Compiler
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            sceneState === 4
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20'
                                : 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/20'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sceneState === 4 ? 'bg-emerald-600' : 'bg-indigo-600 animate-pulse'}`} />
                            <span>{sceneState === 4 ? 'Report Assembled' : 'Assembling Document'}</span>
                        </span>
                    </div>
                </div>

                {/* Spatial Living Interface Environment */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* ========================================================================= */}
                    {/* DOMINANT HERO WORKSPACE: Structured Attachment Report (7.5 Cols)          */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 sm:p-5 shadow-md space-y-4 relative">
                        
                        {/* Report Document Title & Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e0d5] dark:border-[#202330]">
                            <div>
                                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-700 dark:text-indigo-400 block">
                                    Official Audit Dossier
                                </span>
                                <h4 className="text-sm sm:text-base font-black text-[#0a0d14] dark:text-white mt-0.5">
                                    Final Attachment Report & Assessment
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5b6276] dark:text-slate-400 font-medium mt-1">
                                    <span>Student: Brian Mwangi</span>
                                    <span>•</span>
                                    <span>BSc IT (Year 3)</span>
                                    <span>•</span>
                                    <span>Acme Tech</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#f6f5ee] dark:bg-[#181a26] text-[#0a0d14] dark:text-slate-200 border border-[#e2ddd3] dark:border-[#282c3e]">
                                    12-Week Term
                                </span>
                            </div>
                        </div>

                        {/* Structured Report Sections Inside the Document */}
                        <div className="space-y-2.5">
                            
                            {/* SECTION 01: Executive Overview */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                        01 — Attachment Overview & Learning Outcomes
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                        <Check size={11} /> Complete
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#5b6276] dark:text-slate-400 leading-relaxed font-medium">
                                    Practical software engineering engagement focusing on full-stack web applications, microservices, and database maintenance.
                                </p>
                            </div>

                            {/* SECTION 02: Weekly Activities & Logs */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                        02 — Weekly Logs & Technical Reflections
                                    </span>
                                    {loadingTarget === 'logs' ? (
                                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Clock size={10} className="animate-spin" /> Importing logs...
                                        </span>
                                    ) : sceneState >= 1 ? (
                                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                            <Check size={11} /> 10 of 10 Logs Verified
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-mono text-slate-400">Pending</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                                    <div className="bg-white dark:bg-[#141620] p-1.5 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block">Weekly Revisions</span>
                                        <span className="font-bold text-[#0a0d14] dark:text-white font-mono">10 / 10 Approved</span>
                                    </div>
                                    <div className="bg-white dark:bg-[#141620] p-1.5 rounded border border-[#e5e0d5] dark:border-[#242738]">
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 block">Mentor Sign-off</span>
                                        <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">100% Signed</span>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 03: Attendance Compliance Matrix */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                        03 — Attendance Compliance Records
                                    </span>
                                    {loadingTarget === 'attendance' ? (
                                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Clock size={10} className="animate-spin" /> Verifying...
                                        </span>
                                    ) : sceneState >= 2 ? (
                                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                            <Check size={11} /> 91.4% Verified (Compliant)
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-mono text-slate-400">Pending</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-[#5b6276] dark:text-slate-400 pt-0.5">
                                    <span>Required Policy: &gt;75% Attendance</span>
                                    <span className="font-bold text-[#0a0d14] dark:text-white">32 / 35 Days Recorded</span>
                                </div>
                            </div>

                            {/* SECTION 04: Dual Supervisor Reviews & Evaluation */}
                            <div className="p-3 rounded-xl bg-[#faf9f6] dark:bg-[#181a26] border border-[#e2ddd3] dark:border-[#282c3e] space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#0a0d14] dark:text-white">
                                        04 — Dual Stakeholder Evaluation Rubrics
                                    </span>
                                    {loadingTarget === 'reviews' ? (
                                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                            <Clock size={10} className="animate-spin" /> Collecting reviews...
                                        </span>
                                    ) : sceneState >= 3 ? (
                                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                            <Check size={11} /> Both Rubrics Submitted
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-mono text-slate-400">Pending</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div className="bg-white dark:bg-[#141620] p-1.5 rounded border border-[#e5e0d5] dark:border-[#242738] flex items-center justify-between">
                                        <span>Industry Mentor Score</span>
                                        <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">48 / 50</span>
                                    </div>
                                    <div className="bg-white dark:bg-[#141620] p-1.5 rounded border border-[#e5e0d5] dark:border-[#242738] flex items-center justify-between">
                                        <span>Academic Defense Score</span>
                                        <span className="font-mono font-bold text-violet-700 dark:text-violet-400">46 / 50</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Footer Action */}
                        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#5b6276] dark:text-slate-400 border-t border-[#e5e0d5] dark:border-[#202330]">
                            <span>Dossier Hash: ATT-2026-FINAL</span>
                            {sceneState === 4 ? (
                                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={13} /> Report Ready for Board Review
                                </span>
                            ) : (
                                <span className="font-bold text-indigo-700 dark:text-indigo-400">Assembling Sections</span>
                            )}
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* CONTEXTUAL UI LAYERS + MATERIAL 3 SQUIGGLY PROGRESS (5 Cols)             */}
                    {/* ========================================================================= */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* FRAGMENT 1: Weekly Logs Overview Drawer */}
                        <div className="bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 shadow-md space-y-2.5">
                            <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-600/15 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                                        <FileText size={15} />
                                    </div>
                                    <h5 className="text-xs font-black text-[#0a0d14] dark:text-white">
                                        Compiled Log Submissions
                                    </h5>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                    10 / 10 Complete
                                </span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                                <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b] text-[11px]">
                                    <span className="text-[#22283a] dark:text-slate-200 font-medium">Week 10: Final testing & release</span>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">✓ Signed</span>
                                </div>
                                <div className="flex items-center justify-between p-1.5 rounded bg-[#f6f5ee] dark:bg-[#1a1d2b] text-[11px]">
                                    <span className="text-[#22283a] dark:text-slate-200 font-medium">Week 9: REST API integration</span>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">✓ Signed</span>
                                </div>
                            </div>
                        </div>

                        {/* FRAGMENT 2: Industry Supervisor Evaluation Sign-Off Card */}
                        <div className="bg-white dark:bg-[#141620] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-2xl p-4 shadow-md space-y-2.5">
                            <div className="flex items-center justify-between pb-2 border-b border-[#e5e0d5] dark:border-[#202330]">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-cyan-600/15 text-cyan-700 dark:text-cyan-400 flex items-center justify-center">
                                        <Briefcase size={15} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-[#0a0d14] dark:text-white leading-none">
                                            Mentor Evaluation
                                        </h5>
                                        <span className="text-[10px] text-[#5b6276] dark:text-slate-400 font-medium">
                                            James Kariuki • Lead Mentor
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                    Submitted
                                </span>
                            </div>

                            <p className="text-[11px] text-[#22283a] dark:text-slate-300 italic bg-[#f6f5ee] dark:bg-[#1a1d2b] p-2 rounded-lg border border-[#e2ddd3] dark:border-[#282c3e]">
                                "Candidate performed exceptionally throughout the 12 weeks. High technical competence and adherence to standards."
                            </p>
                        </div>

                        {/* FRAGMENT 3: The Signature Material 3 Squiggly Assembly Progress Tracker */}
                        <div className="bg-white dark:bg-[#141620] border-2 border-indigo-500/50 rounded-2xl p-4 shadow-md space-y-2 relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-xs font-black text-[#0a0d14] dark:text-white">
                                        Report Assembly Engine
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                                    {Math.round(squiggleProgress * 100)}%
                                </span>
                            </div>

                            {/* Tactile Material 3 Sinuous Squiggly Path */}
                            <div className="relative py-2 px-1">
                                <svg className="w-full h-10 overflow-visible" viewBox="0 0 280 32" fill="none">
                                    {/* Background reference guide */}
                                    <path
                                        d="M 10 16 Q 40 4, 70 16 T 130 16 T 190 16 T 250 16 L 270 16"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="text-[#e2ddd3] dark:text-[#282c3e]"
                                    />
                                    {/* Tactile animated squiggly progress path */}
                                    <motion.path
                                        d="M 10 16 Q 40 4, 70 16 T 130 16 T 190 16 T 250 16 L 270 16"
                                        stroke="url(#squiggly-gradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0.15 }}
                                        animate={{ pathLength: squiggleProgress }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="squiggly-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="60%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Assembly Phase Label */}
                            <div className="flex items-center justify-between text-[10px] font-mono text-[#5b6276] dark:text-slate-400 pt-0.5">
                                <span>Phase: Collect → Assemble → Verify</span>
                                {sceneState === 4 ? (
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400">✓ Ready</span>
                                ) : (
                                    <span className="font-bold text-indigo-700 dark:text-indigo-400">Processing</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Living Product Report Activity Stream */}
                <div className="mt-5 pt-3.5 border-t border-[#e2ddd3] dark:border-[#1f2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="flex items-center gap-1 font-bold text-[#0a0d14] dark:text-white mr-1">
                            <Activity size={13} className="text-indigo-600 dark:text-indigo-400" />
                            <span>Compilation Status:</span>
                        </span>
                        
                        <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                            <Check size={10} /> 10 Weekly logs compiled
                        </span>

                        {sceneState >= 2 && (
                            <span className="inline-flex items-center gap-1 text-indigo-900 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-300 dark:border-indigo-500/20">
                                <Check size={10} /> Attendance verified (91.4%)
                            </span>
                        )}

                        {sceneState >= 3 && (
                            <span className="inline-flex items-center gap-1 text-violet-900 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                                <Check size={10} /> Dual rubric scores calculated
                            </span>
                        )}
                    </div>

                    <span className="self-start sm:self-center text-[11px] font-mono font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-300 dark:border-indigo-500/20 whitespace-nowrap">
                        Academic Audit Ready
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReportingWorkflowIllustration;
