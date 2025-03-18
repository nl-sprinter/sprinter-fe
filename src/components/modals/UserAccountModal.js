import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

const customStyles = {
    overlay: {
        backgroundColor: 'transparent',
        zIndex: 50
    },
    content: {
        position: 'absolute',
        top: '60px',
        right: '20px',
        left: 'auto',
        bottom: 'auto',
        width: '200px',
        padding: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px', // 모서리를 둥글게 설정
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        background: 'white'
    }
};

const UserAccountModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { user } = useUserStore();

    const handleClick = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="User Modal"
        >
            <div className="space-y-4">
                <div className="pb-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">{user?.nickname}</span>
                </div>
                <div className="space-y-2">
                    {/* 관리자인 경우 관리자 페이지 링크 표시 */}
                    {user?.role === 'ROLE_ADMIN' && (
                        <button 
                            onClick={() => handleClick('/admin/userlist')}
                            className="w-full text-left px-2 py-1 text-sm text-red-700 hover:bg-red-50 rounded font-medium"
                        >
                            관리자 페이지
                        </button>
                    )}
                    
                    <button 
                        onClick={() => handleClick('/account')}
                        className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                        계정 설정
                    </button>
                    <button 
                        onClick={() => handleClick('/logout')}
                        className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UserAccountModal;