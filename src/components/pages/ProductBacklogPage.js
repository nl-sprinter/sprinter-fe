import Layout from '../common/Layout';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBacklog } from '../../api/projectApi';
import { FiFilter } from 'react-icons/fi';
import WeightIndicator from '../common/WeightIndicator';
import BacklogModal from '../common/modal/BacklogModal';
import CardBox from '../common/CardBox';
import PageTitle from '../common/PageTitle';
import FullWidthCard from '../common/FullWidthCard';

const ProductBacklogPage = () => {
    const { projectId } = useParams();
    const [backlogs, setBacklogs] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'todo', 'done'
    const [selectedBacklog, setSelectedBacklog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBacklogs = async () => {
            try {
                const data = await getProductBacklog(projectId);
                setBacklogs(data);
            } catch (err) {
                console.error('백로그 목록을 불러오는데 실패했습니다:', err);
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

    return (
        <Layout showFunctions showSidebar>
            <PageTitle title="Product Backlog" />
            <CardBox>
                <FullWidthCard
                    headerRight={
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
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
                    }
                >
                    <div className="space-y-8">
                        {Object.entries(filteredAndGroupedBacklogs).map(([sprintOrder, { sprintName, backlogs }]) => (
                            <div key={sprintOrder}>
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Sprint {sprintOrder}
                                        <span className="text-sm text-gray-500 ml-2">{sprintName}</span>
                                    </h2>
                                    <hr className="mt-2 border-t border-gray-100" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {backlogs.map((backlog) => (
                                        <div
                                            key={backlog.backlogId}
                                            onClick={() => handleBacklogClick(backlog)}
                                            className={`bg-gray-50 rounded-lg p-3 border-l-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${
                                                backlog.isFinished ? 'border-green-500 hover:bg-green-50' : 'border-blue-500 hover:bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-medium text-base">{backlog.backlogName}</h3>
                                                <WeightIndicator weight={backlog.weight} showLabel={false} size="small" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs px-2 py-1 rounded ${
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
                </FullWidthCard>
            </CardBox>

            <BacklogModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedBacklog(null);
                }}
                backlog={selectedBacklog}
            />
        </Layout>
    );
};

export default ProductBacklogPage;