import { FiSearch, FiMenu, FiMessageSquare, FiUser, FiBell } from 'react-icons/fi';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import RightSideTodoModal from '../modals/rightside/RightSideTodoModal';
import RightSideChatModal from '../modals/rightside/RightSideChatModal';
import UserAccountModal from '../modals/UserAccountModal';
import RightSideNotificationModal from '../modals/rightside/RightSideNotificationModal';
import { getNotificationCount } from '../../api/notificationApi';
import { getTodoCount } from '../../api/todoApi';
import { useUserStore } from '../../store/useUserStore';

const Header = ({ showSidebar = false, showFunctions = false, showSearchBar }) => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const location = useLocation();
    const { user } = useUserStore();
    
    const [todoModalOpen, setTodoModalOpen] = useState(false);
    const [chatModalOpen, setChatModalOpen] = useState(false);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [notificationModalOpen, setNotificationModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);
    const [todoCount, setTodoCount] = useState(0);
    const searchRef = useRef(null);
    const isInitialMount = useRef(true);
    const prevNotificationModalState = useRef(false);
    const prevTodoModalState = useRef(false);
    
    // URL에서 검색어 가져오기
    useEffect(() => {
        if (location.pathname.includes('/search')) {
            const queryParams = new URLSearchParams(location.search);
            const query = queryParams.get('query') || '';
            setSearchQuery(query);
        }
    }, [location]);
    
    // 알림 카운트 가져오기
    const fetchNotificationCount = async () => {
        try {
            const count = await getNotificationCount();
            setNotificationCount(count.count);
        } catch (error) {
            console.error('알림 카운트 조회 실패:', error);
            setNotificationCount(0);
        }
    };
    
    // Todo 카운트 가져오기
    const fetchTodoCount = async () => {
        try {
            const count = await getTodoCount();
            setTodoCount(count);
        } catch (error) {
            console.error('Todo 카운트 조회 실패:', error);
            setTodoCount(0);
        }
    };

    // 로그인 상태와 라우트 변경 감지하여 Todo 카운트와 알림 카운트 가져오기
    useEffect(() => {
        if (user && location.pathname !== '/login') {
            console.log('Todo 카운트 로드');
            fetchTodoCount();
            console.log('알림 카운트 로드');
            fetchNotificationCount();
        }
    }, [user, location.pathname]);
    
    // 알림 모달 상태 변경 감지 및 처리
    useEffect(() => {
        // 모달이 열려 있다가 닫힌 경우에만 알림 카운트 갱신
        if (prevNotificationModalState.current && !notificationModalOpen) {
            console.log('알림 모달 닫힘 후 알림 카운트 갱신');
            fetchNotificationCount();
        }
        
        // 현재 모달 상태 저장
        prevNotificationModalState.current = notificationModalOpen;
    }, [notificationModalOpen]);
    
    // Todo 모달 상태 변경 감지 및 처리
    useEffect(() => {
        // 모달이 열려 있다가 닫힌 경우에만 Todo 카운트 갱신
        if (prevTodoModalState.current && !todoModalOpen) {
            console.log('Todo 모달 닫힘 후 Todo 카운트 갱신');
            fetchTodoCount();
        }
        
        // 현재 모달 상태 저장
        prevTodoModalState.current = todoModalOpen;
    }, [todoModalOpen]);
    
    const handleLogoClick = () => {
        navigate('/');
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (projectId && searchQuery.trim()) {
            navigate(`/projects/${projectId}/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };
    
    const handleNotificationClick = () => {
        setNotificationModalOpen(true);
    };
    
    const handleTodoClick = () => {
        setTodoModalOpen(true);
    };

    return (
        <header className={`fixed top-0 ${showSidebar ? 'sm:ml-60 sm:w-[calc(100%-240px)]' : 'w-full'} bg-white z-40`}>
            <div className="flex justify-between items-center px-4 h-16">
                <div className="flex items-center gap-4 flex-grow justify-end">
                    {showFunctions && (
                        <>
                            {showSearchBar && (
                                <form 
                                    ref={searchRef}
                                    className="relative flex items-center max-w-[300px] w-full bg-gray-100 rounded-3xl"
                                    onSubmit={handleSearchSubmit}
                                >
                                    <input
                                        type="text"
                                        placeholder="검색"
                                        className="w-full px-4 py-2 bg-transparent outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-0 h-full flex items-center justify-center px-4 text-gray-600"
                                    >
                                        <FiSearch className="text-xl"/>
                                    </button>
                                </form>
                            )}
                            <div className="relative">
                                <button
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full"
                                    onClick={handleTodoClick}
                                >
                                    <FiMenu className="text-xl"/>
                                </button>
                                {todoCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full">
                                        {todoCount > 9 ? '9+' : todoCount}
                                    </span>
                                )}
                            </div>
                            <button
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full"
                                onClick={() => setChatModalOpen(true)}
                            >
                                <FiMessageSquare className="text-xl"/>
                            </button>
                            <div className="relative">
                                <button 
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full"
                                    onClick={handleNotificationClick}
                                >
                                    <FiBell className="text-xl" />
                                </button>
                                {notificationCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </span>
                                )}
                            </div>
                            <button 
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full"
                                onClick={() => setUserModalOpen(true)}
                            >
                                <FiUser className="text-xl" />
                            </button>
                        </>
                    )}
                    <img 
                        src="/images/label.png"
                        alt="Label"
                        className="h-6 cursor-pointer"
                        onClick={handleLogoClick}
                    />
                </div>
            </div>
            <RightSideTodoModal
                open={todoModalOpen} 
                onClose={() => setTodoModalOpen(false)} 
            />
            <RightSideChatModal
                open={chatModalOpen}
                onClose={() => setChatModalOpen(false)}
            />
            <UserAccountModal
                open={userModalOpen}
                onClose={() => setUserModalOpen(false)}
            />
            <RightSideNotificationModal
                open={notificationModalOpen}
                onClose={() => setNotificationModalOpen(false)}
            />
        </header>
    );
};

export default Header;