import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-20 bg-slate-950 border-t border-white/5 font-sans">
            <div className="content-width">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Zap className="text-blue-500" size={24} fill="currentColor" />
                            <span className="text-2xl font-black tracking-tighter text-white">AttachPro</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                            Secure institutional-grade platform for managing student attachments.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold">Home</Link></li>
                            <li><a href="/#features" className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold">Features</a></li>
                            <li><a href="/#how-it-works" className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold">How It Works</a></li>
                            <li><Link to="/login" className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold">Login</Link></li>
                            <li><Link to="/signup" className="text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest text-sm">Request Demo</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Legal</h4>
                        <ul className="space-y-4 font-bold text-sm">
                            <li><Link to="/legal/privacy" className="text-slate-400 hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/legal/terms" className="text-slate-400 hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/legal/data-protection" className="text-slate-400 hover:text-blue-500 transition-colors">Data Protection</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Contact</h4>
                        <div className="flex items-center space-x-3 text-slate-400 hover:text-blue-500 transition-colors group cursor-pointer">
                            <Mail size={16} />
                            <a href="mailto:mutiealvin0@gmail.com" className="text-sm font-bold">mutiealvin0@gmail.com</a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                    <p>© 2026 AttachPro. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
