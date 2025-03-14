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
        width: 'calc(100% - 3rem)', // 좌우 여백
        height: 'calc(100% - 3rem)', // 상하 여백
        maxWidth: 'calc(100vw - 10rem)', // 너비 지정
        maxHeight: 'calc(100vh - 5rem)', // 높이 지정
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
    // 모달 열림 상태 로깅
    React.useEffect(() => {
        if (isOpen) {
            console.log('ContentModal이 열렸습니다. 제목:', title);
        }
    }, [isOpen, title]);

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
                <div className="flex-1 p-6 overflow-auto">
                    {children}
                </div>

                {/* 푸터 */}
                <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LargeFormModal;