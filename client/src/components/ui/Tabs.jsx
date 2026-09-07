import React, { useState } from 'react';

export const Tabs = ({
    tabs = [],
    activeTab,
    onChange,
    variant = 'pill', // 'pill' | 'underline' | 'segmented'
    className = ''
}) => {
    const [internalActive, setInternalActive] = useState(tabs[0]?.id || '');
    const currentTab = activeTab !== undefined ? activeTab : internalActive;

    const handleSelect = (id) => {
        if (activeTab === undefined) {
            setInternalActive(id);
        }
        onChange?.(id);
    };

    if (variant === 'underline') {
        return (
            <div className={`flex items-center space-x-6 border-b border-slate-800 ${className}`} role="tablist">
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            disabled={tab.disabled}
                            onClick={() => handleSelect(tab.id)}
                            className={`
                                flex items-center gap-2 pb-3 text-xs font-medium border-b-2 transition-all cursor-pointer -mb-px select-none
                                ${isActive
                                    ? 'border-indigo-500 text-white font-semibold'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                                }
                            `}
                        >
                            {Icon && <Icon size={14} className="text-current flex-shrink-0" />}
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center p-1 bg-[#0d1322] border border-[#1f293d] rounded-full backdrop-blur-md ${className}`} role="tablist">
            {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        disabled={tab.disabled}
                        onClick={() => handleSelect(tab.id)}
                        className={`
                            flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all select-none
                            ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                            }
                        `}
                    >
                        {Icon && <Icon size={13} className="text-current flex-shrink-0" />}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;
