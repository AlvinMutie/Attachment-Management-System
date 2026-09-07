import React from 'react';
import { getStatusConfig } from '../../utils/statusUtils';

export const Badge = ({
    children,
    variant = 'neutral',
    size = 'md',
    dot = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    const sizeStyles = {
        sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold',
        md: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
        lg: 'text-sm px-3 py-1 gap-2 font-medium'
    };

    const variantStyles = {
        neutral: 'text-slate-300 bg-[#161822] border-[#262938]',
        default: 'text-slate-300 bg-[#161822] border-[#262938]',
        primary: 'text-violet-300 bg-violet-500/10 border-violet-500/25',
        indigo: 'text-violet-300 bg-violet-500/10 border-violet-500/25',
        purple: 'text-purple-300 bg-purple-500/10 border-purple-500/25',
        success: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
        warning: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
        danger: 'text-rose-300 bg-rose-500/10 border-rose-500/25',
        info: 'text-sky-300 bg-sky-500/10 border-sky-500/25'
    };

    const dotColors = {
        neutral: 'bg-slate-400',
        default: 'bg-slate-400',
        primary: 'bg-violet-400',
        indigo: 'bg-violet-400',
        purple: 'bg-purple-400',
        success: 'bg-emerald-400',
        warning: 'bg-amber-400',
        danger: 'bg-rose-400',
        info: 'bg-sky-400'
    };

    return (
        <span
            className={`
                inline-flex items-center rounded-md border tracking-tight select-none font-sans
                ${sizeStyles[size] || sizeStyles.md}
                ${variantStyles[variant] || variantStyles.neutral}
                ${className}
            `}
            {...props}
        >
            {dot && (
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant] || 'bg-slate-400'}`}></span>
                </span>
            )}
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
            <span>{children}</span>
        </span>
    );
};

export const StatusBadge = ({
    status,
    size = 'md',
    showIcon = true,
    dot = false,
    className = '',
    ...props
}) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
        <span
            className={`
                inline-flex items-center rounded-md border tracking-tight select-none font-medium
                ${size === 'sm' ? 'text-[10px] px-2 py-0.5 gap-1' : size === 'lg' ? 'text-sm px-3 py-1 gap-2' : 'text-xs px-2.5 py-0.5 gap-1.5'}
                ${config.colorClass}
                ${className}
            `}
            {...props}
        >
            {dot && (
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                </span>
            )}
            {showIcon && IconComponent && (
                <IconComponent className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            )}
            <span>{config.label}</span>
        </span>
    );
};

export default Badge;

