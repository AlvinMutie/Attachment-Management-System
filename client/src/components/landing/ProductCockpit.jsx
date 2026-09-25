import React, { useState } from 'react';
import {
    QrCode,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    Users,
    ShieldCheck,
    GraduationCap,
    Briefcase,
    Activity,
    Sliders,
    ArrowUpRight,
    Lock,
    Sparkles,
    Check,
    Terminal
} from 'lucide-react';

const ProductCockpit = () => {
    const [activeTab, setActiveTab] = useState('student');

    const tabs = [
        { id: 'student', label: 'Student Workspace', icon: GraduationCap, badge: 'Daily Workflow' },
        { id: 'industry', label: 'Industry Supervisor', icon: Briefcase, badge: 'Real-Time Oversight' },
        { id: 'coordinator', label: 'Academic Coordinator', icon: Building2, badge: 'Faculty Governance' }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            {/* Header / Intro */}
            <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-900 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-300 dark:border-cyan-500/20">
                    Native Workspace Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0a0d14] dark:text-white tracking-tight mt-2.5">
                    Unified Interface for Every Stakeholder
                </h2>
                <p className="text-xs sm:text-sm text-[#374151] dark:text-slate-400 font-medium mt-1.5">
                    Experience the dedicated operational console built for students, industry mentors, and university faculty.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white dark:bg-[#12141c] border-2 border-[#d6d0c2] dark:border-[#22242f] rounded-2xl max-w-2xl mx-auto mb-8 shadow-xs">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                                    : 'text-[#374151] dark:text-slate-400 hover:text-black dark:hover:text-slate-200 hover:bg-[#f4f2ea] dark:hover:bg-[#1a1d28]'
                            }`}
                        >
                            <Icon size={15} />
                            <span>{tab.label}</span>
                            {isActive && (
                                <span className="hidden sm:inline-block text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded text-white">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Cockpit Card Container */}
            <div className="bg-white dark:bg-[#12141c] border-2 border-[#e2ddd3] dark:border-[#22242f] rounded-3xl p-5 sm:p-8 shadow-md dark:shadow-2xl relative overflow-hidden backdrop-blur-xl">
                {/* Subtle internal gradient accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* 1. STUDENT TAB CONTENT */}
                {activeTab === 'student' && (
                    <div className="relative z-10 space-y-6 animate-fadeIn">
                        {/* Status bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2ddd3] dark:border-[#1f2230]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-black text-sm shadow-xs">
                                    SA
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-black text-[#0a0d14] dark:text-white">Samuel Amani</h3>
                                        <span className="text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 px-2 py-0.5 rounded">
                                            Active Placement
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium">Software Engineering Intern @ Safaricom PLC • Reg: CS/2022/4092</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#374151] dark:text-slate-400 bg-[#f4f2ea] dark:bg-[#171924] px-3 py-1.5 rounded-lg border border-[#e2ddd3] dark:border-[#242738]">
                                    Week 8 of 12
                                </span>
                                <span className="text-xs font-mono font-bold text-violet-800 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/10 px-3 py-1.5 rounded-lg border border-violet-300 dark:border-violet-500/30">
                                    88.5% Attendance
                                </span>
                            </div>
                        </div>

                        {/* Interactive columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Left: Check-in Terminal Card */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <QrCode size={15} className="text-cyan-700 dark:text-cyan-400" />
                                            Proof-of-Presence
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                                            VERIFIED TODAY
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium mt-2 leading-relaxed">
                                        Check in every morning via 30s rotating cryptographic tokens or the on-site supervisor scanner terminal.
                                    </p>
                                </div>

                                <div className="p-3 bg-[#f0ede4] dark:bg-[#11131b] border border-[#ded9cb] dark:border-[#1f2230] rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 flex items-center justify-center font-bold">
                                        <Clock size={16} />
                                    </div>
                                    <div className="text-xs">
                                        <div className="font-extrabold text-[#0a0d14] dark:text-white">Checked in at 08:24 AM</div>
                                        <div className="text-[#5b6276] dark:text-slate-500 font-mono text-[10px] font-semibold">HQ Westlands • Geo-fenced Match</div>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Weekly Logbook Card */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 space-y-3 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <FileText size={15} className="text-violet-700 dark:text-violet-400" />
                                        Logbook Week 8
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-violet-900 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 px-2 py-0.5 rounded border border-violet-300 dark:border-violet-500/20">
                                        APPROVED & LOCKED
                                    </span>
                                </div>
                                <div className="text-xs text-[#1e2433] dark:text-slate-300 bg-[#f0ede4] dark:bg-[#11131b] p-3 rounded-xl border border-[#ded9cb] dark:border-[#1f2230] space-y-1.5 font-mono">
                                    <div className="text-[#0a0d14] dark:text-slate-400 font-sans font-bold">Technical Highlights:</div>
                                    <p className="text-[#374151] dark:text-slate-300 font-sans text-xs font-medium line-clamp-2">
                                        Configured Kafka ingestion pipeline with dead-letter queue retries and latency alerts.
                                    </p>
                                    <div className="text-[10px] text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 pt-1 border-t border-[#ded9cb] dark:border-[#1e2230] font-bold">
                                        <CheckCircle2 size={12} />
                                        <span>Mentor feedback: "Solid architectural understanding."</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Academic Defense Readiness */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-2xs">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <ShieldCheck size={15} className="text-emerald-700 dark:text-emerald-400" />
                                            Defense Readiness
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400">96 / 100</span>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#374151] dark:text-slate-400 font-semibold">Logbook Submissions</span>
                                            <span className="text-[#0a0d14] dark:text-white font-mono font-bold">8 / 8</span>
                                        </div>
                                        <div className="w-full bg-[#ded9cb] dark:bg-[#11131b] h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-emerald-600 dark:bg-emerald-500 h-full w-full" />
                                        </div>
                                        <div className="flex items-center justify-between text-xs pt-1">
                                            <span className="text-[#374151] dark:text-slate-400 font-semibold">Faculty Field Visit</span>
                                            <span className="text-violet-800 dark:text-violet-400 font-mono font-bold">Completed</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[11px] text-[#374151] dark:text-slate-400 font-semibold bg-[#f0ede4] dark:bg-[#11131b] p-2.5 rounded-lg border border-[#ded9cb] dark:border-[#1f2230] flex items-center gap-2">
                                    <Lock size={12} className="text-slate-500" />
                                    <span>Audit Dossier Export Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. INDUSTRY SUPERVISOR TAB CONTENT */}
                {activeTab === 'industry' && (
                    <div className="relative z-10 space-y-6 animate-fadeIn">
                        {/* Status bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2ddd3] dark:border-[#1f2230]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-black text-sm shadow-xs">
                                    EW
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-black text-[#0a0d14] dark:text-white">Eng. Eric Wanjala</h3>
                                        <span className="text-[10px] font-bold font-mono bg-cyan-100 dark:bg-cyan-500/10 text-cyan-900 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/20 px-2 py-0.5 rounded">
                                            Industry Supervisor
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium">Lead Systems Architect • Safaricom PLC Cloud Infrastructure Team</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#374151] dark:text-slate-400 bg-[#f4f2ea] dark:bg-[#171924] px-3 py-1.5 rounded-lg border border-[#e2ddd3] dark:border-[#242738]">
                                    5 Assigned Interns
                                </span>
                                <span className="text-xs font-mono font-bold text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-300 dark:border-cyan-500/30">
                                    Presence Hub Live
                                </span>
                            </div>
                        </div>

                        {/* Interactive columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Left: Presence Verification Console */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 space-y-3 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Activity size={15} className="text-cyan-700 dark:text-cyan-400" />
                                        Live Presence Hub
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                                        5/5 Present
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Samuel Amani', time: '08:24 AM', status: 'On Site' },
                                        { name: 'Brenda Cherotich', time: '08:31 AM', status: 'On Site' },
                                        { name: 'Kevin Otieno', time: '08:45 AM', status: 'On Site' }
                                    ].map((intern, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#f0ede4] dark:bg-[#11131b] border border-[#ded9cb] dark:border-[#1f2230] text-xs">
                                            <span className="text-[#0a0d14] dark:text-slate-200 font-bold">{intern.name}</span>
                                            <span className="text-[#4b5563] dark:text-slate-400 font-mono text-[11px] font-bold">{intern.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Center: Weekly Review Queue */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 space-y-3 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <FileText size={15} className="text-amber-600 dark:text-amber-400" />
                                        Logbook Review Queue
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-amber-900 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/20">
                                        1 PENDING
                                    </span>
                                </div>
                                <div className="bg-[#f0ede4] dark:bg-[#11131b] p-3 rounded-xl border border-[#ded9cb] dark:border-[#1f2230] space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#0a0d14] dark:text-white">Brenda Cherotich</span>
                                        <span className="text-[#4b5563] dark:text-slate-500 font-mono text-[10px] font-bold">Week 8</span>
                                    </div>
                                    <p className="text-[#374151] dark:text-slate-400 text-[11px] font-medium">
                                        "Implemented automated CI/CD pipeline tests using GitHub Actions..."
                                    </p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 rounded text-[10px] font-bold cursor-pointer">
                                            Approve & Sign
                                        </span>
                                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20 rounded text-[10px] font-bold cursor-pointer">
                                            Request Revision
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Dual Rubric Grading */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-2xs">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <Sliders size={15} className="text-violet-700 dark:text-violet-400" />
                                            Industry Rubric
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-violet-900 dark:text-violet-300">Standardized</span>
                                    </div>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium mt-2">
                                        Grading criteria covering technical competency, punctuality, collaboration, and workplace ethics.
                                    </p>
                                </div>
                                <div className="p-3 bg-[#f0ede4] dark:bg-[#11131b] border border-[#ded9cb] dark:border-[#1f2230] rounded-xl flex items-center justify-between text-xs">
                                    <span className="text-[#374151] dark:text-slate-400 font-bold">Average Intern Score</span>
                                    <span className="text-[#0a0d14] dark:text-white font-mono font-black text-sm">92.4%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. COORDINATOR TAB CONTENT */}
                {activeTab === 'coordinator' && (
                    <div className="relative z-10 space-y-6 animate-fadeIn">
                        {/* Status bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2ddd3] dark:border-[#1f2230]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black text-sm shadow-xs">
                                    FO
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-black text-[#0a0d14] dark:text-white">Dr. Faith Ochieng</h3>
                                        <span className="text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 px-2 py-0.5 rounded">
                                            Faculty Attachment Coordinator
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium">School of Computing & Informatics • Strathmore University</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#374151] dark:text-slate-400 bg-[#f4f2ea] dark:bg-[#171924] px-3 py-1.5 rounded-lg border border-[#e2ddd3] dark:border-[#242738]">
                                    248 Cohort Students
                                </span>
                                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-500/30">
                                    98.4% Compliance
                                </span>
                            </div>
                        </div>

                        {/* Interactive columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Left: Allocation Matrix */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 space-y-3 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Users size={15} className="text-violet-700 dark:text-violet-400" />
                                        Supervisor Allocations
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400">100% Assigned</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-[#f0ede4] dark:bg-[#11131b] p-2.5 rounded-lg border border-[#ded9cb] dark:border-[#1f2230] flex items-center justify-between text-xs">
                                        <span className="text-[#0a0d14] dark:text-slate-300 font-bold">Dr. Anthony Mwangi</span>
                                        <span className="text-[#4b5563] dark:text-slate-500 font-mono text-[11px] font-bold">18 / 20 Loaded</span>
                                    </div>
                                    <div className="bg-[#f0ede4] dark:bg-[#11131b] p-2.5 rounded-lg border border-[#ded9cb] dark:border-[#1f2230] flex items-center justify-between text-xs">
                                        <span className="text-[#0a0d14] dark:text-slate-300 font-bold">Prof. Grace Nduta</span>
                                        <span className="text-[#4b5563] dark:text-slate-500 font-mono text-[11px] font-bold">15 / 20 Loaded</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Real-Time At-Risk Monitor */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 space-y-3 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle size={15} className="text-rose-600 dark:text-rose-400" />
                                        At-Risk Interventions
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-rose-900 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-500/20">
                                        0 Critical Flags
                                    </span>
                                </div>
                                <p className="text-xs text-[#374151] dark:text-slate-400 font-medium leading-relaxed">
                                    Automated alerts detect students dropping below 75% attendance or failing to submit weekly logbooks before the Sunday midnight cutoff.
                                </p>
                            </div>

                            {/* Right: Board Export & Audit Ledger */}
                            <div className="bg-[#faf9f6] dark:bg-[#171924] border border-[#e2ddd3] dark:border-[#242738] rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-2xs">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-[#0a0d14] dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                            <ShieldCheck size={15} className="text-cyan-700 dark:text-cyan-400" />
                                            Credit Board Dossier
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400">Audit Ready</span>
                                    </div>
                                    <p className="text-xs text-[#374151] dark:text-slate-400 font-medium mt-2">
                                        One-click compilation of verified logbooks, attendance logs, and supervisor signatures into sealed PDF/CSV packets.
                                    </p>
                                </div>
                                <div className="p-3 bg-[#f0ede4] dark:bg-[#11131b] border border-[#ded9cb] dark:border-[#1f2230] rounded-xl flex items-center justify-between text-xs">
                                    <span className="text-[#374151] dark:text-slate-400 font-bold">Institutional Dossier</span>
                                    <span className="text-cyan-900 dark:text-cyan-400 font-mono font-black flex items-center gap-1">
                                        Sanitized CSV & PDF
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCockpit;
