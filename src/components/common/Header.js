import { FiSearch, FiMenu, FiMessageSquare, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import TodoModal from './TodoModal';
import ChatModal from './ChatModal';
import SearchModal from './SearchModal';
import UserModal from './UserModal';

const Header = ({ showSidebar = false, showFunctions = false }) => {
    const navigate = useNavigate();
    const [todoModalOpen, setTodoModalOpen] = useState(false);
    const [chatModalOpen, setChatModalOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const searchRef = useRef(null);
    
    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className={`fixed top-0 ${showSidebar ? 'sm:ml-60 sm:w-[calc(100%-240px)]' : 'w-full'} bg-white z-40`}>
            <div className="flex justify-between items-center px-4 h-16">
                <div className="flex items-center gap-8 flex-grow justify-end">
                    {showFunctions && (
                        <>
                            <div ref={searchRef} className="relative flex items-center max-w-[400px] w-full bg-gray-100 rounded-3xl">
                                <input
                                    type="text"
                                    placeholder="검색"
                                    className="w-full px-4 py-2 bg-transparent outline-none"
                                    onClick={() => setSearchModalOpen(true)}
                                />
                                <div className="absolute right-0 h-full flex items-center justify-center px-4 text-gray-600">
                                    <FiSearch className="text-xl" />
                                </div>
                            </div>
                            <button 
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                onClick={() => setTodoModalOpen(true)}
                            >
                                <FiMenu className="text-xl" />
                            </button>
                            <button 
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                onClick={() => setChatModalOpen(true)}
                            >
                                <FiMessageSquare className="text-xl" />
                            </button>
                            <button 
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
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
            <TodoModal 
                open={todoModalOpen} 
                onClose={() => setTodoModalOpen(false)} 
            />
            <ChatModal 
                open={chatModalOpen}
                onClose={() => setChatModalOpen(false)}
            />
            <SearchModal 
                open={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                anchorEl={searchRef.current}
            />
            <UserModal
                open={userModalOpen}
                onClose={() => setUserModalOpen(false)}
            />
        </header>
    );
};

export default Header;