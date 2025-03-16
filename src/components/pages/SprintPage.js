import MainLayout from '../layouts/MainLayout';
import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    checkUserIsProjectLeader, 
    getDailyScrumInToday, 
    goOutUserInProject,
    getUsersBacklogs
} from '../../api/projectApi';
import {useUserStore} from '../../store/useUserStore';
import {PieChart} from 'react-minimal-pie-chart';
import PanelBox from "../layouts/PanelBox";
import PageTitle from "../common/PageTitle";
import BacklogCard from "../common/BacklogCard";
import DailyScrumCard from "../common/DailyScrumCard";
import W1H1Panel from "../panels/W1H1Panel";
import {FiSettings, FiLogOut} from 'react-icons/fi';
import W2H1Panel from "../panels/W2H1Panel";
import LargeBoardDailyScrumModal from '../modals/board/LargeBoardDailyScrumModal';
import LargeBoardBacklogModal from '../modals/board/LargeBoardBacklogModal';
import SmallInfoModal from '../modals/info/SmallInfoModal';
import SmallFormModal from '../modals/form/SmallFormModal';

const SprintPage = () => {
    const navigate = useNavigate();
    const {projectId} = useParams();
    const [backlogs, setBacklogs] = useState([]);
    const {user} = useUserStore();
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    
    const [todayDailyScrums, setTodayDailyScrums] = useState([]);
    const [selectedDailyScrum, setSelectedDailyScrum] = useState(null);
    const [isDailyScrumModalOpen, setIsDailyScrumModalOpen] = useState(false);
    
    const [selectedBacklog, setSelectedBacklog] = useState(null);
    const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
    
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const fetchTodayDailyScrums = async () => {
        try {
            const data = await getDailyScrumInToday(projectId);
            setTodayDailyScrums(data);
        } catch (error) {
            console.error('오늘의 데일리 스크럼 목록을 불러오는데 실패했습니다:', error);
            setTodayDailyScrums([]);
        }
    };

    useEffect(() => {
        const fetchBacklogs = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const data = await getUsersBacklogs(projectId, token);
                setBacklogs(data);
            } catch (err) {
                console.error('사용자 백로그 목록을 불러오는데 실패했습니다:', err);
                setBacklogs([]);
            }
        };

        const checkIsLeader = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token && projectId) {
                    const result = await checkUserIsProjectLeader(projectId, token);
                    setIsProjectLeader(result);
                }
            } catch (error) {
                console.error('팀장 권한 확인 중 오류 발생:', error);
                setIsProjectLeader(false);
            }
        };

        fetchBacklogs();
        checkIsLeader();
        fetchTodayDailyScrums();
    }, [projectId]);

    const handleDailyScrumClick = (dailyScrumId) => {
        console.log('데일리 스크럼 클릭:', dailyScrumId);
        const dailyScrum = todayDailyScrums.find(item => item.dailyScrumId === dailyScrumId);
        setSelectedDailyScrum(dailyScrum);
        setIsDailyScrumModalOpen(true);
    };
    
    const handleBacklogClick = (backlogId) => {
        console.log('백로그 클릭:', backlogId);
        const backlog = backlogs.find(item => item.backlogId === backlogId);
        setSelectedBacklog(backlog);
        setIsBacklogModalOpen(true);
    };
    
    const handleDailyScrumModalClose = () => {
        setIsDailyScrumModalOpen(false);
        fetchTodayDailyScrums();
    };
    
    const handleDailyScrumModalSubmit = () => {
        fetchTodayDailyScrums();
    };
    
    const handleBacklogModalClose = () => {
        setIsBacklogModalOpen(false);
        const fetchBacklogs = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const data = await getUsersBacklogs(projectId, token);
                setBacklogs(data);
            } catch (err) {
                console.error('사용자 백로그 목록을 불러오는데 실패했습니다:', err);
            }
        };
        fetchBacklogs();
    };
    
    const handleBacklogModalSubmit = () => {
        const fetchBacklogs = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const data = await getUsersBacklogs(projectId, token);
                setBacklogs(data);
            } catch (err) {
                console.error('사용자 백로그 목록을 불러오는데 실패했습니다:', err);
            }
        };
        fetchBacklogs();
    };
    
    const handleLeaveClick = () => {
        setIsLeaveModalOpen(true);
    };

    const handleLeaveProject = async () => {
        try {
            await goOutUserInProject(projectId);
            
            setIsLeaveModalOpen(false);
            setInfoModal({
                isOpen: true,
                title: '프로젝트 탈퇴',
                message: '프로젝트에서 탈퇴되었습니다.',
                type: 'success'
            });
        } catch (error) {
            console.error('프로젝트 탈퇴 중 오류 발생:', error);
            setIsLeaveModalOpen(false);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: '프로젝트 탈퇴 중 오류가 발생했습니다.',
                type: 'error'
            });
        }
    };

    return (
        <MainLayout showFunctions showSidebar>
            <PageTitle
                title="스프린트 현황"
                description="스프린트의 전반적인 진행 상황을 확인할 수 있습니다."
                rightContent={
                    isProjectLeader ? (
                        <button 
                            onClick={() => navigate(`/projects/${projectId}/sprints/settings`)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiSettings size={20} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleLeaveClick}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="프로젝트 나가기"
                        >
                            <FiLogOut size={20} />
                        </button>
                    )
                }
            />
            <PanelBox>
                <W2H1Panel title="더미패널"></W2H1Panel>

                <W1H1Panel title="나의 달성 현황(더미패널)">
                    <div className="flex items-center justify-center h-full">
                        <div className="w-28 h-28">
                            <PieChart
                                data={[
                                    {title: '완료', value: 60, color: '#22c55e'},
                                    {title: '진행중', value: 30, color: '#3b82f6'},
                                    {title: '예정', value: 10, color: '#e5e7eb'},
                                ]}
                                lineWidth={40}
                                paddingAngle={2}
                                rounded
                            />
                        </div>
                    </div>
                </W1H1Panel>

                <W1H1Panel title="오늘의 Daily Scrum">
                    <div className="space-y-3">
                        {todayDailyScrums.map((scrum) => (
                            <DailyScrumCard
                                key={scrum.dailyScrumId}
                                dailyScrumId={scrum.dailyScrumId}
                                createdAt={scrum.createdAt}
                                userCount={scrum.userCount}
                                backlogCount={scrum.backlogCount}
                                onClick={() => handleDailyScrumClick(scrum.dailyScrumId)}
                            />
                        ))}
                        {todayDailyScrums.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                오늘의 데일리 스크럼이 없습니다.
                            </div>
                        )}
                    </div>
                </W1H1Panel>

                <W2H1Panel title="나의 Backlog">
                    <div className="space-y-3">
                        {backlogs.map((backlog) => (
                            <BacklogCard
                                key={backlog.backlogId}
                                backlogId={backlog.backlogId}
                                sprintOrder={backlog.sprintOrder}
                                backlogName={backlog.title || backlog.backlogName}
                                weight={backlog.weight}
                                completeRate={backlog.completeRate}
                                isFinished={backlog.isFinished}
                                onClick={() => handleBacklogClick(backlog.backlogId)}
                            />
                        ))}
                        {backlogs.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                담당하는 백로그가 없습니다.
                            </div>
                        )}
                    </div>
                </W2H1Panel>
            </PanelBox>
            
            <LargeBoardDailyScrumModal
                isOpen={isDailyScrumModalOpen}
                onClose={handleDailyScrumModalClose}
                dailyScrum={selectedDailyScrum}
                projectId={projectId}
                sprintId={selectedDailyScrum?.sprintId}
                onSubmit={handleDailyScrumModalSubmit}
            />
            
            <LargeBoardBacklogModal
                isOpen={isBacklogModalOpen}
                onClose={handleBacklogModalClose}
                backlog={selectedBacklog}
                projectId={projectId}
                sprintId={selectedBacklog?.sprintId}
                backlogId={selectedBacklog?.backlogId}
                onSubmit={handleBacklogModalSubmit}
            />
            
            <SmallFormModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                title="프로젝트 탈퇴"
                submitText="탈퇴하기"
                cancelText="취소"
                onSubmit={handleLeaveProject}
            >
                <div className="py-4">
                    <p className="text-gray-700 mb-3">정말 프로젝트를 나가시겠습니까?</p>
                    <p className="text-sm text-red-500">그동안의 모든 활동 내역은 삭제됩니다.</p>
                </div>
            </SmallFormModal>

            <SmallInfoModal
                isOpen={infoModal.isOpen}
                onClose={() => {
                    setInfoModal({ ...infoModal, isOpen: false });
                    if (infoModal.type === 'success') {
                        navigate('/');
                    }
                }}
                title={infoModal.title}
                message={infoModal.message}
                type={infoModal.type}
            />
        </MainLayout>
    );
};

export default SprintPage;