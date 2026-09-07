import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    startIcon: StartIcon,
    endIcon: EndIcon,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const sizeStyles = {
        sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
        md: 'text-sm px-4 py-2 gap-2 min-h-[38px]',
        lg: 'text-sm px-5 py-2.5 gap-2.5 min-h-[44px]'
    };

    const variantStyles = {
        primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 border-t border-indigo-400/40 focus-visible:outline-indigo-500',
        secondary: 'bg-[#162035] hover:bg-[#1e2b47] text-slate-100 border border-[#263554] shadow-sm focus-visible:outline-slate-400',
        outline: 'border border-slate-700/80 hover:border-slate-500 hover:bg-white/[0.04] text-slate-200 focus-visible:outline-white',
        ghost: 'text-slate-400 hover:text-white hover:bg-white/[0.06] focus-visible:outline-slate-400',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 border-t border-rose-400/40 focus-visible:outline-rose-500',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 border-t border-emerald-400/40 focus-visible:outline-emerald-500',
        stripe: 'bg-white hover:bg-slate-100 text-slate-950 font-semibold shadow-lg shadow-white/10'
    };

    const isInteractiveDisabled = disabled || loading;

    return (
        <button
            ref={ref}
            type={type}
            disabled={isInteractiveDisabled}
            aria-busy={loading}
            className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
            ) : (
                StartIcon && <StartIcon className="w-4 h-4 text-current" aria-hidden="true" />
            )}
            <span>{children}</span>
            {!loading && EndIcon && <EndIcon className="w-4 h-4 text-current" aria-hidden="true" />}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
