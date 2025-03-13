import React from 'react';
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
        width: '400px'
    }
};

const SmallInfoModal = ({ 
    isOpen, 
    onClose, 
    title = '알림',
    message,
    buttonText = '확인'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Small Info Modal"
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

                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-700">{message}</p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SmallInfoModal; 