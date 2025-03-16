import React from 'react';

export const ScheduleCard = ({ schedule, onClick }) => {
    const isSprint = schedule.scheduleType === 'SPRINT';
    
    return (
        <div
            className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300
                border border-gray-200 relative overflow-hidden w-full
                border-l-4 border-l-green-500 
                ${isSprint ? 'opacity-90' : 'hover:bg-green-50 cursor-pointer'}`}
            onClick={onClick}
        >
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-green-50/80 to-transparent"/>
            <div className="flex flex-col gap-1 relative flex-1">
                <span className="text-sm">{schedule.title}</span>
                <span className="text-xs text-gray-500">{schedule.startTime}</span>
                <span className="text-xs text-gray-500">{schedule.endTime}</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs relative ${
                isSprint
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
            }`}>
                {isSprint ? '스프린트' : '일정'}
            </span>
        </div>
    );
}