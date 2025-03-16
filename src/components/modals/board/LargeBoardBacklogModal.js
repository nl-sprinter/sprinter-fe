import React, {useState, useEffect} from 'react';
import {FiEdit2, FiCheck, FiCircle} from 'react-icons/fi';
import SmallFormModal from '../form/SmallFormModal';
import LargeBoardModal from "./LargeBoardModal";
import WeightIndicator from '../../common/WeightIndicator';
import SmallFormBacklogCreateEditModal from '../form/SmallFormBacklogCreateEditModal';
/**
 * // 백로그 댓글 좋아요 누르기
export const onLikeToBacklogComment = async (projectId, sprintId, backlogId, backlogCommentId) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/backlogcomments/${backlogCommentId}/likes`);
    console.log(`[API] projectApi.onLikeToBacklogComment 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 백로그 댓글 좋아요 취소
export const offLikeToBacklogComment = async (projectId, sprintId, backlogId, backlogCommentId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/backlogcomments/${backlogCommentId}/likes`);
    console.log(`[API] projectApi.offLikeToBacklogComment 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}
 */
import {
    updateBacklog,
    getUsersInProject,
    getUsersInBacklog,
    addUserInBacklog,
    deleteUserInBacklog,
    addTaskToBacklog,
    addUserOnTask,
    getTasksInBacklog,
    updateTaskContent,
    updateTaskChecked,
    deleteTask, 
    getIssuesInBacklog,
    addIssueToBacklog,
    updateIssueChecked,
    updateIssueContent,
    deleteIssue,
    getBacklogComments,
    createBacklogComment,
    deleteBacklogComment,
    updateBacklogFinished,
    onLikeToBacklogComment,
    offLikeToBacklogComment
} from '../../../api/projectApi';
import UserAttendanceContainer from '../../containers/UserAttendanceContainer';
import BacklogTaskContainer from '../../containers/BacklogTaskContainer';
import BacklogIssueContainer from '../../containers/BacklogIssueContainer';
import BacklogCommentContainer from '../../containers/BacklogCommentContainer';


