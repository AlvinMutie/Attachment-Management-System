import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({
    variant = 'icon', // 'icon' | 'pill' | 'switch'
    className = '',
    showLabel = false
}) => {
    const { theme, toggleTheme, isDark } = useTheme();

    if (variant === 'pill') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isDark
                        ? 'bg-[#181a24] text-slate-200 border border-[#2b2e40] hover:border-violet-500/50 hover:text-white shadow-xs'
                        : 'bg-white text-slate-900 border-2 border-[#cfc8b8] hover:border-violet-600 hover:bg-[#f7f5ed] shadow-xs'
                } ${className}`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
                <div className="relative w-4 h-4 flex items-center justify-center">
                    {isDark ? (
                        <Moon size={14} className="text-violet-400 transition-transform duration-300" />
                    ) : (
                        <Sun size={14} className="text-amber-600 transition-transform duration-300" />
                    )}
                </div>
                {showLabel && (
                    <span className="font-mono text-[11px] tracking-tight">
                        {isDark ? 'Dark Theme' : 'Light Theme'}
                    </span>
                )}
            </button>
        );
    }

    if (variant === 'switch') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                role="switch"
                aria-checked={!isDark}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isDark ? 'bg-[#222638]' : 'bg-violet-600'
                } ${className}`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                        isDark ? 'translate-x-0' : 'translate-x-6'
                    }`}
                >
                    {isDark ? (
                        <Moon size={11} className="text-slate-800" />
                    ) : (
                        <Sun size={11} className="text-amber-600" />
                    )}
                </span>
            </button>
        );
    }

    // Default icon button
    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer relative group ${
                isDark
                    ? 'bg-[#151722] border border-[#26293a] text-slate-200 hover:text-white hover:border-violet-500/40 hover:bg-[#1c1f2e]'
                    : 'bg-white border-2 border-[#d0c9ba] text-slate-900 hover:text-black hover:border-violet-600 hover:bg-[#f6f4ed] shadow-xs'
            } ${className}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <div className="relative w-4 h-4 flex items-center justify-center">
                {isDark ? (
                    <Sun size={16} className="text-slate-300 group-hover:text-amber-400 group-hover:rotate-45 transition-all duration-300" />
                ) : (
                    <Moon size={16} className="text-slate-900 group-hover:text-violet-700 group-hover:-rotate-12 transition-all duration-300" />
                )}
            </div>
            {showLabel && (
                <span className="ml-2 text-xs font-bold">
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
            )}
        </button>
    );
};

export default ThemeToggle;
