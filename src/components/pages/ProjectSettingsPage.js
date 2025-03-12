import Layout from '../common/layout/Layout';
import PageTitle from '../common/PageTitle';
import SettingsCard from '../common/card/SettingsCard';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { deleteProject, updateProjectName, getUsersInProject, searchUserToAddProject, addUserToProject, removeUserFromProject } from '../../api/projectApi';
import { useUserProjectStore } from '../../store/useUserProjectStore';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import SmallFormModal from '../common/modal/form/SmallFormModal';
import SmallInfoModal from '../common/modal/SmallInfoModal';

const ProjectSettingsPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const { projects, fetchProjects } = useUserProjectStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });
    const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);

    useEffect(() => {
        const currentProject = projects.find(p => p.projectId === parseInt(projectId));
        if (currentProject) {
            setProjectName(currentProject.projectName);
            setNewProjectName(currentProject.projectName);
        }
        
        fetchUsers();
    }, [projectId, projects]);

    const fetchUsers = async () => {
        try {
            const data = await getUsersInProject(projectId);
            setUsers(data);
        } catch (error) {
            console.error('팀원 목록을 불러오는데 실패했습니다:', error);
        }
    };

    const handleDeleteProject = async () => {
        try {
            setIsDeleting(true);
            await deleteProject(projectId);
            setIsDeleteModalOpen(false);
            setInfoModal({
                isOpen: true,
                title: '프로젝트 삭제 완료',
                message: '프로젝트가 성공적으로 삭제되었습니다.',
                type: 'success'
            });
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '프로젝트 삭제 실패',
                message: error.message || '프로젝트 삭제에 실패했습니다.',
                type: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateProjectName = async () => {
        if (!newProjectName.trim()) {
            alert('프로젝트 이름을 입력해주세요.');
            return;
        }

        if (newProjectName === projectName) {
            alert('현재 프로젝트 이름과 동일합니다.');
            return;
        }

        try {
            setIsUpdating(true);
            await updateProjectName(projectId, newProjectName);
            await fetchProjects(); // 프로젝트 목록 새로고침
            setProjectName(newProjectName);
            setIsEditing(false);
            setInfoModal({
                isOpen: true,
                title: '프로젝트명 변경 완료',
                message: '프로젝트명이 성공적으로 변경되었습니다.',
                type: 'success'
            });
        } catch (error) {
            alert('프로젝트 이름 변경 중 오류가 발생했습니다.');
            console.error('프로젝트 이름 변경 실패:', error);
            setNewProjectName(projectName); // 에러 시 원래 이름으로 복구
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) return;
        
        try {
            setIsSearching(true);
            setHasSearched(true);
            const results = await searchUserToAddProject(projectId, searchKeyword);
            // 이미 프로젝트에 있는 유저 필터링
            const filteredResults = results.filter(user => 
                !users.some(existingUser => existingUser.userId === user.userId) &&
                !selectedUsers.some(selectedUser => selectedUser.userId === user.userId)
            );
            setSearchResults(filteredResults);
        } catch (error) {
            console.error('유저 검색에 실패했습니다:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // 검색어 변경 핸들러 추가
    const handleSearchKeywordChange = (e) => {
        setSearchKeyword(e.target.value);
        setHasSearched(false); // 검색어가 변경되면 hasSearched 초기화
    };

    const handleAddUser = async () => {
        if (selectedUsers.length === 0) {
            setIsAddUserModalOpen(false);
            return;
        }

        let hasError = false;
        let errorMessage = '';

        try {
            // 선택된 모든 유저를 프로젝트에 추가
            for (const user of selectedUsers) {
                try {
                    await addUserToProject(projectId, user.userId);
                } catch (error) {
                    hasError = true;
                    errorMessage = error.message || `${user.nickname} 추가 중 오류가 발생했습니다.`;
                    break;
                }
            }

            // 성공 또는 실패 모달 표시
            if (hasError) {
                setInfoModal({
                    isOpen: true,
                    title: '팀원 추가 실패',
                    message: errorMessage,
                    type: 'error'
                });
            } else {
                setInfoModal({
                    isOpen: true,
                    title: '팀원 추가 완료',
                    message: '선택한 팀원이 성공적으로 추가되었습니다.',
                    type: 'success'
                });
                // 상태 초기화
                setSelectedUsers([]);
                setSearchResults([]);
                setSearchKeyword('');
                // 유저 목록 새로고침
                fetchUsers();
            }

            setIsAddUserModalOpen(false);
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '팀원 추가 실패',
                message: error.message || '팀원 추가 중 오류가 발생했습니다.',
                type: 'error'
            });
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUsers([...selectedUsers, user]);
        setSearchResults(searchResults.filter(u => u.userId !== user.userId));
    };

    const handleRemoveSelectedUser = (user) => {
        setSelectedUsers(selectedUsers.filter(u => u.userId !== user.userId));
        setSearchResults([...searchResults, user]);
    };

    const handleRemoveUserClick = (user) => {
        setUserToRemove(user);
        setIsRemoveUserModalOpen(true);
    };

    const handleRemoveUser = async () => {
        if (!userToRemove) return;

        try {
            await removeUserFromProject(projectId, userToRemove.userId);
            
            setInfoModal({
                isOpen: true,
                title: '팀원 삭제 완료',
                message: `${userToRemove.nickname} 님이 프로젝트에서 삭제되었습니다.`,
                type: 'success'
            });
            
            // 팀원 목록 새로고침
            fetchUsers();
            setIsRemoveUserModalOpen(false);
            setUserToRemove(null);
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '팀원 삭제 실패',
                message: error.message || '팀원 삭제 중 오류가 발생했습니다.',
                type: 'error'
            });
        }
    };

    return (
        <Layout showFunctions showSidebar>
            <PageTitle 
                title="프로젝트 설정" 
                rightContent={
                    <button 
                        onClick={() => navigate(`/projects/${projectId}/overview`)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <IoMdClose size={20} />
                    </button>
                }
            />
            
            <div className="max-w-2xl space-y-6">
                <SettingsCard
                    title="프로젝트 이름 변경"
                    description="프로젝트의 이름을 변경합니다."
                >
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                            onClick={handleUpdateProjectName}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? '변경 중...' : '변경'}
                        </button>
                    </div>
                </SettingsCard>

                <SettingsCard
                    title="팀원 관리"
                    description="프로젝트에 참여하는 팀원을 관리합니다."
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <p className="text-gray-600">인원 </p>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                {users.length}명
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAddUserModalOpen(true)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                            <FiPlus size={16} />
                            <span>팀원 추가</span>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        {users.map((user) => (
                            <div 
                                key={user.userId} 
                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                                    {user.nickname.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{user.nickname}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                                <div className="text-xs px-2 py-1 rounded-full mr-2 flex items-center gap-1"
                                    style={{
                                        backgroundColor: user.isProjectLeader ? '#FEF3C7' : '#DBEAFE',
                                        color: user.isProjectLeader ? '#92400E' : '#1E40AF'
                                    }}
                                >
                                    {user.isProjectLeader ? '팀장' : '팀원'}
                                </div>
                                {!user.isProjectLeader && (
                                    <button
                                        type="button"
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="팀원 삭제"
                                        onClick={() => handleRemoveUserClick(user)}
                                    >
                                        <FiX size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                아직 팀원이 없습니다. 팀원을 추가해보세요.
                            </div>
                        )}
                    </div>
                </SettingsCard>

                <SettingsCard
                    title="프로젝트 삭제"
                    description="이 작업은 되돌릴 수 없습니다."
                >
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            프로젝트 삭제
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteProject}
                                    disabled={isDeleting}
                                    className={`px-4 py-2 bg-red-500 text-white rounded-lg transition-colors ${
                                        isDeleting 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:bg-red-600'
                                    }`}
                                >
                                    {isDeleting ? '삭제 중...' : '삭제 확인'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
                </SettingsCard>
            </div>

            {/* 프로젝트 삭제 확인 모달 */}
            <SmallFormModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="프로젝트 삭제 확인"
                submitText="삭제"
                onSubmit={handleDeleteProject}
            >
                <div className="space-y-4">
                    <p className="text-red-600 font-medium">
                        ⚠️ 경고: 프로젝트 삭제는 되돌릴 수 없습니다!
                    </p>
                    <p className="text-gray-600">
                        프로젝트를 삭제하면 다음과 같은 데이터가 영구적으로 삭제됩니다:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>모든 스프린트 데이터</li>
                        <li>모든 백로그 데이터</li>
                        <li>프로젝트 설정 및 팀원 정보</li>
                    </ul>
                    <p className="text-gray-600">
                        정말로 프로젝트를 삭제하시겠습니까?
                    </p>
                </div>
            </SmallFormModal>

            {/* 팀원 추가 모달 */}
            <SmallFormModal
                isOpen={isAddUserModalOpen}
                onClose={() => {
                    setIsAddUserModalOpen(false);
                    setSearchResults([]);
                    setSelectedUsers([]);
                    setSearchKeyword('');
                    setHasSearched(false);
                }}
                title="팀원 추가"
                submitText="추가"
                onSubmit={handleAddUser}
            >
                <div className="space-y-6">
                    {/* 검색 영역 - 폼 제출을 방지하기 위해 div로 감싸기 */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={handleSearchKeywordChange}
                            placeholder="이메일 또는 닉네임으로 검색"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                            disabled={isSearching || !searchKeyword.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSearching ? '검색 중...' : (
                                <>
                                    <FiSearch size={16} />
                                    검색
                                </>
                            )}
                        </button>
                    </div>

                    {/* 검색 결과 */}
                    {hasSearched && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">검색 결과</h3>
                            {isSearching ? (
                                <div className="p-8 border border-gray-200 rounded-md text-center">
                                    <div className="inline-block animate-spin h-6 w-6 border-2 border-gray-300 border-t-green-500 rounded-full mr-2"></div>
                                    <span className="text-gray-600">검색 중...</span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                                    {searchResults.map((user) => (
                                        <div 
                                            key={user.userId} 
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                                                {user.nickname.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{user.nickname}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                            <FiPlus size={16} className="text-green-600" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border border-gray-200 rounded-md text-center text-gray-500">
                                    <p>'{searchKeyword}'에 대한 검색 결과가 없습니다.</p>
                                    <p className="text-sm mt-1">다른 키워드로 검색해보세요.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 선택된 유저 */}
                    {selectedUsers.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">추가할 유저</h3>
                            <div className="space-y-2">
                                {selectedUsers.map((user) => (
                                    <div 
                                        key={user.userId} 
                                        className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-md"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                                            {user.nickname.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{user.nickname}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemoveSelectedUser(user);
                                            }}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </SmallFormModal>

            {/* 알림 모달 */}
            <SmallInfoModal
                isOpen={infoModal.isOpen}
                onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
                title={infoModal.title}
                message={infoModal.message}
                type={infoModal.type}
            />

            {/* 팀원 삭제 확인 모달 */}
            <SmallFormModal
                isOpen={isRemoveUserModalOpen}
                onClose={() => {
                    setIsRemoveUserModalOpen(false);
                    setUserToRemove(null);
                }}
                title="팀원 삭제 확인"
                submitText="삭제"
                onSubmit={handleRemoveUser}
            >
                <div className="space-y-4">
                    <p className="text-red-600 font-medium">
                        정말 팀원을 삭제하시겠습니까?
                    </p>
                    {userToRemove && (
                        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                                {userToRemove.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">{userToRemove.nickname}</div>
                                <div className="text-sm text-gray-500">{userToRemove.email}</div>
                            </div>
                        </div>
                    )}
                    <p className="text-gray-600">
                        이 작업은 되돌릴 수 없으며, 해당 팀원은 더 이상 이 프로젝트에 접근할 수 없게 됩니다.
                    </p>
                </div>
            </SmallFormModal>
        </Layout>
    );
};

export default ProjectSettingsPage; 