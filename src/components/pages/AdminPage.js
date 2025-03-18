import React, { useState, useEffect } from "react";
import { getUserList, sendAlertToSelectedUsers, deleteSelectedUsers } from "../../api/adminApi";
import SmallInfoModal from "../modals/info/SmallInfoModal";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { FiChevronLeft, FiChevronRight, FiHome, FiLogOut, FiSearch } from 'react-icons/fi';

const AdminPage = () => {
    const navigate = useNavigate();
    const { clearUser } = useUserStore();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");
    
    // 페이징 관련 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    
    // 검색 관련 상태 분리
    const [inputSearchTerm, setInputSearchTerm] = useState(""); // 사용자 입력
    const [searchTerm, setSearchTerm] = useState(""); // API 호출에 사용
    
    // 로딩 상태 추가
    const [isLoading, setIsLoading] = useState(false);

    // 사용자 목록 불러오기
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // 페이지네이션과 검색어 파라미터 전달
                const data = await getUserList(currentPage, pageSize, searchTerm);
                setUsers(data.content); // 페이징된 내용
                setTotalPages(data.totalPages); // 전체 페이지 수
            } catch (error) {
                console.error("사용자 목록을 불러오는 중 오류 발생:", error);
                showInfoModal("사용자 목록을 불러오는 중 오류가 발생했습니다.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, pageSize, searchTerm]); // searchTerm이 변경될 때만 API 호출

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setSelectedUsers([]); // 페이지 변경 시 선택 초기화
        }
    };

    // 검색 입력 핸들러
    const handleSearchInputChange = (e) => {
        setInputSearchTerm(e.target.value);
    };

    // 검색 핸들러 - 버튼 클릭 시에만 API 호출
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(inputSearchTerm.trim()); // 입력값을 API 호출용 검색어로 설정
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // 검색어 초기화
    const handleClearSearch = () => {
        setInputSearchTerm("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    // 알림 모달 표시
    const showInfoModal = (message, type = "success") => {
        setModalMessage(message);
        setModalType(type);
        setShowModal(true);
    };

    // 체크박스 상태 변경 처리
    const handleCheckboxChange = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    // 전체 선택/해제
    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.userId));
        }
    };

    // 선택한 사용자에게 알림 전송
    const handleSendAlert = async () => {
        if (selectedUsers.length === 0) {
            showInfoModal("알림을 보낼 사용자를 선택해주세요.", "error");
            return;
        }

        if (!alertMessage.trim()) {
            showInfoModal("알림 메시지를 입력해주세요.", "error");
            return;
        }

        try {
            await sendAlertToSelectedUsers(selectedUsers, alertMessage);
            showInfoModal(`${selectedUsers.length}명의 사용자에게 알림을 전송했습니다.`);
            setAlertMessage("");
        } catch (error) {
            console.error("알림 전송 중 오류 발생:", error);
            showInfoModal("알림 전송 중 오류가 발생했습니다.", "error");
        }
    };

    // 선택한 사용자 삭제
    const handleDeleteUsers = async () => {
        if (selectedUsers.length === 0) {
            showInfoModal("삭제할 사용자를 선택해주세요.", "error");
            return;
        }

        const confirm = window.confirm(`선택한 ${selectedUsers.length}명의 사용자를 정말 삭제하시겠습니까?`);
        if (!confirm) return;

        try {
            await deleteSelectedUsers(selectedUsers);
            // 삭제 성공 시 목록에서도 제거하고 현재 페이지 데이터 다시 불러오기
            const data = await getUserList(currentPage, pageSize, searchTerm);
            setUsers(data.content);
            setTotalPages(data.totalPages);
            setSelectedUsers([]);
            showInfoModal(`${selectedUsers.length}명의 사용자가 삭제되었습니다.`);
        } catch (error) {
            console.error("사용자 삭제 중 오류 발생:", error);
            showInfoModal("사용자 삭제 중 오류가 발생했습니다.", "error");
        }
    };

    // 로그아웃 처리
    const handleLogout = () => {
        navigate('/logout');
    };

    // 홈으로 이동
    const handleGoHome = () => {
        navigate('/home');
    };

    // 페이지 버튼 렌더링
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtonsToShow = 5; // 한 번에 보여줄 최대 페이지 버튼 수
        
        let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
        let endPage = Math.min(startPage + maxButtonsToShow - 1, totalPages);
        
        if (endPage - startPage + 1 < maxButtonsToShow) {
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }
        
        // 첫 페이지로 이동 버튼
        buttons.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`w-7 h-7 flex items-center justify-center text-xs rounded ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
                «
            </button>
        );
        
        // 이전 페이지 버튼
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-7 h-7 flex items-center justify-center text-xs rounded ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
                <FiChevronLeft size={14} />
            </button>
        );
        
        // 페이지 번호 버튼
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-7 h-7 flex items-center justify-center text-xs rounded ${
                        currentPage === i ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        // 다음 페이지 버튼
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-7 h-7 flex items-center justify-center text-xs rounded ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
                <FiChevronRight size={14} />
            </button>
        );
        
        // 마지막 페이지로 이동 버튼
        buttons.push(
            <button
                key="last"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`w-7 h-7 flex items-center justify-center text-xs rounded ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
                »
            </button>
        );
        
        return buttons;
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* 헤더 */}
            <div className="bg-white shadow-sm py-2 px-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold text-gray-800">Sprinter 관리자 페이지</h1>
                    <div className="flex space-x-2">
                        <button 
                            onClick={handleGoHome}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                            <FiHome size={12} />
                            홈
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-1"
                        >
                            <FiLogOut size={12} />
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
            
            {/* 메인 컨텐츠 영역 */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col max-h-[calc(100vh-3rem)]">
                {/* 검색 및 기능 버튼 영역 */}
                <div className="bg-white p-3 rounded-lg shadow-sm mb-3 text-xs">
                    <div className="flex flex-col sm:flex-row gap-2">
                        {/* 검색 폼 - 버튼 클릭시에만 API 호출 */}
                        <form onSubmit={handleSearch} className="flex items-center w-full sm:w-80">
                            <div className="relative flex-grow flex">
                                <input
                                    type="text"
                                    value={inputSearchTerm}
                                    onChange={handleSearchInputChange}
                                    placeholder="이메일 또는 이름으로 검색"
                                    className="w-full pl-2 pr-8 py-1 text-xs border border-gray-300 rounded-l"
                                />
                                {inputSearchTerm && (
                                    <button 
                                        type="button" 
                                        onClick={handleClearSearch}
                                        className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                                <button 
                                    type="submit"
                                    className="px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-r flex items-center"
                                >
                                    <FiSearch size={12} className="mr-1" />
                                </button>
                            </div>
                        </form>
                        
                        {/* 선택 기능 버튼 */}
                        <div className="flex items-center gap-2">
                            <button 
                                className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                                onClick={handleSelectAll}
                            >
                                {selectedUsers.length === users.length && users.length > 0 ? "전체 해제" : "전체 선택"}
                            </button>
                            
                            <button 
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                    selectedUsers.length === 0 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                                onClick={handleDeleteUsers}
                                disabled={selectedUsers.length === 0}
                            >
                                선택 삭제
                            </button>
                            
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                {selectedUsers.length}명 선택됨
                            </span>
                        </div>
                    </div>
                    
                    {/* 알림 전송 영역 */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="text"
                            value={alertMessage}
                            onChange={(e) => setAlertMessage(e.target.value)}
                            placeholder="알림 메시지 입력"
                            className="px-2 py-1 text-xs border border-gray-300 rounded flex-grow"
                        />
                        
                        <button 
                            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                                selectedUsers.length === 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            onClick={handleSendAlert}
                            disabled={selectedUsers.length === 0}
                        >
                            알림 보내기
                        </button>
                    </div>
                </div>
                
                {/* 사용자 목록 테이블 */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col">
                    {/* 로딩 오버레이 */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    
                    <div className="overflow-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.length === users.length && users.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-14">
                                        ID
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        nickname
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        password
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        email
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        role
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-2 py-1.5 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.userId)}
                                                onChange={() => handleCheckboxChange(user.userId)}
                                                className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-2 py-1.5 whitespace-nowrap">
                                            <div className="text-xs text-gray-900">{user.userId}</div>
                                        </td>
                                        <td className="px-2 py-1.5 whitespace-nowrap">
                                            <div className="text-xs text-gray-900">{user.nickname}</div>
                                        </td>
                                        <td className="px-2 py-1.5 whitespace-nowrap">
                                            <div className="text-xs text-gray-900">{user.password}</div>
                                        </td>
                                        <td className="px-2 py-1.5 whitespace-nowrap">
                                            <div className="text-xs text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-2 py-1.5 whitespace-nowrap">
                                            <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full 
                                                ${user.role === 'ROLE_`ADMIN`' ? 'bg-green-100 text-green-800' : 
                                                user.role === 'ROLE_DEVELOPER' ? 'bg-purple-100 text-purple-800' : 
                                                'bg-gray-100 text-gray-800'}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {users.length === 0 && !isLoading && (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                {searchTerm ? `"${searchTerm}" 검색 결과가 없습니다.` : '사용자 정보가 없습니다.'}
                            </div>
                        )}
                    </div>
                    
                    {/* 페이지네이션 */}
                    <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-between items-center">
                        {/* 검색 상태 표시 */}
                        <div className="text-xs text-gray-600">
                            {searchTerm && <span className="italic">"{searchTerm}" 검색 결과</span>}
                        </div>
                        
                        {/* 페이지 버튼 */}
                        <div className="flex space-x-1">
                            {renderPaginationButtons()}
                        </div>
                        
                        {/* 페이지 크기 선택 */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">페이지당 행:</span>
                            <select 
                                value={pageSize} 
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="text-xs border border-gray-300 rounded px-1 py-0.5"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 알림 모달 */}
            <SmallInfoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalType === "success" ? "알림" : "오류"}
                message={modalMessage}
                type={modalType}
            />
        </div>
    );
};

export default AdminPage;
