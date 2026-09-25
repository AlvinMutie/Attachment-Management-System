import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, GraduationCap, LogIn } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f6]/95 dark:bg-[#0d0e12]/90 backdrop-blur-md border-b border-[#e2ddd3] dark:border-[#22242f] transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:bg-violet-600/25 transition-all shadow-xs">
                        <GraduationCap size={18} />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black text-[#0a0d14] dark:text-[#ffffff] tracking-tight">
                            AMS
                        </span>
                        <span className="text-[10px] font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 border border-violet-300 dark:border-violet-500/20 px-1.5 py-0.5 rounded">
                            Institutional
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-6 text-xs font-bold text-[#1a202c] dark:text-[#cbd5e1]">
                    <a href="#workspaces" className="hover:text-violet-700 dark:hover:text-white transition-colors">Workspaces</a>
                    <a href="#lifecycle" className="hover:text-violet-700 dark:hover:text-white transition-colors">Lifecycle</a>
                    <a href="#pillars" className="hover:text-violet-700 dark:hover:text-white transition-colors">Features</a>
                    <a href="#security" className="hover:text-violet-700 dark:hover:text-white transition-colors">Compliance</a>
                    <a href="#faq" className="hover:text-violet-700 dark:hover:text-white transition-colors">FAQ</a>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <ThemeToggle variant="icon" />
                    <Link to="/login">
                        <button
                            type="button"
                            className="border-2 border-[#cfc8b8] dark:border-[#2e3244] bg-white dark:bg-[#151722] text-[#0a0d14] dark:text-[#ffffff] hover:bg-[#f4f2ea] dark:hover:bg-[#1e2130] font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <LogIn size={13} className="text-violet-600 dark:text-violet-400" />
                            <span>Sign In</span>
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button
                            type="button"
                            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-4.5 py-2 rounded-xl text-xs shadow-md shadow-violet-600/30 flex items-center gap-1.5 transition-all cursor-pointer border border-violet-400/40"
                        >
                            <span>Register</span>
                            <ArrowRight size={14} />
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle variant="icon" />
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#faf9f6] dark:bg-[#12141c] border-b border-[#e2ddd3] dark:border-[#22242f] px-5 py-4 space-y-3 shadow-xl">
                    <div className="flex flex-col space-y-2 text-xs font-bold text-[#1a202c] dark:text-[#cbd5e1]">
                        <a
                            href="#workspaces"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-violet-700 dark:hover:text-white"
                        >
                            Workspaces
                        </a>
                        <a
                            href="#lifecycle"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-violet-700 dark:hover:text-white"
                        >
                            Lifecycle
                        </a>
                        <a
                            href="#pillars"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-violet-700 dark:hover:text-white"
                        >
                            Features
                        </a>
                        <a
                            href="#security"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-violet-700 dark:hover:text-white"
                        >
                            Compliance
                        </a>
                        <a
                            href="#faq"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-violet-700 dark:hover:text-white"
                        >
                            FAQ
                        </a>
                    </div>
                    <div className="pt-3 border-t border-[#e2ddd3] dark:border-[#22242f] flex flex-col gap-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                            <button
                                type="button"
                                className="w-full border-2 border-[#cfc8b8] dark:border-[#2e3244] bg-white dark:bg-[#151722] text-[#0a0d14] dark:text-[#ffffff] font-bold py-2 rounded-xl text-xs shadow-xs"
                            >
                                Sign In
                            </button>
                        </Link>
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                            <button
                                type="button"
                                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 rounded-xl text-xs shadow-md"
                            >
                                Register
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
