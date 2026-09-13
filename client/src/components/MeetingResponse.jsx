import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    CheckCircle2,
    XCircle,
    RotateCw,
    AlertTriangle,
    UserCheck,
    CalendarCheck,
    X,
    Send,
    MessageSquare,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { getMeetings, respondToMeeting } from '../utils/meetingApi';
import { Button, Badge, LoadingSkeleton } from './ui';

const MeetingResponse = ({ role }) => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(null);

    // Modal state for reschedule or decline
    const [activeModal, setActiveModal] = useState(null); // { meetingId, type: 'reschedule' | 'decline' }
    const [modalInput, setModalInput] = useState('');
    const [modalError, setModalError] = useState(null);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const response = await getMeetings();
            setMeetings(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch meetings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        setResponding(id);
        try {
            await respondToMeeting(id, 'accepted', null, null);
            fetchMeetings();
        } catch (error) {
            alert('Failed to record attendance confirmation');
        } finally {
            setResponding(null);
        }
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (!modalInput.trim()) {
            setModalError('This field is required');
            return;
        }

        const { meetingId, type } = activeModal;
        setResponding(meetingId);
        setModalError(null);

        try {
            if (type === 'reschedule') {
                const proposal = new Date(modalInput).toISOString();
                await respondToMeeting(meetingId, 'rescheduling', null, proposal);
            } else if (type === 'decline') {
                await respondToMeeting(meetingId, 'declined', modalInput, null);
            }
            setActiveModal(null);
            setModalInput('');
            fetchMeetings();
        } catch (error) {
            setModalError('Failed to record meeting response. Please check your input.');
        } finally {
            setResponding(null);
        }
    };

    const myStatus = (meeting) => {
        return role === 'student' ? meeting.studentStatus : meeting.industryStatus;
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <LoadingSkeleton className="h-32 rounded-xl bg-[#15171f] border border-[#22242f]" />
                <LoadingSkeleton className="h-32 rounded-xl bg-[#15171f] border border-[#22242f]" />
            </div>
        );
    }

    const confirmedCount = meetings.filter(m => m.status === 'confirmed').length;
    const pendingActionCount = meetings.filter(m => myStatus(m) !== 'accepted' && m.status !== 'cancelled').length;

    return (
        <div className="space-y-6">
            {/* Quick Filter & Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                    <span className="text-xs font-semibold text-slate-400">Total Scheduled Visits</span>
                    <div className="text-2xl font-bold text-white tracking-tight mt-1">{meetings.length}</div>
                    <span className="text-[11px] text-slate-500 mt-1">Supervision bookings</span>
                </div>

                <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                    <span className="text-xs font-semibold text-emerald-400">Confirmed Visits</span>
                    <div className="text-2xl font-bold text-emerald-400 tracking-tight mt-1">{confirmedCount}</div>
                    <span className="text-[11px] text-slate-500 mt-1">Ready for inspection</span>
                </div>

                <div className="p-4 rounded-xl bg-[#12141c] border border-[#22242f] flex flex-col justify-between">
                    <span className="text-xs font-semibold text-amber-400">Awaiting Your Confirmation</span>
                    <div className="text-2xl font-bold text-amber-400 tracking-tight mt-1">{pendingActionCount}</div>
                    <span className="text-[11px] text-slate-500 mt-1">Pending response</span>
                </div>
            </div>

            {/* Meetings List */}
            {meetings.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#12141c] border border-[#22242f] text-center space-y-2">
                    <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="text-sm font-bold text-white">No Scheduled Visits</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Your university supervisor has not scheduled any site visits or check-ins yet. Notifications will appear here when appointments are created.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {meetings.map((meeting) => {
                        const isPhysical = meeting.type === 'physical';
                        const userConfirmed = myStatus(meeting) === 'accepted';
                        const isConfirmedAll = meeting.status === 'confirmed';

                        return (
                            <div
                                key={meeting.id}
                                className="rounded-2xl bg-[#12141c] border border-[#22242f] p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-all shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3.5">
                                        <div className={`p-3 rounded-xl border shrink-0 ${
                                            isPhysical
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                                        }`}>
                                            {isPhysical ? <MapPin size={22} /> : <Video size={22} />}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                    isPhysical
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                                                }`}>
                                                    {isPhysical ? 'On-Site Inspection' : 'Virtual Supervision'}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                    isConfirmedAll
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {meeting.status}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-white mt-1">
                                                {meeting.purpose || 'Supervision Assessment Visit'}
                                            </h3>
                                            <p className="text-xs text-slate-400">
                                                Initiated by <span className="text-slate-300 font-medium">{meeting.initiator?.name || 'Faculty Supervisor'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:items-end gap-1 text-xs font-mono text-slate-300">
                                        <div className="flex items-center gap-1.5 text-violet-400 font-semibold">
                                            <Calendar size={13} />
                                            <span>{new Date(meeting.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock size={13} />
                                            <span>{new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {meeting.location && (
                                    <div className="p-3 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-slate-300 flex items-center gap-2">
                                        <MapPin size={14} className="text-amber-400 shrink-0" />
                                        <span>Location / Venue: <strong>{meeting.location}</strong></span>
                                    </div>
                                )}

                                {/* Action & Status Area */}
                                <div className="pt-3 border-t border-[#1e2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-400">Your Status:</span>
                                        <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                                            userConfirmed
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {userConfirmed ? 'Confirmed Attending' : myStatus(meeting) || 'Pending Response'}
                                        </span>
                                    </div>

                                    {!userConfirmed && meeting.status !== 'confirmed' && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button
                                                onClick={() => handleAccept(meeting.id)}
                                                disabled={responding === meeting.id}
                                                variant="primary"
                                                className="text-xs py-1.5 px-3 font-semibold flex items-center gap-1.5"
                                            >
                                                <CheckCircle2 size={13} />
                                                <span>{responding === meeting.id ? 'Confirming...' : 'Accept Visit'}</span>
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setActiveModal({ meetingId: meeting.id, type: 'reschedule' });
                                                    setModalInput('');
                                                    setModalError(null);
                                                }}
                                                disabled={responding === meeting.id}
                                                variant="secondary"
                                                className="text-xs py-1.5 px-3 border border-[#2a2e40] flex items-center gap-1.5"
                                            >
                                                <RotateCw size={13} />
                                                <span>Reschedule</span>
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setActiveModal({ meetingId: meeting.id, type: 'decline' });
                                                    setModalInput('');
                                                    setModalError(null);
                                                }}
                                                disabled={responding === meeting.id}
                                                variant="danger"
                                                className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                                            >
                                                <XCircle size={13} />
                                                <span>Decline</span>
                                            </Button>
                                        </div>
                                    )}

                                    {userConfirmed && (
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                            <CheckCircle2 size={15} />
                                            <span>Attendance Verified</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Dialog for Reschedule or Decline */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#12141c] border border-[#22242f] rounded-2xl p-6 space-y-4 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-[#22242f]">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                {activeModal.type === 'reschedule' ? (
                                    <>
                                        <RotateCw size={15} className="text-violet-400" /> Propose New Visit Time
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={15} className="text-rose-400" /> Decline Supervision Visit
                                    </>
                                )}
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-white p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleModalSubmit} className="space-y-4">
                            {activeModal.type === 'reschedule' ? (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Proposed Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={modalInput}
                                        onChange={(e) => setModalInput(e.target.value)}
                                        className="w-full p-2.5 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white outline-none focus:border-violet-500"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-500">Your proposed alternative will be sent to the supervisor for consideration.</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Reason for Declining</label>
                                    <textarea
                                        rows={3}
                                        value={modalInput}
                                        onChange={(e) => setModalInput(e.target.value)}
                                        placeholder="Explain why you cannot attend this scheduled visit..."
                                        className="w-full p-3 rounded-lg bg-[#181a24] border border-[#22242f] text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 resize-none"
                                        required
                                    />
                                </div>
                            )}

                            {modalError && (
                                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                                    <span>{modalError}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#22242f]">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setActiveModal(null)}
                                    className="text-xs py-1.5 px-3 border border-[#2a2e40]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant={activeModal.type === 'reschedule' ? 'primary' : 'danger'}
                                    disabled={responding !== null}
                                    className="text-xs py-1.5 px-4 font-bold"
                                >
                                    {responding ? 'Submitting...' : 'Submit Response'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetingResponse;
