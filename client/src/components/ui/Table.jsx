import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import EmptyState from './EmptyState';

export const Table = ({ children, className = '', containerClassName = '' }) => (
    <div className={`w-full overflow-x-auto rounded-2xl border border-[#1f293d] bg-[#101626] shadow-xl ${containerClassName}`}>
        <table className={`w-full text-left text-sm text-slate-300 border-collapse ${className}`}>
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children, className = '' }) => (
    <thead className={`bg-[#0c101d] border-b border-[#1f293d] text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none ${className}`}>
        {children}
    </thead>
);

export const TableBody = ({ children, className = '' }) => (
    <tbody className={`divide-y divide-[#1f293d]/60 ${className}`}>
        {children}
    </tbody>
);

export const TableRow = ({ children, className = '', hoverable = true, onClick }) => (
    <tr
        onClick={onClick}
        className={`
            transition-colors duration-150
            ${hoverable ? 'hover:bg-[#162035]/80' : ''}
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
        <th scope="col" className={`px-4 py-3 ${alignStyles[align] || 'text-left'} ${className}`}>
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
        <td className={`px-4 py-3 text-xs font-normal text-slate-200 ${alignStyles[align] || 'text-left'} ${className}`}>
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
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 border-t border-[#1f293d] text-xs text-slate-400 bg-[#0c101d] ${className}`}>
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
                <div className="px-2.5 py-1 bg-[#162035] border border-[#263554] rounded-lg text-white font-semibold text-xs">
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
