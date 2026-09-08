import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Send, MessageCircle, Clock, Search, MoreVertical, Phone, Video, User } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

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
            const response = await axios.get(`${API_URL}/messages/contacts`);
            setContacts(response.data.data || []);
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

    const role = user?.role || 'student';
    const filteredContacts = contacts.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role={role}>
            <div className="h-[calc(100vh-7.5rem)] flex gap-4 max-w-7xl mx-auto">
                {/* Contacts Column */}
                <div className="w-80 bg-[#15171f] border border-[#22242f] rounded-xl overflow-hidden flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-[#22242f]">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-bold text-slate-100 tracking-tight">Messages</h2>
                            <Badge variant="neutral">{contacts.length} Contacts</Badge>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#12141c] border border-[#22242f] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {loading ? (
                            <div className="text-center py-8 text-slate-500 text-xs">Loading contacts...</div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-xs font-medium">No contacts found</div>
                        ) : (
                            filteredContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`p-2.5 rounded-lg cursor-pointer transition-colors flex items-center gap-3 border ${selectedContact?.id === contact.id
                                        ? 'bg-violet-600/10 border-violet-500/30 text-slate-100'
                                        : 'hover:bg-[#181a24] border-transparent text-slate-300'
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-9 h-9 rounded-full bg-[#181a24] border border-[#22242f] flex items-center justify-center text-xs font-semibold text-violet-400">
                                            {contact.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#15171f] rounded-full" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className="font-semibold text-xs truncate">
                                                {contact.name}
                                            </h3>
                                        </div>
                                        <p className="text-[11px] text-slate-500 truncate capitalize">
                                            {contact.role?.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Conversation Thread */}
                <div className="flex-1 bg-[#15171f] border border-[#22242f] rounded-xl overflow-hidden flex flex-col relative">
                    {!selectedContact ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-base font-bold text-slate-200 mb-1">Direct Communication Channel</h3>
                            <p className="text-xs text-slate-500 max-w-sm">Select a contact from the roster to review correspondence with your supervisors, students, or coordinators.</p>
                        </div>
                    ) : (
                        <>
                            {/* Thread Header */}
                            <div className="p-4 px-5 border-b border-[#22242f] flex items-center justify-between bg-[#12141c]">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#181a24] border border-[#22242f] flex items-center justify-center text-xs font-semibold text-violet-400">
                                        {selectedContact.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-100">{selectedContact.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] text-slate-400 capitalize">{selectedContact.role?.replace(/_/g, ' ')}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                                            <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Feed */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12 text-xs text-slate-500">No messages in this thread yet. Send a note below.</div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = msg.senderId === user.id;
                                        return (
                                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-4 py-2.5 rounded-xl text-xs leading-relaxed ${isMe
                                                        ? 'bg-violet-600 text-white rounded-br-sm'
                                                        : 'bg-[#181a24] text-slate-200 border border-[#22242f] rounded-bl-sm'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Form */}
                            <div className="p-3.5 px-5 border-t border-[#22242f] bg-[#12141c]">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-1 bg-[#15171f] border border-[#22242f] rounded-lg px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        disabled={sending}
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={!newMessage.trim() || sending}
                                        icon={Send}
                                    >
                                        Send
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CommunicationHub;
