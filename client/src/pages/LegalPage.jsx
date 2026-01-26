import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ChevronLeft, Zap, FileText, Lock } from 'lucide-react';

const LegalPage = () => {
    const { type } = useParams();

    const content = {
        'privacy': {
            title: 'Privacy Policy',
            icon: Shield,
            lastUpdated: 'January 26, 2026',
            sections: [
                {
                    h: 'Data Collection Strategy',
                    p: 'AttachPro operates on a principle of "Minimum Necessary Data." We collect institutional emails for authentication, student names for record-keeping, and location-metadata during QR check-ins to prevent fraudulent attendance. We do not collect biometric data or personal financial information.'
                },
                {
                    h: 'Institutional Data Sovereignty',
                    p: 'All data uploaded to AttachPro belongs entirely to the participating institution. We act as data processors, not owners. We provide the tools for you to export, archive, or purge your records at any time without penalty.'
                },
                {
                    h: 'Zero-Monetization Promise',
                    p: 'Your professional and academic activity is not a product. AttachPro does not run advertisements, nor do we sell hashed or anonymized data to third-party marketing firms or data brokers.'
                },
                {
                    h: 'Use of Cookies',
                    p: 'We use strictly functional cookies to maintain your login session and security preferences. We do not use tracking or advertising cookies to monitor your browser activity across other websites.'
                }
            ]
        },
        'terms': {
            title: 'Terms of Service',
            icon: FileText,
            lastUpdated: 'January 26, 2026',
            sections: [
                {
                    h: 'Scope of Service',
                    p: 'AttachPro provides the digital infrastructure for academic internship management. Our service includes dashboard access, secure logbook storage, and automated reporting tools. Service availability is maintained at a target of 99.9% uptime.'
                },
                {
                    h: 'User Conduct & Responsibility',
                    p: 'Users must maintain the confidentiality of their login credentials. Any attempt to bypass the QR-code rotation signature or inject malicious code into logbook uploads will result in immediate account suspension and notification to the school administration.'
                },
                {
                    h: 'Institutional Licensing',
                    p: 'The platform is licensed to the institution, which in turn grants access to its students and supervisors. The institution is responsible for ensuring all users comply with the Terms of Service and local academic policies.'
                },
                {
                    h: 'Limitation of Liability',
                    p: 'While AttachPro ensures data integrity, the institution remains responsible for final academic grading and placement verification. AttachPro is not liable for academic disputes between students and their respective supervisors.'
                }
            ]
        },
        'data-protection': {
            title: 'Data Protection Protocol',
            icon: Lock,
            lastUpdated: 'January 26, 2026',
            sections: [
                {
                    h: 'End-to-End Encryption',
                    p: 'All traffic between the client browser and our servers is secured via TLS 1.3. At rest, sensitive database entries and logbook files are encrypted using AES-256-GCM, ensuring that data is undecipherable without authorized access.'
                },
                {
                    h: 'Redundancy & Disaster Recovery',
                    p: 'Data is replicated across geographically isolated availability zones. Automated backups are performed every 24 hours and stored in an encrypted state to ensure zero-data-loss recovery in the event of a regional outage.'
                },
                {
                    h: 'Isolation & Multi-Tenancy',
                    p: 'Each institution operates within its own logical database silo. This prevents cross-tenant data leaks and ensures that your school\'s data is never mixed with another institution\'s records at the metadata level.'
                },
                {
                    h: 'Access Auditing',
                    p: 'Every administrative action—from profile updates to logbook approvals—is logged with a timestamp and IP signature. This provide a clear audit trail for institutional compliance officers.'
                }
            ]
        }
    };

    const activeContent = content[type] || content['privacy'];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-600/30">
            {/* Simple Sub-Page Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 px-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Zap className="text-blue-600" size={20} fill="currentColor" />
                        <span className="text-xl font-bold tracking-tighter text-slate-900">AttachPro</span>
                    </Link>
                    <Link to="/" className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-black uppercase tracking-widest">
                        <ChevronLeft size={16} />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 md:px-16">
                <div className="max-w-3xl mx-auto">
                    {/* Page Header */}
                    <div className="flex items-center space-x-6 mb-16">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-inner">
                            <activeContent.icon size={32} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{activeContent.title}</h1>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Version 1.0.4 • {activeContent.lastUpdated}</p>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12">
                        {activeContent.sections.map((section, i) => (
                            <div key={i} className="space-y-4">
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-3">
                                    <span className="w-8 h-px bg-blue-600" />
                                    <span>{section.h}</span>
                                </h2>
                                <p className="text-slate-500 leading-relaxed font-medium pl-11">
                                    {section.p}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer Signal */}
                    <div className="mt-24 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center space-y-6">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <Shield className="text-blue-600" size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">Institutional Compliance</h3>
                            <p className="text-slate-400 text-sm font-medium">For Data Processing Agreements (DPAs) or custom enterprise compliance requirements, please reach out directly.</p>
                        </div>
                        <a href="mailto:mutiealvin0@gmail.com" className="bg-white text-blue-600 px-8 py-3 rounded-xl border border-slate-100 font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-lg transition-all">
                            mutiealvin0@gmail.com
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LegalPage;
