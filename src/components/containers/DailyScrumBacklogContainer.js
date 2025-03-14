import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import WeightIndicator from '../common/WeightIndicator';

/**
 * 백로그 선택 카드 컴포넌트
 * @param {array} selectedBacklogs - 선택된 백로그 목록
 * @param {function} onAddBacklog - 백로그 추가 버튼 클릭 시 호출할 함수
 * @param {function} onRemoveBacklog - 백로그 삭제 버튼 클릭 시 호출할 함수
 * @param {boolean} isLoading - 로딩 상태
 * @param {string} title - 카드 제목 (기본값: "주제 백로그")
 */
const DailyScrumBacklogContainer = ({
    selectedBacklogs = [],
    onAddBacklog,
    onRemoveBacklog,
    isLoading = false,
    title = "주제 백로그"
}) => {
    return (
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{title}</h3>
                <button 
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    onClick={onAddBacklog}
                >
                    <FiPlus size={18}/>
                </button>
            </div>
            
            {isLoading ? (
                <div className="text-center py-4">로딩 중...</div>
            ) : (
                <div className="overflow-y-auto pr-2 flex-grow h-0 min-h-0">
                    <div className="space-y-2 w-full">
                        {selectedBacklogs.length > 0 ? (
                            selectedBacklogs.map(backlog => (
                                <div 
                                    key={backlog.backlogId}
                                    className={`flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 w-full ${
                                        backlog.isFinished ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-2 flex-grow overflow-hidden">
                                        <span className={`text-sm truncate ${backlog.isFinished ? 'line-through text-gray-500' : ''}`}>
                                            {backlog.title}
                                        </span>
                                        <WeightIndicator weight={backlog.weight} size="small" showLabel={false} />
                                    </div>
                                    <button 
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0 ml-2"
                                        onClick={() => onRemoveBacklog(backlog)}
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                선택된 백로그가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyScrumBacklogContainer;