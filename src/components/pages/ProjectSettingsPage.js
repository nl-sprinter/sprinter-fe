import Layout from '../common/layout/Layout';
import PageTitle from '../common/PageTitle';
import SettingsCard from '../common/card/SettingsCard';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { deleteProject, updateProjectName } from '../../api/projectApi';
import { useUserProjectStore } from '../../store/useUserProjectStore';

const ProjectSettingsPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const { projects, fetchProjects } = useUserProjectStore();

    useEffect(() => {
        const currentProject = projects.find(p => p.projectId === parseInt(projectId));
        if (currentProject) {
            setProjectName(currentProject.projectName);
            setNewProjectName(currentProject.projectName);
        }
    }, [projectId, projects]);

    const handleDeleteProject = async () => {
        try {
            setIsDeleting(true);
            await deleteProject(projectId);
            alert('프로젝트가 성공적으로 삭제되었습니다.');
            navigate('/home');
        } catch (error) {
            alert('프로젝트 삭제 중 오류가 발생했습니다.');
            console.error('프로젝트 삭제 실패:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateProjectName = async () => {
        if (!newProjectName.trim()) {
            alert('프로젝트 이름을 입력해주세요.');
            return;
        }

        if (newProjectName === projectName) {
            alert('현재 프로젝트 이름과 동일합니다.');
            return;
        }

        try {
            setIsUpdating(true);
            await updateProjectName(projectId, newProjectName);
            await fetchProjects(); // 프로젝트 목록 새로고침
            setProjectName(newProjectName);
            alert('프로젝트 이름이 성공적으로 변경되었습니다.');
        } catch (error) {
            alert('프로젝트 이름 변경 중 오류가 발생했습니다.');
            console.error('프로젝트 이름 변경 실패:', error);
            setNewProjectName(projectName); // 에러 시 원래 이름으로 복구
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Layout showFunctions showSidebar>
            <PageTitle 
                title="프로젝트 설정" 
                rightContent={
                    <button 
                        onClick={() => navigate(`/projects/${projectId}`)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <IoMdClose size={20} />
                    </button>
                }
            />
            
            <div className="max-w-2xl space-y-6">
                <SettingsCard
                    title="프로젝트 이름 변경"
                    description="프로젝트의 이름을 변경합니다."
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                새 프로젝트 이름
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                    placeholder="프로젝트 이름을 입력하세요"
                                    disabled={isUpdating}
                                />
                                <button
                                    onClick={handleUpdateProjectName}
                                    disabled={isUpdating || !newProjectName.trim() || newProjectName === projectName}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        isUpdating || !newProjectName.trim() || newProjectName === projectName
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {isUpdating ? '변경 중...' : '변경'}
                                </button>
                            </div>
                        </div>
                    </div>
                </SettingsCard>

                <SettingsCard
                    title="프로젝트 삭제"
                    description="이 작업은 되돌릴 수 없습니다."
                >
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            프로젝트 삭제
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteProject}
                                    disabled={isDeleting}
                                    className={`px-4 py-2 bg-red-500 text-white rounded-lg transition-colors ${
                                        isDeleting 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:bg-red-600'
                                    }`}
                                >
                                    {isDeleting ? '삭제 중...' : '삭제 확인'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
                </SettingsCard>

                <SettingsCard
                    title="팀 관리"
                    description="프로젝트 팀원을 관리합니다."
                >
                </SettingsCard>
            </div>
        </Layout>
    );
};

export default ProjectSettingsPage; 