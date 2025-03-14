import React from 'react';

const PanelBox = ({ children, className = '' }) => {
    return (
        <div className={`grid grid-cols-3 gap-6 ${className}`}>
            {children}
        </div>
    );
};

export default PanelBox;