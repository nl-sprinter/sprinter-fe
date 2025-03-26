import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiCheckSquare, FiAlertTriangle, FiCalendar, FiUsers } from 'react-icons/fi';

const SearchCard = ({ result }) => {
    // 검색 결과 타입에 따른 아이콘 및 색상 설정
    const getTypeInfo = (type) => {
        switch (type) {
            case 'BACKLOG':
                return { 
                    icon: <FiFileText size={18} />, 
                    label: '백로그', 
                    bgColor: 'bg-blue-100', 
                    textColor: 'text-blue-700' 
                };
            case 'TASK':
                return { 
                    icon: <FiCheckSquare size={18} />, 
                    label: '태스크', 
                    bgColor: 'bg-green-100', 
                    textColor: 'text-green-700' 
                };
            case 'ISSUE':
                return { 
                    icon: <FiAlertTriangle size={18} />, 
                    label: '이슈', 
                    bgColor: 'bg-red-100', 
                    textColor: 'text-red-700' 
                };
            case 'SCHEDULE':
                return { 
                    icon: <FiCalendar size={18} />, 
                    label: '스케줄', 
                    bgColor: 'bg-purple-100', 
                    textColor: 'text-purple-700' 
                };
            case 'DAILYSCRUM':
                return { 
                    icon: <FiUsers size={18} />, 
                    label: '데일리 스크럼', 
                    bgColor: 'bg-yellow-100', 
                    textColor: 'text-yellow-700' 
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

    const { icon, label, bgColor, textColor } = getTypeInfo(result.searchType);

    return (
        <Link to={result.url} className="block">
            <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${bgColor} ${textColor}`}>
                        {icon}
                        {label}
                    </span>
                    <h3 className="ml-2 text-lg font-medium text-gray-800">{result.title}</h3>
                </div>
                <p className="text-sm text-gray-600 ml-1">{result.content}</p>
                <div className="mt-1 text-xs text-gray-400 ml-1">{result.url}</div>
            </div>
        </Link>
    );
};

export default SearchCard;