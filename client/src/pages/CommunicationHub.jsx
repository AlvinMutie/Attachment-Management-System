import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Send, User, MessageCircle, Clock, Search, MoreVertical, Phone, Video } from 'lucide-react';

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

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            // Set up polling for new messages every 5 seconds
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
            setContacts(response.data.data);
            if (response.data.data.length > 0 && !selectedContact) {
                // Optionally select the first contact
                // setSelectedContact(response.data.data[0]);
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
            // If polling, only update if there are new messages or length changed
            // For simplicity, just setting state now. Optimized approach would check diff.
            setMessages(response.data.data);
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

    return (
        <DashboardLayout role={role}>
            <div className="h-[calc(100vh-8rem)] flex gap-6 animate-fade-in">
                {/* Contacts List */}
                <div className="w-full md:w-80 glass-card !rounded-[32px] overflow-hidden flex flex-col bg-white/[0.02] border-white/5">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black text-white tracking-tight">Messages</h2>
                            <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400">
                                <MessageCircle size={18} />
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
                        {loading ? (
                            <div className="text-center py-8 text-slate-500 text-sm">Loading contacts...</div>
                        ) : contacts.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm font-medium">No contacts found</div>
                        ) : (
                            contacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${selectedContact?.id === contact.id
                                        ? 'bg-blue-600/10 border-blue-600/20 shadow-lg shadow-blue-900/20'
                                        : 'hover:bg-white/5 border-transparent'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className={`font-bold text-sm truncate ${selectedContact?.id === contact.id ? 'text-white' : 'text-slate-300'}`}>
                                                {contact.name}
                                            </h3>
                                            <span className="text-[10px] text-slate-500">12:30</span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">
                                            {contact.role.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 glass-card !rounded-[32px] overflow-hidden flex flex-col bg-white/[0.02] border-white/5 relative">
                    {!selectedContact ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                                <MessageCircle size={48} className="text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Communication Hub</h3>
                            <p className="text-slate-500 max-w-sm">Select a contact from the list to start messaging. All conversations are secure and monitored.</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 px-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">
                                            {selectedContact.name.charAt(0)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white tracking-tight">{selectedContact.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">{selectedContact.role.replace(/_/g, ' ')}</span>
                                            <div className="w-1 h-1 rounded-full bg-slate-500" />
                                            <span className="text-[10px] text-emerald-500 font-bold">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                        <Phone size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                        <Video size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map((msg, index) => {
                                    const isMe = msg.senderId === user.id;
                                    return (
                                        <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe
                                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                                    : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-500 mt-1 px-1">
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 px-6 border-t border-white/5 bg-white/[0.02]">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sending}
                                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 group"
                                    >
                                        <Send size={20} className={`transform transition-transform ${sending ? 'translate-x-1 opacity-50' : 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'}`} />
                                    </button>
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
