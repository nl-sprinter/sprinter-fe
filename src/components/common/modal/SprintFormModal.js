import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';

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
        width: '480px'
    }
};

const SprintFormModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    initialData = null,
    mode = 'create' // 'create' or 'edit'
}) => {
    const [sprintName, setSprintName] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setSprintName(initialData.sprintName);
        } else if (isOpen) {
            setSprintName('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ sprintName });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Sprint Form Modal"
        >
            <div className="w-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">
                        {mode === 'create' ? '새 스프린트 생성' : '스프린트 수정'}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                스프린트 이름
                            </label>
                            <input
                                type="text"
                                value={sprintName}
                                onChange={(e) => setSprintName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                placeholder="스프린트 이름을 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            disabled={!sprintName.trim()}
                        >
                            {mode === 'create' ? '생성' : '수정'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default SprintFormModal; 