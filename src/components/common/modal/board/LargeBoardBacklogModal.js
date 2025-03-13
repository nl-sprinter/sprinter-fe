import React, {useState, useEffect} from 'react';
import {FiEdit2} from 'react-icons/fi';
import SmallFormModal from '../form/SmallFormModal';
import LargeBoardModal from "./LargeBoardModal";
import WeightIndicator from '../../WeightIndicator';
import SmallFormBacklogEditModal from '../form/SmallFormBacklogEditModal';
import {
    getUsersInProject, 
    addTaskToBacklog, 
    getTasksInBacklog, 
    getIssuesInBacklog, 
    addIssueToBacklog, 
    updateIssueChecked, 
    deleteIssue, 
    updateIssueContent,
    getUsersInBacklog,
    addUserInBacklog,
    deleteUserInBacklog,
    updateBacklog,
    updateTaskChecked,
    addUserOnTask,
    deleteTask
} from '../../../../api/projectApi';
import UserAttendanceCard from '../../UserAttendanceCard';
import TaskSelectCard from '../../TaskSelectCard';
import IssueSelectCard from '../../IssueSelectCard';
import CommentCard from '../../CommentCard';


const LargeBoardBacklogModal = ({
                                    isOpen,
                                    onClose,
                                    backlog,
                                    projectId,
                                    sprintId,
                                    backlogId,
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
    const [isIssueEditModalOpen, setIsIssueEditModalOpen] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [newIssueContent, setNewIssueContent] = useState('');
    const [editingIssue, setEditingIssue] = useState({ id: null, content: '' });

    // 백로그 데이터 로드
    useEffect(() => {
        console.log(`backlog=${JSON.stringify(backlog)}`)
        if (backlog) {
            setTitle(backlog.title || '');
            setDescription(backlog.description || '');
            setWeight(backlog.weight || 1);
            setComments(backlog.comments || []);

            // 프로젝트 유저 로드
            if (projectId) {
                console.log("유저로드 통과")
                fetchProjectUsers(projectId);
            }
            
            // 백로그 태스크 및 이슈 로드
            if (projectId && sprintId && backlogId) {
                fetchBacklogTasks(projectId, sprintId, backlogId);
                fetchBacklogIssues(projectId, sprintId, backlogId);
                fetchBacklogUsers(projectId, sprintId, backlogId);
            }
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
    }, [backlog, isOpen, projectId, sprintId, backlogId]);

    // 백로그 데이터 다시 로드
    const reloadBacklog = async () => {
        if (projectId && sprintId && backlogId) {
            // 백로그 관련 데이터 다시 로드
            await fetchBacklogTasks(projectId, sprintId, backlogId);
            await fetchBacklogIssues(projectId, sprintId, backlogId);
            await fetchBacklogUsers(projectId, sprintId, backlogId);
            
            // 부모 컴포넌트에 변경 알림 (백로그 목록 업데이트를 위해)
            if (onSubmit) {
                onSubmit({
                    title,
                    weight,
                    description
                });
            }
        }
    };

    // 프로젝트 유저 로드
    const fetchProjectUsers = async (projectId) => {
        if (!projectId) return;
        
        try {
            const users = await getUsersInProject(projectId);
            setProjectUsers(users);
        } catch (error) {
            console.error('프로젝트 유저 로드 실패:', error);
            setProjectUsers([]);
        }
    };
    
    // 백로그에 할당된 유저 로드
    const fetchBacklogUsers = async (projectId, sprintId, backlogId) => {
        if (!projectId || !sprintId || !backlogId) return;
        
        try {
            const users = await getUsersInBacklog(projectId, sprintId, backlogId);
            setAssignedUsers(users);
        } catch (error) {
            console.error('백로그 유저 로드 실패:', error);
            setAssignedUsers([]);
        }
    };
    
    // 백로그 태스크 로드
    const fetchBacklogTasks = async (projectId, sprintId, backlogId) => {
        if (!projectId || !sprintId || !backlogId) return;
        
        try {
            const taskList = await getTasksInBacklog(projectId, sprintId, backlogId);
            
            // API 응답 데이터를 컴포넌트 상태에 맞게 변환
            const formattedTasks = taskList.map(task => ({
                id: task.taskId,
                content: task.content,
                isCompleted: task.checked,
                assignedUserId: task.userId
            }));
            
            setTasks(formattedTasks);
        } catch (error) {
            console.error('백로그 태스크 로드 실패:', error);
            setTasks([]);
        }
    };
    
    // 백로그 이슈 로드
    const fetchBacklogIssues = async (projectId, sprintId, backlogId) => {
        if (!projectId || !sprintId || !backlogId) return;
        
        try {
            const issueList = await getIssuesInBacklog(projectId, sprintId, backlogId);
            console.log(`이슈 목록 로드 성공:`, issueList);
            
            // API 응답 데이터를 컴포넌트 상태에 맞게 변환
            const formattedIssues = issueList.map(issue => ({
                id: issue.issueId,
                content: issue.content,
                isChecked: issue.checked,
                assignedUserId: null // 이슈 DTO에는 userId가 없으므로 null로 설정
            }));
            
            setIssues(formattedIssues);
        } catch (error) {
            console.error('백로그 이슈 로드 실패:', error);
            setIssues([]);
        }
    };

    // 사용자 할당 처리
    const handleUserToggle = async (user) => {
        if (!assignedUsers.some(u => u.userId === user.userId)) {
            try {
                // 백로그에 유저 추가 API 호출
                await addUserInBacklog(projectId, sprintId, backlogId, user.userId);
                
                    // 서버에서 최신 유저 목록 다시 조회
                await fetchBacklogUsers(projectId, sprintId, backlogId);
            } catch (error) {
                console.error('백로그에 유저 추가 실패:', error);
            }
        }
    };

    const handleUserRemove = async (user) => {
        try {
            // 백로그에서 유저 삭제 API 호출
            await deleteUserInBacklog(projectId, sprintId, backlogId, user.userId);
            
            // 서버에서 최신 유저 목록 다시 조회
            await fetchBacklogUsers(projectId, sprintId, backlogId);
        } catch (error) {
            console.error('백로그에서 유저 삭제 실패:', error);
        }
    };

    // 태스크 관리
    const handleAddTask = async () => {
        if (newTaskContent.trim()) {
            try {
                const response = await addTaskToBacklog(projectId, sprintId, backlogId, newTaskContent);

                // 태스크 목록 업데이트
                setTasks([...tasks, {
                    id: response.taskId,
                    content: newTaskContent,
                    isCompleted: false,
                    assignedUserId: null
                }]);
                setNewTaskContent('');
                setIsTaskAddModalOpen(false);
            } catch (error) {
                console.error('태스크 추가 실패:', error);
            }
        }
    };

    const handleTaskCompletion = async (taskId) => {
        try {
            // 현재 태스크 찾기
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;
            
            // 상태 변경
            const newIsCompleted = !task.isCompleted;
            
            // API 호출하여 서버에 상태 업데이트
            await updateTaskChecked(projectId, sprintId, backlogId, taskId, newIsCompleted);
            
            // 태스크 목록 다시 로드
            await fetchBacklogTasks(projectId, sprintId, backlogId);
        } catch (error) {
            console.error('태스크 상태 변경 실패:', error);
            // 실패 시 원래 상태로 되돌리기
            await fetchBacklogTasks(projectId, sprintId, backlogId);
        }
    };

    const handleTaskAssignment = async (taskId, userId) => {
        try {
            // API 호출하여 서버에 담당자 지정
            await addUserOnTask(projectId, sprintId, backlogId, taskId, userId);
            
            // 태스크 목록 다시 로드
            await fetchBacklogTasks(projectId, sprintId, backlogId);
        } catch (error) {
            console.error('태스크 담당자 지정 실패:', error);
            // 실패 시 원래 상태로 되돌리기
            await fetchBacklogTasks(projectId, sprintId, backlogId);
        }
    };

    const handleRemoveTask = async (taskId) => {
        try {
            // API 호출하여 서버에서 태스크 삭제
            await deleteTask(projectId, sprintId, backlogId, taskId);
            
            // 태스크 목록 다시 로드
            await fetchBacklogTasks(projectId, sprintId, backlogId);
        } catch (error) {
            console.error('태스크 삭제 실패:', error);
            // 실패 시 원래 상태로 되돌리기
            await fetchBacklogTasks(projectId, sprintId, backlogId);
        }
    };

    // 이슈 관리
    const handleAddIssue = async () => {
        if (newIssueContent.trim()) {
            try {
                // 이슈 추가 API 호출
                await addIssueToBacklog(projectId, sprintId, backlogId, newIssueContent);
                
                // 입력 필드 초기화 및 모달 닫기
                setNewIssueContent('');
                setIsIssueAddModalOpen(false);
                
                // 서버로부터 최신 이슈 목록 다시 조회
                await fetchBacklogIssues(projectId, sprintId, backlogId);
            } catch (error) {
                console.error('이슈 추가 실패:', error);
            }
        }
    };

    const handleIssueResolution = async (issueId) => {
        try {
            // 현재 이슈 찾기
            const issue = issues.find(issue => issue.id === issueId);
            if (!issue) return;
            
            // API 호출하여 서버에 상태 업데이트
            await updateIssueChecked(projectId, sprintId, backlogId, issueId, issue.isChecked);

            await fetchBacklogIssues(projectId, sprintId, backlogId);
        } catch (error) {
            
            // API 호출 실패 시 원래 상태로 되돌리기
            fetchBacklogIssues(projectId, sprintId, backlogId);
        }
    };

    const handleIssueAssignment = (issueId, userId) => {
        setIssues(issues.map(issue =>
            issue.id === issueId ? {...issue, assignedUserId: userId} : issue
        )); 
    };

    const handleRemoveIssue = async (issueId) => {
        try {
            // API 호출하여 서버에서 이슈 삭제
            await deleteIssue(projectId, sprintId, backlogId, issueId);
            console.log(`이슈 ${issueId} 삭제 성공`);
            
            // 서버에서 최신 이슈 목록 다시 조회
            await fetchBacklogIssues(projectId, sprintId, backlogId);
        } catch (error) {
            console.error('이슈 삭제 실패:', error);
        }
    };

    // 이슈 수정 관련 함수
    const handleEditIssueClick = (issueId, content) => {
        setEditingIssue({ id: issueId, content });
        setIsIssueEditModalOpen(true);
    };

    const handleEditIssueChange = (e) => {
        setEditingIssue({ ...editingIssue, content: e.target.value });
    };

    const handleEditIssueSubmit = async () => {
        if (editingIssue.content.trim() && editingIssue.id) {
            try {
                // API 호출하여 서버에 이슈 내용 업데이트
                await updateIssueContent(projectId, sprintId, backlogId, editingIssue.id, editingIssue.content);
                console.log(`이슈 ${editingIssue.id} 수정 성공`);
                
                // 모달 닫기
                setIsIssueEditModalOpen(false);
                
                // 서버에서 최신 이슈 목록 다시 조회
                await fetchBacklogIssues(projectId, sprintId, backlogId);
            } catch (error) {
                console.error('이슈 수정 실패:', error);
            }
        }
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
    const handleBacklogEditSubmit = async (data) => {
        try {
            // 로컬 상태 업데이트
            setTitle(data.title);
            setWeight(data.weight);
            
            // API 호출하여 서버에 백로그 정보 업데이트
            await updateBacklog(projectId, sprintId, backlogId, data.title, data.weight);
            console.log(`백로그 수정 성공: 제목=${data.title}, 가중치=${data.weight}`);
            
            // 수정 모달만 닫기
            setIsBacklogEditModalOpen(false);
            
            // 백로그 데이터 다시 로드
            await reloadBacklog();
            
            // 부모 컴포넌트에 변경 알림 (백로그 목록 업데이트를 위해)
            if (onSubmit) {
                onSubmit({
                    title: data.title,
                    weight: data.weight,
                    description
                });
            }
        } catch (error) {
            console.error('백로그 수정 실패:', error);
        }
    };

    // 사용자 아바타 렌더링
    const renderUserAvatar = (userId) => {
        const user = projectUsers.find(u => u.userId === userId);
        if (!user) return null;

        return (
            <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
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
                                <WeightIndicator weight={weight} showLabel={false}/>
                                <span className="text-sm text-gray-500">
                                    {getWeightText(weight)}
                                </span>
                            </div>
                        )}
                        <button
                            onClick={handleBacklogEdit}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FiEdit2 size={16}/>
                        </button>
                    </div>
                }
            >
                {/* 연관 팀원 - 3/20 비율 */}
                <UserAttendanceCard
                    attendedUsers={assignedUsers}
                    allUsers={projectUsers}
                    onUserToggle={handleUserToggle}
                    onUserRemove={handleUserRemove}
                    title={`연관 팀원 (${assignedUsers.length}명)`}
                />

                <p className="p-2"/>

                {/* 태스크와 이슈를 한 행에 배치 - 10/20 비율 */}
                <div className="grid grid-cols-2 gap-4  h-[calc(100%-380px)]">
                    {/* 태스크 */}
                    <TaskSelectCard
                        tasks={tasks}
                        assignedUsers={assignedUsers}
                        onAddTask={() => setIsTaskAddModalOpen(true)}
                        onRemoveTask={handleRemoveTask}
                        onTaskCompletion={handleTaskCompletion}
                        onTaskAssignment={handleTaskAssignment}
                        title="태스크"
                        renderUserAvatar={renderUserAvatar}
                    />

                    {/* 이슈 */}
                    <IssueSelectCard
                        issues={issues}
                        assignedUsers={assignedUsers}
                        onAddIssue={() => setIsIssueAddModalOpen(true)}
                        onRemoveIssue={handleRemoveIssue}
                        onIssueResolution={handleIssueResolution}
                        onIssueAssignment={handleIssueAssignment}
                        onEditIssue={handleEditIssueClick}
                        title="이슈"
                        renderUserAvatar={renderUserAvatar}
                    />
                </div>

                <p className="p-2"/>

                {/* 댓글 - 7/20 비율 */}
                <div className="h-[calc(100%*7/20)]">
                    <CommentCard
                        comments={comments}
                        newComment={newComment}
                        onCommentChange={setNewComment}
                        onAddComment={handleAddComment}
                        onLikeComment={handleLikeComment}
                        allUsers={projectUsers}
                        title="댓글"
                    />
                </div>
            </LargeBoardModal>

            {/* 백로그 수정 모달 - z-index 버그 수정 */}
            <div className="relative z-[1100]">
                <SmallFormBacklogEditModal
                    isOpen={isBacklogEditModalOpen}
                    onClose={() => setIsBacklogEditModalOpen(false)}
                    onSubmit={handleBacklogEditSubmit}
                    backlog={{title, weight}}
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
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">태스크
                            내용</label>
                        <input
                            type="text"
                            id="taskTitle"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="태스크 내용을 입력하세요"
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
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
                        <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700 mb-1">이슈
                            내용</label>
                        <input
                            type="text"
                            id="issueTitle"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이슈 내용을 입력하세요"
                            value={newIssueContent}
                            onChange={(e) => setNewIssueContent(e.target.value)}
                        />
                    </div>
                </SmallFormModal>
            </div>

            {/* 이슈 수정 모달 - z-index 버그 수정 */}
            <div className="relative z-[1100]">
                <SmallFormModal
                    isOpen={isIssueEditModalOpen}
                    onClose={() => setIsIssueEditModalOpen(false)}
                    title="이슈 수정"
                    submitText="수정"
                    onSubmit={handleEditIssueSubmit}
                >
                    <div>
                        <label htmlFor="issueEditContent" className="block text-sm font-medium text-gray-700 mb-1">이슈
                            내용</label>
                        <input
                            type="text"
                            id="issueEditContent"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="이슈 내용을 입력하세요"
                            value={editingIssue.content}
                            onChange={handleEditIssueChange}
                        />
                    </div>
                </SmallFormModal>
            </div>
        </>
    );
};

export default LargeBoardBacklogModal;