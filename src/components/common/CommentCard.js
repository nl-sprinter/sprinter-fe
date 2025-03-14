import React, { useState, useEffect } from 'react';
import { FiCornerDownRight, FiX } from 'react-icons/fi';

/**
 * 댓글 카드 컴포넌트
 * @param {array} comments - 댓글 목록
 * @param {string} newComment - 새 댓글 내용
 * @param {function} onCommentChange - 댓글 내용 변경 함수
 * @param {function} onAddComment - 댓글 추가 함수
 * @param {function} onLikeComment - 댓글 좋아요 함수
 * @param {array} allUsers - 전체 사용자 목록
 * @param {string} title - 카드 제목
 * @param {function} onRemoveComment - 댓글 삭제 함수
 */
const CommentCard = ({
    comments = [],
    newComment = '',
    onCommentChange,
    onAddComment,
    onLikeComment,
    allUsers = [],
    title = "댓글",
    onRemoveComment
}) => {
    // 답글 입력 상태 관리
    const [replyingStates, setReplyingStates] = useState({});
    const [replyContents, setReplyContents] = useState({});
    const [processedComments, setProcessedComments] = useState({ parents: [], children: [] });

    // 댓글 데이터 처리 - 삭제된 부모 댓글에 대한 더미 부모 생성
    useEffect(() => {
        const parentComments = comments.filter(comment => !comment.parentCommentId);
        const childComments = comments.filter(comment => comment.parentCommentId);
        
        // 삭제된 부모 댓글을 위한 더미 부모 목록
        const missingParentIds = new Set();
        
        // 존재하지 않는 부모 ID 수집
        childComments.forEach(child => {
            const parentExists = comments.some(c => c.backlogCommentId === child.parentCommentId);
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
            isDeleted: true // 삭제된 댓글 표시를 위한 플래그
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
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="text-xs text-blue-500 hover:text-blue-600"
                                                onClick={() => handleReplyClick(comment.backlogCommentId)}
                                            >
                                                답글
                                            </button>
                                            <button
                                                className="text-xs text-red-500 hover:text-red-600"
                                                onClick={() => onRemoveComment && onRemoveComment(comment.backlogCommentId)}
                                            >
                                                <FiX size={16} />
                                            </button>
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
                                            <button
                                                className="text-xs text-red-500 hover:text-red-600"
                                                onClick={() => onRemoveComment && onRemoveComment(childComment.backlogCommentId)}
                                            >
                                                <FiX size={16} />
                                            </button>
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
            <div className="mt-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="댓글을 입력하세요"
                        value={newComment}
                        onChange={(e) => onCommentChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onAddComment(newComment)}
                    />
                    <button
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                        onClick={() => onAddComment(newComment)}
                    >
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentCard; 