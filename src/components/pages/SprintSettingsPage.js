import MainLayout from '../layouts/MainLayout';
import PageTitle from '../common/PageTitle';
import SettingsPanel from '../panels/SettingsPanel';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useProjectNavigationStore } from '../../store/useProjectNavigationStore';
import { updateSprintName, createSprint, getSprintPeriod, updateSprintPeriod } from '../../api/projectApi';
import SmallFormSprintCreateEditModal from '../modals/form/SmallFormSprintCreateEditModal';
import SmallInfoModal from '../modals/info/SmallInfoModal';

const SprintSettingsPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { sprints, fetchSprints } = useProjectNavigationStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [sprintPeriod, setSprintPeriod] = useState(30);
    const [isUpdatingPeriod, setIsUpdatingPeriod] = useState(false);
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    useEffect(() => {
        const fetchSprintPeriod = async () => {
            try {
                const period = await getSprintPeriod(projectId);
                setSprintPeriod(period);
            } catch (error) {
                console.error('스프린트 주기 조회 실패:', error);
            }
        };

        fetchSprintPeriod();
    }, [projectId]);

    const handleCreateSprint = async (data) => {
        try {
            await createSprint(projectId, data.sprintName);
            await fetchSprints();
            setIsCreateModalOpen(false);
            setInfoModal({
                isOpen: true,
                title: '스프린트 생성 완료',
                message: '스프린트가 생성되었습니다.',
                type: 'success'
            });
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '스프린트 생성 실패',
                message: '스프린트 생성에 실패했습니다.',
                type: 'error'
            });
            console.error('스프린트 생성 실패:', error);
        }
    };

    const handleEditClick = (sprint) => {
        setSelectedSprint(sprint);
        setIsEditModalOpen(true);
    };

    const handleEditSprint = async (data) => {
        try {
            await updateSprintName(projectId, selectedSprint.sprintId, data.sprintName);
            await fetchSprints();
            setIsEditModalOpen(false);
            setSelectedSprint(null);
            setInfoModal({
                isOpen: true,
                title: '스프린트 수정 완료',
                message: '스프린트 이름이 변경되었습니다.',
                type: 'success'
            });
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '스프린트 수정 실패',
                message: '스프린트 이름 변경에 실패했습니다.',
                type: 'error'
            });
            console.error('스프린트 이름 변경 실패:', error);
        }
    };

    const handlePeriodChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setSprintPeriod(value);
        }
    };

    const handlePeriodSave = async () => {
        setIsUpdatingPeriod(true);
        try {
            await updateSprintPeriod(projectId, sprintPeriod);
            setInfoModal({
                isOpen: true,
                title: '스프린트 주기 변경 완료',
                message: '스프린트 주기가 변경되었습니다.',
                type: 'success'
            });
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '스프린트 주기 변경 실패',
                message: '스프린트 주기 변경에 실패했습니다.',
                type: 'error'
            });
            console.error('스프린트 주기 변경 실패:', error);
        } finally {
            setIsUpdatingPeriod(false);
        }
    };

    return (
        <MainLayout showFunctions showSidebar>
            <PageTitle 
                title="스프린트 설정" 
                rightContent={
                    <button 
                        onClick={() => navigate(`/projects/${projectId}/sprints`)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <IoMdClose size={20} />
                    </button>
                }
            />
            
            <div className="max-w-2xl space-y-6">
                <SettingsPanel
                    title="스프린트 단위 기간"
                    description="새로 생성되는 스프린트의 기본 기간을 설정합니다."
                >
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            min="1"
                            value={sprintPeriod}
                            onChange={handlePeriodChange}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        <span className="text-gray-600">일</span>
                        <button
                            onClick={handlePeriodSave}
                            disabled={isUpdatingPeriod}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isUpdatingPeriod ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </SettingsPanel>

                <SettingsPanel
                    title="스프린트 관리"
                    description="스프린트 추가하거나 이름을 변경할 수 있습니다."
                >
                    <div className="space-y-4">
                        {sprints.map((sprint) => (
                            <div 
                                key={sprint.sprintId}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">{sprint.sprintName}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(sprint)}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {sprint.startDate} - {sprint.endDate}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <FiPlus size={20} />
                            새 스프린트 추가
                        </button>
                    </div>
                </SettingsPanel>
            </div>

            <SmallInfoModal
                isOpen={infoModal.isOpen}
                onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
                title={infoModal.title}
                message={infoModal.message}
                type={infoModal.type}
            />

            <SmallFormSprintCreateEditModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSprint}
                sprint={null}
                actionText="생성"
            />

            <SmallFormSprintCreateEditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedSprint(null);
                }}
                onSubmit={handleEditSprint}
                sprint={selectedSprint}
                actionText="수정"
            />
        </MainLayout>
    );
};

export default SprintSettingsPage;
