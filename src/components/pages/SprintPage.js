import Layout from '../common/layout/Layout';
import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {getProductBacklogList, checkUserIsProjectLeader} from '../../api/projectApi';
import {useUserStore} from '../../store/useUserStore';
import {PieChart} from 'react-minimal-pie-chart';
import CardBox from "../common/layout/CardBox";
import PageTitle from "../common/PageTitle";
import BacklogItem from "../common/item/BacklogItem";
import W1H1Card from "../common/card/W1H1Card";
import {FiSettings} from 'react-icons/fi';

const SprintPage = () => {
    const navigate = useNavigate();
    const {projectId} = useParams();
    const [backlogs, setBacklogs] = useState([]);
    const {user} = useUserStore();
    const [isProjectLeader, setIsProjectLeader] = useState(false);

    useEffect(() => {
        const fetchBacklogs = async () => {
            try {
                const data = await getProductBacklogList(projectId);
                setBacklogs(data);
            } catch (err) {
                console.error('Error fetching backlogs:', err);
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

        fetchBacklogs();
        checkIsLeader();
    }, [projectId]);

    return (
        <Layout showFunctions showSidebar>
            <PageTitle
                title="스프린트 현황"
                description="스프린트의 전반적인 진행 상황을 확인할 수 있습니다."
                rightContent={
                    isProjectLeader && (
                        <button 
                            onClick={() => navigate(`/projects/${projectId}/sprints/settings`)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiSettings size={20} />
                        </button>
                    )
                }
            />
            <CardBox>
                <W1H1Card title="나의 Backlog">
                    <div className="space-y-3">
                        {backlogs.map((backlog) => (
                            <BacklogItem
                                backlogId={backlog.backlogId}
                                sprintOrder={backlog.sprintOrder}
                                backlogName={backlog.backlogName}
                                weight={backlog.weight}
                                isFinished={backlog.isFinished}
                            />
                        ))}
                    </div>
                </W1H1Card>

                <W1H1Card title="Daily Scrum"/>

                <W1H1Card title="추가 예정"/>

                <W1H1Card title="나의 달성 현황">
                    <div className="flex items-center justify-center h-full">
                        <div className="w-28 h-28">
                            <PieChart
                                data={[
                                    {title: '완료', value: 60, color: '#22c55e'},
                                    {title: '진행중', value: 30, color: '#3b82f6'},
                                    {title: '예정', value: 10, color: '#e5e7eb'},
                                ]}
                                lineWidth={40}
                                paddingAngle={2}
                                rounded
                            />
                        </div>
                    </div>
                </W1H1Card>
            </CardBox>
        </Layout>
    );
};

export default SprintPage;