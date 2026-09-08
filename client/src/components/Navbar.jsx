import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0e12]/85 backdrop-blur-md border-b border-[#22242f]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:bg-violet-600/20 transition-all">
                        <GraduationCap size={18} />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-slate-100 tracking-tight">AMS</span>
                        <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">
                            Institutional
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
                    <a href="#workspaces" className="hover:text-white transition-colors">Workspaces</a>
                    <a href="#lifecycle" className="hover:text-white transition-colors">Lifecycle</a>
                    <a href="#pillars" className="hover:text-white transition-colors">Features</a>
                    <a href="#security" className="hover:text-white transition-colors">Compliance</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login">
                        <Button variant="ghost" size="sm">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="primary" size="sm" endIcon={ArrowRight}>
                            Register School
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    aria-label="Toggle Navigation Menu"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#12141c] border-b border-[#22242f] px-5 py-4 space-y-3">
                    <div className="flex flex-col space-y-2 text-xs font-medium text-slate-300">
                        <a
                            href="#workspaces"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-white"
                        >
                            Workspaces
                        </a>
                        <a
                            href="#lifecycle"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-white"
                        >
                            Lifecycle
                        </a>
                        <a
                            href="#pillars"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-white"
                        >
                            Features
                        </a>
                        <a
                            href="#security"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-white"
                        >
                            Compliance
                        </a>
                        <a
                            href="#faq"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 hover:text-white"
                        >
                            FAQ
                        </a>
                    </div>
                    <div className="pt-3 border-t border-[#22242f] flex flex-col gap-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" size="sm" className="w-full">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="primary" size="sm" className="w-full">
                                Register Institution
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
