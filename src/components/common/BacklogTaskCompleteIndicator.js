import React from 'react';

const BacklogTaskCompleteIndicator = ({ completeRate, showLabel = true, size = 'medium' }) => {

    console.log(`Backlog task complete: ${completeRate}%`);


    // null 값 처리
    const safeProgress = completeRate === null ? 0 : completeRate;
    
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
    
    // 진행도에 따른 색상 계산 (인라인 스타일용)
    const getProgressColorStyle = (completeRate) => {
        if (completeRate <= 0) return { backgroundColor: '#FBBF24' }; // yellow-400
        if (completeRate < 30) {
            // 0-30%: 더 강한 노란색 유지
            return { backgroundColor: '#FFD700' }; // goldenrod
        }
        if (completeRate < 50) {
            // 30-50%: 노란색에서 초록색으로 점진적 변화
            const ratio = (completeRate - 30) / 20;
            const r = Math.floor(245 * (1 - ratio));
            const g = Math.floor(158 + (97 * ratio));
            const b = Math.floor(11 * (1 - ratio));
            return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
        }
        if (completeRate < 100) {
            // 50-100%: 초록색에서 파란색으로 점진적 변화
            const ratio = (completeRate - 50) / 50;
            const r = Math.floor(74 * (1 - ratio));
            const g = Math.floor(222 * (1 - ratio) + 96 * ratio);
            const b = Math.floor(128 * ratio + 128);
            return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
        }
        return { backgroundColor: '#4F46E5' }; // indigo-600
    };
    
    // 진행도 텍스트
    const getProgressText = (completeRate) => {
        return `${completeRate}% 완료`;
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
                    className="absolute top-0 left-0 bottom-0 transition-all duration-300 ease-in-out"
                    style={{ 
                        width: `${safeProgress}%`,
                        ...getProgressColorStyle(safeProgress)
                    }}
                />
            </div>
        </div>
    );
};

export default BacklogTaskCompleteIndicator; 