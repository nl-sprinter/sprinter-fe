import React from 'react';
import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';

// 모달 스타일 설정
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
        width: '80%',
        height: '80%',
        maxWidth: '1200px',
        maxHeight: '800px'
    }
};

const LargeBoardModal = ({
    isOpen, 
    onClose, 
    title,
    children,
    extraHeaderContent
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Large Board Modal"
        >
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">
                        {title}
                    </h2>
                    <div className="flex items-center">
                        {extraHeaderContent}
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <IoMdClose size={24} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                    {children}
                </div>
            </div>
        </Modal>
    );
};

export default LargeBoardModal;