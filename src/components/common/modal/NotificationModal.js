import Modal from 'react-modal';
import { FiX } from 'react-icons/fi';

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

const NotificationModal = ({ open, onClose }) => {
    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Notification Modal"
        >
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">알림</h2>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiX className="text-xl text-gray-600" />
                </button>
            </div>
            <div className="space-y-4">
                {/* 알림 목록 예시 */}
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-sm">새로운 스프린트가 시작되었습니다.</div>
                    <div className="text-xs text-gray-500 mt-1">1시간 전</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-sm">데일리 스크럼 시간입니다.</div>
                    <div className="text-xs text-gray-500 mt-1">3시간 전</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-sm">백로그가 업데이트되었습니다.</div>
                    <div className="text-xs text-gray-500 mt-1">5시간 전</div>
                </div>
            </div>
        </Modal>
    );
};

export default NotificationModal; 