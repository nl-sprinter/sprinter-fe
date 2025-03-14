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
        width: '480px'
    }
};

const SmallFormModal = ({ 
    isOpen, 
    onClose, 
    title,
    children,
    submitText = '확인',
    cancelText = '취소',
    onSubmit,
    isSubmitDisabled = false
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Small Form Modal"
        >
            <div className="w-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoMdClose size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="space-y-4">
                        {children}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                isSubmitDisabled
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default SmallFormModal; 