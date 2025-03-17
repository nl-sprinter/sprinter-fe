import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import SmallListModal from '../modals/list/SmallListModal';

/**
 * User 출석 컴포넌트
 * @param {array} attendedUsers - 출석한 유저 목록
 * @param {array} allUsers - 전체 유저 목록
 * @param {function} onUserToggle - 유저 토글 함수
 * @param {function} onUserRemove - 유저 삭제 함수
 * @param {string} title - 카드 제목
 */
const UserAttendanceContainer = ({
    attendedUsers = [],
    allUsers = [],
    onUserToggle,
    onUserRemove,
    title = "참석자"
}) => {
    const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
    const [hoveredUserId, setHoveredUserId] = useState(null);
    

    // 선택 가능한 유저 목록 (이미 선택된 유저 제외)
    const availableUsers = allUsers.filter(
        user => !attendedUsers.some(u => u.userId === user.userId)
    );
    
    const openUserListModal = () => {
        setIsUserListModalOpen(true);
    };
    
    const closeUserListModal = () => {
        console.log(`UserAttendanceContainer.closeUserListModal 호출`);
        setIsUserListModalOpen(false);
    };
    
    // 직접 사용자를 선택하는 함수
    const selectUser = (user) => {
        console.log(`UserAttendanceContainer.selectUser = ${user.userId}`);
        onUserToggle && onUserToggle(user);
        closeUserListModal();
    };

    return (
        <div className="bg-gray-50 p-3 rounded-lg h-[100px]">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{title}</h3>
                <button 
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    onClick={openUserListModal}
                >
                    <FiPlus size={18}/>
                </button>
            </div>
            <div className="overflow-y-auto max-h-[50px]">
                <div className="flex flex-wrap gap-2">
                    {attendedUsers.map(user => (
                        <div 
                            key={user.userId}
                            className={`relative flex items-center gap-2 px-3 py-1 rounded-lg border whitespace-nowrap transition-all duration-200 cursor-pointer
                                ${hoveredUserId === user.userId 
                                    ? 'bg-red-50 border-red-500 text-red-500' 
                                    : 'bg-white border-gray-200'}`}
                            onMouseEnter={() => setHoveredUserId(user.userId)}
                            onMouseLeave={() => setHoveredUserId(null)}
                            onClick={() => hoveredUserId === user.userId && onUserRemove && onUserRemove(user)}
                        >
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                                {user.nickname.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm">{user.nickname}</span>
                            
                            {hoveredUserId === user.userId && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 rounded-lg text-red-500">
                                    <div className="flex items-center gap-1">
                                        <FiX size={14} />
                                        <span className="text-sm">삭제</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {attendedUsers.length === 0 && (
                        <div className="text-center text-gray-500 w-full">
                            선택된 팀원이 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* 유저 선택 모달 */}
            <div className="relative z-[1200]">
                <SmallListModal
                    isOpen={isUserListModalOpen}
                    onClose={closeUserListModal}
                    title='팀원 선택'
                    items={availableUsers}
                    onItemSelect={selectUser}
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
        </div>
    );
};

export default UserAttendanceContainer;