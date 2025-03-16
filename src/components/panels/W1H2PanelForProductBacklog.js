import React from 'react';

const W1H2PanelForProductBacklog = ({ title, children, headerRight, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg flex flex-col flex-shrink-0 w-[400px] h-[612px] snap-center ${className}`}>
            <div className="flex justify-between items-center py-2.5 px-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                {headerRight}
            </div>
            <div className="p-3 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default W1H2PanelForProductBacklog;