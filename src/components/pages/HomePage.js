import { useNavigate } from 'react-router-dom';
import Layout from '../common/layout/Layout';
import { FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useUserProjectStore } from '../../store/useUserProjectStore';
import { useUserStore } from '../../store/useUserStore';
import { useProjectNavigationStore } from '../../store/useProjectNavigationStore';
import {getUserProjects} from "../../api/userApi";

const HomePage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const { fetchProjects } = useUserProjectStore();
    const { setProjectId } = useProjectNavigationStore();
    const { user, fetchUserInfo } = useUserStore();

    useEffect(() => {
        if (!user) {
            console.log('Homepage - user가 없습니다. fetchUserInfo 호출');
            fetchUserInfo();
        } else {
            console.log('Homepage - user가 있습니다. fetchUserInfo 호출 안함');
        }
    }, [user, fetchUserInfo]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const projectsData = await getUserProjects();
                
                if (isMounted) {
                    setProjects(projectsData);
                }
            } catch (error) {
                // 에러는 axiosConfig의 인터셉터에서 처리됨
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleProjectClick = async (project) => {
        // 프로젝트 진입 시 store 초기화 및 현재 프로젝트 설정
        await fetchProjects();
        setProjectId(project.projectId);
        navigate(`/projects/${project.projectId}/overview`);
    };

    return (
        <Layout showFunctions>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-8">
                    안녕하세요, {user?.nickname}님!
                </h1>
                
                <div className="flex flex-wrap gap-4">
                    <div 
                        className="w-64 h-64 bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => navigate('/startingform')}
                    >
                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
                            <FiPlus className="text-4xl text-gray-600" />
                        </div>
                        <span className="text-gray-600">새 프로젝트</span>
                    </div>
                    
                    {projects.map((project) => (
                        <div 
                            key={project.projectId}
                            className="w-64 h-64 bg-green-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
                            onClick={() => handleProjectClick(project)}
                        >
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4">
                                <span className="text-4xl text-green-500">
                                    {project.projectName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-white">{project.projectName}</span>
                            <span className="text-white text-sm mt-2 opacity-75">
                                ID: {project.projectId}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
