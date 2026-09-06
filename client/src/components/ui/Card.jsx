import React from 'react';

export const Card = React.forwardRef(({
    children,
    className = '',
    hoverable = false,
    ...props
}, ref) => (
    <div
        ref={ref}
        className={`
            bg-slate-900/80 border border-white/5 rounded-2xl shadow-xl shadow-black/20
            ${hoverable ? 'hover:border-white/15 hover:shadow-2xl transition-all duration-200' : ''}
            ${className}
        `}
        {...props}
    >
        {children}
    </div>
));
Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`p-6 pb-3 space-y-1.5 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
    <Component className={`text-lg font-bold text-white tracking-tight ${className}`} {...props}>
        {children}
    </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-xs text-slate-400 font-normal leading-relaxed ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
    <div className={`p-6 pt-3 ${className}`} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4 ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
