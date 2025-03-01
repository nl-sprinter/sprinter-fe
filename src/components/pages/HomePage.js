import { useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getUserProjects, getUserNickname } from '../../api/userApi';

const HomePage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [projectsData, nicknameData] = await Promise.all([
                    getUserProjects(),
                    getUserNickname()
                ]);
                
                if (isMounted) {
                    setProjects(projectsData);
                    setNickname(nicknameData);
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

    return (
        <Layout showFunctions>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-8">
                    안녕하세요, {nickname}님!
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
                    
                    {projects.map((project, index) => (
                        <div 
                            key={index}
                            className="w-64 h-64 bg-green-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
                            onClick={() => navigate('/overview')}
                        >
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4">
                                <span className="text-4xl text-green-500">
                                    {project.projectName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-white">{project.projectName}</span>
                            <span className="text-white text-sm mt-2 opacity-75">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
