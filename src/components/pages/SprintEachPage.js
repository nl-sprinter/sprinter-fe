import MainLayout from '../layouts/MainLayout';
import {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate } from 'react-router-dom';
import {getSprintBacklogList, addBacklogToSprint, getDailyScrumList, addDailyScrumToSprint} from '../../api/projectApi';
import {IoMdAdd} from 'react-icons/io';
import PanelBox from "../layouts/PanelBox";
import PageTitle from "../common/PageTitle";
import DailyScrumCard from "../common/DailyScrumCard";
import BacklogCard from "../common/BacklogCard";
import W1H1Panel from "../panels/W1H1Panel";
import W2H1Panel from "../panels/W2H1Panel";
import SmallFormDailyScrumCreateModal from '../modals/form/SmallFormDailyScrumCreateModal';
import SmallInfoModal from '../modals/info/SmallInfoModal';
import LargeBoardBacklogModal from '../modals/board/LargeBoardBacklogModal';
import LargeBoardDailyScrumModal from '../modals/board/LargeBoardDailyScrumModal';
import SmallFormBacklogCreateEditModal from "../modals/form/SmallFormBacklogCreateEditModal";
import { useProjectNavigationStore } from '../../store/useProjectNavigationStore';
import { getSprintList } from '../../api/projectApi';

