import React, { useState } from 'react';

export const Tabs = ({
    tabs = [],
    activeTab,
    onChange,
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

    return (
        <div className={`flex items-center space-x-1 p-1 bg-slate-900/60 border border-white/5 rounded-xl ${className}`} role="tablist">
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
                            flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all select-none
                            ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                            ${isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }
                        `}
                    >
                        {Icon && <Icon size={15} className="text-current flex-shrink-0" />}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
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
