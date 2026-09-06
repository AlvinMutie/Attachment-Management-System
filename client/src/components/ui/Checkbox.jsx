import React, { useId } from 'react';
import { Check } from 'lucide-react';

const Checkbox = React.forwardRef(({
    id,
    label,
    description,
    error,
    disabled = false,
    checked,
    onChange,
    className = '',
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className="flex items-start space-x-3 select-none">
            <div className="relative flex items-center pt-0.5">
                <input
                    ref={ref}
                    id={inputId}
                    type="checkbox"
                    disabled={disabled}
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                    {...props}
                />
                <div className={`
                    w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-150
                    peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40 peer-focus-visible:border-blue-500
                    peer-checked:bg-blue-600 peer-checked:border-blue-600
                    ${error ? 'border-rose-500 bg-rose-500/10' : 'border-white/20 bg-slate-900/60 hover:border-white/30'}
                    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                `}>
                    <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                </div>
            </div>

            {(label || description) && (
                <label htmlFor={inputId} className={`space-y-0.5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    {label && (
                        <span className="block text-sm font-medium text-slate-200">
                            {label}
                        </span>
                    )}
                    {description && (
                        <p className="text-xs text-slate-400">
                            {description}
                        </p>
                    )}
                    {error && (
                        <p role="alert" className="text-xs text-rose-400 font-medium">
                            {error}
                        </p>
                    )}
                </label>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
