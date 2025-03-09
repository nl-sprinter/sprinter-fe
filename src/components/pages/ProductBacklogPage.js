import Layout from '../common/layout/Layout';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBacklogList } from '../../api/projectApi';
import { useProjectNavigationStore } from '../../store/useProjectNavigationStore';
import BacklogModal from '../common/modal/BacklogModal';
import SideScrollableCardBox from '../common/layout/SideScrollableCardBox';
import PageTitle from '../common/PageTitle';
import BacklogItem from '../common/item/BacklogItem';
import W1H2Card from '../common/card/W1H2Card';

const ProductBacklogPage = () => {
    const { projectId } = useParams();
    const { sprints } = useProjectNavigationStore();
    const [backlogs, setBacklogs] = useState([]);
    const [selectedBacklog, setSelectedBacklog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBacklogs = async () => {
            try {
                const data = await getProductBacklogList(projectId);
                setBacklogs(data);
            } catch (err) {
                console.error('백로그 목록을 불러오는데 실패했습니다:', err);
            }
        };

        fetchBacklogs();
    }, [projectId]);

    const groupedBacklogs = backlogs.reduce((acc, backlog) => {
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

    const handleBacklogClick = (backlog) => {
        setSelectedBacklog(backlog);
        setIsModalOpen(true);
    };

    return (
        <Layout showFunctions showSidebar>
            <div className="space-y-6">
                <PageTitle title="Product Backlog" />

                <SideScrollableCardBox>
                    {sprints.map((sprint) => {
                        const sprintBacklogs = backlogs.filter(backlog => backlog.sprintOrder === sprint.sprintOrder);
                        
                        return (
                            <W1H2Card
                                key={sprint.sprintId}
                                title={`Sprint ${sprint.sprintOrder} - ${sprint.sprintName}`}
                            >
                                <div className="space-y-3">
                                    {sprintBacklogs.length > 0 ? (
                                        sprintBacklogs.map((backlog) => (
                                            <BacklogItem
                                                key={backlog.backlogId}
                                                backlogId={backlog.backlogId}
                                                sprintOrder={backlog.sprintOrder}
                                                backlogName={backlog.title}
                                                weight={backlog.weight}
                                                isFinished={backlog.isFinished}
                                                onClick={() => handleBacklogClick(backlog)}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            백로그가 없습니다.
                                        </div>
                                    )}
                                </div>
                            </W1H2Card>
                        );
                    })}

                    {sprints.length === 0 && (
                        <div className="w-full text-center py-8 text-gray-500">
                            스프린트가 없습니다.
                        </div>
                    )}
                </SideScrollableCardBox>

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