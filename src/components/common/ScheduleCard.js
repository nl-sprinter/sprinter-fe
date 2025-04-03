import React from 'react';

// 색상 매핑 함수
const getColorByEnum = (colorEnum) => {
    const colorMap = {
        RED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-l-red-500' },
        ORANGE: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-l-orange-500' },
        YELLOW: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-l-yellow-500' },
        GREEN: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-l-green-500' },
        BLUE: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-l-blue-500' },
        NAVY: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-l-indigo-500' },
        PURPLE: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-l-purple-500' }
    };
    
    return colorEnum && colorMap[colorEnum] 
        ? colorMap[colorEnum] 
        : { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-l-gray-500' };
};

export const ScheduleCard = ({ schedule, onClick }) => {
    const isSprint = schedule.scheduleType === 'SPRINT';
    const isAllDay = schedule.allDay === true;
    const colorStyle = isSprint 
        ? { bg: 'bg-green-100', text: 'text-green-700', border: 'border-l-green-500' }
        : getColorByEnum(schedule.scheduleColor);
    
    return (
        <div
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300
                border border-gray-200 relative overflow-hidden w-full
                border-l-4 ${colorStyle.border} 
                ${isSprint ? 'opacity-90' : 'hover:bg-green-50 cursor-pointer'}`}
            onClick={onClick}
        >
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-green-50/80 to-transparent"/>
            <div className="flex flex-col gap-1 relative flex-1">
                <span className="text-sm">{schedule.title}</span>
                <span className="text-xs text-gray-500">
                    {formatDateTime(schedule.startTime, isAllDay)}
                </span>
                <span className="text-xs text-gray-500">
                    {formatDateTime(schedule.endTime, isAllDay)}
                </span>
            </div>
            <span className={`px-2 py-1 rounded text-xs relative ${
                isSprint
                    ? 'bg-green-100 text-green-700'
                    : `${colorStyle.bg} ${colorStyle.text}`
            }`}>
                {isSprint ? '스프린트' : isAllDay ? '종일' : '일정'}
            </span>
        </div>
    );
};

// 날짜 포맷팅 함수 수정 - allDay 파라미터 추가
const formatDateTime = (dateTimeStr, isAllDay = false) => {
    if (!dateTimeStr) return '';
    
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // 종일 일정인 경우 시간 표시 제외
    if (isAllDay) {
        return `${year}-${month}-${day}`;
    }
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};