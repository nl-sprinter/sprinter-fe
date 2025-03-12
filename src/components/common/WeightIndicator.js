import React from 'react';

const WeightIndicator = ({ weight, showLabel = true, size = 'medium' }) => {
    const getWeightColor = (weight) => {
        if (weight <= 1) return 'bg-green-500';
        if (weight <= 2) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    const getWeightText = (weight) => {
        if (weight <= 1) return '낮음';
        if (weight <= 2) return '보통';
        return '높음';
    };

    const getSizeClasses = (size) => {
        switch (size) {
            case 'small':
                return 'w-3 h-3';
            case 'large':
                return 'w-5 h-5';
            case 'medium':
            default:
                return 'w-4 h-4';
        }
    };

    return (
        <div className="flex items-center gap-2">
            {showLabel && <span className="text-sm text-gray-400">중요도</span>}
            <div 
                className={`
                    ${getSizeClasses(size)} 
                    rounded-full 
                    ${getWeightColor(weight)}
                    shadow-sm
                    border border-gray-50
                    transition-all duration-300 ease-in-out
                `}
                title={getWeightText(weight)}
            />
        </div>
    );
};

export default WeightIndicator; 