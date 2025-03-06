import React from 'react';

const BasicInfoCard = ({ title, children, headerRight, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm h-[300px] flex flex-col ${className}`}>
            <div className="flex justify-between items-center py-2.5 px-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                {headerRight}
            </div>
            <div className="flex-1 p-3 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default BasicInfoCard; 