import React, {useState, useMemo} from 'react';
import {IoChevronBack, IoChevronForward, IoToday} from "react-icons/io5";

// 파스텔 색상 배열 정의
const PASTEL_COLORS = [
    'rgba(176, 224, 230, 0.3)', // 연한 하늘
    'rgba(152, 251, 152, 0.3)', // 연한 초록
    'rgba(173, 216, 230, 0.3)', // 연한 파랑
    'rgba(255, 182, 193, 0.3)', // 연한 핑크
    'rgba(255, 228, 225, 0.3)', // 연한 살구
    'rgba(255, 218, 185, 0.3)', // 연한 복숭아
    'rgba(221, 160, 221, 0.3)', // 연한 자주
    'rgba(255, 255, 224, 0.3)', // 연한 노랑
    'rgba(240, 230, 140, 0.3)', // 연한 카키
    'rgba(230, 230, 250, 0.3)', // 연한 라벤더
];

export const CalendarContainer = ({schedule = [], currentDate, setCurrentDate, onScheduleClick}) => {
    // 스프린트 ID별 색상 매핑을 위한 상태
    const [sprintColorMap] = useState({});

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

    // 스프린트 ID에 대한 일관된 색상 가져오기
    const getSprintColor = (sprintId) => {
        if (!sprintColorMap[sprintId]) {
            // 새 스프린트 ID에 대해 랜덤 파스텔 색상 할당
            sprintColorMap[sprintId] = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
        }
        return sprintColorMap[sprintId];
    };

    // 색상 매핑 함수 추가
    const getColorByEnum = (colorEnum) => {
        const colorMap = {
            RED: { bg: 'rgba(255, 99, 71, 0.3)', text: '#C53030' },
            ORANGE: { bg: 'rgba(255, 165, 0, 0.3)', text: '#C05621' },
            YELLOW: { bg: 'rgba(255, 215, 0, 0.3)', text: '#B7791F' },
            GREEN: { bg: 'rgba(46, 204, 113, 0.3)', text: '#2F855A' },
            BLUE: { bg: 'rgba(52, 152, 219, 0.3)', text: '#2B6CB0' },
            NAVY: { bg: 'rgba(25, 118, 210, 0.3)', text: '#1E40AF' },
            PURPLE: { bg: 'rgba(155, 89, 182, 0.3)', text: '#6B46C1' }
        };
        
        return colorEnum && colorMap[colorEnum] 
            ? colorMap[colorEnum] 
            : { bg: 'rgba(226, 232, 240, 0.3)', text: '#4A5568' };
    };

    // 날짜가 스케줄의 시작일과 종료일 사이에 있는지 확인
    const isDateInScheduleRange = (dateStr, schedule) => {
        if (!schedule.startTime || !schedule.endTime) return false;
        
        // 날짜 문자열에서 년, 월, 일만 추출
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
        
        // 스케줄 시작/종료 시간에서 년, 월, 일만 추출
        const startDateStr = schedule.startTime.split('T')[0];
        const endDateStr = schedule.endTime.split('T')[0];
        
        const [startYear, startMonth, startDay] = startDateStr.split('-').map(num => parseInt(num, 10));
        const [endYear, endMonth, endDay] = endDateStr.split('-').map(num => parseInt(num, 10));
        
        // 날짜 비교를 위한 숫자 변환 (YYYYMMDD 형식)
        const dateNum = year * 10000 + month * 100 + day;
        const startDateNum = startYear * 10000 + startMonth * 100 + startDay;
        const endDateNum = endYear * 10000 + endMonth * 100 + endDay;
        
        return dateNum >= startDateNum && dateNum <= endDateNum;
    };

    // 날짜가 스케줄의 시작일인지 확인하는 함수 추가
    const isDateStartOfSchedule = (dateStr, schedule) => {
        if (!schedule.startTime) return false;
        
        // 날짜 문자열에서 년, 월, 일만 추출
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
        
        // 스케줄 시작 시간에서 년, 월, 일만 추출
        const startDateStr = schedule.startTime.split('T')[0];
        const [startYear, startMonth, startDay] = startDateStr.split('-').map(num => parseInt(num, 10));
        
        // 년, 월, 일이 모두 일치하는지 확인
        return year === startYear && month === startMonth && day === startDay;
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // 이전 달의 날짜들
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 text-gray-400 border-t border-l border-gray-200"/>)
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            // 날짜 문자열 생성 (YYYY-MM-DD 형식)
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const dayStr = day.toString().padStart(2, '0');
            const dateStr = `${year}-${month}-${dayStr}`;
            
            // 해당 날짜에 해당하는 스케줄 필터링
            const daySchedules = Array.isArray(schedule)
                ? schedule.filter(s => isDateInScheduleRange(dateStr, s))
                : [];

            // SPRINT 타입 스케줄 분리
            const sprintSchedules = daySchedules.filter(s => s.scheduleType === 'SPRINT');
            const normalSchedules = daySchedules.filter(s => s.scheduleType !== 'SPRINT');

            const isToday = new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

            // SPRINT 배경 스타일 계산
            const sprintBackgroundStyle = sprintSchedules.length > 0
                ? {backgroundColor: getSprintColor(sprintSchedules[0].id)}
                : {};

            days.push(
                <div
                    key={day}
                    className={`p-2 min-h-[80px] border-t border-l border-gray-200 relative 
                    ${isToday ? 'bg-green-50/50 ring-2 ring-green-200 ring-inset' : ''}`}
                    style={sprintBackgroundStyle}
                >
                    <span className={`text-sm ${isToday ? 'text-green-600 font-bold' : 'text-gray-600'}`}>{day}</span>

                    {/* SPRINT 타입 표시 (시작일에만 표시) */}
                    {sprintSchedules.some(s => isDateStartOfSchedule(dateStr, s)) && (
                        <span className="text-xs bg-green-100 text-green-700 rounded-md ml-1 p-1">
                                {sprintSchedules[0].title || ''}
                        </span>
                    )}

                    {/* 일반 스케줄 표시 */}
                    <div className="mt-1 space-y-1">
                        {normalSchedules.map((schedule) => {
                            const colorStyle = getColorByEnum(schedule.scheduleColor);
                            return (
                                <div
                                    key={schedule.id}
                                    className="text-xs p-1 rounded-md cursor-pointer text-[11px]"
                                    style={{
                                        backgroundColor: colorStyle.bg,
                                        color: colorStyle.text
                                    }}
                                    onClick={() => onScheduleClick && onScheduleClick(schedule)}
                                >
                                    {schedule.title}
                                </div>
                            );
                        })}
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
            <div className="flex justify-between items-center mb-4 ">
                <div className="flex items-center gap-3">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                        title="이전 달"
                    >
                        <IoChevronBack size={20}/>
                    </button>

                    <div className="flex items-center gap-2">
                        <select
                            value={currentDate.getFullYear()}
                            onChange={(e) => changeYear(parseInt(e.target.value))}
                            className="bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-700 text-sm"
                        >
                            {generateYearOptions().map(year => (
                                <option key={year} value={year}>{year}년</option>
                            ))}
                        </select>
                        <span className="text-lg font-medium">{currentDate.getMonth() + 1}월</span>
                    </div>

                    <button
                        onClick={goToNextMonth}
                        className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                        title="다음 달"
                    >
                        <IoChevronForward size={20}/>
                    </button>
                </div>

                <button
                    onClick={goToToday}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1
                                    ${isCurrentMonth() ? 'text-green-600' : 'bg-white hover:bg-gray-100 transition-colors shadow-sm'}`}
                    disabled={isCurrentMonth()}
                    title="오늘"
                >
                    <IoToday size={16}/>
                    오늘
                </button>
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                        <div key={day}
                             className="p-2 text-center font-medium text-gray-600 bg-gray-50/50 border-b border-gray-200">
                            {day}
                        </div>
                    ))}
                    {renderCalendar()}
                </div>
            </div>
        </>
    );
}