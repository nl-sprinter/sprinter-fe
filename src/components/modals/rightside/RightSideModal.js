import React from 'react';
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
        width: '360px', // 288px에서 360px로 증가
        margin: '0',
        padding: '20px',
        border: '0px solid',
        borderRadius: '0',
        transform: 'none',
        position: 'fixed'
    }
};

/**
 * 오른쪽에서 열리는 사이드 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} title - 모달 제목
 * @param {React.ReactNode} children - 모달 내용
 * @param {string} contentLabel - 모달 접근성 라벨
 * @param {object} customContentStyle - 추가 스타일 (너비 등 조정)
 * @param {React.ReactNode} extraHeaderContent - 헤더에 추가할 컨텐츠
 */
const RightSideModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    contentLabel = "Side Modal",
    customContentStyle = {},
    extraHeaderContent
}) => {
    // 기본 스타일과 사용자 정의 스타일 병합
    const mergedStyles = {
        overlay: customStyles.overlay,
        content: {
            ...customStyles.content,
            ...customContentStyle
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={mergedStyles}
            contentLabel={contentLabel}
            ariaHideApp={false}
        >
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="flex items-center gap-2">
                    {extraHeaderContent}
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX className="text-xl text-gray-600" />
                    </button>
                </div>
            </div>
            <div className="modal-content">
                {children}
            </div>
        </Modal>
    );
};

export default RightSideModal; 