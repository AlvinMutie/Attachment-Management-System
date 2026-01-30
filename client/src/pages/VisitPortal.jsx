import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import MeetingResponse from '../components/MeetingResponse';
import { useAuth } from '../context/AuthContext';

const VisitPortal = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout role={user.role}>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">My Visits</h1>
                    <p className="text-slate-500 font-medium">Manage your scheduled site visits and remote check-ins</p>
                </div>

                <MeetingResponse role={user.role} />
            </div>
        </DashboardLayout>
    );
};

export default VisitPortal;
