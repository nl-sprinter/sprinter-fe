import MainLayout from '../layouts/MainLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import { createProject } from '../../api/projectApi';
import WeightIndicator from '../common/WeightIndicator';
import SmallFormBacklogCreateEditModal from '../modals/form/SmallFormBacklogCreateEditModal';
import SmallInfoModal from '../modals/info/SmallInfoModal';

const BacklogConfirmPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [backlogData, setBacklogData] = useState(location.state?.backlogData || null);
    const [editingBacklog, setEditingBacklog] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [targetSprintNumber, setTargetSprintNumber] = useState(null);
    const [sprintPeriod, setSprintPeriod] = useState(backlogData?.sprint.sprint_period || 7);
    const [isEditingProjectName, setIsEditingProjectName] = useState(false);
    const [projectName, setProjectName] = useState(backlogData?.project.project_name || '');
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    if (!backlogData) {
        return <div>데이터가 없습니다.</div>;
    }

    const getSprintDates = (sprintNumber) => {
        const startDate = addDays(new Date(), (sprintNumber - 1) * sprintPeriod);
        const endDate = addDays(startDate, sprintPeriod - 1);
        return {
            start: format(startDate, 'yyyy.MM.dd'),
            end: format(endDate, 'yyyy.MM.dd')
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createProject(backlogData);
            setInfoModal({
                isOpen: true,
                title: '프로젝트 생성 완료',
                message: '프로젝트가 성공적으로 생성되었습니다.',
                type: 'success'
            });
            setTimeout(() => {
        navigate('/home');
            }, 1500);
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '프로젝트 생성 실패',
                message: '프로젝트 생성에 실패했습니다.',
                type: 'error'
            });
            console.error('Error creating project:', error);
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { destination } = result;
        const newBacklog = [...backlogData.backlog];
        
        // 전체 백로그에서 해당 항목의 실제 인덱스를 찾습니다
        const sourceIndex = newBacklog.findIndex(item => 
            `${item.sprint_number}-${newBacklog.filter(b => b.sprint_number === item.sprint_number).indexOf(item)}` === result.draggableId
        );
        
        // 드래그한 항목을 가져옵니다
        const [movedItem] = newBacklog.splice(sourceIndex, 1);
        
        // 스프린트 번호 업데이트
        movedItem.sprint_number = parseInt(destination.droppableId);
        
        // 목적지 스프린트의 백로그 항목들을 찾습니다
        const destinationItems = newBacklog.filter(item => 
            item.sprint_number === parseInt(destination.droppableId)
        );
        
        // 나머지 항목들을 찾습니다
        const otherItems = newBacklog.filter(item => 
            item.sprint_number !== parseInt(destination.droppableId)
        );
        
        // 목적지 스프린트의 정확한 위치에 항목을 삽입합니다
        destinationItems.splice(destination.index, 0, movedItem);
        
        // 백로그 데이터 업데이트
        setBacklogData({
            ...backlogData,
            backlog: [...otherItems, ...destinationItems]
        });
    };

    const handleEditClick = (backlog) => {
        setEditingBacklog(backlog);
        setIsEditModalOpen(true);
    };

    const handleAddBacklogClick = (sprintNumber) => {
        setTargetSprintNumber(sprintNumber);
        setIsCreateModalOpen(true);
    };

    const handleCreateBacklog = (data) => {
        const newBacklog = {
            title: data.title.trim(),
            weight: data.weight,
            sprint_number: targetSprintNumber
        };
        
        setBacklogData({
            ...backlogData,
            backlog: [...backlogData.backlog, newBacklog]
        });
        setIsCreateModalOpen(false);
        setTargetSprintNumber(null);
    };

    const handleEditBacklog = (data) => {
        const updatedBacklog = backlogData.backlog.map(item =>
            item === editingBacklog ? {
                ...item,
                title: data.title.trim(),
                weight: data.weight
            } : item
        );
        
        setBacklogData({
            ...backlogData,
            backlog: updatedBacklog
        });
        setIsEditModalOpen(false);
        setEditingBacklog(null);
    };

    const handleDeleteSprint = (sprintNumber) => {
        // 해당 스프린트의 백로그 존재 여부 확인
        const hasBacklogs = backlogData.backlog.some(item => item.sprint_number === sprintNumber);
        
        if (hasBacklogs) {
            alert('백로그가 있는 스프린트는 삭제할 수 없습니다.');
            return;
        }

        if (sprintNumber !== backlogData.sprint.sprint_count) {
            alert('마지막 스프린트만 삭제할 수 있습니다.');
            return;
        }

        setBacklogData({
            ...backlogData,
            sprint: {
                ...backlogData.sprint,
                sprint_count: backlogData.sprint.sprint_count - 1
            }
        });
    };

    const handleDeleteBacklog = (backlogToDelete) => {
        if (window.confirm('이 백로그를 삭제하시겠습니까?')) {
            const updatedBacklog = backlogData.backlog.filter(item => item !== backlogToDelete);
            setBacklogData({
                ...backlogData,
                backlog: updatedBacklog
            });
        }
    };

    const handleSprintPeriodChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setSprintPeriod(value);
            setBacklogData({
                ...backlogData,
                sprint: {
                    ...backlogData.sprint,
                    sprint_period: value
                }
            });
        }
    };

    const handleProjectNameEdit = () => {
        setIsEditingProjectName(true);
    };

    const handleProjectNameSave = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            setIsEditingProjectName(false);
            if (projectName.trim()) {
                setBacklogData({
                    ...backlogData,
                    project: {
                        ...backlogData.project,
                        project_name: projectName.trim()
                    }
                });
            } else {
                setProjectName(backlogData.project.project_name);
            }
        } else if (e.key === 'Escape') {
            setIsEditingProjectName(false);
            setProjectName(backlogData.project.project_name);
        }
    };

    return (
        <MainLayout>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="px-[10%] py-8 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="mb-4">
                                <div className="flex items-center justify-center gap-2">
                                    {isEditingProjectName ? (
                                        <input
                                            type="text"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            onKeyDown={(e) => handleProjectNameSave(e)}
                                            onBlur={handleProjectNameSave}
                                            autoFocus
                                            className="text-3xl font-bold text-center bg-transparent border-b-2 border-green-500 outline-none"
                                        />
                                    ) : (
                                        <>
                                            <h1 className="text-3xl font-bold text-center">
                                                {backlogData.project.project_name}
                                            </h1>
                                            <button
                                                type="button"
                                                onClick={handleProjectNameEdit}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FiEdit2 size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <p className="text-gray-600 text-center">
                                    AI가 추천하는 스프린트 계획 입니다.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    스프린트 단위 기간:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={sprintPeriod}
                                    onChange={handleSprintPeriodChange}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                />
                                <span className="text-sm text-gray-600">일</span>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            {[...Array(backlogData.sprint.sprint_count)].map((_, index) => {
                                const sprintNumber = index + 1;
                                const sprintDates = getSprintDates(sprintNumber);
                                const sprintBacklogs = backlogData.backlog.filter(
                                    item => item.sprint_number === sprintNumber
                                );

                                return (
                                    <div key={sprintNumber} className="bg-white rounded-lg shadow">
                                        <div className="flex items-center justify-between p-4 border-b">
                                            <div>
                                                <h3 className="text-lg font-medium">
                                                    Sprint {sprintNumber}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {sprintDates.start} - {sprintDates.end}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddBacklogClick(sprintNumber)}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                >
                                                    <IoMdAdd size={20} />
                                                </button>
                                                {sprintNumber === backlogData.sprint.sprint_count && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSprint(sprintNumber)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    >
                                                        <IoMdClose size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <Droppable droppableId={String(sprintNumber)}>
                                            {(provided) => (
                                                <div 
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className="p-4"
                                                >
                                                    {sprintBacklogs.map((backlog, idx) => (
                                                        <Draggable
                                                            key={`${backlog.sprint_number}-${idx}`}
                                                            draggableId={`${backlog.sprint_number}-${idx}`}
                                                            index={idx}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="flex items-center justify-between p-3 mb-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 group"
                                                                >
                                                                    <div className="flex-1">
                                                                        <span className="text-sm">
                                                                            {backlog.title}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <WeightIndicator weight={backlog.weight} size="small" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditClick(backlog);
                                                                            }}
                                                                            className="p-1.5 text-gray-400 hover:text-green-600 rounded-full transition-colors"
                                                                        >
                                                                            <FiEdit2 size={16} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteBacklog(backlog);
                                                                            }}
                                                                            className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                                                                        >
                                                                            <IoMdClose size={18} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 백로그 목록이 비어있을 때 표시할 메시지 */}
                        {backlogData.backlog.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                백로그가 없습니다.
                            </div>
                        )}

                        <div className="flex flex-col gap-6">
                            <button
                                type="button"
                                onClick={() => setBacklogData({
                                    ...backlogData,
                                    sprint: {
                                        ...backlogData.sprint,
                                        sprint_count: backlogData.sprint.sprint_count + 1
                                    }
                                })}
                                className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <IoMdAdd size={20} />
                                새 스프린트 추가
                            </button>

                            <div className="flex justify-center gap-4">
                                <button
                                    type="button"
                        onClick={() => navigate('/home')}
                                    className="px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50 transition-colors"
                    >
                        취소
                                </button>
                                <button
                        type="submit"
                                    className="w-[120px] px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                                >
                                    만들기
                                </button>
                            </div>
                        </div>
                    </form>

                    <SmallInfoModal
                        isOpen={infoModal.isOpen}
                        onClose={() => {
                            setInfoModal({ ...infoModal, isOpen: false });
                            if (infoModal.type === 'success') {
                                navigate('/home');
                            }
                        }}
                        title={infoModal.title}
                        message={infoModal.message}
                        type={infoModal.type}
                    />

                    <SmallFormBacklogCreateEditModal
                        isOpen={isCreateModalOpen}
                        onClose={() => {
                            setIsCreateModalOpen(false);
                            setTargetSprintNumber(null);
                        }}
                        onSubmit={handleCreateBacklog}
                        backlog={null}
                        actionText='생성'
                    />

                    <SmallFormBacklogCreateEditModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setEditingBacklog(null);
                        }}
                        onSubmit={handleEditBacklog}
                        backlog={editingBacklog}
                        actionText='수정'
                    />
                </div>
            </DragDropContext>
        </MainLayout>
    );
};

export default BacklogConfirmPage;