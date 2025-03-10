import Layout from '../common/layout/Layout';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getProductBacklog} from '../../api/projectApi';
import {PieChart} from 'react-minimal-pie-chart';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import {IoMdAdd} from 'react-icons/io';
import W2H1Card from '../common/card/W2H1Card';
import CardBox from "../common/layout/CardBox";
import PageTitle from "../common/PageTitle";
import DailyScrumItem from "../common/item/DailyScrumItem";
import BacklogItem from "../common/item/BacklogItem";
import W1H1Card from "../common/card/W1H1Card";

const SprintEachPage = () => {
    const {projectId, sprintId} = useParams();
    const [backlogs, setBacklogs] = useState([]);

    // 더미 데이터 - 실제 구현 시 API에서 가져올 데이터
    const barChartData = [
        {name: '1일차', 완료: 4, 진행중: 2, 예정: 3},
        {name: '2일차', 완료: 5, 진행중: 3, 예정: 2},
        {name: '3일차', 완료: 6, 진행중: 2, 예정: 1},
        {name: '4일차', 완료: 7, 진행중: 1, 예정: 1},
        {name: '5일차', 완료: 8, 진행중: 1, 예정: 0},
    ];

    const dailyScrums = [
        {id: 1, date: '2024.03.20', content: '오늘은 백엔드 API 개발을 완료했습니다.'},
        {id: 2, date: '2024.03.19', content: '프론트엔드 컴포넌트 구현 중입니다.'},
        {id: 3, date: '2024.03.18', content: '데이터베이스 스키마 설계를 완료했습니다.'},
        {id: 4, date: '2024.03.17', content: '프로젝트 초기 설정을 완료했습니다.'},
        {id: 5, date: '2024.03.16', content: '팀 미팅을 통해 요구사항을 정리했습니다.'},
    ];

    useEffect(() => {
        const fetchBacklogs = async () => {
            try {
                const data = await getProductBacklog(projectId);
                // 현재 스프린트의 백로그만 필터링
                const sprintBacklogs = data.filter(
                    backlog => backlog.sprintId === parseInt(sprintId)
                );
                setBacklogs(sprintBacklogs);
            } catch (err) {
                console.error('Error fetching backlogs:', err);
            }
        };

        fetchBacklogs();
    }, [projectId, sprintId]);

    return (
        <Layout showFunctions showSidebar>
            <PageTitle title="스프린트 상세" />
            <CardBox>
                <W2H1Card title="Sprint 현황">
                    <div className="flex h-full">
                        <div className="w-1/3 flex items-center justify-center">
                            <div className="w-24 h-24">
                                <PieChart
                                    data={[
                                        {title: '완료', value: 60, color: '#22c55e'},
                                        {title: '진행중', value: 30, color: '#3b82f6'},
                                        {title: '예정', value: 10, color: '#e5e7eb'},
                                    ]}
                                    lineWidth={35}
                                    paddingAngle={2}
                                    rounded
                                />
                            </div>
                        </div>
                        <div className="w-2/3 flex items-center justify-center">
                            <BarChart width={350} height={150} data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="완료" stackId="a" fill="#22c55e"/>
                                <Bar dataKey="진행중" stackId="a" fill="#3b82f6"/>
                                <Bar dataKey="예정" stackId="a" fill="#e5e7eb"/>
                            </BarChart>
                        </div>
                    </div>
                </W2H1Card>

                <W1H1Card
                    title="Sprint Backlog"
                    headerRight={
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                            <IoMdAdd size={20}/>
                        </button>
                    }
                >
                    <div className="space-y-3">
                        {backlogs.map((backlog) => (
                            <BacklogItem
                                backlogId={backlog.id}
                                sprintOrder={backlog.sprintOrder}
                                backlogName={backlog.backlogName}
                                weight={backlog.weight}
                                isFinished={backlog.isFinished}
                                />
                        ))}
                    </div>
                </W1H1Card>

                <W1H1Card
                    title="Daily Scrum"
                    headerRight={
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                            <IoMdAdd size={20}/>
                        </button>
                    }
                >
                    <div className="space-y-3">
                        {dailyScrums.map((scrum) => (
                            <DailyScrumItem
                                id={scrum.id}
                                date={scrum.date}
                                content={scrum.content}
                            />
                        ))}
                    </div>
                </W1H1Card>
            </CardBox>
        </Layout>
    );
};

export default SprintEachPage;