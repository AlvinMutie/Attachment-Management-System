import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="content-width h-16 flex justify-between items-center text-slate-900">
            <Link to="/" className="flex items-center space-x-2 group cursor-pointer text-slate-900">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform text-white">
                    <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-xl font-bold tracking-tight">AttachPro</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8 text-[13px] font-bold text-slate-600">
                <a href="#vision" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs">Vision</a>
                <a href="#features" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs">Features</a>
                <a href="#faq" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs">FAQ</a>
                <Link to="/login" className="hover:text-blue-600 transition-colors uppercase tracking-wider text-xs border-l border-slate-200 pl-8 ml-2">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold text-xs uppercase tracking-widest shadow-md">
                    Get Started
                </Link>
            </div>
        </div>
    </nav>
);

export default Navbar;
