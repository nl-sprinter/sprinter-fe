const WeightIndicator = ({ weight, showLabel = true, size = 'medium' }) => {
    const getWeightColor = (weight) => {
        if (weight <= 1) return 'bg-yellow-400';
        if (weight <= 2) return 'bg-green-400';
        return 'bg-blue-700';
    };

    const getWeightBarWidth = (weight) => {
        if (weight <= 1) return 'w-1/3';
        if (weight <= 2) return 'w-2/3';
        return 'w-full';
    };

    const getWeightText = (weight) => {
        if (weight <= 1) return '낮음';
        if (weight <= 2) return '보통';
        return '높음';
    };

    const getSizeClasses = (size) => {
        switch (size) {
            case 'small':
                return 'w-16 h-2.5';
            case 'large':
                return 'w-24 h-4';
            case 'medium':
            default:
                return 'w-20 h-3';
        }
    };

    return (
        <div className="flex items-center gap-2">
            {showLabel && <span className="text-sm text-gray-400">중요도</span>}
            <div className={`${getSizeClasses(size)} bg-gray-100 rounded-full overflow-hidden shadow-inner`}>
                <div 
                    className={`h-full ${getWeightColor(weight)} ${getWeightBarWidth(weight)} transition-all duration-300 ease-in-out`}
                />
            </div>
        </div>
    );
};

export default WeightIndicator; 