import {
    Clock,
    Send,
    CheckCircle2,
    XCircle,
    CheckCheck,
    AlertTriangle,
    Calendar,
    ShieldCheck,
    ShieldAlert,
    HelpCircle,
    Activity
} from 'lucide-react';

export const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        variant: 'warning',
        colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        icon: Clock
    },
    submitted: {
        label: 'Submitted',
        variant: 'info',
        colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        icon: Send
    },
    approved: {
        label: 'Approved',
        variant: 'success',
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        icon: CheckCircle2
    },
    rejected: {
        label: 'Rejected',
        variant: 'danger',
        colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        icon: XCircle
    },
    active: {
        label: 'Active',
        variant: 'success',
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        icon: Activity
    },
    inactive: {
        label: 'Inactive',
        variant: 'neutral',
        colorClass: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        icon: Clock
    },
    completed: {
        label: 'Completed',
        variant: 'success',
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        icon: CheckCheck
    },
    overdue: {
        label: 'Overdue',
        variant: 'danger',
        colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        icon: AlertTriangle
    },
    scheduled: {
        label: 'Scheduled',
        variant: 'info',
        colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        icon: Calendar
    },
    verified: {
        label: 'Verified',
        variant: 'success',
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        icon: ShieldCheck
    },
    unverified: {
        label: 'Unverified',
        variant: 'warning',
        colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        icon: ShieldAlert
    }
};

export const getStatusConfig = (status) => {
    if (!status) {
        return {
            label: 'Unknown',
            variant: 'neutral',
            colorClass: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
            icon: HelpCircle
        };
    }
    const normalized = String(status).toLowerCase().trim();
    return STATUS_CONFIG[normalized] || {
        label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
        variant: 'neutral',
        colorClass: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        icon: HelpCircle
    };
};
