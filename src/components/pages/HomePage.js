import { useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getUserProjects, getUserNickname } from '../../api/userApi';
import useApiCall from '../../hooks/useApiCall';

const HomePage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nickname, setNickname] = useState('');
    const { callApi } = useApiCall();

    useEffect(() => {
        let isMounted = true;

        const fetchProjects = async () => {
            try {
                const data = await callApi(getUserProjects);
                const nickname = await callApi(getUserNickname);
                if (isMounted) {
                    setProjects(data);
                    setNickname(nickname);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('프로젝트를 불러오는데 실패했습니다.');
                    setLoading(false);
                }
            }
        };

        fetchProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <Layout showFunctions>
                <div className="p-8 flex justify-center items-center">
                    <div className="text-gray-600">로딩 중...</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout showFunctions>
                <div className="p-8 flex justify-center items-center">
                    <div className="text-red-500">{error}</div>
                </div>
            </Layout>
        );
    }

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
                        console.log(project),
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
