import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play } from 'lucide-react';

/**
 * Material 3 Expressive Circular Progressive Indicator
 * Continuous looping radial progress loader with central status bars
 */
export const M3ExpressiveProgressRing = ({
    progress = 0.5,
    isPaused = false,
    onTogglePause = () => {},
    color = 'blue', // 'blue' | 'violet' | 'cyan' | 'indigo' | 'emerald'
    size = 32,
    strokeWidth = 3.5,
    currentStep = null,
    totalSteps = null,
    label = null,
    className = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Color definitions mapping to vibrant Material 3 Expressive accent tones
    const colorTokens = {
        blue: {
            arc: '#38bdf8', // sky-400
            track: 'rgba(56, 189, 248, 0.15)',
            glow: 'rgba(56, 189, 248, 0.28)',
            badge: 'text-sky-400 bg-sky-950/40 border-sky-500/30'
        },
        violet: {
            arc: '#a78bfa', // violet-400
            track: 'rgba(167, 139, 250, 0.15)',
            glow: 'rgba(167, 139, 250, 0.28)',
            badge: 'text-violet-400 bg-violet-950/40 border-violet-500/30'
        },
        cyan: {
            arc: '#22d3ee', // cyan-400
            track: 'rgba(34, 211, 238, 0.15)',
            glow: 'rgba(34, 211, 238, 0.28)',
            badge: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30'
        },
        indigo: {
            arc: '#818cf8', // indigo-400
            track: 'rgba(129, 140, 248, 0.15)',
            glow: 'rgba(129, 140, 248, 0.28)',
            badge: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30'
        },
        emerald: {
            arc: '#34d399', // emerald-400
            track: 'rgba(52, 211, 153, 0.15)',
            glow: 'rgba(52, 211, 153, 0.28)',
            badge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
        }
    };

    const activeColor = colorTokens[color] || colorTokens.blue;

    // SVG geometry calculations
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div
            className={`inline-flex items-center gap-2 select-none relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Interactive Material 3 Expressive Dial Button */}
            <motion.button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onTogglePause();
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label={isPaused ? "Resume auto-advancing" : "Pause auto-advancing"}
                title={isPaused ? "Paused • Click to resume" : "Auto-advancing • Continuous loop"}
                className="relative rounded-full flex items-center justify-center p-0.5 bg-[#181a24] dark:bg-[#0c0e15] border border-[#d6d0c2] dark:border-[#262a3a] shadow-xs cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent focus:ring-sky-500/40 transition-colors"
                style={{
                    width: size,
                    height: size,
                    boxShadow: isHovered ? `0 0 12px ${activeColor.glow}` : 'none'
                }}
            >
                {/* SVG Progress Ring - Continuous fluid loading loop (always loading, never pausing) */}
                <motion.svg
                    width={size}
                    height={size}
                    className="absolute inset-0 pointer-events-none"
                    viewBox={`0 0 ${size} ${size}`}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2.0,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Background Muted Track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        className="text-[#dcd6c8] dark:text-[#252836]"
                        strokeWidth={strokeWidth}
                    />

                    {/* Active Animated Continuous Loop Arc */}
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={activeColor.arc}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animate={{
                            strokeDashoffset: [
                                circumference * 0.72,
                                circumference * 0.18,
                                circumference * 0.72
                            ]
                        }}
                        transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.svg>

                {/* Central State Icon (Pause || bars from reference, Play ▶ when paused) */}
                <div className="relative z-10 flex items-center justify-center text-slate-200 pointer-events-none">
                    <AnimatePresence mode="wait">
                        {isPaused ? (
                            <motion.div
                                key="play"
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="ml-0.5"
                            >
                                <Play size={size * 0.36} fill="currentColor" className="text-slate-300 dark:text-slate-200" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="pause"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center gap-[2.5px]"
                            >
                                {/* Two vertical rounded pause bars matching user reference */}
                                <span
                                    className="bg-slate-300 dark:bg-slate-200 rounded-[1px] transition-colors group-hover:bg-white"
                                    style={{
                                        width: Math.max(size * 0.08, 2),
                                        height: size * 0.38
                                    }}
                                />
                                <span
                                    className="bg-slate-300 dark:bg-slate-200 rounded-[1px] transition-colors group-hover:bg-white"
                                    style={{
                                        width: Math.max(size * 0.08, 2),
                                        height: size * 0.38
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>

            {/* Step Counter */}
            {(currentStep !== null && totalSteps !== null) && (
                <div className="flex flex-col text-left font-mono leading-none">
                    <span className="text-[10px] font-bold text-[#0a0d14] dark:text-slate-300">
                        {currentStep}/{totalSteps}
                    </span>
                    <span className="text-[8px] text-[#5b6276] dark:text-slate-400 font-semibold uppercase tracking-wider">
                        {isPaused ? 'Paused' : 'Active'}
                    </span>
                </div>
            )}

            {label && (
                <span className="text-[11px] font-mono text-[#5b6276] dark:text-slate-400 hidden sm:inline-block">
                    {label}
                </span>
            )}
        </div>
    );
};

export default M3ExpressiveProgressRing;
