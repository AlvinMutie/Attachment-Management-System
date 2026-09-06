import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dropdown = ({
    trigger,
    children,
    align = 'right',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const alignStyles = {
        left: 'left-0 origin-top-left',
        right: 'right-0 origin-top-right'
    };

    return (
        <div ref={containerRef} className="relative inline-block text-left">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className={`
                            absolute z-50 mt-2 w-56 rounded-xl bg-slate-900 border border-white/10
                            shadow-xl shadow-black/40 py-1.5 focus:outline-none overflow-hidden
                            ${alignStyles[align] || alignStyles.right}
                            ${className}
                        `}
                        role="menu"
                    >
                        {typeof children === 'function' ? children({ close: () => setIsOpen(false) }) : children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const DropdownItem = ({
    children,
    onClick,
    icon: Icon,
    danger = false,
    disabled = false,
    className = ''
}) => (
    <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        role="menuitem"
        className={`
            w-full flex items-center px-4 py-2.5 text-xs font-medium transition-colors text-left gap-2.5
            ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            ${danger
                ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }
            ${className}
        `}
    >
        {Icon && <Icon size={16} className="text-current flex-shrink-0" />}
        <span className="truncate">{children}</span>
    </button>
);

export const DropdownDivider = () => (
    <div className="my-1 border-t border-white/5" role="separator" />
);

export default Dropdown;
