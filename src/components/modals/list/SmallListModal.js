import React from 'react';
import Modal from 'react-modal';

// 모달 스타일 설정
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1200
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
        width: '500px',
        maxHeight: '400px',
        overflow: 'hidden'
    }
};

/**
 * 작은 리스트 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} title - 모달 제목
 * @param {array} items - 표시할 항목 배열
 * @param {function} onItemSelect - 항목 선택 시 호출할 함수
 * @param {function} renderItem - 항목 렌더링 함수 (선택 사항)
 */
const SmallListModal = ({
    isOpen,
    onClose,
    title,
    items = [],
    onItemSelect,
    renderItem
}) => {
    
    const handleItemClick = (item) => {
        onItemSelect && onItemSelect(item);
    };
    
    const handleClose = (e) => {
        if (onClose) onClose(e);
    };

    // 기본 항목 렌더링 함수
    const defaultRenderItem = (item) => (
        <div 
            key={item.id || item.backlogId}
            className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleItemClick(item)}
        >
            <span>{item.title || item.name}</span>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="List Modal"
            ariaHideApp={false}
        >
            <div className="flex flex-col h-full">
                {/* 헤더 */}
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">
                        {title}
                    </h2>
                </div>

                {/* 리스트 */}
                <div className="overflow-y-auto max-h-[350px]">
                    {items.length > 0 ? (
                        items.map(item => (
                            renderItem ? renderItem(item, handleItemClick) : defaultRenderItem(item)
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            표시할 항목이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SmallListModal; 