import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';
import { FiCheck } from 'react-icons/fi';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        border: 'none',
        borderRadius: '0.5rem',
        width: '400px'
    }
};

const SmallInfoModal = ({ 
    isOpen, 
    onClose, 
    title = '알림',
    message,
    type = 'success' // 'success' | 'error'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Info Modal"
        >
            <div className="w-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        {type === 'success' ? (
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <FiCheck className="text-green-500" size={16} />
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                <IoMdClose className="text-red-500" size={16} />
                            </div>
                        )}
                        <h2 className="text-lg font-semibold">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoMdClose size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-gray-600">
                        {message}
                    </p>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                type === 'success' 
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SmallInfoModal; 