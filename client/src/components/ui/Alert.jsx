import React from 'react';
import {
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';

export const Alert = ({
    variant = 'info',
    title,
    children,
    onClose,
    className = ''
}) => {
    const config = {
        info: {
            icon: Info,
            containerClass: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        },
        success: {
            icon: CheckCircle2,
            containerClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        },
        warning: {
            icon: AlertTriangle,
            containerClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        },
        danger: {
            icon: AlertCircle,
            containerClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }
    }[variant] || {
        icon: Info,
        containerClass: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    };

    const Icon = config.icon;

    return (
        <div
            role="alert"
            className={`
                flex items-start gap-3.5 p-4 rounded-xl border transition-all text-xs
                ${config.containerClass}
                ${className}
            `}
        >
            <Icon size={18} className="flex-shrink-0 mt-0.5 text-current" aria-hidden="true" />

            <div className="flex-1 space-y-0.5">
                {title && (
                    <h5 className="font-bold text-slate-100 tracking-tight text-sm">
                        {title}
                    </h5>
                )}
                <div className="text-slate-300 font-normal leading-relaxed">
                    {children}
                </div>
            </div>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-current"
                    aria-label="Dismiss alert"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default Alert;
