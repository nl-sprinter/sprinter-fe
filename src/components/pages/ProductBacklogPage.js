import Layout from '../common/Layout';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBacklog } from '../../api/projectApi';
import { FiFilter } from 'react-icons/fi';
import WeightIndicator from '../common/WeightIndicator';
import BacklogModal from '../common/BacklogModal';

const ProductBacklogPage = () => {
    const { projectId } = useParams();
    const [backlogs, setBacklogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'todo', 'done'
    const [selectedBacklog, setSelectedBacklog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBacklogs = async () => {
            try {
                const data = await getProductBacklog(projectId);
                setBacklogs(data);
                setLoading(false);
            } catch (err) {
                setError('백로그 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchBacklogs();
    }, [projectId]);

    const filteredAndGroupedBacklogs = useMemo(() => {
        const filtered = backlogs.filter(backlog => {
            if (filterStatus === 'all') return true;
            if (filterStatus === 'todo') return !backlog.isFinished;
            if (filterStatus === 'done') return backlog.isFinished;
            return true;
        });

        // 스프린트 순서별로 그룹화
        return filtered.reduce((acc, backlog) => {
            const sprintOrder = backlog.sprintOrder;
            if (!acc[sprintOrder]) {
                acc[sprintOrder] = {
                    sprintName: backlog.sprintName,
                    backlogs: []
                };
            }
            acc[sprintOrder].backlogs.push(backlog);
            return acc;
        }, {});
    }, [backlogs, filterStatus]);

    const handleBacklogClick = (backlog) => {
        setSelectedBacklog(backlog);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <Layout showFunctions showSidebar>
                <div className="p-8 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout showFunctions showSidebar>
                <div className="p-8">
                    <div className="text-red-500 text-center">{error}</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showFunctions showSidebar>
            <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Product Backlog</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50">
                                <FiFilter className="text-gray-500" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="appearance-none bg-transparent pr-8 focus:outline-none cursor-pointer"
                                >
                                    <option value="all">전체</option>
                                    <option value="todo">진행중</option>
                                    <option value="done">완료</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <div className="space-y-8">
                        {Object.entries(filteredAndGroupedBacklogs).map(([sprintOrder, { sprintName, backlogs }]) => (
                            <div key={sprintOrder} className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    <span className="text-gray-700">Sprint {sprintOrder}</span><br />
                                    <span className="text-gray-500 text-sm">{sprintName}</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {backlogs.map((backlog) => (
                                        <div
                                            key={backlog.backlogId}
                                            onClick={() => handleBacklogClick(backlog)}
                                            className={`bg-white rounded-lg p-4 border-l-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md ${
                                                backlog.isFinished ? 'border-green-500 hover:bg-green-50' : 'border-blue-500 hover:bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-medium text-lg">{backlog.backlogName}</h3>
                                                <WeightIndicator weight={backlog.weight} showLabel={false} size="small" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm px-2 py-1 rounded ${
                                                    backlog.isFinished
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {backlog.isFinished ? '완료' : '진행중'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {Object.keys(filteredAndGroupedBacklogs).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                백로그가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                <BacklogModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBacklog(null);
                    }}
                    backlog={selectedBacklog}
                />
            </div>
        </Layout>
    );
};

export default ProductBacklogPage;