import React from 'react';

const BacklogTaskCompleteIndicator = ({ progress, showLabel = true, size = 'medium' }) => {
    // null 값 처리
    const safeProgress = progress === null ? 0 : progress;
    
    // 크기 클래스 가져오기 - 표준 Tailwind 클래스로 수정
    const getSizeClasses = (size) => {
        switch (size) {
            case 'small':
                return 'h-3 w-16'; // w-15는 Tailwind 기본 클래스가 아님
            case 'large':
                return 'h-5 w-24'; // w-25는 Tailwind 기본 클래스가 아님
            case 'medium':
            default:
                return 'h-4 w-20'; // w-20은 Tailwind 기본 클래스임
        }
    };
    
    // 진행도에 따른 색상 계산
    const getProgressColor = (progress) => {
        if (progress <= 0) return 'bg-yellow-400';
        if (progress < 50) {
            const ratio = progress / 50;
            return `bg-[#${Math.floor(255 * (1 - ratio)).toString(16).padStart(2, '0')}${Math.floor(204 + (51 * ratio)).toString(16).padStart(2, '0')}00]`;
        }
        if (progress < 100) {
            const ratio = (progress - 50) / 50;
            return `bg-[#00${Math.floor(204 - (204 * ratio)).toString(16).padStart(2, '0')}${Math.floor(128 * (1 - ratio)).toString(16).padStart(2, '0')}]`;
        }
        return 'bg-indigo-600';
    };
    
    // 진행도 텍스트
    const getProgressText = (progress) => {
        return `${progress}% 완료`;
    };

    return (
        <div className="flex items-center gap-2">
            {showLabel && <span className="text-sm text-gray-400">완성도</span>}
            <div 
                className={`
                    ${getSizeClasses(size)} 
                    rounded-full 
                    bg-gray-200
                    shadow-sm
                    border border-gray-50
                    overflow-hidden
                    transition-all duration-300 ease-in-out
                    relative
                `}
                title={getProgressText(safeProgress)}
            >
                <div 
                    className={`
                        absolute top-0 left-0 bottom-0
                        ${getProgressColor(safeProgress)}
                        transition-all duration-300 ease-in-out
                    `}
                    style={{ width: `${safeProgress}%` }}
                />
            </div>
        </div>
    );
};

export default BacklogTaskCompleteIndicator; 