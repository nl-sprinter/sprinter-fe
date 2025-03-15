import MainLayout from '../layouts/MainLayout';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageTitle from '../common/PageTitle';
import PanelBox from '../layouts/PanelBox';
import W3H2Panel from '../panels/W3H2Panel';
import { IoMdAdd } from 'react-icons/io';
import { IoChevronBack, IoChevronForward, IoToday } from 'react-icons/io5';
import MiddleFormScheduleCreateEditModal from '../modals/form/MiddleFormScheduleCreateEditModal';

const ScheduleItem = ({ title, date, type, onClick }) => {
    return (
        <div 
            className="flex items-center justify-between p-2 rounded-lg transition-all duration-300
                border border-gray-200 relative overflow-hidden
                border-l-4 border-l-green-500 hover:bg-green-50 cursor-pointer"
            onClick={onClick}
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
                {type === 'sprint' ? '스프린트' : '일정'}
            </span>
        </div>
    );
};

const CalendarPage = () => {
    // URL에서 projectId 가져오기
    const { projectId } = useParams();

    // 캘린더 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([
        {
            id: 1,
            date: '2024-03-15',
            title: '더미일정1',
            type: 'sprint',
            color: '#4ADE80'
        },
        {
            id: 2,
            date: '2024-03-16',
            title: '더미일정2',
            type: 'sprint',
            color: '#4ADE80'
        },
        {
            id: 3,
            date: '2024-03-20',
            title: '더미일정3',
            type: 'meeting',
            color: '#60A5FA'
        }
    ]);
    
    // 선택된 이벤트 상태
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchSchedules = async () => {

    }


    // 일정 추가 모달 열기
    const openAddEventModal = async () => {
        setSelectedSchedule(null);
        setIsAddModalOpen(true);
    };
    
    // 일정 추가/편집 처리
    const handleAddEditEvent = (scheduleData) => {
        // api 호출
        console.log('[debug] CalendarPage - handleAddEditEvent 호출됨', scheduleData);
        
        // 모달 닫기
        setIsAddModalOpen(false);
    };

    // 모달 닫기 함수 수정
    const handleCloseModal = () => {
        console.log('[debug] CalendarPage - handleCloseModal 호출됨');
        setIsAddModalOpen(false);
        setSelectedSchedule(null); // 선택된 이벤트 초기화
        fetchSchedules();
    };

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
            const dayEvents = events.filter(event => event.date === dateStr);
            
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
                        {dayEvents.map((schedule) => (
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
        <MainLayout showFunctions showSidebar>
            <PageTitle 
                title="캘린더" 
                description="프로젝트의 주요 일정을 확인할 수 있습니다."
                rightContent={
                    <button 
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                        onClick={() => openAddEventModal()}
                    >
                        <IoMdAdd size={20} />
                        일정 추가
                    </button>
                }
            />
            
            <PanelBox>
                <W3H2Panel
                    title={
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={goToPreviousMonth}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    title="이전 달"
                                >
                                    <IoChevronBack size={24} />
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
                                    <IoChevronForward size={24} />
                                </button>
                            </div>
                            
                            <button 
                                onClick={goToToday}
                                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1
                                    ${isCurrentMonth() ? 'text-green-600' : 'bg-gray-100 hover:bg-gray-200 transition-colors'}`}
                                disabled={isCurrentMonth()}
                                title="오늘"
                            >
                                <IoToday size={16} />
                                오늘
                            </button>
                        </div>
                    }
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
                                {events.map((event) => (
                                    <ScheduleItem
                                        key={event.id}
                                        title={event.title}
                                        date={event.date}
                                        type={event.type}
                                    />
                                ))}
                                {events.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        등록된 일정이 없습니다
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </W3H2Panel>
            </PanelBox>
            
            {/* 일정 추가/편집 모달 수정 */}
            <MiddleFormScheduleCreateEditModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                projectId={projectId}
                schedule={selectedSchedule}
                onSubmit={handleAddEditEvent}
            />
        </MainLayout>
    );
};

export default CalendarPage;