import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import SmallListModal from './modal/list/SmallListModal';

/**
 * 유저 출석 카드 컴포넌트
 * @param {array} attendedUsers - 출석한 유저 목록
 * @param {array} allUsers - 전체 유저 목록
 * @param {function} onUserToggle - 유저 토글 함수
 * @param {function} onUserRemove - 유저 삭제 함수
 * @param {string} title - 카드 제목
 */
const UserAttendanceCard = ({
    attendedUsers = [],
    allUsers = [],
    onUserToggle,
    onUserRemove,
    title = "참석자"
}) => {
    const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

    // 선택 가능한 유저 목록 (이미 선택된 유저 제외)
    const availableUsers = allUsers.filter(
        user => !attendedUsers.some(u => u.userId === user.userId)
    );

    return (
        <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{title}</h3>
                <button 
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    onClick={() => setIsUserListModalOpen(true)}
                >
                    <FiPlus size={18}/>
                </button>
            </div>
            <div className="overflow-x-auto pb-2">
                <div className="flex flex-nowrap gap-3 min-w-full">
                    {attendedUsers.map(user => (
                        <div 
                            key={user.userId}
                            className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 whitespace-nowrap"
                        >
                            <div className="relative group">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                                    {user.nickname.charAt(0).toUpperCase()}
                                </div>
                                <button 
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onUserRemove && onUserRemove(user)}
                                >
                                    <FiX size={10} />
                                </button>
                            </div>
                            <span className="text-sm">{user.nickname}</span>
                        </div>
                    ))}
                    {attendedUsers.length === 0 && (
                        <div className="text-center py-2 text-gray-500 w-full">
                            선택된 팀원이 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* 유저 선택 모달 */}
            <SmallListModal
                isOpen={isUserListModalOpen}
                onClose={() => setIsUserListModalOpen(false)}
                title='팀원 선택'
                items={availableUsers}
                onItemSelect={(user) => {
                    onUserToggle && onUserToggle(user);
                }}
                renderItem={(user, onClick) => (
                    <div 
                        key={user.userId}
                        className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onClick(user)}
                    >
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                            {user.nickname.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.nickname}</span>
                    </div>
                )}
            />
        </div>
    );
};

export default UserAttendanceCard; 