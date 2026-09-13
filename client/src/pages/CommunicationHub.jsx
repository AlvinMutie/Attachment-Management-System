import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import {
    Send,
    MessageCircle,
    Clock,
    Search,
    User,
    Briefcase,
    GraduationCap,
    Shield,
    Sparkles,
    Check,
    CheckCheck,
    RefreshCw,
    AlertCircle,
    Info,
    Mail,
    Phone
} from 'lucide-react';
import { Badge, Button, LoadingSkeleton } from '../components/ui';
import { getContacts, getMessages, sendMessage, markAsRead } from '../utils/messageApi';

const CommunicationHub = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const initialTargetId = searchParams.get('contactId') || searchParams.get('userId') || location.state?.contactId || location.state?.userId;

    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorFeedback, setErrorFeedback] = useState(null);
    const messagesEndRef = useRef(null);

    const role = user?.role || 'student';

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            markAsRead(selectedContact.id).catch(() => {});
            const interval = setInterval(() => {
                fetchMessages(selectedContact.id, true);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await getContacts();
            let contactList = response.data?.data || response.data || [];
            if (!Array.isArray(contactList)) contactList = [];
            setContacts(contactList);

            if (contactList.length > 0) {
                if (initialTargetId) {
                    const target = contactList.find(c => String(c.id) === String(initialTargetId));
                    setSelectedContact(target || contactList[0]);
                } else if (!selectedContact) {
                    setSelectedContact(contactList[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            setErrorFeedback('Unable to connect to messaging network.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (contactId, isPolling = false) => {
        try {
            if (!isPolling) setMessagesLoading(true);
            const response = await getMessages(contactId);
            const msgList = response.data?.data || response.data || [];
            setMessages(Array.isArray(msgList) ? msgList : []);
        } catch (error) {
            if (!isPolling) {
                console.error('Failed to fetch messages:', error);
            }
        } finally {
            if (!isPolling) setMessagesLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        const outgoingText = newMessage.trim();
        setNewMessage('');
        setSending(true);
        setErrorFeedback(null);

        // Optimistic preview
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            senderId: user?.id,
            receiverId: selectedContact.id,
            content: outgoingText,
            createdAt: new Date().toISOString(),
            isRead: false
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const response = await sendMessage({
                receiverId: selectedContact.id,
                content: outgoingText
            });
            const savedMsg = response.data?.data || response.data;
            if (savedMsg) {
                setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? savedMsg : m));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setErrorFeedback(error.response?.data?.message || 'Failed to dispatch message.');
            // Revert optimistic message on failure
            setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            setNewMessage(outgoingText);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString([], options);
    };

    const getRoleBadge = (roleStr) => {
        switch (roleStr) {
            case 'industry_supervisor':
                return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Industry Supervisor</span>;
            case 'university_supervisor':
                return <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">University Supervisor</span>;
            case 'attachment_coordinator':
                return <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">Coordinator</span>;
            case 'school_admin':
                return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">School Admin</span>;
            case 'student':
                return <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">Student Intern</span>;
            default:
                return <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">{roleStr?.replace(/_/g, ' ')}</span>;
        }
    };

    const filteredContacts = contacts.filter(c =>
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.admissionNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role={role}>
            <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
                {/* 1. Header Cockpit */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161922] to-[#0f1117] border border-[#222533] p-6 sm:p-7 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-300 shadow-inner">
                                <MessageCircle size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                    Direct Collaboration & Supervision
                                </span>
                                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                                    Institutional Communication Hub
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Encrypted correspondence between student attachees, university faculty leads, industry supervisors, and coordinators.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchContacts}
                                className="px-3 py-1.5 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-[#22242f] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                                title="Refresh directory"
                            >
                                <RefreshCw size={13} />
                                <span>Sync Roster</span>
                            </button>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs font-mono text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Active Gateway</span>
                            </span>
                        </div>
                    </div>
                </div>

                {errorFeedback && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-300 text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={15} className="text-rose-400 shrink-0" />
                            <span>{errorFeedback}</span>
                        </div>
                        <button onClick={() => setErrorFeedback(null)} className="text-rose-400 hover:text-rose-200 text-xs underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* 2. Split Chat Area */}
                <div className="h-[calc(100vh-18rem)] min-h-[540px] flex flex-col md:flex-row gap-5">
                    {/* Contacts Roster (Left Column) */}
                    <div className="w-full md:w-80 bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden flex flex-col shrink-0 shadow-lg">
                        <div className="p-4 border-b border-[#1e2230] space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Directory</h2>
                                <span className="text-[11px] font-mono text-slate-400 bg-[#181a24] px-2 py-0.5 rounded border border-[#22242f]">
                                    {contacts.length} Connected
                                </span>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                                <input
                                    type="text"
                                    placeholder="Search attachee, staff..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#181a24] border border-[#22242f] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                            {loading ? (
                                <div className="space-y-2 p-2">
                                    <LoadingSkeleton className="h-14 rounded-xl bg-[#181a24]" />
                                    <LoadingSkeleton className="h-14 rounded-xl bg-[#181a24]" />
                                    <LoadingSkeleton className="h-14 rounded-xl bg-[#181a24]" />
                                </div>
                            ) : filteredContacts.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                                    <User className="w-7 h-7 mx-auto text-slate-600 mb-1.5" />
                                    <p className="font-semibold text-slate-400">No contacts found</p>
                                    <p className="text-[11px] text-slate-500 max-w-[180px] mx-auto">
                                        Assigned attachees and coordinators will appear here automatically.
                                    </p>
                                </div>
                            ) : (
                                filteredContacts.map(contact => {
                                    const isSelected = selectedContact?.id === contact.id;

                                    return (
                                        <div
                                            key={contact.id}
                                            onClick={() => setSelectedContact(contact)}
                                            className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                                                isSelected
                                                    ? 'bg-violet-600/15 border-violet-500/30 text-white shadow-sm'
                                                    : 'hover:bg-[#181a24] border-transparent text-slate-300'
                                            }`}
                                        >
                                            <div className="relative shrink-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                                                    isSelected
                                                        ? 'bg-violet-600 text-white shadow-md'
                                                        : 'bg-[#181a24] border border-[#22242f] text-violet-400'
                                                }`}>
                                                    {contact.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#12141c] rounded-full" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h3 className="font-semibold text-xs text-white truncate">
                                                        {contact.name}
                                                    </h3>
                                                </div>
                                                {contact.admissionNumber && (
                                                    <p className="text-[10px] font-mono text-slate-400 truncate">
                                                        {contact.admissionNumber}
                                                    </p>
                                                )}
                                                <div className="mt-1">
                                                    {getRoleBadge(contact.role)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Active Conversation Pane (Right Column) */}
                    <div className="flex-1 bg-[#12141c] border border-[#22242f] rounded-2xl overflow-hidden flex flex-col relative shadow-lg">
                        {!selectedContact ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                                <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shadow-inner">
                                    <MessageCircle size={32} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">Direct Communication Channel</h3>
                                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                                        Select an assigned student attachee, faculty supervisor, or coordinator from the directory to start correspondence.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Conversation Header */}
                                <div className="p-4 px-6 border-b border-[#1e2230] flex items-center justify-between bg-[#151720]">
                                    <div className="flex items-center gap-3.5">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                                                {selectedContact.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#151720] rounded-full" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-sm text-white">{selectedContact.name}</h3>
                                                {selectedContact.admissionNumber && (
                                                    <span className="text-[10px] font-mono text-slate-400 bg-[#181a24] px-1.5 py-0.5 rounded border border-[#22242f]">
                                                        {selectedContact.admissionNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {getRoleBadge(selectedContact.role)}
                                                <span className="text-[10px] text-slate-500 font-mono">{selectedContact.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Stream */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0e1017]/40">
                                    {messagesLoading ? (
                                        <div className="space-y-3 py-4">
                                            <LoadingSkeleton className="h-10 w-2/3 rounded-2xl bg-[#181a24]" />
                                            <LoadingSkeleton className="h-10 w-1/2 ml-auto rounded-2xl bg-violet-600/20" />
                                            <LoadingSkeleton className="h-10 w-3/5 rounded-2xl bg-[#181a24]" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-16 text-xs text-slate-500 space-y-1">
                                            <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                            <p className="font-medium text-slate-400">No messages in this correspondence yet</p>
                                            <p className="text-[11px] text-slate-600">Send an initial message below to start communicating directly with this attachee.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isMe = String(msg.senderId) === String(user?.id);

                                            return (
                                                <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                                            isMe
                                                                ? 'bg-violet-600 text-white rounded-br-sm'
                                                                : 'bg-[#181a24] text-slate-200 border border-[#22242f] rounded-bl-sm'
                                                        }`}>
                                                            {msg.content}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 px-1">
                                                            <span>{formatTime(msg.createdAt)}</span>
                                                            {isMe && <CheckCheck size={12} className="text-violet-400" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Bar */}
                                <div className="p-4 px-6 border-t border-[#1e2230] bg-[#151720]">
                                    <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
                                        <input
                                            type="text"
                                            placeholder={`Message ${selectedContact.name}...`}
                                            className="flex-1 bg-[#181a24] border border-[#22242f] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors font-sans"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            disabled={sending}
                                        />
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={!newMessage.trim() || sending}
                                            className="py-3 px-5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/20"
                                        >
                                            <Send size={14} />
                                            <span>{sending ? 'Sending...' : 'Send'}</span>
                                        </Button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CommunicationHub;
