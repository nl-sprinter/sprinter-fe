import React from 'react';

/**
 * 댓글 카드 컴포넌트
 * @param {array} comments - 댓글 목록
 * @param {string} newComment - 새 댓글 내용
 * @param {function} onCommentChange - 댓글 내용 변경 함수
 * @param {function} onAddComment - 댓글 추가 함수
 * @param {function} onLikeComment - 댓글 좋아요 함수
 * @param {array} allUsers - 전체 사용자 목록
 * @param {string} title - 카드 제목
 */
const CommentCard = ({
    comments = [],
    newComment = '',
    onCommentChange,
    onAddComment,
    onLikeComment,
    allUsers = [],
    title = "댓글"
}) => {
    return (
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <div className="overflow-y-auto pr-2 flex-grow h-0 min-h-0">
                <div className="space-y-2">
                    {comments.length > 0 ? (
                        comments.map(comment => {
                            const user = allUsers.find(u => u.userId === comment.userId);
                            return (
                                <div key={comment.id}
                                     className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="font-medium text-sm">{user?.nickname || '알 수 없는 사용자'}</span>
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
                                            onClick={() => onLikeComment && onLikeComment(comment.id)}
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
            <div className="mt-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="댓글을 입력하세요"
                        value={newComment}
                        onChange={(e) => onCommentChange && onCommentChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onAddComment && onAddComment()}
                    />
                    <button
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                        onClick={onAddComment}
                    >
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentCard; 