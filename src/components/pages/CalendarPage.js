import MainLayout from '../layouts/MainLayout';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    const { projectId, scheduleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

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
    }, [fetchSchedules, currentDate, projectId]); // fetchSchedules 의존성 추가

    // URL에서 scheduleId가 변경될 때 모달 상태 업데이트
    useEffect(() => {
        if (scheduleId && schedule.length > 0) {
            const scheduleIdInt = parseInt(scheduleId);
            const foundSchedule = schedule.find(item => item.id === scheduleIdInt);
            
            if (foundSchedule) {
                console.log(`스케줄 ID ${scheduleId}에 해당하는 모달 열기`);
                handleScheduleClick(foundSchedule);
            } else {
                console.log(`스케줄 ID ${scheduleId}를 찾을 수 없음, 상세 정보 조회 시도`);
                // 현재 로드된 스케줄 목록에 없는 경우 API로 직접 조회 시도
                fetchScheduleById(scheduleIdInt);
            }
        } else if (!scheduleId) {
            console.log('스케줄 모달 닫기');
            setIsAddModalOpen(false);
        }
    }, [scheduleId, schedule, projectId]);

    // 스케줄 ID로 직접 조회하는 함수
    const fetchScheduleById = async (id) => {
        try {
            const detailedSchedule = await getScheduleByScheduleId(id);
            if (detailedSchedule) {
                const completeSchedule = {
                    ...detailedSchedule,
                    id: id
                };
                setSelectedSchedule(completeSchedule);
                setIsAddModalOpen(true);
            } else {
                // 존재하지 않는 스케줄 ID인 경우 기본 URL로 리다이렉트
                navigate(`/projects/${projectId}/calendar`, { replace: true });
            }
        } catch (error) {
            console.error('스케줄 상세 정보 조회 실패:', error);
            navigate(`/projects/${projectId}/calendar`, { replace: true });
        }
    };

    // 일정 추가 모달 열기
    const openAddScheduleModal = useCallback(() => {
        setSelectedSchedule(null);
        setIsAddModalOpen(true);
    }, []);
    
    // 스케줄 클릭 처리
    const handleScheduleClick = useCallback(async (schedule) => {
        if (schedule.scheduleType === 'SPRINT') {
            // 스프린트 타입은 클릭 처리하지 않음
            return;
        }
        
        // URL 변경
        navigate(`/projects/${projectId}/calendar/schedule/${schedule.id}`);
        
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
    }, [projectId, navigate]);
    
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
            handleCloseModal();
            
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
            handleCloseModal();
            
            // 일정 목록 새로고침
            fetchSchedules();
        } catch (error) {
            console.error('일정 삭제 실패:', error);
        }
    };

    // 모달 닫기 함수 수정
    const handleCloseModal = () => {
        // URL 변경
        navigate(`/projects/${projectId}/calendar`);
        setIsAddModalOpen(false);
        setSelectedSchedule(null); // 선택된 이벤트 초기화
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