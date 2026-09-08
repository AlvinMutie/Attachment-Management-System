import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Badge from './ui/Badge';

const Footer = () => {
    return (
        <footer className="bg-[#0d0e12] border-t border-[#22242f] text-slate-400 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                    {/* Brand column */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                                <GraduationCap size={18} />
                            </div>
                            <span className="text-lg font-bold text-slate-100 tracking-tight">Attachment Management System</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                            A purpose-built institutional platform for university attachment programs. Connecting students, industry mentors, faculty supervisors, and attachment coordinators under verified academic compliance.
                        </p>
                        <div className="pt-1 flex items-center gap-2">
                            <Badge variant="success">All Services Operational</Badge>
                        </div>
                    </div>

                    {/* Workspaces */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Workspaces</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/login" className="hover:text-violet-400 transition-colors">Student Portal</Link></li>
                            <li><Link to="/login" className="hover:text-violet-400 transition-colors">Industry Supervisor</Link></li>
                            <li><Link to="/login" className="hover:text-violet-400 transition-colors">Faculty Supervisor</Link></li>
                            <li><Link to="/login" className="hover:text-violet-400 transition-colors">Coordinator Hub</Link></li>
                            <li><Link to="/login" className="hover:text-violet-400 transition-colors">School Admin</Link></li>
                        </ul>
                    </div>

                    {/* Academic Governance */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Governance</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="#lifecycle" className="hover:text-violet-400 transition-colors">Attachment Lifecycle</a></li>
                            <li><a href="#pillars" className="hover:text-violet-400 transition-colors">Attendance Policy (75%)</a></li>
                            <li><a href="#pillars" className="hover:text-violet-400 transition-colors">Logbook Revision Rules</a></li>
                            <li><a href="#security" className="hover:text-violet-400 transition-colors">Multi-Tenant Isolation</a></li>
                            <li><Link to="/legal/data-protection" className="hover:text-violet-400 transition-colors">Data Protection</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Contact */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Legal & Support</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/legal/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/legal/terms" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
                            <li>
                                <a href="mailto:support@ams-portal.edu" className="hover:text-violet-400 transition-colors flex items-center gap-1.5 pt-1">
                                    <Mail size={13} />
                                    <span>support@ams-portal.edu</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-[#22242f] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 Attachment Management System (AMS). Built for Higher Education Institutions.</p>
                    <p className="font-mono text-[11px] text-slate-500">v2.4.0 • Production Build</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
