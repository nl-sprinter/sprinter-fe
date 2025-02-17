import Layout from '../common/Layout';

const SprintPage = () => {
    const sprints = [
        { 
            name: 'Sprint 1',
            status: '진행중',
            period: '2024.03.01 - 2024.03.15',
            progress: 60
        },
        { 
            name: 'Sprint 2',
            status: '예정',
            period: '2024.03.16 - 2024.03.30',
            progress: 0
        }
    ];

    return (
        <Layout showFunctions showSidebar>
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Sprint</h1>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        새 스프린트 생성
                    </button>
                </div>

                <div className="space-y-4">
                    {sprints.map((sprint, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{sprint.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm 
                                    ${sprint.status === '진행중' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {sprint.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{sprint.period}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${sprint.progress}%` }}
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                                    상세보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default SprintPage;