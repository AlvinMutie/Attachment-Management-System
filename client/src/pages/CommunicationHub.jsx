import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
    CheckCheck
} from 'lucide-react';
import { Badge, Button, LoadingSkeleton } from '../components/ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CommunicationHub = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            const interval = setInterval(() => {
                fetchMessages(selectedContact.id, true);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/messages/contacts`);
            const contactList = response.data.data || [];
            setContacts(contactList);
            if (contactList.length > 0 && !selectedContact) {
                setSelectedContact(contactList[0]);
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (contactId, isPolling = false) => {
        try {
            const response = await axios.get(`${API_URL}/messages/${contactId}`);
            setMessages(response.data.data || []);
        } catch (error) {
            if (!isPolling) console.error('Failed to fetch messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        setSending(true);
        try {
            const response = await axios.post(`${API_URL}/messages`, {
                receiverId: selectedContact.id,
                content: newMessage
            });
            setMessages([...messages, response.data.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString([], options);
    };

    const getRoleBadge = (roleStr) => {
        switch (roleStr) {
            case 'industry_supervisor':
                return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Industry Supervisor</span>;
            case 'university_supervisor':
                return <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">Faculty Lead</span>;
            case 'attachment_coordinator':
                return <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">Coordinator</span>;
            case 'student':
                return <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Student Intern</span>;
            default:
                return <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{roleStr?.replace(/_/g, ' ')}</span>;
        }
    };

    const role = user?.role || 'student';
    const filteredContacts = contacts.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role?.toLowerCase().includes(searchQuery.toLowerCase())
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
                                    Direct Collaboration
                                </span>
                                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                                    Institutional Communication Hub
                                </h1>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Secure, direct correspondence between students, faculty leads, workplace supervisors, and coordinators.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs font-mono text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Encrypted Session</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Split Chat Area */}
                <div className="h-[calc(100vh-18rem)] min-h-[520px] flex flex-col md:flex-row gap-5">
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
                                    placeholder="Search by name or role..."
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
                                <div className="text-center py-12 text-slate-500 text-xs">
                                    <User className="w-6 h-6 mx-auto text-slate-600 mb-1.5" />
                                    <span>No contacts matched</span>
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
                                                <h3 className="font-semibold text-xs text-white truncate">
                                                    {contact.name}
                                                </h3>
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
                                        Select an assigned supervisor, coordinator, or student from the directory to review and send messages.
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
                                            <h3 className="font-bold text-sm text-white">{selectedContact.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {getRoleBadge(selectedContact.role)}
                                                <span className="text-[10px] text-slate-500 font-mono">{selectedContact.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Stream */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0e1017]/40">
                                    {messages.length === 0 ? (
                                        <div className="text-center py-16 text-xs text-slate-500 space-y-1">
                                            <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                            <p className="font-medium text-slate-400">No messages in this correspondence yet</p>
                                            <p className="text-[11px] text-slate-600">Send an initial message below to start the conversation.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isMe = msg.senderId === user?.id;

                                            return (
                                                <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
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
                                            placeholder="Write your message here..."
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
