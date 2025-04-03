import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSprintBacklogList } from '../../api/projectApi';

const SprintBacklogProgressContainer = () => {
    const { projectId, sprintId } = useParams();
    const [percent, setPercent] = useState(0);
    const size = 120; // 도넛 차트 크기
    const strokeWidth = 12; // 도넛 두께
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    useEffect(() => {
        const calculateProgress = async () => {
            try {
                const backlogs = await getSprintBacklogList(projectId, sprintId);
                
                if (backlogs.length === 0) {
                    setPercent(0);
                    return;
                }

                // 단순히 completeRate의 평균을 계산
                const totalProgress = backlogs.reduce((sum, backlog) => sum + backlog.completeRate, 0);
                const averageProgress = Math.round(totalProgress / backlogs.length);

                setPercent(averageProgress);
            } catch (error) {
                console.error('스프린트 백로그 진행도 계산 실패:', error);
                setPercent(0);
            }
        };

        calculateProgress();
    }, [projectId, sprintId]);

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="relative">
                {/* 도넛 차트 */}
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* 배경 원 */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth={strokeWidth}
                    />
                    {/* 진행도 원 */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out"
                    />
                </svg>
                {/* 퍼센트 텍스트 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-2xl font-bold text-gray-700">
                            {percent}%
                        </span>
                        <p className="text-xs text-gray-500 mt-1">진행도</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprintBacklogProgressContainer;
