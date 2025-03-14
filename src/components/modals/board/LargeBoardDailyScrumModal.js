import React, {useState, useEffect} from 'react';
import {FiTrash2} from 'react-icons/fi';
import {
    getUsersInProject,
    getSprintBacklogList,
    getDailyScrumUserList,
    addUserToDailyScrum,
    deleteUserFromDailyScrum,
    getBacklogListInDailyScrum,
    addBacklogToDailyScrum,
    removeBacklogFromDailyScrum,
    getDailyScrumContent,
    saveDailyScrumContent,
    deleteDailyScrum
} from '../../../api/projectApi';
import SmallListModal from '../list/SmallListModal';
import SmallFormModal from '../form/SmallFormModal';
import UserAttendanceContainer from '../../containers/UserAttendanceContainer';
import DailyScrumBacklogContainer from '../../containers/DailyScrumBacklogContainer';
import DailyScrumContentContainer from '../../containers/DailyScrumContentContainer';
import LargeModal from './LargeBoardModal';
import SmallInfoModal from '../info/SmallInfoModal';
import WeightIndicator from '../../common/WeightIndicator';

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
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBacklogListModalOpen, setIsBacklogListModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
                    console.error('Backlog 목록을 불러오는데 실패했습니다:', err);
                }
            };

            Promise.all([fetchUsers(), fetchBacklogs()])
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, projectId, sprintId]);

    // 데일리 스크럼 데이터 로드
    useEffect(() => {
        if (dailyScrum && isOpen) {
            fetchDailyScrumUsers();
            fetchDailyScrumBacklogs();
            fetchDailyScrumContent();
        }
    }, [dailyScrum, isOpen]);

    // 데일리 스크럼 참석자 목록 조회
    const fetchDailyScrumUsers = async () => {
        if (!dailyScrum || !projectId || !sprintId) return;

        setIsLoading(true);
        try {
            const data = await getDailyScrumUserList(projectId, sprintId, dailyScrum.dailyScrumId);
            setAttendedUsers(data);
        } catch (err) {
            console.error('Daily Scrum 참석자 목록을 불러오는데 실패했습니다:', err);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: '참석자 목록을 불러오는데 실패했습니다.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 데일리 스크럼 백로그 목록 조회
    const fetchDailyScrumBacklogs = async () => {
        if (!dailyScrum || !projectId || !sprintId) return;

        setIsLoading(true);
        try {
            const data = await getBacklogListInDailyScrum(projectId, sprintId, dailyScrum.dailyScrumId);
            setSelectedBacklogs(data);
        } catch (err) {
            console.error('Daily Scrum Backlog 목록을 불러오는데 실패했습니다:', err);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: 'Backlog 목록을 불러오는데 실패했습니다.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 데일리 스크럼 콘텐츠 조회
    const fetchDailyScrumContent = async () => {
        if (!dailyScrum || !projectId || !sprintId) return;

        setIsLoading(true);
        try {
            const data = await getDailyScrumContent(projectId, sprintId, dailyScrum.dailyScrumId);
            setContent(data.content || '');
        } catch (err) {
            console.error('데일리 스크럼 회의노트를 불러오는데 실패했습니다:', err);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: '회의 내용을 불러오는데 실패했습니다.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserToggle = async (user) => {
        if (!dailyScrum) return;

        if (!attendedUsers.some(u => u.userId === user.userId)) {
            try {
                await addUserToDailyScrum(projectId, sprintId, dailyScrum.dailyScrumId, user.userId);
                // 서버에서 최신 참석자 목록 다시 조회
                await fetchDailyScrumUsers();
            } catch (err) {
                console.error('참석자 추가에 실패했습니다:', err);
                setInfoModal({
                    isOpen: true,
                    title: '오류',
                    message: '참석자 추가에 실패했습니다.',
                    type: 'error'
                });
            }
        }
    };

    const handleUserRemove = async (user) => {
        if (!dailyScrum) return;

        try {
            await deleteUserFromDailyScrum(projectId, sprintId, dailyScrum.dailyScrumId, user.userId);
            // 서버에서 최신 참석자 목록 다시 조회
            await fetchDailyScrumUsers();
        } catch (err) {
            console.error('참석자 삭제에 실패했습니다:', err);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: '참석자 삭제에 실패했습니다.',
                type: 'error'
            });
        }
    };

    const handleAddBacklog = () => {
        setIsBacklogListModalOpen(true);
    };

    const handleBacklogSelect = async (backlog) => {
        console.log(`backlog = ${JSON.stringify(backlog)}`);
        if (!dailyScrum) return;

        if (!selectedBacklogs.some(b => b.backlogId === backlog.backlogId)) {
            try {
                await addBacklogToDailyScrum(projectId, sprintId, dailyScrum.dailyScrumId, backlog.backlogId);
                // 서버에서 최신 백로그 목록 다시 조회
                await fetchDailyScrumBacklogs();
            } catch (err) {
                console.error('Backlog 추가에 실패했습니다:', err);
                setInfoModal({
                    isOpen: true,
                    title: '오류',
                    message: 'Backlog 추가에 실패했습니다.',
                    type: 'error'
                });
            }
        }
    };

    const handleRemoveBacklog = async (backlog) => {
        if (!dailyScrum) return;

        try {
            await removeBacklogFromDailyScrum(projectId, sprintId, dailyScrum.dailyScrumId, backlog.backlogId);
            // 서버에서 최신 백로그 목록 다시 조회
            await fetchDailyScrumBacklogs();
        } catch (err) {
            console.error('Backlog 삭제에 실패했습니다:', err);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: 'Backlog 삭제에 실패했습니다.',
                type: 'error'
            });
        }
    };

    // 회의노트 저장 처리
    const handleSaveContent = async () => {
        if (!dailyScrum) return;

        setIsLoading(true);
        try {
            await saveDailyScrumContent(projectId, sprintId, dailyScrum.dailyScrumId, content);
            setInfoModal({
                isOpen: true,
                title: '저장 완료',
                message: 'Daily Scrum 내용이 성공적으로 저장되었습니다.',
                type: 'success'
            });
        } catch (err) {
            console.error('회의노트 저장에 실패했습니다:', err);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: 'Daily Scrum 내용 저장에 실패했습니다.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 데일리 스크럼 삭제 확인 모달 열기
    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    // 데일리 스크럼 삭제 처리
    const handleDeleteDailyScrum = async () => {
        if (!dailyScrum) return;

        setIsLoading(true);
        try {
            await deleteDailyScrum(projectId, sprintId, dailyScrum.dailyScrumId);
            setIsDeleteModalOpen(false);

            // 삭제 성공 후 모달 닫기 및 부모 컴포넌트에 알림
            onSubmit && onSubmit();
            onClose();
        } catch (err) {
            console.error('Daily Scrum 삭제에 실패했습니다:', err);
            setInfoModal({
                isOpen: true,
                title: '오류',
                message: 'Daily Scrum 삭제에 실패했습니다.',
                type: 'error'
            });
            setIsLoading(false);
        }
    };

    // 모달 제목에 날짜 표시
    const getModalTitle = () => {
        if (!dailyScrum) return "새 Daily Scrum";

        const date = new Date(dailyScrum.createdAt);
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');

        return `Daily Scrum - ${formattedDate}`;
    };

    // 선택 가능한 백로그 목록 (이미 선택된 백로그 제외)
    const availableBacklogs = backlogs.filter(
        backlog => !selectedBacklogs.some(b => b.backlogId === backlog.backlogId)
    );

    // 백로그 렌더링 함수 (완료된 백로그에 취소선과 회색 배경 적용)
    const renderBacklogItem = (backlog, onClick) => (
        <div
            key={backlog.backlogId}
            className={`flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                backlog.isFinished ? 'bg-gray-100' : ''
            }`}
            onClick={() => onClick(backlog)}
        >
            <div className="flex items-center space-x-2">
                <span className={`text-sm ${backlog.isFinished ? 'line-through text-gray-500' : ''}`}>
                    {backlog.title}
                </span>
                <WeightIndicator weight={backlog.weight} size="small" showLabel={false}/>
            </div>
        </div>
    );

    // 삭제 버튼 렌더링 (기존 데일리 스크럼에만 표시)
    const renderDeleteButton = () => {
        if (!dailyScrum) return null;

        return (
            <button
                onClick={handleOpenDeleteModal}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors mr-2"
                title="Daily Scrum 삭제"
            >
                <FiTrash2 size={18}/>
            </button>
        );
    };

    return (
        <>
            <LargeModal
                isOpen={isOpen}
                onClose={() => {
                    // 모달이 닫힐 때 부모 컴포넌트에 변경 사항 알림
                    onSubmit && onSubmit();
                    onClose();
                }}
                title={
                    <div className="flex items-center">
                        <span>{getModalTitle()}</span>
                    </div>
                }
                extraHeaderContent={renderDeleteButton()}
            >
                {/* 유저 출석 카드 */}
                <UserAttendanceContainer
                    attendedUsers={attendedUsers}
                    allUsers={users}
                    onUserToggle={handleUserToggle}
                    onUserRemove={handleUserRemove}
                    title={`참석자 (${attendedUsers.length}명)`}
                />

                <div className="p-2"/>

                <div className="grid grid-cols-2 gap-3 h-[calc(100%-120px)]">
                    {/* 주제 백로그 컨테이너 */}
                    <DailyScrumBacklogContainer
                        selectedBacklogs={selectedBacklogs}
                        onAddBacklog={handleAddBacklog}
                        onRemoveBacklog={handleRemoveBacklog}
                        isLoading={isLoading}
                        title="주제 Backlog"
                    />

                    {/* 데일리스크럼 내용 컨테이너 */}
                    <DailyScrumContentContainer
                        value={content}
                        onChange={setContent}
                        onSave={handleSaveContent}
                    />
                </div>
            </LargeModal>

            {/* 백로그 선택 모달 */}
            <SmallListModal
                isOpen={isBacklogListModalOpen}
                onClose={() => setIsBacklogListModalOpen(false)}
                title="Backlog 선택"
                items={availableBacklogs}
                onItemSelect={handleBacklogSelect}
                renderItem={renderBacklogItem}
            />

            {/* 삭제 확인 모달 */}
            <SmallFormModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Daily Scrum 삭제"
                submitText="삭제"
                cancelText="취소"
                onSubmit={handleDeleteDailyScrum}
            >
                이 Daily Scrum 을 삭제하시겠습니까?
            </SmallFormModal>

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