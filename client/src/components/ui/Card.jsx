import React from 'react';

export const Card = React.forwardRef(({
    children,
    className = '',
    variant = 'stripe', // 'stripe' | 'bento' | 'glass'
    hoverable = false,
    ...props
}, ref) => {
    const baseStyles = {
        stripe: 'bg-[#101626] border border-[#1f293d] rounded-2xl shadow-lg shadow-black/40',
        bento: 'bento-card',
        glass: 'glass-surface rounded-2xl'
    };

    return (
        <div
            ref={ref}
            className={`
                ${baseStyles[variant] || baseStyles.stripe}
                ${hoverable ? 'hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-indigo-500/10 transition-all duration-200' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
});
Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`p-5 pb-3 flex items-center justify-between border-b border-white/[0.04] ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
    <Component className={`text-base font-semibold text-white tracking-tight ${className}`} {...props}>
        {children}
    </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-xs text-slate-400 font-normal leading-relaxed mt-0.5 ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
    <div className={`p-5 ${className}`} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`p-5 pt-3 flex items-center justify-between border-t border-white/[0.04] mt-2 ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
