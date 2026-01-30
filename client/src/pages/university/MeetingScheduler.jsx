import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    User,
    Briefcase,
    Plus,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { createMeeting, getMeetings } from '../../utils/meetingApi';
import { getMyStudents } from '../../utils/universityApi';

const MeetingScheduler = () => {
    const [meetings, setMeetings] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        studentId: '',
        industrySupervisorId: '', // Ideally auto-fetched based on selected student
        type: 'physical',
        scheduledAt: '',
        purpose: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [meetingRes, studentRes] = await Promise.all([
                getMeetings(),
                getMyStudents()
            ]);
            setMeetings(meetingRes.data.data);
            setStudents(studentRes.data.data);
        } catch (error) {
            console.error('Failed to load scheduler data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelect = (e) => {
        const student = students.find(s => s.id === e.target.value);
        if (student) {
            setFormData({
                ...formData,
                studentId: student.id,
                industrySupervisorId: student.industrySupervisor?.id || ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createMeeting(formData);
            setShowModal(false);
            fetchData();
            alert('Meeting request sent successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to schedule meeting');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'rescheduling': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'cancelled': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <DashboardLayout role="university_supervisor">
            <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Visit Scheduler</h1>
                        <p className="text-slate-500 font-medium">Coordinate and track supervised industry visits</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>Schedule Visit</span>
                    </button>
                </div>

                <div className="grid gap-4">
                    {meetings.map((meeting) => (
                        <div key={meeting.id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${meeting.type === 'physical' ? 'bg-orange-500/10 text-orange-500' : 'bg-purple-500/10 text-purple-500'
                                }`}>
                                {meeting.type === 'physical' ? <MapPin size={32} /> : <Video size={32} />}
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <h3 className="text-lg font-bold text-white">
                                        {meeting.purpose}
                                    </h3>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${getStatusColor(meeting.status)}`}>
                                        {meeting.status}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 text-xs font-medium text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{new Date(meeting.scheduledAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>{new Date(meeting.scheduledAt).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={14} />
                                        <span>Student: {meeting.student?.user?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={14} />
                                        <span>Supervisor: {meeting.industrySupervisor?.name || 'Pending Assignment'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[140px]">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-white/5 p-2 rounded-lg">
                                    <span className="text-slate-500">Student</span>
                                    <span className={meeting.studentStatus === 'accepted' ? 'text-emerald-400' : 'text-amber-400'}>
                                        {meeting.studentStatus}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-white/5 p-2 rounded-lg">
                                    <span className="text-slate-500">Industry</span>
                                    <span className={meeting.industryStatus === 'accepted' ? 'text-emerald-400' : 'text-amber-400'}>
                                        {meeting.industryStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {meetings.length === 0 && !loading && (
                        <div className="p-12 text-center text-slate-500 font-medium bg-white/5 rounded-3xl border border-dashed border-white/10">
                            No meetings scheduled yet. Initiate a visit request to begin.
                        </div>
                    )}
                </div>
            </div>

            {/* Create Meeting Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-lg p-8 space-y-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-black text-white">Schedule New Visit</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><XCircle /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Select Target Student</label>
                                <select
                                    className="input-field bg-slate-900"
                                    onChange={handleStudentSelect}
                                    required
                                >
                                    <option value="">Select a student...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.user?.name} - {s.admissionNumber}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Industry Mentor</label>
                                <input
                                    type="text"
                                    value={students.find(s => s.id === formData.studentId)?.industrySupervisor?.name || 'Not Assigned'}
                                    disabled
                                    className="input-field bg-slate-900 opacity-50"
                                />
                                {formData.studentId && !formData.industrySupervisorId && (
                                    <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                                        <AlertCircle size={10} />
                                        Warning: Student has no industry supervisor linked.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Meeting Type</label>
                                    <select
                                        className="input-field bg-slate-900"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="physical">Physical Site Visit</option>
                                        <option value="remote">Remote Check-in</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="input-field bg-slate-900"
                                        onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Purpose of Visit</label>
                                <textarea
                                    className="input-field bg-slate-900 h-24 resize-none"
                                    placeholder="e.g. Mid-term assessment and logbook review..."
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full justify-center">
                                Send Meeting Requests
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default MeetingScheduler;
