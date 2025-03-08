import Layout from '../common/layout/Layout';
import CardBox from '../common/layout/CardBox';
import PageTitle from '../common/PageTitle';
import { FiSettings } from 'react-icons/fi';
import W1H1Card from "../common/card/W1H1Card";
import { useNavigate, useParams } from 'react-router-dom';

const OverviewPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    return (
        <Layout showFunctions showSidebar>
            <PageTitle 
                title="프로젝트 개요" 
                description="프로젝트의 전반적인 진행 상황을 확인할 수 있습니다."
                rightContent={
                    <button 
                        onClick={() => navigate(`/projects/${projectId}/settings`)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiSettings size={20} />
                    </button>
                }
            />
            
            <CardBox>
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

                <W1H1Card title="팀 현황">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">전체 팀원</span>
                            <span className="font-medium">5명</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">활성 팀원</span>
                            <span className="font-medium">4명</span>
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