import React from 'react';

/**
 * 2칸 너비, 2칸 높이 패널 컴포넌트
 * @param {ReactNode} title - 패널 제목
 * @param {ReactNode} children - 패널 내용
 * @param {ReactNode} headerRight - 헤더 오른쪽 영역에 표시할 요소
 * @param {string} className - 추가 CSS 클래스
 */
const W2H2Panel = ({ title, children, headerRight, className = '' }) => {
    return (
        <div className={`col-span-2 row-span-2 bg-white rounded-lg shadow-lg flex flex-col ${className}`}>
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

export default W2H2Panel; 