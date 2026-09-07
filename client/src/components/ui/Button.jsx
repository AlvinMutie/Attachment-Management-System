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
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer font-sans';

    const sizeStyles = {
        sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[30px]',
        md: 'text-xs px-3.5 py-2 gap-2 min-h-[36px]',
        lg: 'text-sm px-4.5 py-2.5 gap-2 min-h-[42px]'
    };

    const variantStyles = {
        primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-600/20 border border-violet-500/30 focus-visible:outline-violet-500 font-semibold',
        secondary: 'bg-[#181a24] hover:bg-[#202330] text-slate-200 border border-[#2c3040] shadow-sm focus-visible:outline-slate-400',
        outline: 'border border-[#2c3040] hover:border-slate-500 hover:bg-white/[0.03] text-slate-300 focus-visible:outline-white',
        ghost: 'text-slate-400 hover:text-white hover:bg-white/[0.05] focus-visible:outline-slate-400',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm border border-rose-500/30 focus-visible:outline-rose-500 font-semibold',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-500/30 focus-visible:outline-emerald-500 font-semibold',
        figma: 'bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-sm'
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
                <Loader2 className="w-3.5 h-3.5 animate-spin text-current" aria-hidden="true" />
            ) : (
                StartIcon && <StartIcon className="w-3.5 h-3.5 text-current" aria-hidden="true" />
            )}
            <span>{children}</span>
            {!loading && EndIcon && <EndIcon className="w-3.5 h-3.5 text-current" aria-hidden="true" />}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;

