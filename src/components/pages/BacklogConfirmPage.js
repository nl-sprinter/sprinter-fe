import Layout from '../common/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Modal from 'react-modal';
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import { createProject } from '../../api/projectApi';

const BacklogConfirmPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [backlogData, setBacklogData] = useState(location.state?.backlogData || null);
    const [editingBacklog, setEditingBacklog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [selectedWeight, setSelectedWeight] = useState(null);
    const [isAddingBacklog, setIsAddingBacklog] = useState(false);
    const [targetSprintNumber, setTargetSprintNumber] = useState(null);
    const [sprintDuration, setSprintDuration] = useState(backlogData?.sprint.sprint_duration || 7);
    const [isEditingProjectName, setIsEditingProjectName] = useState(false);
    const [projectName, setProjectName] = useState(backlogData?.project.project_name || '');

    if (!backlogData) {
        return <div>데이터가 없습니다.</div>;
    }

    const getSprintDates = (sprintNumber) => {
        const startDate = addDays(new Date(), (sprintNumber - 1) * backlogData.sprint.sprint_duration);
        const endDate = addDays(startDate, backlogData.sprint.sprint_duration - 1);
        return {
            start: format(startDate, 'yyyy.MM.dd'),
            end: format(endDate, 'yyyy.MM.dd')
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createProject(backlogData);
        navigate('/home');
        } catch (error) {
            // 에러는 axiosConfig의 인터셉터에서 처리됨
            console.error('Error creating project:', error);
        }
    };

    const getWeightColor = (weight) => {
        if (weight <= 1) return 'bg-yellow-500';
        if (weight <= 2) return 'bg-green-500';
        return 'bg-blue-800';
    };

    const getWeightBarWidth = (weight) => {
        if (weight <= 1) return 'w-1/3';
        if (weight <= 2) return 'w-2/3';
        return 'w-full';
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
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
        setEditTitle(backlog.title);
        setSelectedWeight(backlog.weight);
        setIsModalOpen(true);
    };

    const handleAddSprint = () => {
        const lastSprintNumber = backlogData.sprint.sprint_count;
        const lastSprintEndDate = getSprintDates(lastSprintNumber).end;
        
        // 마지막 스프린트 종료일의 다음날을 계산
        const newSprintStartDate = addDays(new Date(lastSprintEndDate.replace(/\./g, '-')), 1);
        
        setBacklogData({
            ...backlogData,
            sprint: {
                ...backlogData.sprint,
                sprint_count: lastSprintNumber + 1
            }
        });
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

    const handleAddBacklogClick = (sprintNumber) => {
        setTargetSprintNumber(sprintNumber);
        setEditTitle('');
        setSelectedWeight(null);
        setIsAddingBacklog(true);
        setIsModalOpen(true);
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

    const handleModalSave = () => {
        if (isAddingBacklog) {
            // 새 백로그 추가
            const newBacklog = {
                title: editTitle.trim(),
                weight: selectedWeight,
                sprint_number: targetSprintNumber
            };
            
            setBacklogData({
                ...backlogData,
                backlog: [...backlogData.backlog, newBacklog]
            });
        } else {
            // 기존 백로그 수정
            const updatedBacklog = backlogData.backlog.map(item =>
                item === editingBacklog ? {
                    ...item,
                    title: editTitle.trim(),
                    weight: selectedWeight
                } : item
            );
            
            setBacklogData({
                ...backlogData,
                backlog: updatedBacklog
            });
        }
        setIsModalOpen(false);
        setIsAddingBacklog(false);
        setTargetSprintNumber(null);
    };

    const handleSprintDurationChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setSprintDuration(value);
            setBacklogData({
                ...backlogData,
                sprint: {
                    ...backlogData.sprint,
                    sprint_duration: value
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
        <Layout>
            <DragDropContext onDragEnd={handleDragEnd}>
                <form onSubmit={handleSubmit} className="px-[10%] py-8 overflow-y-auto">
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
                                AI가 추천하는 백로그입니다
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                스프린트 단위 기간:
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={sprintDuration}
                                onChange={handleSprintDurationChange}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                            <span className="text-sm text-gray-600">일</span>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        {[...Array(backlogData.sprint.sprint_count)].map((_, index) => {
                            const sprintNumber = index + 1;
                            const dates = getSprintDates(sprintNumber);
                            const sprintBacklogs = backlogData.backlog.filter(
                                item => item.sprint_number === sprintNumber
                            );
                            const isLastSprint = sprintNumber === backlogData.sprint.sprint_count;
                            const canDelete = isLastSprint && sprintBacklogs.length === 0;

                            return (
                                <div key={sprintNumber} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                Sprint {sprintNumber}
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                {dates.start} - {dates.end}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleAddBacklogClick(sprintNumber)}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-full"
                                            >
                                                <IoMdAdd size={20} />
                                            </button>
                                            {canDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSprint(sprintNumber)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
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
                                                                className="flex items-center justify-between py-3 border-b last:border-0 border-gray-100 cursor-pointer hover:bg-gray-50"
                                                            >
                                                                <span className="text-gray-800 flex-grow" onClick={() => handleEditClick(backlog)}>
                                                                    {backlog.title}
                                                                </span>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-24 h-4 bg-gray-200 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className={`h-full ${getWeightColor(backlog.weight)} ${getWeightBarWidth(backlog.weight)}`}
                                                                        />
                                                                    </div>
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

                    {/* 수정 모달 */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={() => {
                            setIsModalOpen(false);
                            setIsAddingBacklog(false);
                            setTargetSprintNumber(null);
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {isAddingBacklog ? '백로그 추가' : '백로그 수정'}
                        </h2>
                        <div className="space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    내용
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    가중치
                                </label>
                                <div className="flex items-center justify-between gap-4 mt-2">
                                    {[1, 2, 3].map((weight) => (
                                        <button
                                            key={weight}
                                            type="button"
                                            onClick={() => setSelectedWeight(weight)}
                                            className={`flex-1 py-2 px-4 rounded-lg border ${
                                                selectedWeight === weight 
                                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <div className={`w-full h-2 rounded-full ${getWeightColor(weight)}`} />
                                                <span className="text-sm">
                                                    {weight === 1 ? '1. 낮음' : weight === 2 ? '2. 보통' : '3. 높음'}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    disabled={!editTitle.trim() || !selectedWeight}
                                    onClick={handleModalSave}
                                    className={`px-4 py-2 rounded ${
                                        !editTitle.trim() || !selectedWeight
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {isAddingBacklog ? '추가' : '수정'}
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* 백로그 목록이 비어있을 때 표시할 메시지 */}
                    {backlogData.backlog.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            백로그가 없습니다.
                        </div>
                    )}

                    <div className="flex flex-col justify-between">
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleAddSprint}
                                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center mb-4"
                            >
                                <span className="text-xl mr-1">+</span> 스프린트 추가
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="w-[120px] px-4 py-2 border border-green-500 text-green-500 rounded hover:border-green-600 hover:text-green-600"
                                onClick={() => navigate('/home')}
                            >
                                취소
                            </button>
                            <button
                        type="submit"
                                className={`w-[120px] px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600`}
                            >
                                만들기
                            </button>
                        </div>
                    </div>
                </form>
            </DragDropContext>
        </Layout>
    );
};

export default BacklogConfirmPage;