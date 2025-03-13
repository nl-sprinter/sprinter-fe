import React from 'react';
import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';

// 모달 스타일 설정
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        width: 'calc(100% - 3rem)', // 좌우 1.5rem 여백으로 조금 더 넓게 설정
        height: 'calc(100% - 3rem)', // 상하 1.5rem 여백으로 조금 더 높게 설정
        maxWidth: 'calc(100vw - 30rem)', // 최대 너비를 뷰포트 너비로 설정하여 화면을 거의 채울 수 있게 함
        maxHeight: 'calc(100vh - 5rem)', // 최대 높이를 뷰포트 높이로 설정하여 화면을 거의 채울 수 있게 함
        padding: 0,
        border: 'none',
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        overflow: 'hidden'
    }
};

const LargeFormModal = ({
    isOpen, 
    onClose, 
    title,
    onSubmit,
    submitText = '확인',
    cancelText = '취소',
    children
}) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit && onSubmit();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Content Modal"
            ariaHideApp={false}
        >
            <div className="flex flex-col h-full">
                {/* 헤더 */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoMdClose size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* 콘텐츠 영역 */}
                <div className="flex-1 p-3 overflow-auto">
                    {children}
                </div>
            </div>
        </Modal>
    );
};

export default LargeFormModal;