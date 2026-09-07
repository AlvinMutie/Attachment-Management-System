import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, FileText, UserCheck, AlertCircle, MessageSquare, Clock } from 'lucide-react';
import { notificationApi } from '../utils/notificationApi';

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationApi.getNotifications(1, 10);
            if (res.success) {
                setNotifications(res.data || res.notifications || []);
            }
            const unreadRes = await notificationApi.getUnreadCount();
            if (unreadRes.success) {
                setUnreadCount(unreadRes.unreadCount ?? unreadRes.data?.unreadCount ?? 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30s background poll
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'placement_approved':
            case 'placement_rejected':
            case 'placement_submitted':
                return <FileText className="w-4 h-4 text-blue-400" />;
            case 'supervisor_assigned':
                return <UserCheck className="w-4 h-4 text-emerald-400" />;
            case 'logbook_submitted':
            case 'logbook_reviewed':
                return <Clock className="w-4 h-4 text-amber-400" />;
            case 'assessment_submitted':
                return <AlertCircle className="w-4 h-4 text-purple-400" />;
            case 'new_message':
                return <MessageSquare className="w-4 h-4 text-indigo-400" />;
            default:
                return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications();
                }}
                className="relative p-2 rounded-xl bg-slate-900/60 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors focus-visible:outline-blue-500 shadow-sm"
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-950">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl backdrop-blur-xl z-[80] overflow-hidden animate-fade-in">
                    <div className="p-3.5 px-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-[11px] text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 font-medium"
                            >
                                <CheckCheck size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-500">Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                                <Bell className="w-6 h-6 text-slate-600" />
                                <span>No notifications yet</span>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                    className={`p-3.5 px-4 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 items-start ${
                                        !notif.isRead ? 'bg-blue-600/[0.06]' : ''
                                    }`}
                                >
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 mt-0.5 shrink-0">
                                        {getNotificationIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className={`text-xs truncate ${!notif.isRead ? 'font-semibold text-white' : 'font-medium text-slate-300'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <span className="text-[10px] text-slate-500 mt-1 block">
                                            {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
