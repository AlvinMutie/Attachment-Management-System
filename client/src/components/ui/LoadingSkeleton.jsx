import React from 'react';

export const LoadingSkeleton = ({
    variant = 'text',
    count = 1,
    className = '',
    width,
    height
}) => {
    const items = Array.from({ length: count });

    const baseClass = 'skeleton-shimmer bg-slate-800/80 rounded-lg animate-pulse';

    const getVariantClass = () => {
        switch (variant) {
            case 'circle':
            case 'avatar':
                return 'rounded-full w-10 h-10';
            case 'card':
                return 'rounded-2xl h-44 w-full';
            case 'table-row':
                return 'h-12 w-full';
            case 'button':
                return 'h-10 w-24 rounded-xl';
            case 'text':
            default:
                return 'h-4 w-full';
        }
    };

    return (
        <div className="space-y-2 w-full">
            {items.map((_, idx) => (
                <div
                    key={idx}
                    className={`${baseClass} ${getVariantClass()} ${className}`}
                    style={{
                        width: width || undefined,
                        height: height || undefined
                    }}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="w-full space-y-3 p-4 bg-slate-900/40 rounded-2xl border border-white/5">
        <div className="flex gap-4 pb-2 border-b border-white/5">
            {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="skeleton-shimmer bg-slate-800 h-4 rounded w-1/4" />
            ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex gap-4 py-2 border-b border-white/5 last:border-0">
                {Array.from({ length: cols }).map((_, c) => (
                    <div key={c} className="skeleton-shimmer bg-slate-800/60 h-4 rounded w-1/4" />
                ))}
            </div>
        ))}
    </div>
);

export const CardSkeleton = ({ count = 3 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="p-6 bg-slate-900/80 border border-white/5 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                    <div className="skeleton-shimmer bg-slate-800 h-4 w-1/3 rounded" />
                    <div className="skeleton-shimmer bg-slate-800 h-10 w-10 rounded-xl" />
                </div>
                <div className="skeleton-shimmer bg-slate-800 h-8 w-1/2 rounded" />
                <div className="skeleton-shimmer bg-slate-800/60 h-3 w-3/4 rounded" />
            </div>
        ))}
    </div>
);

export default LoadingSkeleton;
