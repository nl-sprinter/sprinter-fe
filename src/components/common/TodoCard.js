import React from 'react';
import { useNavigate } from 'react-router-dom';
import {FiCalendar, FiCheckSquare, FiFileText} from 'react-icons/fi';

export const TodoCard = ({ todoType, content, url }) => {
    const navigate = useNavigate();

    // 알림 타입에 따른 아이콘 및 색상 설정
    const getTypeInfo = () => {
        switch (todoType) {
            case 'SCHEDULE':
                return {
                    icon: <FiCalendar size={18} />,
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-700'
                };
            case 'TASK':
                return {
                    icon: <FiCheckSquare size={18} />,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700'
                };
            default:
                return {
                    icon: <FiFileText size={18} />,
                    label: '기타',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-700'
                };
        }
    };

    const { icon, bgColor, textColor } = getTypeInfo();

    // 알림 클릭 핸들러
    const handleClick = () => {
        if (url) {
            navigate(url);
        }
    };

    return (
        <div
            className={`relative p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer`}
            onClick={handleClick}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${bgColor} ${textColor}`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 mb-1">{content}</p>
                </div>
            </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
};