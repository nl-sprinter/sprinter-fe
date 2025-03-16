import React, { useState, useEffect } from 'react';
import { FiCornerDownRight, FiX, FiSend, FiTrash2, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useUserStore } from '../../store/useUserStore'; // 유저 스토어 임포트

/**
 * 댓글 카드 컴포넌트
 * @param {array} comments - 댓글 목록
 * @param {string} newComment - 새 댓글 내용
 * @param {function} onCommentChange - 댓글 내용 변경 함수
 * @param {function} onAddComment - 댓글 추가 함수
 * @param {function} onLikeComment - 댓글 좋아요 함수
 * @param {string} title - 카드 제목
 * @param {function} onRemoveComment - 댓글 삭제 함수
 */
const BacklogCommentContainer = ({
    comments = [],
    newComment = '',
    onCommentChange,
    onAddComment,
    onLikeComment,
    title = "댓글",
    onRemoveComment
}) => {
    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = useUserStore(state => state.user);
    
    // 답글 입력 상태 관리
    const [replyingStates, setReplyingStates] = useState({});
    const [replyContents, setReplyContents] = useState({});
    const [processedComments, setProcessedComments] = useState({ parents: [], children: [] });

    // 댓글 데이터 처리 - 삭제된 부모 댓글에 대한 더미 부모 생성
    useEffect(() => {
        // comments가 배열인지 확인하고, 아니면 빈 배열로 처리
        const commentsArray = Array.isArray(comments) ? comments : [];
        console.log('comments 타입:', typeof comments, 'Array.isArray(comments):', Array.isArray(comments));
        
        const parentComments = commentsArray.filter(comment => !comment.parentCommentId);
        const childComments = commentsArray.filter(comment => comment.parentCommentId);
        
        // 삭제된 부모 댓글을 위한 더미 부모 목록
        const missingParentIds = new Set();
        
        // 존재하지 않는 부모 ID 수집
        childComments.forEach(child => {
            const parentExists = commentsArray.some(c => c.backlogCommentId === child.parentCommentId);
            if (!parentExists) {
                missingParentIds.add(child.parentCommentId);
            }
        });
        
        // 더미 부모 댓글 생성
        const dummyParents = Array.from(missingParentIds).map(parentId => ({
            backlogCommentId: parentId,
            content: "삭제된 댓글입니다",
            nickname: "",
            createdDate: new Date().toISOString(),
            isDeleted: true, // 삭제된 댓글 표시를 위한 플래그
            userId: null, // 삭제된 댓글에는 userId가 없음
            likeCount: 0, // 삭제된 댓글에는 좋아요 수 0
            isLiked: false // 삭제된 댓글은 좋아요 상태 아님
        }));
        
        // 실제 부모 댓글과 더미 부모 댓글 합치기
        const allParents = [...parentComments, ...dummyParents];
        
        setProcessedComments({
            parents: allParents,
            children: childComments
        });
    }, [comments]);

    // 답글 작성 시작
    const handleReplyClick = (commentId) => {
        console.log(`답글 버튼 클릭: commentId=${commentId}`); // 디버깅용
        
        // 다른 댓글의 답글 입력 상태는 초기화, 선택한 댓글만 true로 설정
        const newReplyingStates = {};
        newReplyingStates[commentId] = true;
        setReplyingStates(newReplyingStates);
    };

    // 답글 내용 변경
    const handleReplyChange = (commentId, content) => {
        setReplyContents(prev => ({
            ...prev,
            [commentId]: content
        }));
    };

    // 답글 취소
    const handleCancelReply = (commentId) => {
        setReplyingStates(prev => ({
            ...prev,
            [commentId]: false
        }));
        setReplyContents(prev => ({
            ...prev,
            [commentId]: ''
        }));
    };

    // 답글 추가
    const handleAddReply = (parentCommentId) => {
        const content = replyContents[parentCommentId];
        if (content && content.trim()) {
            onAddComment(content, parentCommentId);
            handleCancelReply(parentCommentId);
        }
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 삭제 버튼 표시 여부 확인 (현재 사용자가 댓글 작성자인 경우에만 표시)
    const canDelete = (comment) => {
        if (!currentUser || !comment || comment.isDeleted) return false;
        return currentUser.userId === comment.userId;
    };

    // 댓글 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
        }
    };
    
    // 댓글 삭제 핸들러
    const handleRemove = (commentId) => {
        onRemoveComment && onRemoveComment(commentId);
    };
    
    // 좋아요 핸들러
    const handleLike = (commentId, isLiked) => {
        onLikeComment && onLikeComment(commentId, !isLiked);
    };

    // 좋아요 버튼 렌더링 함수
    const renderLikeButton = (comment) => {
        console.log(`aaaaaaaaasdasdasdcomment = ${JSON.stringify(comment)}`);
        console.log(`renderLikeButton comment.backlogCommentId=${comment.backlogCommentId}, comment.isLiked=${comment.isLiked}`);

        if (comment.isDeleted) return null;
        
        return (
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => handleLike(comment.backlogCommentId, comment.isLiked)}
                    className={`p-1 rounded-full transition-all duration-200 ${
                        comment.isLiked 
                            ? 'text-red-500 hover:bg-red-50' 
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                >
                    {comment.isLiked ? (
                        <FaHeart size={14} className="fill-current" />
                    ) : (
                        <FiHeart size={14} className="stroke-current" />
                    )}
                </button>
                {comment.likeCount > 0 && (
                    <span className={`text-xs font-medium ${
                        comment.isLiked ? 'text-red-500' : 'text-gray-500'
                    }`}>
                        {comment.likeCount}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <div className="overflow-y-auto pr-2 flex-grow h-0 min-h-0">
                <div className="space-y-2">
                    {processedComments.parents.length > 0 ? (
                        processedComments.parents.map(comment => (
                            <div key={comment.backlogCommentId} className="mb-4">
                                {/* 부모 댓글 */}
                                <div className={`flex items-start justify-between py-2 border-b border-gray-100 
                                    ${comment.isDeleted ? 'bg-gray-100 opacity-70' : ''}`}>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{comment.nickname}</span>
                                            {!comment.isDeleted && (
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(comment.createdDate)}
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-sm ${comment.isDeleted ? 'text-gray-500 italic' : 'text-gray-700'}`}>
                                            {comment.content}
                                        </span>
                                    </div>
                                    {!comment.isDeleted && (
                                        <div className="flex items-center gap-3">
                                            {/* 좋아요 버튼 */}
                                            {renderLikeButton(comment)}
                                            
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="text-xs text-blue-500 hover:text-blue-600"
                                                    onClick={() => handleReplyClick(comment.backlogCommentId)}
                                                >
                                                    답글
                                                </button>
                                                {/* 현재 사용자가 댓글 작성자인 경우에만 삭제 버튼 표시 */}
                                                {canDelete(comment) && (
                                                    <button
                                                        className="text-xs text-red-500 hover:text-red-600"
                                                        onClick={() => handleRemove(comment.backlogCommentId)}
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* 답글 입력 폼 - replyingStates에서 backlogCommentId로 확인 */}
                                {replyingStates[comment.backlogCommentId] && (
                                    <div className="ml-8 mt-2 mb-2 flex items-center gap-2">
                                        <FiCornerDownRight className="text-gray-400 mr-1" />
                                        <input
                                            type="text"
                                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                            placeholder="답글을 입력하세요"
                                            value={replyContents[comment.backlogCommentId] || ''}
                                            onChange={(e) => handleReplyChange(comment.backlogCommentId, e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.backlogCommentId)}
                                        />
                                        <button
                                            className="px-2 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
                                            onClick={() => handleAddReply(comment.backlogCommentId)}
                                        >
                                            등록
                                        </button>
                                        <button
                                            className="px-2 py-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors text-xs"
                                            onClick={() => handleCancelReply(comment.backlogCommentId)}
                                        >
                                            취소
                                        </button>
                                    </div>
                                )}
                                
                                {/* 해당 부모 댓글의 자식 댓글들 */}
                                {processedComments.children
                                    .filter(child => child.parentCommentId === comment.backlogCommentId)
                                    .map(childComment => (
                                        <div 
                                            key={childComment.backlogCommentId}
                                            className="ml-8 flex items-start justify-between py-2 border-b border-gray-100"
                                        >
                                            <div className="flex items-start">
                                                <FiCornerDownRight className="text-gray-400 mr-2 mt-1" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{childComment.nickname}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(childComment.createdDate)}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-700">{childComment.content}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* 답글 좋아요 버튼 */}
                                                {renderLikeButton(childComment)}
                                                
                                                {/* 현재 사용자가 답글 작성자인 경우에만 삭제 버튼 표시 */}
                                                {canDelete(childComment) && (
                                                    <button
                                                        className="text-xs text-red-500 hover:text-red-600"
                                                        onClick={() => handleRemove(childComment.backlogCommentId)}
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            댓글이 없습니다.
                        </div>
                    )}
                </div>
            </div>
            
            {/* 새 댓글 입력 영역 */}
            <form onSubmit={handleSubmit} className="mt-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="댓글을 입력하세요"
                        value={newComment}
                        onChange={(e) => onCommentChange(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                        disabled={!newComment.trim()}
                    >
                        <FiSend size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BacklogCommentContainer;