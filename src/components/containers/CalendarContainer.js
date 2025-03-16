import React, {useState} from 'react';
import {IoChevronBack, IoChevronForward, IoToday} from "react-icons/io5";

export const CalendarContainer = ({ schedule = [], currentDate, setCurrentDate }) => {

    // 달력 네비게이션 함수들
    const goToPreviousMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const goToNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const changeYear = (year) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(year);
            return newDate;
        });
    };

    // 년도 리스트 생성 (현재 년도 기준 ±5년)
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            years.push(i);
        }
        return years;
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // 이전 달의 날짜들
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 text-gray-400" />)
        }

        // 현재 달의 날짜들 - 클릭 이벤트 제거
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateStr = dateObj.toISOString().split('T')[0];
            
            // schedule이 array인지 확인 후 filter 호출
            const daySchedule = Array.isArray(schedule) 
                ? schedule.filter(schedule => schedule.date === dateStr)
                : [];

            const isToday = new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

            days.push(
                <div
                    key={day}
                    className={`p-2 min-h-[80px] border-t border-l border-gray-100 ${isToday ? 'bg-green-50/30' : ''}`}
                >
                    <span className={`text-sm ${isToday ? 'text-green-600 font-medium' : 'text-gray-600'}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                        {daySchedule.map((schedule) => (
                            <div
                                key={schedule.id}
                                className={`text-xs p-1.5 rounded-md cursor-pointer`}
                                style={{ backgroundColor: schedule.color ? `${schedule.color}33` : '#EFF6FF', color: schedule.color || '#1D4ED8' }}
                            >
                                {schedule.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    // 현재 날짜가 이번 달에 있는지 확인
    const isCurrentMonth = () => {
        const today = new Date();
        return today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
    };

    return (
        <>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="이전 달"
                    >
                        <IoChevronBack size={24}/>
                    </button>

                    <div className="flex items-center gap-2">
                        <select
                            value={currentDate.getFullYear()}
                            onChange={(e) => changeYear(parseInt(e.target.value))}
                            className="bg-transparent border border-gray-200 rounded-md px-2 py-1 text-gray-700"
                        >
                            {generateYearOptions().map(year => (
                                <option key={year} value={year}>{year}년</option>
                            ))}
                        </select>
                        <span className="text-lg font-medium">{currentDate.getMonth() + 1}월</span>
                    </div>

                    <button
                        onClick={goToNextMonth}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        title="다음 달"
                    >
                        <IoChevronForward size={24}/>
                    </button>
                </div>

                <button
                    onClick={goToToday}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1
                                    ${isCurrentMonth() ? 'text-green-600' : 'bg-gray-100 hover:bg-gray-200 transition-colors'}`}
                    disabled={isCurrentMonth()}
                    title="오늘"
                >
                    <IoToday size={16}/>
                    오늘
                </button>
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-7 border-r border-b border-gray-100">
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                        <div key={day}
                             className="p-2 text-center font-medium text-gray-600 bg-gray-50/50 border-t border-l border-gray-100">
                            {day}
                        </div>
                    ))}
                    {renderCalendar()}
                </div>
            </div>
        </>
    );


}