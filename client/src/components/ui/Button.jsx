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
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizeStyles = {
        sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
        md: 'text-sm px-4 py-2.5 gap-2 min-h-[40px]',
        lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px]'
    };

    const variantStyles = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:translate-y-0.5 focus-visible:outline-blue-500',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-white/10 active:translate-y-0.5 focus-visible:outline-slate-400',
        outline: 'border border-white/20 hover:border-white/40 hover:bg-white/5 text-slate-200 active:translate-y-0.5 focus-visible:outline-white',
        ghost: 'text-slate-400 hover:text-slate-100 hover:bg-white/5 focus-visible:outline-slate-400',
        danger: 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:translate-y-0.5 focus-visible:outline-rose-500',
        success: 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:translate-y-0.5 focus-visible:outline-emerald-500'
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