const SprintEachPage = () => {
    const {projectId, sprintId, backlogId, dailyScrumId} = useParams();
    const navigate = useNavigate();

    // API 호출 중복 방지를 위한 ref
    const isLoadingBacklogs = useRef(false);
    const isLoadingDailyScrums = useRef(false);
    
    const [backlogs, setBacklogs] = useState([]);
    const [dailyScrums, setDailyScrums] = useState([]);
    const [selectedBacklog, setSelectedBacklog] = useState(null);
    const [selectedDailyScrum, setSelectedDailyScrum] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDailyScrumModalOpen, setIsDailyScrumModalOpen] = useState(false);
    const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
    const [isDailyScrumCreateModalOpen, setIsDailyScrumCreateModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    const [infoType, setInfoType] = useState('success');
    const [sprintOrder, setSprintOrder] = useState(null);

    // 스프린트 정보 가져오기
    useEffect(() => {
        if (projectId && sprintId) {
            // 프로젝트 네비게이션 스토어에서 스프린트 목록 가져오기
            const { sprints } = useProjectNavigationStore.getState();
            
            // 현재 스프린트 ID에 해당하는 스프린트 찾기
            const currentSprint = sprints.find(sprint => sprint.sprintId === parseInt(sprintId));
            
            if (currentSprint) {
                setSprintOrder(currentSprint.sprintOrder);
            } else {
                // 스토어에 스프린트 정보가 없으면 다시 불러오기
                const fetchSprintInfo = async () => {
                    try {
                        const sprintList = await getSprintList(projectId);
                        const sprint = sprintList.find(s => s.sprintId === parseInt(sprintId));
                        if (sprint) {
                            setSprintOrder(sprint.sprintOrder);
                        }
                    } catch (error) {
                        console.error('스프린트 정보를 불러오는데 실패했습니다:', error);
                    }
                };
                
                fetchSprintInfo();
            }
        }
    }, [projectId, sprintId]);

    // 백로그 데이터 로드
    const fetchBacklogs = async () => {
        // 이미 로딩 중이면 중복 호출 방지
        if (isLoadingBacklogs.current) return;
        
        try {
            isLoadingBacklogs.current = true;
            console.log('백로그 목록 로드 시작');
            
            const data = await getSprintBacklogList(projectId, sprintId);
            setBacklogs(data);
            
            console.log('백로그 목록 로드 완료');
        } catch (err) {
            console.error('스프린트 백로그 목록을 불러오는데 실패했습니다:', err);
        } finally {
            isLoadingBacklogs.current = false;
        }
    };

    // 데일리 스크럼 데이터 로드
    const fetchDailyScrums = async () => {
        // 이미 로딩 중이면 중복 호출 방지
        if (isLoadingDailyScrums.current) return;
        
        try {
            isLoadingDailyScrums.current = true;
            console.log('데일리 스크럼 목록 로드 시작');
            
            const data = await getDailyScrumList(projectId, sprintId);
            setDailyScrums(data);
            
            console.log('데일리 스크럼 목록 로드 완료');
        } catch (err) {
            console.error('데일리 스크럼 목록을 불러오는데 실패했습니다:', err);
        } finally {
            isLoadingDailyScrums.current = false;
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        if (projectId && sprintId) {
            fetchBacklogs();
            fetchDailyScrums();
        }
    }, [projectId, sprintId]);

    // URL에서 backlogId가 변경될 때 모달 상태 업데이트
    useEffect(() => {
        if (backlogId && backlogs.length > 0) {
            const backlogIdInt = parseInt(backlogId);
            const backlog = backlogs.find(item => item.backlogId === backlogIdInt);
            
            if (backlog) {
                console.log(`백로그 ID ${backlogId}에 해당하는 모달 열기`);
                setSelectedBacklog(backlog);
                setIsBacklogModalOpen(true);
            } else {
                console.log(`백로그 ID ${backlogId}를 찾을 수 없음`);
                // 존재하지 않는 백로그 ID인 경우 기본 URL로 리다이렉트
                navigate(`/projects/${projectId}/sprints/${sprintId}`, { replace: true });
            }
        } else if (!backlogId) {
            console.log('백로그 모달 닫기');
            setIsBacklogModalOpen(false);
        }
    }, [backlogId, backlogs, projectId, sprintId, navigate]);

    // URL에서 dailyScrumId가 변경될 때 모달 상태 업데이트
    useEffect(() => {
        if (dailyScrumId && dailyScrums.length > 0) {
            const dailyScrumIdInt = parseInt(dailyScrumId);
            const dailyScrum = dailyScrums.find(item => item.dailyScrumId === dailyScrumIdInt);
            
            if (dailyScrum) {
                console.log(`데일리 스크럼 ID ${dailyScrumId}에 해당하는 모달 열기`);
                setSelectedDailyScrum(dailyScrum);
                setIsDailyScrumModalOpen(true);
            } else {
                console.log(`데일리 스크럼 ID ${dailyScrumId}를 찾을 수 없음`);
                // 존재하지 않는 데일리 스크럼 ID인 경우 기본 URL로 리다이렉트
                navigate(`/projects/${projectId}/sprints/${sprintId}`, { replace: true });
            }
        } else if (!dailyScrumId) {
            console.log('데일리 스크럼 모달 닫기');
            setIsDailyScrumModalOpen(false);
        }
    }, [dailyScrumId, dailyScrums, projectId, sprintId, navigate]);

    // 선택된 백로그 업데이트
    useEffect(() => {
        if (selectedBacklog && backlogs.length > 0) {
            const updatedBacklog = backlogs.find(backlog => backlog.backlogId === selectedBacklog.backlogId);
            if (updatedBacklog && JSON.stringify(updatedBacklog) !== JSON.stringify(selectedBacklog)) {
                console.log('선택된 백로그 정보 업데이트');
                setSelectedBacklog(updatedBacklog);
            }
        }
    }, [backlogs, selectedBacklog]);

    const handleBacklogClick = (backlogId) => {
        console.log('백로그 클릭:', backlogId);
        navigate(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}`);
    };

    const handleDailyScrumClick = (dailyScrumId) => {
        console.log('데일리 스크럼 클릭:', dailyScrumId);
        navigate(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}`);
    };

    const handleAddBacklogClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleAddDailyScrumClick = () => {
        setIsDailyScrumCreateModalOpen(true);
    };

    const handleCreateDailyScrum = async () => {
        try {
            await addDailyScrumToSprint(projectId, sprintId);
            setIsDailyScrumCreateModalOpen(false);
            setInfoMessage('데일리 스크럼이 생성되었습니다.');
            setInfoType('success');
            setIsInfoModalOpen(true);
        } catch (error) {
            console.error('데일리 스크럼 생성 중 오류가 발생했습니다:', error);
            setInfoMessage('데일리 스크럼 생성에 실패했습니다.');
            setInfoType('error');
            setIsInfoModalOpen(true);
        }
    };

    const handleInfoModalClose = () => {
        setIsInfoModalOpen(false);
        fetchDailyScrums();
    };

    const handleCreateBacklog = async (data) => {
        try {
            await addBacklogToSprint(projectId, sprintId, data.title, data.weight);
            setIsCreateModalOpen(false);
            fetchBacklogs();
        } catch (error) {
            console.error('백로그 추가 중 오류가 발생했습니다:', error);
        }
    };

    const handleDailyScrumModalSubmit = (data) => {
        console.log('데일리 스크럼 데이터 저장:', data);
        fetchDailyScrums();
    };

    const handleBacklogModalSubmit = (data) => {
        console.log('백로그 데이터 제출:', data);
        fetchBacklogs();
    };

    const handleCloseBacklogModal = () => {
        console.log('백로그 모달 닫기 요청');
        navigate(`/projects/${projectId}/sprints/${sprintId}`);
    };

    const handleCloseDailyScrumModal = () => {
        console.log('데일리 스크럼 모달 닫기 요청');
        navigate(`/projects/${projectId}/sprints/${sprintId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    // 백로그 모달 렌더링 조건
    const shouldRenderBacklogModal = backlogId && selectedBacklog && isBacklogModalOpen;
    
    // 데일리 스크럼 모달 렌더링 조건
    const shouldRenderDailyScrumModal = dailyScrumId && selectedDailyScrum && isDailyScrumModalOpen;

    return (
        <MainLayout showFunctions showSidebar>
            <PageTitle title={`Sprint ${sprintOrder || ''} 상세`} />
            <PanelBox>
                <W2H1Panel
                    title="Sprint Backlog"
                    headerRight={
                        <>
                            <button
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                onClick={handleAddBacklogClick}
                            >
                                <IoMdAdd size={20}/>
                            </button>
                        </>
                    }
                >
                    <div className="space-y-3">
                        {backlogs.map((backlog) => (
                            <BacklogCard
                                key={backlog.backlogId}
                                backlogId={backlog.backlogId}
                                sprintOrder={backlog.sprintOrder}
                                backlogName={backlog.title}
                                weight={backlog.weight}
                                completeRate={backlog.completeRate}
                                isFinished={backlog.isFinished}
                                onClick={() => handleBacklogClick(backlog.backlogId)}
                            />
                        ))}
                        {backlogs.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                백로그가 없습니다.
                            </div>
                        )}
                    </div>
                </W2H1Panel>

                <W1H1Panel
                    title="Daily Scrum"
                    headerRight={
                        <button 
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            onClick={handleAddDailyScrumClick}
                        >
                            <IoMdAdd size={20}/>
                        </button>
                    }
                >
                    <div className="space-y-3">
                        {dailyScrums.map((scrum) => (
                            <DailyScrumCard
                                key={scrum.dailyScrumId}
                                dailyScrumId={scrum.dailyScrumId}
                                createdAt={formatDate(scrum.createdAt)}
                                userCount={scrum.userCount}
                                backlogCount={scrum.backlogCount}
                                onClick={() => handleDailyScrumClick(scrum.dailyScrumId)}
                            />
                        ))}
                        {dailyScrums.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                데일리 스크럼이 없습니다.
                            </div>
                        )}
                    </div>
                </W1H1Panel>
            </PanelBox>

            <SmallFormBacklogCreateEditModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateBacklog}
                actionText='생성'
            />

            <SmallFormDailyScrumCreateModal
                isOpen={isDailyScrumCreateModalOpen}
                onClose={() => setIsDailyScrumCreateModalOpen(false)}
                onSubmit={handleCreateDailyScrum}
            />

            <SmallInfoModal
                isOpen={isInfoModalOpen}
                onClose={handleInfoModalClose}
                message={infoMessage}
                type={infoType}
            />

            {/* 백로그 모달은 조건을 더 엄격하게 검사 */}
            {shouldRenderBacklogModal && (
                <LargeBoardBacklogModal
                    isOpen={true}
                    onClose={handleCloseBacklogModal}
                    backlog={selectedBacklog}
                    projectId={projectId}
                    sprintId={sprintId}
                    backlogId={selectedBacklog.backlogId}
                    onSubmit={handleBacklogModalSubmit}
                />
            )}

            {/* 데일리 스크럼 모달도 조건을 엄격하게 검사 */}
            {shouldRenderDailyScrumModal && (
                <LargeBoardDailyScrumModal
                    isOpen={true}
                    onClose={handleCloseDailyScrumModal}
                    dailyScrum={selectedDailyScrum}
                    projectId={projectId}
                    sprintId={sprintId}
                    onSubmit={handleDailyScrumModalSubmit}
                />
            )}
        </MainLayout>
    );
};

export default SprintEachPage;