import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
    icon: Icon = Inbox,
    title = 'No records found',
    description = 'There are currently no items to display.',
    actionLabel,
    onAction,
    actionIcon,
    className = ''
}) => (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-dashed border-white/10 rounded-2xl ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
            <Icon size={28} aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-white tracking-tight mb-1">
            {title}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            {description}
        </p>
        {actionLabel && onAction && (
            <Button
                variant="primary"
                size="sm"
                onClick={onAction}
                startIcon={actionIcon}
            >
                {actionLabel}
            </Button>
        )}
    </div>
);

export default EmptyState;
