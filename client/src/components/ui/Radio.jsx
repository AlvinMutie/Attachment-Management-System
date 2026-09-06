import React, { useId } from 'react';

const Radio = React.forwardRef(({
    id,
    name,
    value,
    label,
    description,
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
                    type="radio"
                    name={name}
                    value={value}
                    disabled={disabled}
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                    {...props}
                />
                <div className={`
                    w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-150
                    peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40 peer-focus-visible:border-blue-500
                    peer-checked:border-blue-500
                    border-white/20 bg-slate-900/60 hover:border-white/30
                    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                `}>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
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
                </label>
            )}
        </div>
    );
});

Radio.displayName = 'Radio';

export default Radio;
