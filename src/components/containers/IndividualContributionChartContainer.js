import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getIndividualContributionChartData } from '../../api/projectApi';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const IndividualContributionChartContainer = ({sprintId}) => {
    const { projectId } = useParams();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("individualContributionChartData  호출전");
                const data = await getIndividualContributionChartData(projectId, sprintId);
                
                const labels = data.map(item => item.nickname);
                const contributions = data.map(item => item.contribution);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: '개인별 기여도',
                            data: contributions,
                            backgroundColor: '#3B82F6', // 파란색 계열
                        }
                    ]
                });
            } catch (error) {
                console.error('개인별 기여도 차트 데이터 로딩 실패:', error);
            }
        };

        fetchData();
    }, [projectId]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                padding: 5
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Contribution'
                }
            },
            x: {
                barPercentage: 0.05,
                categoryPercentage: 0.1
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10
            }
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-2">
            <div style={{ width: '100%', height: '250px' }}>
                {chartData && <Bar data={chartData} options={options} />}
            </div>
        </div>
    );
};

export default IndividualContributionChartContainer;
