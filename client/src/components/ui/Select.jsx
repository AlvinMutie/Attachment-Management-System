import React, { useId } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

const Select = React.forwardRef(({
    id,
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    options = [],
    children,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
        <div className={`w-full space-y-1.5 ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                    {label}
                    {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
                </label>
            )}

            <div className="relative flex items-center">
                <select
                    ref={ref}
                    id={selectId}
                    disabled={disabled}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : helperText ? helperId : undefined}
                    className={`
                        w-full bg-slate-900/60 border rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 appearance-none
                        transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
                        ${error
                            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5'
                            : 'border-white/10 hover:border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                        }
                        ${className}
                    `}
                    {...props}
                >
                    {children ? children : (
                        options.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                disabled={opt.disabled}
                                className="bg-slate-900 text-slate-100"
                            >
                                {opt.label}
                            </option>
                        ))
                    )}
                </select>

                <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center gap-1" aria-hidden="true">
                    {error ? <AlertCircle size={18} className="text-rose-500" /> : <ChevronDown size={18} />}
                </div>
            </div>

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

Select.displayName = 'Select';

export default Select;
