import Layout from '../common/Layout';
import { useState } from 'react';

const CalendarPage = () => {
    const [currentDate] = useState(new Date());
    const [events] = useState([
        {
            date: '2024-03-15',
            title: '스프린트 1 종료',
            type: 'sprint',
        },
        {
            date: '2024-03-16',
            title: '스프린트 2 시작',
            type: 'sprint',
        },
        {
            date: '2024-03-20',
            title: '백로그 검토',
            type: 'meeting',
        }
    ]);

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
            days.push(<div key={`empty-${i}`} className="p-2 text-gray-400" />);
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.date === date);

            days.push(
                <div key={day} className="p-2 min-h-[100px] border border-gray-100">
                    <span className="text-sm text-gray-600">{day}</span>
                    <div className="mt-1 space-y-1">
                        {dayEvents.map((event, index) => (
                            <div 
                                key={index}
                                className={`text-xs p-1 rounded ${
                                    event.type === 'sprint' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                }`}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <Layout showFunctions showSidebar>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">캘린더</h1>
                    <p className="text-gray-600">프로젝트의 주요 일정을 확인할 수 있습니다.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                        </h2>
                        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            일정 추가
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                            <div key={day} className="bg-gray-50 p-2 text-center font-medium">
                                {day}
                            </div>
                        ))}
                        {renderCalendar()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CalendarPage;