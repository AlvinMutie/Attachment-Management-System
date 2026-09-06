import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import { Badge } from './Badge';

export const PageHeader = ({
    title,
    subtitle,
    breadcrumbs,
    badge,
    badgeVariant = 'primary',
    actions,
    icon: Icon,
    className = ''
}) => {
    return (
        <div className={`space-y-4 pb-4 mb-6 border-b border-white/5 ${className}`}>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                    {Icon && (
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner mt-0.5">
                            <Icon size={24} aria-hidden="true" />
                        </div>
                    )}
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {title}
                            </h1>
                            {badge && (
                                <Badge variant={badgeVariant} size="sm">
                                    {badge}
                                </Badge>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
