import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBurnDownChartAndVelocityChartData } from '../../api/projectApi';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const BurnDownChartContainer = () => {
    const { projectId } = useParams();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBurnDownChartAndVelocityChartData(projectId);
                
                const labels = data.map(item => `S${item.sprintId}`);
                const estimatedPoints = data.map(item => item.estimatedBurndownPoint);
                const realPoints = data.map(item => item.realBurndownPoint);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: '예상 Burndown',
                            data: estimatedPoints,
                            borderColor: '#60A5FA',
                            backgroundColor: '#60A5FA',
                            tension: 0.3
                        },
                        {
                            label: '실제 Burndown',
                            data: realPoints,
                            borderColor: '#EF4444',
                            backgroundColor: '#EF4444',
                            tension: 0.3
                        }
                    ]
                });
            } catch (error) {
                console.error('번다운 차트 데이터 로딩 실패:', error);
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
                padding: 10,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Points'
                }
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
                {chartData ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-center">
                            스프린트 데이터가 없습니다.<br/>
                            <span className="text-sm">스프린트가 시작되면 Burn-Down 차트가 표시됩니다.</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BurnDownChartContainer;
