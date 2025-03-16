import MainLayout from '../layouts/MainLayout';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
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

const SprintEachPage = () => {
    const {projectId, sprintId} = useParams();
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

    const fetchBacklogs = async () => {
        try {
            const data = await getSprintBacklogList(projectId, sprintId);
            setBacklogs(data);

            // 현재 선택된 백로그가 있으면 최신 정보로 업데이트
            if (selectedBacklog) {
                const updatedBacklog = data.find(backlog => backlog.backlogId === selectedBacklog.backlogId);
                if (updatedBacklog) {
                    setSelectedBacklog(updatedBacklog);
                }
            }
        } catch (err) {
            console.error('스프린트 백로그 목록을 불러오는데 실패했습니다:', err);
        }
    };

    const fetchDailyScrums = async () => {
        try {
            const data = await getDailyScrumList(projectId, sprintId);
            setDailyScrums(data);
        } catch (err) {
            console.error('데일리 스크럼 목록을 불러오는데 실패했습니다:', err);
        }
    };

    useEffect(() => {
        fetchBacklogs();
        fetchDailyScrums();
    }, [projectId, sprintId]);

    const handleBacklogClick = (backlogId) => {
        console.log('백로그 클릭:', backlogId);
        const backlog = backlogs.find(item => item.backlogId === backlogId);
        setSelectedBacklog(backlog);
        setIsBacklogModalOpen(true);
    };

    const handleDailyScrumClick = (dailyScrumId) => {
        console.log('데일리 스크럼 클릭:', dailyScrumId);
        const dailyScrum = dailyScrums.find(item => item.dailyScrumId === dailyScrumId);
        setSelectedDailyScrum(dailyScrum);
        setIsDailyScrumModalOpen(true);
    };

    const handleAddBacklogClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleAddDailyScrumClick = () => {
        // 데일리 스크럼 생성 모달 열기
        setIsDailyScrumCreateModalOpen(true);
    };

    const handleCreateDailyScrum = async () => {
        try {
            // 데일리 스크럼 생성 API 호출
            await addDailyScrumToSprint(projectId, sprintId);
            
            // 생성 모달 닫기
            setIsDailyScrumCreateModalOpen(false);
            
            // 성공 메시지 표시
            setInfoMessage('데일리 스크럼이 생성되었습니다.');
            setInfoType('success');
            setIsInfoModalOpen(true);
        } catch (error) {
            console.error('데일리 스크럼 생성 중 오류가 발생했습니다:', error);
            
            // 오류 메시지 표시
            setInfoMessage('데일리 스크럼 생성에 실패했습니다.');
            setInfoType('error');
            setIsInfoModalOpen(true);
        }
    };

    const handleInfoModalClose = () => {
        setIsInfoModalOpen(false);
        // 데일리 스크럼 목록 새로고침
        fetchDailyScrums();
    };

    const handleCreateBacklog = async (data) => {
        try {
            await addBacklogToSprint(projectId, sprintId, data.title, data.weight);
            setIsCreateModalOpen(false);
            fetchBacklogs(); // 백로그 목록 새로고침
        } catch (error) {
            console.error('백로그 추가 중 오류가 발생했습니다:', error);
        }
    };

    const handleDailyScrumModalSubmit = (data) => {
        // 여기에 데일리 스크럼 모달 제출 시 로직 추가
        console.log('데일리 스크럼 데이터 저장:', data);
        setIsDailyScrumModalOpen(false);
        fetchDailyScrums(); // 데일리 스크럼 목록 새로고침
    };

    // 백로그 모달 제출 시 처리 함수
    const handleBacklogModalSubmit = (data) => {
        console.log('백로그 데이터 제출:', data);
        // 모달을 닫지 않고 백로그 목록만 새로고침
        fetchBacklogs();
    };

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    return (
        <MainLayout showFunctions showSidebar>
            <PageTitle title="스프린트 상세" />
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

            <LargeBoardBacklogModal
                isOpen={isBacklogModalOpen}
                onClose={() => {
                    setIsBacklogModalOpen(false);
                    fetchBacklogs(); // 모달이 닫힐 때도 백로그 목록 새로고침
                }}
                backlog={selectedBacklog}
                projectId={projectId}
                sprintId={sprintId}
                backlogId={selectedBacklog?.backlogId}
                onSubmit={handleBacklogModalSubmit}
            />

            <LargeBoardDailyScrumModal
                isOpen={isDailyScrumModalOpen}
                onClose={() => setIsDailyScrumModalOpen(false)}
                dailyScrum={selectedDailyScrum}
                projectId={projectId}
                sprintId={sprintId}
                onSubmit={handleDailyScrumModalSubmit}
            />
        </MainLayout>
    );
};

export default SprintEachPage;