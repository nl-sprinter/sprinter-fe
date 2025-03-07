import React from 'react';

const SideScrollableCardBox = ({children, className = ''}) => {
    const handleWheel = (e) => {
        e.preventDefault();
        const container = e.currentTarget;
        container.scrollLeft += e.deltaY;
    };

    return (
        <div className="relative">
            <div
                className={`
                    flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth
                    scrollbar scrollbar-thin 
                    scrollbar-track-transparent hover:scrollbar-track-gray-50/50
                    scrollbar-thumb-gray-200/80 hover:scrollbar-thumb-gray-300/80
                    shadow-[inset_0_-12px_6px_-6px_rgba(0,0,0,0.02)]
                    rounded-lg
                    transition-colors duration-200
                    ${className}
                `}
                style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollBehavior: 'smooth'
                }}
                onWheel={handleWheel}
            >
                <div className="flex gap-6 px-1 py-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SideScrollableCardBox;