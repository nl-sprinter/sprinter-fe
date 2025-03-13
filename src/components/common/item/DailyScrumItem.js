import React from 'react';
import { FiCalendar, FiUsers } from 'react-icons/fi';


const DailyScrumItem = ({ 
    dailyScrumId, 
    createdAt,
    userCount,
    backlogCount,
    onClick 
}) => {
    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    return (
        <div 
            className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onClick && onClick(dailyScrumId)}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1 text-gray-600">
                    <FiCalendar size={14} />
                    <span className="text-sm font-medium">{formatDate(createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                    <FiUsers size={14} />
                    <span className="text-sm">{userCount}명</span>
                </div>
            </div>
            <div className="text-xs text-gray-500">
                논의된 백로그: {backlogCount}개
            </div>
        </div>
    );
};

export default DailyScrumItem;