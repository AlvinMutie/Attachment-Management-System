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
    TrendingUp,
    Sparkles,
    Calendar,
    ArrowUpRight,
    Terminal,
    ChevronRight,
    Check
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

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

    // Smooth springs for fluid cinematic feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 24,
        restDelta: 0.001
    });

    // 3D Angle Transformations
    // 0.0 -> 0.4: Tilted laptop opens up and rotates to flat 0deg
    const rotateX = useTransform(smoothProgress, [0, 0.45], [26, 0]);

    // 0.2 -> 1.0: Scales up from full laptop hardware view to screen-filling viewport
    const scale = useTransform(smoothProgress, [0, 0.4, 0.95], [0.88, 1.15, 1.65]);

    // Vertical alignment shift so camera dives into the screen center
    const translateY = useTransform(smoothProgress, [0, 0.4, 0.95], [40, -10, 140]);

    // Bottom keyboard and chassis fade out as camera enters the screen
    const keyboardOpacity = useTransform(smoothProgress, [0.35, 0.7], [1, 0]);
    const keyboardY = useTransform(smoothProgress, [0.35, 0.7], [0, 60]);

    // Screen border glow intensity
    const screenGlow = useTransform(smoothProgress, [0, 0.6, 1], [0.2, 0.8, 1]);

    return (
        <div ref={containerRef} className="relative h-[220vh] w-full">
            {/* Sticky Viewport Anchor */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden [perspective:1400px]">
                {/* Background Ambient Glow Halo */}
                <motion.div
                    style={{ opacity: screenGlow }}
                    className="absolute w-[680px] h-[480px] bg-gradient-to-tr from-violet-600/25 via-indigo-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10"
                />

                {/* Scroll Indicator Prompt (fades on scroll) */}
                <motion.div
                    style={{ opacity: useTransform(smoothProgress, [0, 0.15], [1, 0]) }}
                    className="absolute top-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151720]/80 backdrop-blur-md border border-[#22242f] text-[11px] font-medium text-slate-300 shadow-xl pointer-events-none"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                    <span>Scroll down to enter the interactive workspace</span>
                    <ChevronRight size={13} className="text-violet-400" />
                </motion.div>

                {/* 3D Transformable Laptop Container */}
                <motion.div
                    style={{
                        rotateX,
                        scale,
                        y: translateY,
                        transformStyle: 'preserve-3d'
                    }}
                    className="relative w-[92%] max-w-[1040px] flex flex-col items-center select-none"
                >
                    {/* === LAPTOP LID & SCREEN === */}
                    <div className="relative w-full rounded-[22px] bg-[#161821] p-3 sm:p-4 border-[2px] border-[#2f3244] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
                        {/* Top Bezel Camera & Sensor Notch */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0a0b0e] border border-[#2f3244]" />
                            <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
                        </div>

                        {/* Inner High-Res Screen Glass */}
                        <div className="relative rounded-xl bg-[#0d0e14] border border-[#22242f] overflow-hidden text-left shadow-inner">
                            {/* App Window Header Bar */}
                            <div className="bg-[#12141c] border-b border-[#22242f] px-4 py-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-400 pl-2 border-l border-[#22242f]">
                                        attachpro.app/workspace/{activeWorkspace}
                                    </span>
                                </div>

                                {/* Role Switcher in Titlebar */}
                                <div className="flex items-center gap-1 bg-[#181a24] p-1 rounded-lg border border-[#22242f]">
                                    {[
                                        { id: 'student', label: 'Student', icon: GraduationCap },
                                        { id: 'supervisor', label: 'Industry Lead', icon: Briefcase },
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
                                                <Icon size={12} />
                                                <span>{role.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Cockpit Content Inside Screen */}
                            <div className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#10121a] to-[#0d0e12]">
                                {/* Dossier Header Strip */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#1e2230]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-300 flex items-center justify-center font-bold text-sm">
                                            {activeWorkspace === 'student' && <GraduationCap size={20} />}
                                            {activeWorkspace === 'supervisor' && <Briefcase size={20} />}
                                            {activeWorkspace === 'coordinator' && <Compass size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white">
                                                    {activeWorkspace === 'student' && 'Alvin Mutie (ADM: CS-2023-049)'}
                                                    {activeWorkspace === 'supervisor' && 'Eng. Sarah Jenkins (Safaricom Cloud Ops)'}
                                                    {activeWorkspace === 'coordinator' && 'Dr. James Okoth (Faculty of Computing)'}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <CheckCircle2 size={10} /> Active
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400">
                                                {activeWorkspace === 'student' && 'Placement: Safaricom PLC • Week 8 of 12'}
                                                {activeWorkspace === 'supervisor' && 'Mentoring 8 Interns • All Site Visits Synchronized'}
                                                {activeWorkspace === 'coordinator' && 'Term: May - August 2026 • 142 Placements Under Oversight'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1.5 rounded-lg bg-[#181a24] border border-[#22242f] text-right">
                                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Compliance</span>
                                            <span className="text-xs font-bold text-emerald-400 font-mono">94.8% (≥75% Met)</span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg bg-[#181a24] border border-[#22242f] text-right">
                                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Approved Logs</span>
                                            <span className="text-xs font-bold text-violet-400 font-mono">8 / 10 Weeks</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Workspace Content Grid */}
                                {activeWorkspace === 'student' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3.5 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                                                    <QrCode size={13} className="text-violet-400" /> Rotating Token
                                                </span>
                                                <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                                                    {qrCountdown}s
                                                </span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-[#0e1017] border border-[#22242f] text-center">
                                                <p className="text-[10px] text-slate-400 font-mono">SESSION: AT-9821-NBI</p>
                                                <p className="text-xs font-bold text-emerald-400 mt-0.5">Verified Presence Today</p>
                                            </div>
                                            <p className="text-[10px] text-slate-500">Safaricom PLC HQ • On-Site Checked In</p>
                                        </div>

                                        <div className="md:col-span-2 p-3.5 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-200">Week 8 Technical Logbook</span>
                                                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    Approved & Locked
                                                </span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-[#0e1017] border border-[#22242f] text-[11px] text-slate-300 font-mono leading-relaxed">
                                                Deployed Docker containerized microservices to Kubernetes cluster with automated Prometheus health checks.
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                                                <span className="text-emerald-400 font-medium">Signed off by Eng. Sarah Jenkins</span>
                                                <span className="font-mono text-slate-500">3 Artifacts (.yaml, .pdf)</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeWorkspace === 'supervisor' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3.5 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <span className="text-[11px] font-bold text-slate-200">Intern Roster (8 Assigned)</span>
                                            <div className="space-y-1.5">
                                                {[
                                                    { name: 'Alvin Mutie', dept: 'Software Eng', status: 'Approved', color: 'emerald' },
                                                    { name: 'Sarah Wilson', dept: 'Informatics', status: 'Pending Review', color: 'amber' },
                                                    { name: 'David Smith', dept: 'Cyber Security', status: 'Approved', color: 'emerald' }
                                                ].map((stu, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0e1017] border border-[#22242f] text-[11px]">
                                                        <span className="font-semibold text-slate-200">{stu.name}</span>
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-${stu.color}-500/10 text-${stu.color}-400 border border-${stu.color}-500/20`}>
                                                            {stu.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 p-3.5 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-200">Pending Logbook Submission</span>
                                                <span className="text-[10px] text-slate-400">Sarah Wilson (Week 8)</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-[#0e1017] border border-[#22242f] text-[11px] text-slate-300 font-mono">
                                                "Configured Apache Kafka event streaming cluster with consumer group partition rebalancing."
                                            </div>
                                            <div className="flex gap-2 pt-1">
                                                <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all">
                                                    Approve Entry
                                                </button>
                                                <button className="px-3 py-1 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-[11px] font-semibold transition-all">
                                                    Request Revision
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeWorkspace === 'coordinator' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3.5 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <span className="text-[11px] font-bold text-slate-200">Cohort Pipeline</span>
                                            <div className="space-y-1 text-[11px]">
                                                <div className="flex justify-between text-slate-300">
                                                    <span>Active Placements:</span>
                                                    <span className="font-mono text-emerald-400 font-bold">142</span>
                                                </div>
                                                <div className="flex justify-between text-slate-300">
                                                    <span>Pending Approvals:</span>
                                                    <span className="font-mono text-amber-400 font-bold">4</span>
                                                </div>
                                                <div className="flex justify-between text-slate-300">
                                                    <span>Faculty Supervisors:</span>
                                                    <span className="font-mono text-violet-400 font-bold">24</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 p-3.5 rounded-xl bg-[#141620] border border-[#22242f] space-y-2">
                                            <span className="text-[11px] font-bold text-slate-200">Automated Risk Attention Queue</span>
                                            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
                                                <span>2 students flagged for supervisor visit delay (&gt;6 weeks without faculty check)</span>
                                                <button className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]">
                                                    Dispatch Notice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* === LAPTOP BOTTOM KEYBOARD & CHASSIS === */}
                    <motion.div
                        style={{
                            opacity: keyboardOpacity,
                            y: keyboardY
                        }}
                        className="w-[104%] -mt-1 flex flex-col items-center pointer-events-none"
                    >
                        {/* Laptop Hinge & Base Top */}
                        <div className="w-full h-4 bg-gradient-to-b from-[#222533] via-[#1a1c26] to-[#12141c] rounded-t-sm border-t border-[#3d4257] shadow-lg flex items-center justify-center">
                            <div className="w-24 h-1 rounded-full bg-[#0d0e14]" />
                        </div>

                        {/* Laptop Deck Plate with Trackpad & Keyboard Silhouette */}
                        <div className="w-full h-12 bg-gradient-to-b from-[#181a24] to-[#11131a] rounded-b-2xl border-b-2 border-x-2 border-[#2b2e40] shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex items-center justify-center relative">
                            {/* Trackpad Cutout */}
                            <div className="w-32 h-6 rounded-lg bg-[#141620] border border-[#262838] shadow-inner" />
                            {/* Front Lip Grip Notch */}
                            <div className="absolute top-0 w-20 h-1 bg-[#282b3d] rounded-b-md" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ScrollLaptopMockup;
