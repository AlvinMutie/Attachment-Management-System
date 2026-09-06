import React, { useId } from 'react';

const Textarea = React.forwardRef(({
    id,
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    rows = 4,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
        <div className={`w-full space-y-1.5 ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                    {label}
                    {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                disabled={disabled}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : helperText ? helperId : undefined}
                className={`
                    w-full bg-slate-900/60 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500
                    transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed resize-y
                    ${error
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5'
                        : 'border-white/10 hover:border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                    }
                    ${className}
                `}
                {...props}
            />

            {error && (
                <p id={errorId} role="alert" className="text-xs text-rose-400 font-medium">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={helperId} className="text-xs text-slate-400">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
