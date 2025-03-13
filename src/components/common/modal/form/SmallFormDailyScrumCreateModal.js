import React from 'react';
import SmallFormModal from './SmallFormModal';

const SmallFormDailyScrumCreateModal = ({ isOpen, onClose, onSubmit }) => {
    // 오늘 날짜 포맷팅
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');

    return (
        <SmallFormModal
            isOpen={isOpen}
            onClose={onClose}
            title="데일리 스크럼 생성"
            submitText="확인"
            cancelText="취소"
            onSubmit={onSubmit}
        >
            <div className="py-4 text-center">
                <p className="text-gray-700">
                    정말 <span className="font-semibold">{formattedDate}</span>로 데일리 스크럼을 생성하시겠습니까?
                </p>
            </div>
        </SmallFormModal>
    );
};

export default SmallFormDailyScrumCreateModal; 