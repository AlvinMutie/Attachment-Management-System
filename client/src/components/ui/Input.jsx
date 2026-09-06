import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = React.forwardRef(({
    id,
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    startIcon: StartIcon,
    endIcon: EndIcon,
    className = '',
    containerClassName = '',
    type = 'text',
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
        <div className={`w-full space-y-1.5 ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                    {label}
                    {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
                </label>
            )}

            <div className="relative flex items-center">
                {StartIcon && (
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none" aria-hidden="true">
                        <StartIcon size={18} />
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    disabled={disabled}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : helperText ? helperId : undefined}
                    className={`
                        w-full bg-slate-900/60 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500
                        transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
                        ${StartIcon ? 'pl-10' : ''}
                        ${EndIcon || error ? 'pr-10' : ''}
                        ${error
                            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5'
                            : 'border-white/10 hover:border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                        }
                        ${className}
                    `}
                    {...props}
                />

                {error ? (
                    <div className="absolute right-3.5 text-rose-500 pointer-events-none" aria-hidden="true">
                        <AlertCircle size={18} />
                    </div>
                ) : EndIcon ? (
                    <div className="absolute right-3.5 text-slate-400 pointer-events-none" aria-hidden="true">
                        <EndIcon size={18} />
                    </div>
                ) : null}
            </div>

            {error && (
                <p id={errorId} role="alert" className="text-xs text-rose-400 font-medium flex items-center gap-1">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={helperId} className="text-xs text-slate-400 font-normal">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
