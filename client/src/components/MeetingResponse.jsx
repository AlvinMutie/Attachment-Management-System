import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    CheckCircle2,
    XCircle,
    RotateCw,
    AlertTriangle
} from 'lucide-react';
import { getMeetings, respondToMeeting } from '../utils/meetingApi';

const MeetingResponse = ({ role }) => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(null); // ID of meeting being responded to

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await getMeetings();
            setMeetings(response.data.data);
        } catch (error) {
            console.error('Failed to fetch meetings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (id, status) => {
        let note = null;
        let proposal = null;

        if (status === 'rescheduling') {
            const newDate = prompt('Propose a new date and time (YYYY-MM-DD HH:MM):');
            if (!newDate) return;
            proposal = new Date(newDate).toISOString();
        }

        if (status === 'declined') {
            note = prompt('Please provide a reason for declining:');
            if (!note) return;
        }

        setResponding(id);
        try {
            await respondToMeeting(id, status, note, proposal);
            alert(`Response recorded: ${status}`);
            fetchMeetings();
        } catch (error) {
            alert('Failed to submit response');
        } finally {
            setResponding(null);
        }
    };

    const myStatus = (meeting) => {
        return role === 'student' ? meeting.studentStatus : meeting.industryStatus;
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading schedules...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Upcoming Visits</h2>

            {meetings.length === 0 && (
                <div className="p-8 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center text-slate-500 font-medium">
                    No scheduled visits found.
                </div>
            )}

            {meetings.map((meeting) => (
                <div key={meeting.id} className="glass-card p-6 flex flex-col gap-6 border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${meeting.type === 'physical' ? 'bg-orange-500/20 text-orange-500' : 'bg-purple-500/20 text-purple-500'}`}>
                                {meeting.type === 'physical' ? <MapPin size={24} /> : <Video size={24} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{meeting.purpose}</h3>
                                <p className="text-xs text-slate-400 font-medium">Initiated by {meeting.initiator?.name}</p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${meeting.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                            {meeting.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-300">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" />
                            <span>{new Date(meeting.scheduledAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-blue-500" />
                            <span>{new Date(meeting.scheduledAt).toLocaleTimeString()}</span>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>My Status: <span className={myStatus(meeting) === 'accepted' ? 'text-emerald-400' : 'text-amber-400'}>{myStatus(meeting)}</span></span>
                        </div>

                        {myStatus(meeting) !== 'accepted' && meeting.status !== 'confirmed' && (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => handleResponse(meeting.id, 'accepted')}
                                    disabled={responding === meeting.id}
                                    className="flex-1 px-4 py-2 bg-emerald-600/20 text-emerald-500 rounded-lg hover:bg-emerald-600/30 transition-colors text-xs font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={14} /> Accept
                                </button>
                                <button
                                    onClick={() => handleResponse(meeting.id, 'rescheduling')}
                                    disabled={responding === meeting.id}
                                    className="flex-1 px-4 py-2 bg-blue-600/20 text-blue-500 rounded-lg hover:bg-blue-600/30 transition-colors text-xs font-bold flex items-center justify-center gap-2"
                                >
                                    <RotateCw size={14} /> Reschedule
                                </button>
                                <button
                                    onClick={() => handleResponse(meeting.id, 'declined')}
                                    disabled={responding === meeting.id}
                                    className="flex-1 px-4 py-2 bg-rose-600/20 text-rose-500 rounded-lg hover:bg-rose-600/30 transition-colors text-xs font-bold flex items-center justify-center gap-2"
                                >
                                    <XCircle size={14} /> Decline
                                </button>
                            </div>
                        )}
                        {myStatus(meeting) === 'accepted' && (
                            <span className="text-xs text-emerald-500 font-bold flex items-center gap-2">
                                <CheckCircle2 size={16} /> You have confirmed attendance
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MeetingResponse;
