import Layout from '../common/layout/Layout';
import CardBox from '../common/layout/CardBox';
import PageTitle from '../common/PageTitle';
import { FiSettings } from 'react-icons/fi';
import W1H1Card from "../common/card/W1H1Card";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUsersInProject, checkUserIsProjectLeader } from '../../api/projectApi';

const OverviewPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [users, setUsers] = useState([]);
    const [isProjectLeader, setIsProjectLeader] = useState(false);

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

    return (
        <Layout showFunctions showSidebar>
            <PageTitle 
                title="프로젝트 개요" 
                description="프로젝트의 전반적인 진행 상황을 확인할 수 있습니다."
                rightContent={
                    isProjectLeader && (
                        <button 
                            onClick={() => navigate(`/projects/${projectId}/overview/settings`)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiSettings size={20} />
                        </button>
                    )
                }
            />
            
            <CardBox>
                <W1H1Card title="팀원 목록">
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
                </W1H1Card>

                <W1H1Card title="스프린트 현황">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">진행중인 스프린트</span>
                            <span className="font-medium">2개</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">완료된 스프린트</span>
                            <span className="font-medium">3개</span>
                        </div>
                    </div>
                </W1H1Card>

                <W1H1Card title="백로그 현황">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">전체 백로그</span>
                            <span className="font-medium">15개</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">완료된 백로그</span>
                            <span className="font-medium">8개</span>
                        </div>
                    </div>
                </W1H1Card>

                <W1H1Card title="일정 현황">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">시작일</span>
                            <span className="font-medium">2024.03.01</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">종료 예정일</span>
                            <span className="font-medium">2024.06.30</span>
                        </div>
                    </div>
                </W1H1Card>
            </CardBox>
        </Layout>
    );
};

export default OverviewPage;