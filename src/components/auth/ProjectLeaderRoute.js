import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { checkUserIsProjectLeader } from '../../api/projectApi';

const ProjectLeaderRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProjectLeader, setIsProjectLeader] = useState(false);
    const { projectId } = useParams();

    useEffect(() => {
        const checkIsLeader = async () => {
            try {
                // localStorage에서 토큰 가져오기
                const token = localStorage.getItem('accessToken');
                if (!token || !projectId) {
                    setIsProjectLeader(false);
                    setIsLoading(false);
                    return;
                }

                // API 호출하여 팀장 여부 확인
                const isLeader = await checkUserIsProjectLeader(projectId, token);
                setIsProjectLeader(isLeader);
            } catch (error) {
                console.error('팀장 권한 확인 중 오류 발생:', error);
                setIsProjectLeader(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkIsLeader();
    }, [projectId]);

    // 로딩 중일 때
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">로딩 중...</div>;
    }

    // 팀장이 아닐 때
    if (!isProjectLeader) {
        return <Navigate to={`/projects/${projectId}/overview`} replace />;
    }

    // 팀장일 때
    return children;
};

export default ProjectLeaderRoute; 