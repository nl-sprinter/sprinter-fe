import Layout from '../common/Layout';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getProductBacklog} from '../../api/projectApi';
import WeightIndicator from '../common/WeightIndicator';
import {useUserStore} from '../../store/useUserStore';
import {PieChart} from 'react-minimal-pie-chart';
import BasicInfoCard from '../common/BasicInfoCard';
import CardBox from "../common/CardBox";
import PageTitle from "../common/PageTitle";

const SprintPage = () => {
    const {projectId} = useParams();
    const [backlogs, setBacklogs] = useState([]);
    const {user} = useUserStore();

    useEffect(() => {
        const fetchBacklogs = async () => {
            try {
                const data = await getProductBacklog(projectId);
                setBacklogs(data);
            } catch (err) {
                console.error('Error fetching backlogs:', err);
            }
        };

        fetchBacklogs();
    }, [projectId]);

    return (
        <Layout showFunctions showSidebar>
            <PageTitle title="스프린트 현황" />
            <CardBox>
                <BasicInfoCard title="나의 Backlog">
                    <div className="space-y-3">
                        {backlogs.map((backlog) => (
                            <div
                                key={backlog.backlogId}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                            >
                                <span className="text-xs text-gray-500">Sprint {backlog.sprintOrder}</span>
                                <span className="flex-1 mx-3 text-sm">{backlog.backlogName}</span>
                                <WeightIndicator weight={backlog.weight} showLabel={false} size="small"/>
                            </div>
                        ))}
                    </div>
                </BasicInfoCard>

                <BasicInfoCard title="Daily Scrum"/>

                <BasicInfoCard title="추가 예정"/>

                <BasicInfoCard title="나의 달성 현황">
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
                </BasicInfoCard>
            </CardBox>
        </Layout>
    );
};

export default SprintPage;