import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectProgressPercent } from '../../api/projectApi';

const ProjectProgressContainer = () => {
    const { projectId } = useParams();
    const [percent, setPercent] = useState(0);
    const size = 120; // 도넛 차트 크기
    const strokeWidth = 12; // 도넛 두께
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const data = await getProjectProgressPercent(projectId);
                setPercent(data.percent);
            } catch (error) {
                console.error('프로젝트 진행도 조회 실패:', error);
                setPercent(0);
            }
        };

        fetchProgress();
    }, [projectId]);

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
                        <p className="text-xs text-gray-500 mt-1">완성도</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectProgressContainer;
