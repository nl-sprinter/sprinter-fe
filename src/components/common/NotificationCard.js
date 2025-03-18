import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiAlertTriangle, FiUsers, FiCalendar, FiMessageCircle, FiUserPlus } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export const NotificationCard = ({ key, notificationType, content, time, navigable, url, onDelete, projectId, projectName }) => {
    const navigate = useNavigate();
    
    // 알림 타입에 따른 아이콘 및 색상 설정
    const getTypeInfo = () => {
        switch (notificationType) {
            case 'COMMENT':
                return { 
                    icon: <FiMessageCircle size={18} />, 
                    bgColor: 'bg-blue-100', 
                    textColor: 'text-blue-700' 
                };
            case 'ISSUE':
                return { 
                    icon: <FiAlertTriangle size={18} />, 
                    bgColor: 'bg-red-100', 
                    textColor: 'text-red-700' 
                };
            case 'DAILYSCRUM':
                return { 
                    icon: <FiUsers size={18} />, 
                    bgColor: 'bg-yellow-100', 
                    textColor: 'text-yellow-700' 
                };
            case 'TEAMMATE':
                return { 
                    icon: <FiUserPlus size={18} />, 
                    bgColor: 'bg-green-100', 
                    textColor: 'text-green-700' 
                };
            case 'SCHEDULE':
                return { 
                    icon: <FiCalendar size={18} />, 
                    bgColor: 'bg-purple-100', 
                    textColor: 'text-purple-700' 
                };
            case 'CHATTING':
                return { 
                    icon: <FiMessageSquare size={18} />, 
                    bgColor: 'bg-indigo-100', 
                    textColor: 'text-indigo-700' 
                };
            default:
                return { 
                    icon: <FiMessageCircle size={18} />, 
                    bgColor: 'bg-gray-100', 
                    textColor: 'text-gray-700' 
                };
        }
    };

    const { icon, bgColor, textColor } = getTypeInfo();
    
    // 시간 포맷팅
    const formatTime = (timeString) => {
        try {
            const date = new Date(timeString);
            return formatDistanceToNow(date, { addSuffix: true, locale: ko });
        } catch (error) {
            return timeString;
        }
    };
    
    // 알림 클릭 핸들러
    const handleClick = () => {
        if (navigable && url) {
            navigate(url);
        }
    };
    
    return (
        <div 
            className={`
                relative p-3 rounded-lg border border-gray-200 
                ${navigable ? 'hover:bg-gray-50 cursor-pointer' : ''}
            `}
            onClick={navigable ? handleClick : undefined}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${bgColor} ${textColor}`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 mb-1">{content}</p>
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p className="text-xs text-gray-500">{formatTime(time)}</p>
                        {projectName && (
                            <p className="text-xs text-gray-500">
                                <span className="inline-block mx-1">•</span>
                                {projectName}
                            </p>
                        )}
                    </div>
                </div>
                {onDelete && (
                    <button 
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            {navigable && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
        </div>
    );
};