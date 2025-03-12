import React, { useState, useEffect } from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import SmallFormModal from '../form/SmallFormModal';
import SmallListModal from '../list/SmallListModal';
import LargeBoardModal from "./LargeBoardModal";
import WeightIndicator from '../../WeightIndicator';
import SmallFormBacklogEditModal from '../form/SmallFormBacklogEditModal';
import { getUsersInProject } from '../../../../api/projectApi';
import UserAttendanceCard from '../../UserAttendanceCard';

/**
 * 백로그 상세 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {object} backlog - 백로그 데이터
 * @param {function} onSubmit - 모달 제출 함수
 */
const LargeBoardBacklogModal = ({
    isOpen, 
    onClose, 
    backlog, 
    onSubmit 
}) => {
    // 상태 관리
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState(1);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [issues, setIssues] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [projectUsers, setProjectUsers] = useState([]);
    
    // 모달 상태
    const [isBacklogEditModalOpen, setIsBacklogEditModalOpen] = useState(false);
    const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false);
    const [isIssueAddModalOpen, setIsIssueAddModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newIssueTitle, setNewIssueTitle] = useState('');

    // 더미 데이터 - 실제 구현 시 API에서 가져올 데이터
    const allUsers = [
        { userId: 1, nickname: '김개발', profileImage: null },
        { userId: 2, nickname: '이디자인', profileImage: null },
        { userId: 3, nickname: '박기획', profileImage: null },
        { userId: 4, nickname: '최테스트', profileImage: null },
    ];

    // 백로그 데이터 로드
    useEffect(() => {
        if (backlog) {
            setTitle(backlog.title || '');
            setDescription(backlog.description || '');
            setWeight(backlog.weight || 1);
            setAssignedUsers(backlog.assignedUsers || []);
            setTasks(backlog.tasks || []);
            setIssues(backlog.issues || []);
            setComments(backlog.comments || []);
            
            // 프로젝트 유저 로드
            fetchProjectUsers();
        } else {
            // 새 백로그 생성 시 초기화
            setTitle('');
            setDescription('');
            setWeight(1);
            setAssignedUsers([]);
            setTasks([]);
            setIssues([]);
            setComments([]);
        }
    }, [backlog, isOpen]);

    // 프로젝트 유저 로드
    const fetchProjectUsers = async () => {
        try {
            // 실제 API 호출
            const projectId = backlog?.projectId;
            if (projectId) {
                const users = await getUsersInProject(projectId);
                setProjectUsers(users);
                return;
            }
            
            // projectId가 없는 경우 임시로 더미 데이터 사용
            setProjectUsers(allUsers);
        } catch (error) {
            console.error('프로젝트 유저 로드 실패:', error);
            // 에러 발생 시 더미 데이터로 대체
            setProjectUsers(allUsers);
        }
    };

    // 사용자 할당 처리
    const handleUserToggle = (user) => {
        if (!assignedUsers.some(u => u.userId === user.userId)) {
            setAssignedUsers(prev => [...prev, user]);
        }
    };

    const handleUserRemove = (user) => {
        setAssignedUsers(prev => 
            prev.filter(u => u.userId !== user.userId)
        );
    };

    // 태스크 관리
    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            const task = {
                id: Date.now(),
                content: newTaskTitle,
                isCompleted: false,
                assignedUserId: null
            };
            setTasks([...tasks, task]);
            setNewTaskTitle('');
            setIsTaskAddModalOpen(false);
        }
    };

    const handleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    };

    const handleTaskAssignment = (taskId, userId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, assignedUserId: userId } : task
        ));
    };

    const handleRemoveTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    // 이슈 관리
    const handleAddIssue = () => {
        if (newIssueTitle.trim()) {
            const issue = {
                id: Date.now(),
                content: newIssueTitle,
                isResolved: false,
                assignedUserId: null
            };
            setIssues([...issues, issue]);
            setNewIssueTitle('');
            setIsIssueAddModalOpen(false);
        }
    };

    const handleIssueResolution = (issueId) => {
        setIssues(issues.map(issue => 
            issue.id === issueId ? { ...issue, isResolved: !issue.isResolved } : issue
        ));
    };

    const handleIssueAssignment = (issueId, userId) => {
        setIssues(issues.map(issue => 
            issue.id === issueId ? { ...issue, assignedUserId: userId } : issue
        ));
    };

    const handleRemoveIssue = (issueId) => {
        setIssues(issues.filter(issue => issue.id !== issueId));
    };

    // 댓글 관리
    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: Date.now(),
                userId: 1, // 현재 로그인한 사용자 ID
                content: newComment,
                createdAt: new Date().toISOString(),
                likes: 0,
                isLiked: false,
                replies: []
            };
            setComments([...comments, comment]);
            setNewComment('');
        }
    };

    const handleLikeComment = (commentId) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                const isLiked = !comment.isLiked;
                return {
                    ...comment,
                    isLiked,
                    likes: isLiked ? comment.likes + 1 : comment.likes - 1
                };
            }
            return comment;
        }));
    };

    // 백로그 제목 수정
    const handleBacklogEdit = () => {
        setIsBacklogEditModalOpen(true);
    };

    // 백로그 수정 완료
    const handleBacklogEditSubmit = (data) => {
        setTitle(data.title);
        setWeight(data.weight);
        setIsBacklogEditModalOpen(false);
    };

    // 사용자 아바타 렌더링
    const renderUserAvatar = (userId) => {
        const user = allUsers.find(u => u.userId === userId);
        if (!user) return null;
        
        return (
            <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {user.nickname.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-gray-600">{user.nickname}</span>
            </div>
        );
    };

    // 중요도 텍스트 가져오기
    const getWeightText = (weight) => {
        if (weight <= 1) return '낮음';
        if (weight <= 2) return '보통';
        return '높음';
    };

    return (
        <>
            <LargeBoardModal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    <div className="flex items-center gap-3">
                        <span>{backlog ? title : '새 백로그'}</span>
                        {backlog && (
                            <div className="flex items-center gap-1">
                                <WeightIndicator weight={weight} showLabel={false} />
                                <span className="text-sm text-gray-500">
                                    {getWeightText(weight)}
                                </span>
                            </div>
                        )}
                        <button 
                            onClick={handleBacklogEdit}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiEdit2 size={16} />
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col space-y-4 h-[calc(100vh-200px)]">
                    {/* 연관 팀원 - 1/9 비율 */}
                    <div className="h-[calc(100%*3/20)]">
                        <UserAttendanceCard
                            attendedUsers={assignedUsers}
                            allUsers={projectUsers}
                            onUserToggle={handleUserToggle}
                            onUserRemove={handleUserRemove}
                            title={`연관 팀원 (${assignedUsers.length}명)`}
                        />
                    </div>

                    {/* 태스크와 이슈를 한 행에 배치 - 6/9 비율 */}
                    <div className="grid grid-cols-2 gap-4 h-[calc(100%*10/20)]">
                        {/* 태스크 */}
                        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-medium">태스크</h3>
                                <button 
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    onClick={() => setIsTaskAddModalOpen(true)}
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
                                                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 w-full"
                                            >
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {/* 체크박스 */}
                                                    <input
                                                        type="checkbox"
                                                        checked={task.isCompleted}
                                                        onChange={() => handleTaskCompletion(task.id)}
                                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
                                                    />
                                                    {/* content */}
                                                    <span className={`text-sm truncate ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>
                                                        {task.content}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                    {task.assignedUserId && renderUserAvatar(task.assignedUserId)}
                                                    <select
                                                        className="text-xs border border-gray-200 rounded p-1"
                                                        value={task.assignedUserId || ''}
                                                        onChange={(e) => handleTaskAssignment(task.id, e.target.value ? Number(e.target.value) : null)}
                                                    >
                                                        <option value="">담당자</option>
                                                        {assignedUsers.map(user => (
                                                            <option key={user.userId} value={user.userId}>
                                                                {user.nickname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button 
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                                                        onClick={() => handleRemoveTask(task.id)}
                                                    >
                                                        <FiX size={16} />
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
                        </div>

                        {/* 이슈 */}
                        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-medium">이슈</h3>
                                <button 
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    onClick={() => setIsIssueAddModalOpen(true)}
                                >
                                    <FiPlus size={18}/>
                                </button>
                            </div>
                            <div className="overflow-y-auto pr-2 flex-grow h-0 min-h-0">
                                <div className="space-y-2 w-full">
                                    {issues.length > 0 ? (
                                        issues.map(issue => (
                                            <div 
                                                key={issue.id}
                                                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 w-full"
                                            >
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {/* 체크박스 */}
                                                    <input
                                                        type="checkbox"
                                                        checked={issue.isResolved}
                                                        onChange={() => handleIssueResolution(issue.id)}
                                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
                                                    />
                                                    {/* content */}
                                                    <span className={`text-sm truncate ${issue.isResolved ? 'line-through text-gray-400' : ''}`}>
                                                        {issue.content}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                    {issue.assignedUserId && renderUserAvatar(issue.assignedUserId)}
                                                    <select
                                                        className="text-xs border border-gray-200 rounded p-1"
                                                        value={issue.assignedUserId || ''}
                                                        onChange={(e) => handleIssueAssignment(issue.id, e.target.value ? Number(e.target.value) : null)}
                                                    >
                                                        <option value="">담당자</option>
                                                        {assignedUsers.map(user => (
                                                            <option key={user.userId} value={user.userId}>
                                                                {user.nickname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button 
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                                                        onClick={() => handleRemoveIssue(issue.id)}
                                                    >
                                                        <FiX size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 h-full flex flex-col justify-center">
                                            이슈가 없습니다.
                                            <div className="mt-2 text-sm text-green-600">
                                                우측 상단의 + 버튼을 눌러 이슈를 추가하세요.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 댓글 */}
                    <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-[calc(100%*7/20)]">
                        <h3 className="text-lg font-medium mb-3">댓글</h3>
                        <div className="overflow-y-auto pr-2 flex-grow">
                            <div className="space-y-2">
                                {comments.length > 0 ? (
                                    comments.map(comment => {
                                        const user = allUsers.find(u => u.userId === comment.userId);
                                        return (
                                            <div key={comment.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">{user?.nickname || '알 수 없는 사용자'}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    <span className="text-sm text-gray-700">{comment.content}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${comment.isLiked ? 'text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
                                                        onClick={() => handleLikeComment(comment.id)}
                                                    >
                                                        <span>👍</span>
                                                        <span>{comment.likes}</span>
                                                    </button>
                                                    <button className="text-xs text-gray-500 hover:text-gray-700">
                                                        답글
                                                    </button>
                                                    <button className="text-xs text-red-400 hover:text-red-500">
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4 text-gray-500 h-full flex flex-col justify-center">
                                        댓글이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="댓글을 입력하세요"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button
                                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                                    onClick={handleAddComment}
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </LargeBoardModal>

            {/* 백로그 수정 모달 - z-index 버그 수정 */}
            <div className="relative z-[1100]">
                <SmallFormBacklogEditModal
                    isOpen={isBacklogEditModalOpen}
                    onClose={() => setIsBacklogEditModalOpen(false)}
                    onSubmit={handleBacklogEditSubmit}
                    backlog={{ title, weight }}
                />
            </div>

            {/* 태스크 추가 모달 - z-index 버그 수정 */}
            <div className="relative z-[1100]">
                <SmallFormModal
                    isOpen={isTaskAddModalOpen}
                    onClose={() => setIsTaskAddModalOpen(false)}
                    title="태스크 추가"
                    submitText="추가"
                    onSubmit={handleAddTask}
                >
                    <div>
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">태스크 내용</label>
                        <input
                            type="text"
                            id="taskTitle"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="태스크 내용을 입력하세요"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>
                </SmallFormModal>
            </div>

            {/* 이슈 추가 모달 - z-index 버그 수정 */}
            <div className="relative z-[1100]">
                <SmallFormModal
                    isOpen={isIssueAddModalOpen}
                    onClose={() => setIsIssueAddModalOpen(false)}
                    title="이슈 추가"
                    submitText="추가"
                    onSubmit={handleAddIssue}
                >
                    <div>
                        <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700 mb-1">이슈 내용</label>
                        <input
                            type="text"
                            id="issueTitle"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이슈 내용을 입력하세요"
                            value={newIssueTitle}
                            onChange={(e) => setNewIssueTitle(e.target.value)}
                        />
                    </div>
                </SmallFormModal>
            </div>
        </>
    );
};

export default LargeBoardBacklogModal;