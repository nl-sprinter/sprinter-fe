import React, { useState, useEffect } from 'react';
import { getUsersInProject, getSprintBacklogList } from '../../../../api/projectApi';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';
import SmallListModal from '../list/SmallListModal';
import UserAttendanceCard from '../../UserAttendanceCard';
import LargeModal from './LargeBoardModal';
import SmallInfoModal from '../SmallInfoModal';

const LargeBoardDailyScrumModal = ({
    isOpen,
    onClose,
    onSubmit,
    projectId,
    sprintId,
    dailyScrum
}) => {
    const [users, setUsers] = useState([]);
    const [backlogs, setBacklogs] = useState([]);
    const [attendedUsers, setAttendedUsers] = useState([]);
    const [selectedBacklogs, setSelectedBacklogs] = useState([]);
    const [meetingNote, setMeetingNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBacklogListModalOpen, setIsBacklogListModalOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    // 프로젝트 유저 및 백로그 데이터 로드
    useEffect(() => {
        if (isOpen && projectId && sprintId) {
            setIsLoading(true);
            
            // 프로젝트 유저 로드
            const fetchUsers = async () => {
                try {
                    const data = await getUsersInProject(projectId);
                    setUsers(data);
                } catch (err) {
                    console.error('프로젝트 유저 목록을 불러오는데 실패했습니다:', err);
                }
            };
            
            // 스프린트 백로그 로드
            const fetchBacklogs = async () => {
                try {
                    const data = await getSprintBacklogList(projectId, sprintId);
                    setBacklogs(data);
                } catch (err) {
                    console.error('스프린트 백로그 목록을 불러오는데 실패했습니다:', err);
                }
            };
            
            Promise.all([fetchUsers(), fetchBacklogs()])
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, projectId, sprintId]);

    // 데일리 스크럼 데이터 로드
    useEffect(() => {
        if (dailyScrum) {
            // 여기서 데일리 스크럼 데이터를 기반으로 상태 초기화
            // 실제 API 연동 시 구현
            setAttendedUsers([]);
            setSelectedBacklogs([]);
            setMeetingNote('');
        }
    }, [dailyScrum]);

    const handleUserToggle = (user) => {
        if (!attendedUsers.some(u => u.userId === user.userId)) {
            setAttendedUsers(prev => [...prev, user]);
        }
    };

    const handleUserRemove = (user) => {
        setAttendedUsers(prev => 
            prev.filter(u => u.userId !== user.userId)
        );
    };

    const handleAddBacklog = () => {
        setIsBacklogListModalOpen(true);
    };

    const handleBacklogSelect = (backlog) => {
        if (!selectedBacklogs.some(b => b.backlogId === backlog.backlogId)) {
            setSelectedBacklogs(prev => [...prev, backlog]);
        }
    };

    const handleRemoveBacklog = (backlog) => {
        setSelectedBacklogs(prev => 
            prev.filter(b => b.backlogId !== backlog.backlogId)
        );
    };

    // 회의노트 저장 처리
    const handleSaveNote = () => {
        // 실제 API 연동 시 구현
        console.log('회의노트 저장:', meetingNote);
        // 저장 성공 시 알림 표시 등의 처리
        setInfoModal({
            isOpen: true,
            title: '저장 완료',
            message: '회의노트가 성공적으로 저장되었습니다.',
            type: 'success'
        });
    };

    // 모달 제목에 날짜 표시
    const getModalTitle = () => {
        if (!dailyScrum) return "새 데일리 스크럼";
        
        const date = new Date(dailyScrum.createdAt);
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
        
        return `데일리 스크럼 - ${formattedDate}`;
    };

    // 선택 가능한 백로그 목록 (이미 선택된 백로그 제외)
    const availableBacklogs = backlogs.filter(
        backlog => !selectedBacklogs.some(b => b.backlogId === backlog.backlogId)
    );

    return (
        <>
            <LargeModal
                isOpen={isOpen}
                onClose={onClose}
                title={getModalTitle()}
            >
                <div className="flex flex-col space-y-4 h-[calc(100vh-200px)]">
                    {/* 1. 유저 출석 카드 - 3/20 비율 */}
                    <div className="h-[calc(100%*3/20)]">
                        {isLoading ? (
                            <div className="bg-gray-50 p-3 rounded-lg h-full">
                                <h3 className="text-lg font-medium mb-3">참석자</h3>
                                <div className="text-center py-4">로딩 중...</div>
                            </div>
                        ) : (
                            <UserAttendanceCard
                                attendedUsers={attendedUsers}
                                allUsers={users}
                                onUserToggle={handleUserToggle}
                                onUserRemove={handleUserRemove}
                                title={`참석자 (${attendedUsers.length}명)`}
                            />
                        )}
                    </div>

                    {/* 2. 주제 백로그와 회의노트를 한 행에 배치 - 17/20 비율 */}
                    <div className="grid grid-cols-2 gap-4 h-[calc(100%*17/20)]">
                        {/* 주제 백로그 카드 */}
                        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-medium">주제 백로그</h3>
                                <button 
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    onClick={handleAddBacklog}
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
                                                    className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 w-full"
                                                >
                                                    <span className="text-sm truncate">{backlog.title}</span>
                                                    <button 
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                                                        onClick={() => handleRemoveBacklog(backlog)}
                                                    >
                                                        <FiX size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-gray-500 bg-white rounded-lg border border-gray-200">
                                                선택된 백로그가 없습니다.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 회의노트 */}
                        <div className="bg-gray-50 p-3 rounded-lg flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-medium">회의노트</h3>
                                <button 
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    onClick={handleSaveNote}
                                    title="회의노트 저장"
                                >
                                    <FiSave size={18}/>
                                </button>
                            </div>
                            <div className="border border-gray-300 rounded-lg overflow-hidden flex-grow flex flex-col">
                                <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center gap-2">
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <span className="font-bold">B</span>
                                    </button>
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <span className="italic">I</span>
                                    </button>
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <span className="underline">U</span>
                                    </button>
                                    <div className="h-4 w-px bg-gray-300 mx-1"></div>
                                    <button className="p-1 hover:bg-gray-200 rounded text-sm">H1</button>
                                    <button className="p-1 hover:bg-gray-200 rounded text-sm">H2</button>
                                    <button className="p-1 hover:bg-gray-200 rounded text-sm">H3</button>
                                </div>
                                <textarea
                                    className="w-full p-3 flex-grow focus:outline-none"
                                    placeholder="마크다운을 사용하여 회의 내용을 작성하세요..."
                                    value={meetingNote}
                                    onChange={(e) => setMeetingNote(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </LargeModal>

            {/* 백로그 선택 모달 */}
            <SmallListModal
                isOpen={isBacklogListModalOpen}
                onClose={() => setIsBacklogListModalOpen(false)}
                title="백로그 선택"
                items={availableBacklogs}
                onItemSelect={handleBacklogSelect}
                renderItem={(backlog, onClick) => (
                    <div 
                        key={backlog.backlogId}
                        className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onClick(backlog)}
                    >
                        <span className="text-sm">{backlog.title}</span>
                    </div>
                )}
            />

            {/* 알림 모달 */}
            <SmallInfoModal
                isOpen={infoModal.isOpen}
                onClose={() => setInfoModal({...infoModal, isOpen: false})}
                title={infoModal.title}
                message={infoModal.message}
                type={infoModal.type}
            />
        </>
    );
};

export default LargeBoardDailyScrumModal;