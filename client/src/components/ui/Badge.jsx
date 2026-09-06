import React from 'react';
import { getStatusConfig } from '../../utils/statusUtils';

export const Badge = ({
    children,
    variant = 'neutral',
    size = 'md',
    icon: Icon,
    className = '',
    ...props
}) => {
    const sizeStyles = {
        sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold',
        md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
        lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
    };

    const variantStyles = {
        neutral: 'text-slate-300 bg-slate-800/80 border-slate-700/60',
        primary: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        danger: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        info: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    };

    return (
        <span
            className={`
                inline-flex items-center rounded-full border tracking-wide select-none
                ${sizeStyles[size] || sizeStyles.md}
                ${variantStyles[variant] || variantStyles.neutral}
                ${className}
            `}
            {...props}
        >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
            <span>{children}</span>
        </span>
    );
};

export const StatusBadge = ({
    status,
    size = 'md',
    showIcon = true,
    className = '',
    ...props
}) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
        <span
            className={`
                inline-flex items-center rounded-full border tracking-wide select-none font-medium
                ${size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : size === 'lg' ? 'text-sm px-3 py-1.5 gap-2' : 'text-xs px-2.5 py-1 gap-1.5'}
                ${config.colorClass}
                ${className}
            `}
            {...props}
        >
            {showIcon && IconComponent && (
                <IconComponent className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            )}
            <span>{config.label}</span>
        </span>
    );
};

export default Badge;
