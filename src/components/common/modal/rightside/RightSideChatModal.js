import React from 'react';
import RightSideModal from './RightSideModal';

const RightSideChatModal = ({ open, onClose }) => {
    return (
        <RightSideModal
            isOpen={open}
            onClose={onClose}
            title="채팅"
            contentLabel="Chat Modal"
        >
            {/* 채팅 컨텐츠 */}
        </RightSideModal>
    );
};

export default RightSideChatModal;