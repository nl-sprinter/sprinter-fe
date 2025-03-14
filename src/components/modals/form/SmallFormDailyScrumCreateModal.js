import React from 'react';
import SmallFormModal from './SmallFormModal';

const SmallFormDailyScrumCreateModal = ({isOpen, onClose, onSubmit}) => {
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
            title="Daily Scrum 생성"
            submitText="확인"
            cancelText="취소"
            onSubmit={onSubmit}
        >
            <span className="font-semibold">{formattedDate}</span>의 Daily Scrum 을 생성하시겠습니까?
        </SmallFormModal>
    );
};

export default SmallFormDailyScrumCreateModal; 