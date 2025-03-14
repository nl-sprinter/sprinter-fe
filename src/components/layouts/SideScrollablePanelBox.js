import React, { useRef, useEffect } from 'react';

const SideScrollablePanelBox = ({children, className = ''}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (e.deltaY !== 0) {
                container.scrollLeft += e.deltaY;
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className="relative">
            <div
                ref={containerRef}
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
            >
                <div className="flex gap-6 px-1 py-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SideScrollablePanelBox;