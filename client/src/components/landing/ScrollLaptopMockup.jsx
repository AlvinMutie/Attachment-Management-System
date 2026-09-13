import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    GraduationCap,
    Briefcase,
    Compass,
    QrCode,
    CheckCircle2,
    Lock,
    Shield,
    Activity,
    Users,
    ChevronRight,
    Sparkles,
    Calendar,
    ArrowRight
} from 'lucide-react';

export const ScrollLaptopMockup = () => {
    const containerRef = useRef(null);
    const [activeWorkspace, setActiveWorkspace] = useState('student');
    const [qrCountdown, setQrCountdown] = useState(28);

    // Live QR countdown ticker simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setQrCountdown((prev) => (prev > 1 ? prev - 1 : 30));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // Smooth spring physics for organic motion
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 22,
        restDelta: 0.001
    });

    // 3D Angle: Starts tilted back at 22deg and levels out flat (0deg)
    const rotateX = useTransform(smoothProgress, [0, 0.4], [22, 0]);

    // Scale: Starts at 0.82 and smoothly scales up to a clean 1.18x (centered without hitting the navbar)
    const scale = useTransform(smoothProgress, [0, 0.45, 0.95], [0.84, 1.02, 1.20]);

    // Center vertical translation so it remains perfectly balanced between navbar (64px) and bottom
    const translateY = useTransform(smoothProgress, [0, 0.5, 0.95], [10, -5, 20]);

    // Lower keyboard and chassis opacity fades out smoothly as you zoom into the screen
    const keyboardOpacity = useTransform(smoothProgress, [0.35, 0.65], [1, 0]);
    const keyboardTranslateY = useTransform(smoothProgress, [0.35, 0.65], [0, 40]);

    // Ambient halo glow behind the laptop
    const haloGlow = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.7, 0.9]);

    return (
        <div ref={containerRef} className="relative h-[200vh] w-full">
            {/* Sticky Viewport Container with top clearance for 64px header */}
            <div className="sticky top-16 h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center overflow-hidden [perspective:1400px] px-4 sm:px-6">
                {/* Background Ambient Glow */}
                <motion.div
                    style={{ opacity: haloGlow }}
                    className="absolute w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-cyan-400/15 blur-[120px] rounded-full pointer-events-none -z-10"
                />

                {/* Micro Scroll Guidance Pill */}
                <motion.div
                    style={{ opacity: useTransform(smoothProgress, [0, 0.12], [1, 0]) }}
                    className="absolute top-4 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12141c]/90 backdrop-blur-md border border-[#22242f] text-[11px] text-slate-300 shadow-xl pointer-events-none"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                    <span>Scroll down to zoom into the live workspace</span>
                    <ChevronRight size={12} className="text-violet-400" />
                </motion.div>

                {/* 3D Transformable Laptop Frame */}
                <motion.div
                    style={{
                        rotateX,
                        scale,
                        y: translateY,
                        transformStyle: 'preserve-3d'
                    }}
                    className="relative w-full max-w-[960px] flex flex-col items-center select-none"
                >
                    {/* ========================================================= */}
                    {/* VECTOR LAPTOP LID & SCREEN BEZEL                          */}
                    {/* ========================================================= */}
                    <div className="relative w-full rounded-[20px] bg-[#1a1c26] p-2.5 sm:p-3.5 border-[2px] border-[#363a4e] shadow-[0_20px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
                        {/* Top Notch Camera & Sensor Array */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-0.5 rounded-b-md bg-[#0d0e14] z-30">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1c26] border border-[#363a4e]" />
                            <div className="w-1 h-1 rounded-full bg-emerald-400/80 shadow-[0_0_4px_#34d399]" title="Camera Active" />
                        </div>

                        {/* Inner Glass Display */}
                        <div className="relative rounded-xl bg-[#0d0e12] border border-[#22242f] overflow-hidden text-left shadow-2xl">
                            {/* Window Top Navigation Bar */}
                            <div className="bg-[#12141c] border-b border-[#1e2230] px-3 sm:px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 pl-2 border-l border-[#22242f] hidden sm:inline">
                                        ams.institution.edu/portal/{activeWorkspace}
                                    </span>
                                </div>

                                {/* Interactive Role Selector in Window Header */}
                                <div className="flex items-center gap-1 bg-[#181a24] p-1 rounded-lg border border-[#22242f]">
                                    {[
                                        { id: 'student', label: 'Student Intern', icon: GraduationCap },
                                        { id: 'supervisor', label: 'Industry Supervisor', icon: Briefcase },
                                        { id: 'coordinator', label: 'Coordinator', icon: Compass }
                                    ].map((role) => {
                                        const Icon = role.icon;
                                        const isActive = activeWorkspace === role.id;
                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveWorkspace(role.id);
                                                }}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                                    isActive
                                                        ? 'bg-violet-600 text-white shadow-sm'
                                                        : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                <Icon size={11} />
                                                <span>{role.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Cockpit Content Inside Screen */}
                            <div className="p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-[#11131a] to-[#0c0d12]">
                                {/* Dossier Header Strip */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e2230]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-300 flex items-center justify-center font-bold text-xs shrink-0">
                                            {activeWorkspace === 'student' && <GraduationCap size={18} />}
                                            {activeWorkspace === 'supervisor' && <Briefcase size={18} />}
                                            {activeWorkspace === 'coordinator' && <Compass size={18} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white truncate">
                                                    {activeWorkspace === 'student' && 'Alvin Mutie (ADM: CS-2023-049)'}
                                                    {activeWorkspace === 'supervisor' && 'Eng. Sarah Jenkins (Safaricom Cloud Ops)'}
                                                    {activeWorkspace === 'coordinator' && 'Dr. James Okoth (Faculty of Computing)'}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                                    <CheckCircle2 size={9} /> Verified
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 truncate">
                                                {activeWorkspace === 'student' && 'Placement: Safaricom PLC • Week 8 of 12'}
                                                {activeWorkspace === 'supervisor' && 'Mentoring 8 Interns • All Presence Telemetry Synced'}
                                                {activeWorkspace === 'coordinator' && 'Term: May - Aug 2026 • 142 Active Interns Coordinated'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="px-2.5 py-1 rounded-lg bg-[#181a24] border border-[#22242f] text-right">
                                            <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-semibold">Attendance</span>
                                            <span className="text-[11px] font-bold text-emerald-400 font-mono">94.8% (≥75% Met)</span>
                                        </div>
                                        <div className="px-2.5 py-1 rounded-lg bg-[#181a24] border border-[#22242f] text-right">
                                            <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-semibold">Approved Logs</span>
                                            <span className="text-[11px] font-bold text-violet-400 font-mono">8 / 10 Weeks</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Workspace Content Grid */}
                                {activeWorkspace === 'student' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-200 flex items-center gap-1">
                                                    <QrCode size={12} className="text-violet-400" /> Rotating Token
                                                </span>
                                                <span className="text-[9px] font-mono text-violet-400 bg-violet-500/10 px-1 py-0.2 rounded border border-violet-500/20">
                                                    {qrCountdown}s
                                                </span>
                                            </div>
                                            <div className="p-2 rounded-lg bg-[#0e1017] border border-[#22242f] text-center">
                                                <p className="text-[9px] text-slate-500 font-mono">TOKEN: AT-9821-NBI</p>
                                                <p className="text-[11px] font-bold text-emerald-400 mt-0.5">Presence Verified Today</p>
                                            </div>
                                            <p className="text-[9px] text-slate-400">Safaricom HQ • On-Site Checked In</p>
                                        </div>

                                        <div className="md:col-span-2 p-3 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-200">Week 8 Technical Logbook</span>
                                                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                    Approved & Locked
                                                </span>
                                            </div>
                                            <div className="p-2 rounded-lg bg-[#0e1017] border border-[#22242f] text-[10px] text-slate-300 font-mono leading-relaxed">
                                                Configured CI/CD pipeline automation for Kubernetes microservices deployment with automated load testing.
                                            </div>
                                            <div className="flex items-center justify-between text-[9px] text-slate-400">
                                                <span className="text-emerald-400 font-medium">Approved by Eng. Sarah Jenkins</span>
                                                <span className="font-mono text-slate-500">3 Attachments (.pdf, .yaml)</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeWorkspace === 'supervisor' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 rounded-xl bg-[#141620] border border-[#22242f] space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-200">Assigned Interns (8)</span>
                                            <div className="space-y-1">
                                                {[
                                                    { name: 'Alvin Mutie', status: 'Present' },
                                                    { name: 'Sarah Wilson', status: 'Pending Log' },
                                                    { name: 'David Smith', status: 'Present' }
                                                ].map((stu, i) => (
                                                    <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e1017] border border-[#22242f] text-[10px]">
                                                        <span className="font-medium text-slate-200">{stu.name}</span>
                                                        <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            {stu.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 p-3 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-200">Logbook Review Queue</span>
                                                <span className="text-[9px] text-slate-400">Sarah Wilson (Week 8)</span>
                                            </div>
                                            <div className="p-2 rounded-lg bg-[#0e1017] border border-[#22242f] text-[10px] text-slate-300 font-mono">
                                                "Integrated Apache Kafka event streaming cluster with consumer group partition rebalancing."
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                                                    Approve Entry
                                                </button>
                                                <button className="px-2.5 py-1 rounded-md bg-[#181a24] border border-[#22242f] text-slate-300 text-[10px] font-bold">
                                                    Request Revision
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeWorkspace === 'coordinator' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 rounded-xl bg-[#141620] border border-[#22242f] space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-200">Cohort Pipeline</span>
                                            <div className="space-y-1 text-[10px]">
                                                <div className="flex justify-between text-slate-300">
                                                    <span>Active Placements:</span>
                                                    <span className="font-mono text-emerald-400 font-bold">142</span>
                                                </div>
                                                <div className="flex justify-between text-slate-300">
                                                    <span>Faculty Supervisors:</span>
                                                    <span className="font-mono text-violet-400 font-bold">24</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 p-3 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <span className="text-[10px] font-bold text-slate-200">Supervision Attention Queue</span>
                                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 flex items-center justify-between">
                                                <span>2 students flagged for supervisor visit delay (&gt;6 weeks)</span>
                                                <button className="px-2 py-0.5 bg-amber-500 text-slate-950 font-bold rounded text-[9px]">
                                                    Dispatch Notice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* VECTOR LAPTOP KEYBOARD DECK & CHASSIS                     */}
                    {/* ========================================================= */}
                    <motion.div
                        style={{
                            opacity: keyboardOpacity,
                            y: keyboardTranslateY
                        }}
                        className="w-[102%] -mt-1 flex flex-col items-center pointer-events-none"
                    >
                        {/* Hinge Line */}
                        <div className="w-full h-3 bg-gradient-to-b from-[#252836] via-[#1c1e29] to-[#141620] rounded-t-sm border-t border-[#41475e] shadow-md flex items-center justify-center">
                            <div className="w-20 h-1 rounded-full bg-[#0a0b10]" />
                        </div>

                        {/* Keyboard Base Chassis */}
                        <div className="w-full bg-gradient-to-b from-[#1b1d28] via-[#151722] to-[#0f1017] rounded-b-2xl border-x-2 border-b-2 border-[#313547] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col items-center space-y-2">
                            {/* Vector Keyboard Grid & Speakers */}
                            <div className="w-full flex items-center justify-between gap-2 px-2">
                                {/* Left Speaker Grill Dots */}
                                <div className="w-8 h-14 rounded-md bg-[radial-gradient(#2d3144_1px,transparent_1px)] [background-size:3px_3px] opacity-40 shrink-0" />

                                {/* Simplified Vector Keycap Matrix */}
                                <div className="flex-1 bg-[#10121a] border border-[#242738] rounded-lg p-1.5 space-y-1 shadow-inner">
                                    {/* Function Row */}
                                    <div className="grid grid-cols-12 gap-0.5 h-2">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="rounded-sm bg-[#161824] border border-[#25283a]" />
                                        ))}
                                    </div>
                                    {/* Number / QWERTY Rows */}
                                    <div className="grid grid-cols-12 gap-0.5 h-2.5">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="rounded-sm bg-[#1a1c2a] border border-[#272b3e]" />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-11 gap-0.5 h-2.5">
                                        {Array.from({ length: 11 }).map((_, i) => (
                                            <div key={i} className="rounded-sm bg-[#1a1c2a] border border-[#272b3e]" />
                                        ))}
                                    </div>
                                    {/* Spacebar Row */}
                                    <div className="flex items-center justify-center gap-1 h-3">
                                        <div className="w-6 h-full rounded-sm bg-[#181a26] border border-[#272b3e]" />
                                        <div className="w-6 h-full rounded-sm bg-[#181a26] border border-[#272b3e]" />
                                        <div className="flex-1 h-full rounded-sm bg-[#1d2030] border border-[#2d3147]" />
                                        <div className="w-6 h-full rounded-sm bg-[#181a26] border border-[#272b3e]" />
                                        <div className="w-6 h-full rounded-sm bg-[#181a26] border border-[#272b3e]" />
                                    </div>
                                </div>

                                {/* Right Speaker Grill Dots */}
                                <div className="w-8 h-14 rounded-md bg-[radial-gradient(#2d3144_1px,transparent_1px)] [background-size:3px_3px] opacity-40 shrink-0" />
                            </div>

                            {/* Vector Force Touch Trackpad */}
                            <div className="w-36 h-7 rounded-lg bg-[#141620] border border-[#282b3d] shadow-inner" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ScrollLaptopMockup;
