import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBurnDownChartAndVelocityChartData } from '../../api/projectApi';
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

const VelocityChartContainer = () => {
    const { projectId } = useParams();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBurnDownChartAndVelocityChartData(projectId);
                
                const labels = data.map(item => `S${item.sprintId}`);
                const velocities = data.map(item => item.velocity);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Velocity',
                            data: velocities,
                            backgroundColor: '#22C55E',
                        }
                    ]
                });
            } catch (error) {
                console.error('벨로시티 차트 데이터 로딩 실패:', error);
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
            },
            x: {
                barPercentage: 0.4,
                categoryPercentage: 0.8
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
                    <Bar data={chartData} options={options} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-center">
                            스프린트 데이터가 없습니다.<br/>
                            <span className="text-sm">스프린트가 시작되면 Velocity 차트가 표시됩니다.</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VelocityChartContainer;
