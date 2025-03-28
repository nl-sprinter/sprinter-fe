import MainLayout from '../layouts/MainLayout';
import PanelBox from '../layouts/PanelBox';
import PageTitle from '../common/PageTitle';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import W1H1Panel from "../panels/W1H1Panel";
import W1H2Panel from "../panels/W1H2Panel";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUsersInProject, checkUserIsProjectLeader, goOutUserInProject } from '../../api/projectApi';
import SmallInfoModal from '../modals/info/SmallInfoModal';
import SmallFormModal from '../modals/form/SmallFormModal';
import RouletteGame from '../games/Roulette';
import W2H1Panel from "../panels/W2H1Panel";
import DiceGame from '../games/Dice';
import FreeSpeechContainer from '../containers/FreeSpeechContainer';
import ProjectProgressContainer from '../containers/ProjectProgressContainer';

const OverviewPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [users, setUsers] = useState([]);
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const [selectedGame, setSelectedGame] = useState('roulette');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsersInProject(projectId);
                setUsers(data);
            } catch (error) {
                console.error('팀원 목록을 불러오는데 실패했습니다:', error);
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

        fetchUsers();
        checkIsLeader();
    }, [projectId]);

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
                title="프로젝트 개요" 
                description="프로젝트의 전반적인 진행 상황을 확인할 수 있습니다."
                rightContent={
                    isProjectLeader ? (
                        <button 
                            onClick={() => navigate(`/projects/${projectId}/overview/settings`)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="프로젝트 설정"
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
                <W1H1Panel title="팀원 목록">
                    <div className="h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-300">
                        <div className="grid grid-cols-3 gap-4">
                            {users.map((user) => (
                                <div 
                                    key={user.userId} 
                                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-lg font-medium shadow-sm">
                                            {user.nickname.charAt(0).toUpperCase()}
                                        </div>
                                        {user.isProjectLeader && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">★</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">
                                        {user.nickname}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </W1H1Panel>

                <W1H2Panel title="자유 발언대">
                    <FreeSpeechContainer />
                </W1H2Panel>

                <W1H2Panel 
                    title="미니게임" 
                    headerRight={
                        <div className="flex gap-1">
                            <button
                                onClick={() => setSelectedGame('roulette')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    selectedGame === 'roulette'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                룰렛
                            </button>
                            <button
                                onClick={() => setSelectedGame('dice')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    selectedGame === 'dice'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                주사위
                            </button>
                        </div>
                    }
                >
                    {selectedGame === 'roulette' ? (
                        <RouletteGame users={users} />
                    ) : (
                        <DiceGame />
                    )}
                </W1H2Panel>

                <W1H1Panel title="프로젝트 완성도">
                    <ProjectProgressContainer />
                </W1H1Panel>
            </PanelBox>

            <SmallFormModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                title="프로젝트 탈퇴"
                submitText="탈퇴하기"
                cancelText="취소"
                onSubmit={handleLeaveProject}
            >
                <>
                    <p>정말 프로젝트를 나가시겠습니까?</p>
                    <p className="text-red-500">그동안의 모든 활동 내역은 삭제됩니다.</p>
                </>
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

export default OverviewPage;