const LargeBoardBacklogModal = ({
                                    isOpen,
                                    onClose,
                                    backlog,
                                    projectId,
                                    sprintId,
                                    backlogId,
                                    onSubmit
                                }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState(1);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [issues, setIssues] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [projectUsers, setProjectUsers] = useState([]);
    const [finished, setFinished] = useState(false);

    // 모달 상태
    const [isBacklogEditModalOpen, setIsBacklogEditModalOpen] = useState(false);
    const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false);
    const [isIssueAddModalOpen, setIsIssueAddModalOpen] = useState(false);
    const [isIssueEditModalOpen, setIsIssueEditModalOpen] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [newIssueContent, setNewIssueContent] = useState('');
    const [editingIssue, setEditingIssue] = useState({ id: null, content: '' });
    const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState({ id: null, content: '' });

    // 데이터 로드
    useEffect(() => {
        if (backlog) {
            setTitle(backlog.title || '');
            setDescription(backlog.description || '');
            setWeight(backlog.weight || 1);
            setComments(backlog.comments || []);
            setFinished(backlog.isFinished || false);

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
                fetchBacklogComments(projectId, sprintId, backlogId);
            }
        } else {
            setTitle('');
            setDescription('');
            setWeight(1);
            setAssignedUsers([]);
            setTasks([]);
            setIssues([]);
            setComments([]);
            setFinished(false);
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
                    isFinished: finished
                });
            }
        }
    };

    // 백로그 완료 상태 토글
    const handleToggleBacklogFinished = async () => {
        if (!backlogId) return;
        
        try {
            // API 호출
            let newFinished = await updateBacklogFinished(backlogId, finished);
            
            // 상태 업데이트
            setFinished(newFinished);
            
            // 부모 컴포넌트에 변경 알림
            if (onSubmit) {
                onSubmit({
                    title,
                    weight,
                    isFinished: newFinished
                });
            }
        } catch (error) {
            console.error('백로그 완료 상태 업데이트 실패:', error);
        } finally {
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
                isChecked: task.checked,
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

            // API 응답 데이터를 컴포넌트 상태에 맞게 변환
            const formattedIssues = issueList.map(issue => ({
                id: issue.issueId,
                content: issue.content,
                isChecked: issue.checked,
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
                // API 호출하여 태스크 추가
                await addTaskToBacklog(projectId, sprintId, backlogId, newTaskContent);
                
                // 입력 필드 초기화 및 모달 닫기
                setNewTaskContent('');
                setIsTaskAddModalOpen(false);
                
                // 서버에서 최신 태스크 목록 다시 조회
                await fetchBacklogTasks(projectId, sprintId, backlogId);
            } catch (error) {
                console.error('태스크 추가 실패:', error);
            }
        }
    };

    const handleTaskCompletion = async (taskId) => {
        try {
            // 현재 태스크 찾기
            const task = tasks.find(task => task.id === taskId);
            if (!task) return;
            
            // API 호출하여 서버에 상태 업데이트
            await updateTaskChecked(projectId, sprintId, backlogId, taskId, task.isChecked);
            
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
            console.error('이슈 상태 변경 실패:', error);
            // API 호출 실패 시 원래 상태로 되돌리기
            fetchBacklogIssues(projectId, sprintId, backlogId);
        }
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
    const handleAddComment = async (content, parentCommentId = null) => {
        if (content && content.trim()) {
            try {
                await createBacklogComment(
                    projectId, 
                    sprintId, 
                    backlogId, 
                    parentCommentId,
                    content
                );
                
                // 입력 필드 초기화 (메인 댓글 입력창인 경우에만)
                if (!parentCommentId) {
                    setNewComment('');
                }
                
                // 댓글 목록 새로고침
                await fetchBacklogComments();
            } catch (error) {
                console.error('댓글 추가 실패:', error);
            }
        }
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
                    description,
                    isFinished: finished
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

    // Task 수정 관련 함수 추가
    const handleEditTaskClick = (taskId, content) => {
        setEditingTask({ id: taskId, content });
        setIsTaskEditModalOpen(true);
    };

    const handleEditTaskChange = (e) => {
        setEditingTask({ ...editingTask, content: e.target.value });
    };

    const handleEditTaskSubmit = async () => {
        if (editingTask.content.trim() && editingTask.id) {
            try {
                // API 호출하여 서버에 태스크 내용 업데이트
                await updateTaskContent(projectId, sprintId, backlogId, editingTask.id, editingTask.content);
                
                // 모달 닫기
                setIsTaskEditModalOpen(false);
                
                // 서버에서 최신 태스크 목록 다시 조회
                await fetchBacklogTasks(projectId, sprintId, backlogId);
            } catch (error) {
                console.error('태스크 수정 실패:', error);
            }
        }
    };

    // 댓글 로드 함수
    const fetchBacklogComments = async () => {
        try {
            const commentsData = await getBacklogComments(projectId, sprintId, backlogId);
            console.log('댓글 데이터 타입:', typeof commentsData, 'Array.isArray:', Array.isArray(commentsData));
            console.log('댓글 데이터:', commentsData);
            
            // commentsData가 배열인지 확인하고, 아니면 빈 배열로 처리
            setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch (error) {
            console.error('댓글 로드 실패:', error);
            setComments([]);
        }
    };

    // 댓글 삭제 함수
    const handleRemoveComment = async (commentId) => {
        await deleteBacklogComment(projectId, sprintId, backlogId, commentId);
        // 임시로 프론트에서만 삭제 처리
        setComments(comments.filter(comment => comment.backlogCommentId !== commentId));
    };

    // 댓글 좋아요 함수 추가
    const handleLikeComment = async (commentId, isLiked) => {
        try {
            let newBacklogCommentData;
            if (isLiked) {
                // 좋아요 추가
                newBacklogCommentData = await onLikeToBacklogComment(projectId, sprintId, backlogId, commentId);
            } else {
                // 좋아요 취소
                newBacklogCommentData = await offLikeToBacklogComment(projectId, sprintId, backlogId, commentId);
            }
            
            // 댓글 목록 새로고침
            await fetchBacklogComments();
        } catch (error) {
            console.error('댓글 좋아요 처리 실패:', error);
        }
    };

    // 완료 상태에 따라 모달 스타일 클래스 결정
    const modalHeaderClass = finished
        ? "bg-gray-100"
        : "bg-blue-100";

    return (
        <>
            <LargeBoardModal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    <div className="flex items-center gap-3">
                        <span>{backlog ? title : '새 Backlog'}</span>
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
                extraHeaderContent={
                    backlog && (
                        <div className="flex items-center gap-2 mr-3">
                            <button
                                onClick={handleToggleBacklogFinished}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    finished
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-200'
                                        : 'bg-blue-200 text-blue-700 hover:bg-blue-200'
                                }`}
                            >
                                {finished ? (
                                    <>
                                        <FiCheck className="text-gray-600" />
                                        <span>완료</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCircle className="text-blue-500" />
                                        <span>진행중</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )
                }
                customHeaderClass={modalHeaderClass}
            >
                {/* 연관 팀원 - 3/20 비율 */}
                <UserAttendanceContainer
                    attendedUsers={assignedUsers}
                    allUsers={projectUsers}
                    onUserToggle={handleUserToggle}
                    onUserRemove={handleUserRemove}
                    title={`연관 팀원 (${assignedUsers.length}명)`}
                />

                <p className="p-2"/>

                {/* Task 와 Issue 를 한 행에 배치 - 10/20 비율 */}
                <div className="grid grid-cols-2 gap-4 h-[calc(100%-380px)]">
                    {/* Task */}
                    <BacklogTaskContainer
                        tasks={tasks}
                        assignedUsers={assignedUsers}
                        onAddTask={() => setIsTaskAddModalOpen(true)}
                        onRemoveTask={handleRemoveTask}
                        onTaskCompletion={handleTaskCompletion}
                        onTaskAssignment={handleTaskAssignment}
                        onEditTask={handleEditTaskClick}
                        renderUserAvatar={renderUserAvatar}
                    />

                    {/* Issue */}
                    <BacklogIssueContainer
                        issues={issues}
                        onAddIssue={() => setIsIssueAddModalOpen(true)}
                        onRemoveIssue={handleRemoveIssue}
                        onIssueResolution={handleIssueResolution}
                        onEditIssue={handleEditIssueClick}
                    />
                </div>

                <p className="p-2"/>

                {/* 댓글 - 7/20 비율 */}
                <div className="h-[calc(100%*7/20)]">
                    <BacklogCommentContainer
                        comments={comments}
                        newComment={newComment}
                        onCommentChange={setNewComment}
                        onAddComment={handleAddComment}
                        onRemoveComment={handleRemoveComment}
                        onLikeComment={handleLikeComment}
                        title="댓글"
                    />
                </div>
            </LargeBoardModal>

            {/* 백로그 수정 모달 - z-index 버그 수정 */}
            <div className="relative z-[1100]">
                <SmallFormBacklogCreateEditModal
                    isOpen={isBacklogEditModalOpen}
                    onClose={() => setIsBacklogEditModalOpen(false)}
                    onSubmit={handleBacklogEditSubmit}
                    backlog={{title, weight}}
                    actionText='수정'
                />
            </div>

            {/* 태스크 추가 모달 - z-index 버그 수정 */}
            <div className="relative z-[1100]">
                <SmallFormModal
                    isOpen={isTaskAddModalOpen}
                    onClose={() => setIsTaskAddModalOpen(false)}
                    title="Task 추가"
                    submitText="추가"
                    onSubmit={handleAddTask}
                >
                    <div>
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">Task
                            내용</label>
                        <input
                            type="text"
                            id="taskTitle"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Task 내용을 입력하세요"
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
                    title="Issue 추가"
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
                            placeholder="Issue 내용을 입력하세요"
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
                    title="Issue 수정"
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
                            placeholder="Issue 내용을 입력하세요"
                            value={editingIssue.content}
                            onChange={handleEditIssueChange}
                        />
                    </div>
                </SmallFormModal>
            </div>

            {/* 태스크 수정 모달 */}
            <div className="relative z-[1100]">
                <SmallFormModal
                    isOpen={isTaskEditModalOpen}
                    onClose={() => setIsTaskEditModalOpen(false)}
                    title="Task 수정"
                    submitText="수정"
                    onSubmit={handleEditTaskSubmit}
                >
                    <div>
                        <label htmlFor="taskEditContent" className="block text-sm font-medium text-gray-700 mb-1">
                            Task 내용
                        </label>
                        <input
                            type="text"
                            id="taskEditContent"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Task 내용을 입력하세요"
                            value={editingTask.content}
                            onChange={handleEditTaskChange}
                        />
                    </div>
                </SmallFormModal>
            </div>
        </>
    );
};

export default LargeBoardBacklogModal;