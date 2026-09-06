import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import EmptyState from './EmptyState';

export const Table = ({ children, className = '', containerClassName = '' }) => (
    <div className={`w-full overflow-x-auto rounded-2xl border border-white/5 bg-slate-900/60 shadow-xl ${containerClassName}`}>
        <table className={`w-full text-left text-sm text-slate-300 border-collapse ${className}`}>
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children, className = '' }) => (
    <thead className={`bg-slate-950/70 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none ${className}`}>
        {children}
    </thead>
);

export const TableBody = ({ children, className = '' }) => (
    <tbody className={`divide-y divide-white/5 ${className}`}>
        {children}
    </tbody>
);

export const TableRow = ({ children, className = '', hoverable = true, onClick }) => (
    <tr
        onClick={onClick}
        className={`
            transition-colors duration-150
            ${hoverable ? 'hover:bg-white/[0.02]' : ''}
            ${onClick ? 'cursor-pointer' : ''}
            ${className}
        `}
    >
        {children}
    </tr>
);

export const TableHead = ({
    children,
    align = 'left',
    className = ''
}) => {
    const alignStyles = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return (
        <th scope="col" className={`px-5 py-3.5 ${alignStyles[align] || 'text-left'} ${className}`}>
            {children}
        </th>
    );
};

export const TableCell = ({
    children,
    align = 'left',
    className = ''
}) => {
    const alignStyles = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return (
        <td className={`px-5 py-4 text-xs font-normal text-slate-200 ${alignStyles[align] || 'text-left'} ${className}`}>
            {children}
        </td>
    );
};

export const TableEmpty = ({ colSpan = 5, title, description, actionLabel, onAction }) => (
    <tr>
        <td colSpan={colSpan} className="p-8">
            <EmptyState
                title={title}
                description={description}
                actionLabel={actionLabel}
                onAction={onAction}
            />
        </td>
    </tr>
);

export const TablePagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems,
    itemsPerPage = 10,
    className = ''
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems || currentPage * itemsPerPage);

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-white/5 text-xs text-slate-400 ${className}`}>
            <div>
                {totalItems !== undefined ? (
                    <span>
                        Showing <strong className="text-white">{startItem}</strong> to <strong className="text-white">{endItem}</strong> of <strong className="text-white">{totalItems}</strong> entries
                    </span>
                ) : (
                    <span>Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong></span>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange?.(currentPage - 1)}
                    startIcon={ChevronLeft}
                >
                    Previous
                </Button>
                <div className="px-3 py-1 bg-slate-800 rounded-lg text-white font-semibold">
                    {currentPage}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange?.(currentPage + 1)}
                    endIcon={ChevronRight}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Table;
