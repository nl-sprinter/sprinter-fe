import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const ChatBubble = ({ message, isCurrentUser }) => {
    // 시간 포맷팅
    const formatTime = (timeString) => {
        if (!timeString) return '';
        
        try {
            const date = new Date(timeString);
            return formatDistanceToNow(date, { addSuffix: true, locale: ko });
        } catch (error) {
            console.error('ChatBubble.formatTime 에러: 시간 포맷팅 에러', error);
            return timeString;
        }
    };

    return (
        <div className="mb-3">
            {/* 사용자 이름 - 버블 바깥 위에 표시 */}
            {!isCurrentUser && (
                <div className="text-xs font-medium text-gray-600 mb-1 ml-2">
                    {message.nickname}
                </div>
            )}
            
            <div className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {/* 메시지 버블과 시간 (내가 보낸 메시지) */}
                {isCurrentUser && (
                    <>
                        <div className="text-xs text-gray-400 mr-2 mb-1">
                            {formatTime(message.timeStamp)}
                        </div>
                        <div className="max-w-[80%] px-3 py-2 rounded-lg bg-green-500 text-white rounded-tr-none">
                            <div className="whitespace-pre-wrap break-words">
                                {message.content}
                            </div>
                        </div>
                    </>
                )}
                
                {/* 메시지 버블과 시간 (상대방 메시지) */}
                {!isCurrentUser && (
                    <>
                        <div className="max-w-[80%] px-3 py-2 rounded-lg bg-white text-gray-800 rounded-tl-none">
                            <div className="whitespace-pre-wrap break-words">
                                {message.content}
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-2 mb-1">
                            {formatTime(message.timeStamp)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatBubble; 