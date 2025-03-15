import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1100
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
        width: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
    }
};

const MiddleFormModal = ({ 
    isOpen, 
    onClose, 
    title,
    children,
    submitText = '확인',
    cancelText = '취소',
    onSubmit,
    isSubmitDisabled = false
}) => {
    
    const handleClose = () => {
        onClose && onClose();
    };
    
    const handleSubmit = () => {
        onSubmit && onSubmit();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Form Modal"
            ariaHideApp={false}
        >
            <div className="flex flex-col h-full">
                {/* 헤더 */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-800">{title}</h2>
                </div>

                {/* 본문 */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {children}
                </div>

                {/* 푸터 */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        onClick={handleClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`px-4 py-2 bg-green-500 text-white rounded-lg transition-colors ${
                            isSubmitDisabled 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-green-600'
                        }`}
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default MiddleFormModal; 