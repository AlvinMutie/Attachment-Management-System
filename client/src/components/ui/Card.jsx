import React from 'react';

export const Card = React.forwardRef(({
    children,
    className = '',
    variant = 'stripe', // 'stripe' | 'bento' | 'glass'
    hoverable = false,
    ...props
}, ref) => {
    const baseStyles = {
        stripe: 'bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl shadow-md transition-colors duration-150',
        bento: 'bento-card',
        glass: 'glass-surface rounded-2xl'
    };

    return (
        <div
            ref={ref}
            className={`
                ${baseStyles[variant] || baseStyles.stripe}
                ${hoverable ? 'hover:border-violet-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200' : ''}
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
    <div className={`p-5 pb-3 flex items-center justify-between border-b border-[var(--border-subtle)] ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
    <Component className={`text-base font-bold text-[var(--text-primary)] tracking-tight ${className}`} {...props}>
        {children}
    </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-xs text-[var(--text-secondary)] font-medium leading-relaxed mt-0.5 ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
    <div className={`p-5 ${className}`} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`p-5 pt-3 flex items-center justify-between border-t border-[var(--border-subtle)] mt-2 ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
