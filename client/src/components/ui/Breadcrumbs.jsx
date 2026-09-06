import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ items = [], className = '' }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-xs text-slate-400 ${className}`}>
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        to="/"
                        className="flex items-center text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded focus-visible:outline-blue-500"
                        aria-label="Home"
                    >
                        <Home size={14} />
                    </Link>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center space-x-2">
                            <ChevronRight size={12} className="text-slate-600 flex-shrink-0" aria-hidden="true" />
                            {item.to && !isLast ? (
                                <Link
                                    to={item.to}
                                    className="text-slate-400 hover:text-slate-200 transition-colors truncate max-w-[150px] focus-visible:outline-blue-500"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={`truncate max-w-[180px] ${isLast ? 'text-white font-medium' : 'text-slate-400'}`} aria-current={isLast ? 'page' : undefined}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
