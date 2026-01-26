import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/10">
        <div className="content-width h-16 flex justify-between items-center text-slate-900">
            <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform text-white">
                    <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white md:text-slate-900">AttachPro</span>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-[13px] font-bold text-slate-600">
                <a href="#features" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs">Features</a>
                <a href="#how-it-works" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs">How It Works</a>
                <a href="#pricing" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs">Pricing</a>
                <Link to="/login" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold text-xs uppercase tracking-widest shadow-md">
                    Get Started
                </Link>
            </div>
        </div>
    </nav>
);

export default Navbar;
