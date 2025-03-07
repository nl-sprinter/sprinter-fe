import Layout from '../common/layout/Layout';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBacklog } from '../../api/projectApi';
import BacklogModal from '../common/modal/BacklogModal';
import SideScrollableCardBox from '../common/layout/SideScrollableCardBox';
import PageTitle from '../common/PageTitle';
import BacklogItem from '../common/item/BacklogItem';
import W1H2Card from '../common/card/W1H2Card';

const ProductBacklogPage = () => {
    const { projectId } = useParams();
    const [backlogs, setBacklogs] = useState([]);
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
                    {Object.entries(groupedBacklogs).map(([sprintOrder, { sprintName, backlogs }]) => (
                        <W1H2Card
                            key={sprintOrder}
                            title={`Sprint ${sprintOrder} - ${sprintName}`}
                        >
                            <div className="space-y-3">
                                {backlogs.map((backlog) => (
                                    <BacklogItem
                                        key={backlog.backlogId}
                                        backlogId={backlog.backlogId}
                                        sprintOrder={backlog.sprintOrder}
                                        backlogName={backlog.backlogName}
                                        weight={backlog.weight}
                                        isFinished={backlog.isFinished}
                                        onClick={() => handleBacklogClick(backlog)}
                                    />
                                ))}
                            </div>
                        </W1H2Card>
                    ))}

                    {Object.keys(groupedBacklogs).length === 0 && (
                        <div className="w-full text-center py-8 text-gray-500">
                            백로그가 없습니다.
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