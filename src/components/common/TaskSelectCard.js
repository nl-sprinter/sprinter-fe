import React, { useState } from 'react';
import { FiPlus, FiX, FiUser, FiUserX } from 'react-icons/fi';
import SmallListModal from './modal/list/SmallListModal';

/**
 * 태스크 선택 카드 컴포넌트
 * @param {array} tasks - 태스크 목록
 * @param {array} assignedUsers - 할당된 사용자 목록
 * @param {function} onAddTask - 태스크 추가 함수
 * @param {function} onRemoveTask - 태스크 삭제 함수
 * @param {function} onTaskCompletion - 태스크 완료 상태 변경 함수
 * @param {function} onTaskAssignment - 태스크 할당 함수
 * @param {string} title - 카드 제목
 * @param {function} renderUserAvatar - 사용자 아바타 렌더링 함수
 */
const TaskSelectCard = ({
    tasks = [],
    assignedUsers = [],
    onAddTask,
    onRemoveTask,
    onTaskCompletion,
    onTaskAssignment,
    title = "태스크",
    renderUserAvatar
}) => {
    // 진행 중/완료된 태스크 개수 계산
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const inProgressTasks = tasks.length - completedTasks;
    
    // 유저 선택 모달 상태
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    // 담당자 선택 모달 열기
    const handleOpenUserModal = (taskId) => {
        setSelectedTaskId(taskId);
        setIsUserModalOpen(true);
    };

    // 담당자 선택 처리
    const handleUserSelect = (user) => {
        if (selectedTaskId) {
            onTaskAssignment && onTaskAssignment(selectedTaskId, user.userId);
        }
    };

    // 담당자 제거 처리
    const handleRemoveUser = (taskId) => {
        onTaskAssignment && onTaskAssignment(taskId, null);
    };

    return (
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-lg font-medium">{title}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                        진행중 <span className="text-green-600 font-medium">{inProgressTasks}</span>, 
                        완료 <span className="text-green-600 font-medium">{completedTasks}</span>
                    </div>
                </div>
                <button
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    onClick={onAddTask}
                >
                    <FiPlus size={18}/>
                </button>
            </div>
            <div className="overflow-y-auto pr-2 flex-grow h-0 min-h-0">
                <div className="space-y-2 w-full">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <div
                                key={task.id}
                                className={`flex items-center justify-between p-3 rounded-lg border w-full transition-colors
                                    ${task.isCompleted 
                                        ? 'bg-gray-100 border-gray-300 opacity-70' 
                                        : 'bg-green-50 border-green-200'}`}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {/* 체크박스 */}
                                    <input
                                        type="checkbox"
                                        checked={task.isCompleted}
                                        onChange={() => onTaskCompletion && onTaskCompletion(task.id)}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
                                    />
                                    {/* content */}
                                    <span
                                        className={`text-sm truncate ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>
                                        {task.content}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {task.assignedUserId && renderUserAvatar && renderUserAvatar(task.assignedUserId)}
                                    
                                    {/* 담당자 아이콘 */}
                                    {task.assignedUserId ? (
                                        <button
                                            className="p-1.5 text-gray-500 hover:bg-red-50 rounded-full transition-colors"
                                            onClick={() => handleRemoveUser(task.id)}
                                            title="담당자 제거"
                                        >
                                            <FiUserX size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                            onClick={() => handleOpenUserModal(task.id)}
                                            title="담당자 지정"
                                        >
                                            <FiUser size={16} />
                                        </button>
                                    )}
                                    
                                    {/* 삭제 버튼 */}
                                    <button
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                                        onClick={() => onRemoveTask && onRemoveTask(task.id)}
                                    >
                                        <FiX size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 h-full flex flex-col justify-center">
                            태스크가 없습니다.
                            <div className="mt-2 text-sm text-green-600">
                                우측 상단의 + 버튼을 눌러 태스크를 추가하세요.
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* 담당자 선택 모달 */}
            <SmallListModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                title="담당자 선택"
                items={assignedUsers}
                onItemSelect={handleUserSelect}
                renderItem={(user, onClick) => (
                    <div 
                        key={user.userId}
                        className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onClick(user)}
                    >
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                            {user.nickname.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.nickname}</span>
                    </div>
                )}
            />
        </div>
    );
};

export default TaskSelectCard; 