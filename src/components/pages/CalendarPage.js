import Layout from '../common/layout/Layout';
import { useState } from 'react';
import PageTitle from '../common/PageTitle';
import CardBox from '../common/layout/CardBox';
import W3H2Card from '../common/card/W3H2Card';
import { IoMdAdd } from 'react-icons/io';

const ScheduleItem = ({ title, date, type }) => {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg transition-all duration-300
            border border-gray-200 relative overflow-hidden
            border-l-4 border-l-green-500 hover:bg-green-50"
        >
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-green-50/80 to-transparent" />
            <div className="flex flex-col gap-1 relative flex-1">
                <span className="text-sm">{title}</span>
                <span className="text-xs text-gray-500">{date}</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs relative ${
                type === 'sprint' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
            }`}>
                {type === 'sprint' ? '스프린트' : '미팅'}
            </span>
        </div>
    );
};

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
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

            days.push(
                <div key={day} className={`p-2 min-h-[80px] border-t border-l border-gray-100 ${isToday ? 'bg-green-50/30' : ''}`}>
                    <span className={`text-sm ${isToday ? 'text-green-600 font-medium' : 'text-gray-600'}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                        {dayEvents.map((event, index) => (
                            <div 
                                key={index}
                                className={`text-xs p-1.5 rounded-md ${
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
            <PageTitle 
                title="캘린더" 
                description="프로젝트의 주요 일정을 확인할 수 있습니다."
                rightContent={
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1">
                        <IoMdAdd size={20} />
                        일정 추가
                    </button>
                }
            />
            
            <CardBox>
                <W3H2Card 
                    title={`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}
                >
                    <div className="flex h-full gap-6">
                        <div className="flex-1">
                            <div className="grid grid-cols-7 border-r border-b border-gray-100">
                                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                                    <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50/50 border-t border-l border-gray-100">
                                        {day}
                                    </div>
                                ))}
                                {renderCalendar()}
                            </div>
                        </div>
                        <div className="w-80">
                            <h3 className="text-lg font-medium mb-4">My Schedule</h3>
                            <div className="space-y-2">
                                {events.map((event, index) => (
                                    <ScheduleItem
                                        key={index}
                                        title={event.title}
                                        date={event.date}
                                        type={event.type}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </W3H2Card>
            </CardBox>
        </Layout>
    );
};

export default CalendarPage;