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
        <div className={`space-y-3 pb-4 mb-6 border-b border-[#1f293d] ${className}`}>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    {Icon && (
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 shadow-inner mt-0.5">
                            <Icon size={22} aria-hidden="true" />
                        </div>
                    )}
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                {title}
                            </h1>
                            {badge && (
                                <Badge variant={badgeVariant} size="sm" dot>
                                    {badge}
                                </Badge>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
