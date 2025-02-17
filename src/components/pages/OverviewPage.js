import Layout from '../common/Layout';

const OverviewPage = () => {
    return (
        <Layout showFunctions showSidebar>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">프로젝트 개요</h1>
                    <p className="text-gray-600">프로젝트의 전반적인 진행 상황을 확인할 수 있습니다. (예시임)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-600 mb-4">
                            스프린트 현황
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">진행중인 스프린트</span>
                                <span className="font-medium">2개</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">완료된 스프린트</span>
                                <span className="font-medium">3개</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-600 mb-4">
                            백로그 현황
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">전체 백로그</span>
                                <span className="font-medium">15개</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">완료된 백로그</span>
                                <span className="font-medium">8개</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-600 mb-4">
                            팀 현황
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">전체 팀원</span>
                                <span className="font-medium">5명</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">활성 팀원</span>
                                <span className="font-medium">4명</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-600 mb-4">
                            일정 현황
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">시작일</span>
                                <span className="font-medium">2024.03.01</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">종료 예정일</span>
                                <span className="font-medium">2024.06.30</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OverviewPage;