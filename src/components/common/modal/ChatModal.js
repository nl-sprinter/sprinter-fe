import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';

// Modal.setAppElement('#root'); // index.js나 App.js에서 한 번만 설정하면 됩니다

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 50
    },
    content: {
        top: '0',
        right: '0',
        bottom: '0',
        left: 'auto',
        width: '288px', // w-72
        margin: '0',
        padding: '20px',
        border: '0px solid',
        borderRadius: '0',
        transform: 'none',
        position: 'fixed'
    }
};

const ChatModal = ({ open, onClose }) => {
    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Chat Modal"
        >
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">채팅</h2>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiX className="text-xl text-gray-600" />
                </button>
            </div>
            {/* 채팅 컨텐츠 */}
        </Modal>
    );
};

export default ChatModal; 