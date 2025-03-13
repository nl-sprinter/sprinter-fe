import React from 'react';
import { FiPlus, FiX, FiEdit2 } from 'react-icons/fi';

/**
 * 이슈 선택 카드 컴포넌트
 * @param {array} issues - 이슈 목록
 * @param {function} onAddIssue - 이슈 추가 함수
 * @param {function} onRemoveIssue - 이슈 삭제 함수
 * @param {function} onIssueResolution - 이슈 해결 상태 변경 함수
 * @param {function} onIssueAssignment - 이슈 할당 함수
 * @param {function} onEditIssue - 이슈 수정 함수
 * @param {string} title - 카드 제목
 * @param {function} renderUserAvatar - 사용자 아바타 렌더링 함수
 */
const IssueSelectCard = ({
    issues = [],
    onAddIssue,
    onRemoveIssue,
    onIssueResolution,
    onIssueAssignment,
    onEditIssue,
    title = "이슈",
    renderUserAvatar
}) => {
    // 진행 중/완료된 이슈 개수 계산
    const completedIssues = issues.filter(issue => issue.isChecked).length;
    const inProgressIssues = issues.length - completedIssues;

    return (
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-lg font-medium">{title}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                        진행중 <span className="text-orange-600 font-medium">{inProgressIssues}</span>, 
                        완료 <span className="text-orange-600 font-medium">{completedIssues}</span>
                    </div>
                </div>
                <button
                    className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                    onClick={onAddIssue}
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
                                className={`flex items-center justify-between p-3 rounded-lg border w-full transition-colors
                                    ${issue.isChecked 
                                        ? 'bg-gray-100 border-gray-300 opacity-70' 
                                        : 'bg-orange-50 border-orange-200'}`}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {/* 체크박스 */}
                                    <input
                                        type="checkbox"
                                        checked={issue.isChecked}
                                        onChange={() => onIssueResolution && onIssueResolution(issue.id)}
                                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 flex-shrink-0"
                                    />
                                    {/* content */}
                                    <span
                                        className={`text-sm truncate ${issue.isChecked ? 'line-through text-gray-400' : ''}`}>
                                        {issue.content}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {/* 수정 버튼 */}
                                    <button
                                        className="p-1 text-blue-500 hover:bg-blue-50 rounded-full flex-shrink-0"
                                        onClick={() => onEditIssue && onEditIssue(issue.id, issue.content)}
                                    >
                                        <FiEdit2 size={16}/>
                                    </button>
                                    {/* 삭제 버튼 */}
                                    <button
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                                        onClick={() => onRemoveIssue && onRemoveIssue(issue.id)}
                                    >
                                        <FiX size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 h-full flex flex-col justify-center">
                            이슈가 없습니다.
                            <div className="mt-2 text-sm text-orange-600">
                                우측 상단의 + 버튼을 눌러 이슈를 추가하세요.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IssueSelectCard; 