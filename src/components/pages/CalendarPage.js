import MainLayout from '../layouts/MainLayout';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PageTitle from '../common/PageTitle';
import PanelBox from '../layouts/PanelBox';
import { IoMdAdd } from 'react-icons/io';
import MiddleFormScheduleCreateEditModal from '../modals/form/MiddleFormScheduleCreateEditModal';
import { 
    getScheduleList, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule,
    getScheduleByScheduleId 
} from '../../api/projectApi';
import {MyScheduleContainer} from "../containers/MyScheduleContainer";
import W2H2Panel from "../panels/W2H2Panel";
import W1H2Panel from "../panels/W1H2Panel";
import {CalendarContainer} from "../containers/CalendarContainer";

const CalendarPage = () => {
    const { projectId } = useParams();

    // 캘린더 상태
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedule, setSchedule] = useState([]);
    
    // 선택된 이벤트 상태
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // useCallback으로 fetchSchedules 함수 메모이제이션
    const fetchSchedules = useCallback(async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // JavaScript는 0부터 시작하므로 +1
            const scheduleData = await getScheduleList(projectId, year, month);

            // API 응답이 null 또는 undefined인 경우 빈 배열로 처리
            setSchedule(Array.isArray(scheduleData) ? scheduleData : []);
        } catch (error) {
            console.error('일정 조회 실패:', error);
            setSchedule([]); // 오류 발생 시 빈 배열로 초기화
        }
    }, [projectId, currentDate]); // user 의존성 제거

    // currentDate나 projectId가 변경될 때만 일정 조회
    useEffect(() => {
        fetchSchedules();
    }, [ currentDate, projectId]); // fetchSchedules 의존성 제거

    // 일정 추가 모달 열기
    const openAddScheduleModal = useCallback(() => {
        setSelectedSchedule(null);
        setIsAddModalOpen(true);
    }, []);
    
    // 스케줄 클릭 처리
    const handleScheduleClick = useCallback(async (schedule) => {
        try {
            const detailedSchedule = await getScheduleByScheduleId(schedule.id);
            const completeSchedule = {
                ...detailedSchedule,
                id: schedule.id
            };
            setSelectedSchedule(completeSchedule);
            setIsAddModalOpen(true);
        } catch (error) {
            console.error('스케줄 상세 정보 조회 실패:', error);
            setSelectedSchedule(schedule);
            setIsAddModalOpen(true);
        }
    }, []);
    
    // currentDate 설정 함수 메모이제이션
    const handleSetCurrentDate = useCallback((date) => {
        setCurrentDate(date);
    }, []);

    // 스케줄 수정 처리
    const handleAddEditSchedule = async (scheduleData) => {
        try {
            if (selectedSchedule) {
                // 수정 모드
                await updateSchedule(projectId, selectedSchedule.id, scheduleData);
            } else {
                // 추가 모드
                await addSchedule(scheduleData, projectId);
            }
            
            // 모달 닫기
            setIsAddModalOpen(false);
            
            // 일정 목록 새로고침
            fetchSchedules();
        } catch (error) {
            console.error('일정 저장 실패:', error);
        }
    };
    
    // 스케줄 삭제 처리
    const handleDeleteSchedule = async () => {
        if (!selectedSchedule) return;
        
        try {
            await deleteSchedule(projectId, selectedSchedule.id);
            
            // 모달 닫기
            setIsAddModalOpen(false);
            
            // 일정 목록 새로고침
            fetchSchedules();
        } catch (error) {
            console.error('일정 삭제 실패:', error);
        }
    };

    // 모달 닫기 함수 수정
    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setSelectedSchedule(null); // 선택된 이벤트 초기화
        fetchSchedules();
    };

    return (
        <MainLayout showFunctions showSidebar>
            <PageTitle 
                title="캘린더" 
                description="프로젝트의 주요 일정을 확인할 수 있습니다."
            />

            <PanelBox>
                <W2H2Panel
                    title={'달력'}
                    headerRight={
                        <div className="w-8 h-8 opacity-0">
                            <IoMdAdd size={20} />
                        </div>
                    }
                >
                    <CalendarContainer
                        schedule={schedule}
                        currentDate={currentDate}
                        setCurrentDate={handleSetCurrentDate}
                        onScheduleClick={handleScheduleClick}
                    />

                </W2H2Panel>
                <W1H2Panel
                    headerRight={
                        <button
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            onClick={openAddScheduleModal}
                        >
                            <IoMdAdd size={20} />
                        </button>
                    }
                    title={'스케줄'}
                >
                    <MyScheduleContainer 
                        schedule={schedule} 
                        onScheduleClick={handleScheduleClick}
                    />
                </W1H2Panel>
            </PanelBox>

            {/* 일정 추가/편집 모달 수정 */}
            <MiddleFormScheduleCreateEditModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                projectId={projectId}
                schedule={selectedSchedule}
                onSubmit={handleAddEditSchedule}
                onDelete={handleDeleteSchedule}
            />
        </MainLayout>
    );
};

export default CalendarPage;