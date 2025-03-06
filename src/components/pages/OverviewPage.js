import Layout from '../common/Layout';
import BasicInfoCard from '../common/BasicInfoCard';
import CardBox from '../common/CardBox';
import PageTitle from '../common/PageTitle';
import { FiSettings } from 'react-icons/fi';

const OverviewPage = () => {
    return (
        <Layout showFunctions showSidebar>
            <PageTitle 
                title="프로젝트 개요" 
                description="프로젝트의 전반적인 진행 상황을 확인할 수 있습니다."
                rightContent={
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiSettings size={20} />
                    </button>
                }
            />
            
            <CardBox>
                <BasicInfoCard title="스프린트 현황">
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
                </BasicInfoCard>

                <BasicInfoCard title="백로그 현황">
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
                </BasicInfoCard>

                <BasicInfoCard title="팀 현황">
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
                </BasicInfoCard>

                <BasicInfoCard title="일정 현황">
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
                </BasicInfoCard>
            </CardBox>
        </Layout>
    );
};

export default OverviewPage;