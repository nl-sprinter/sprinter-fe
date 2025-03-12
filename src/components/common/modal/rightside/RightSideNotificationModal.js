import React from 'react';
import RightSideModal from './RightSideModal';

const RightSideNotificationModal = ({ open, onClose }) => {
    return (
        <RightSideModal
            isOpen={open}
            onClose={onClose}
            title="알림"
            contentLabel="Notification Modal"
        >
            <div className="space-y-4">
                {/* 알림 목록 예시 */}
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-sm">새로운 스프린트가 시작되었습니다.</div>
                    <div className="text-xs text-gray-500 mt-1">1시간 전</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-sm">데일리 스크럼 시간입니다.</div>
                    <div className="text-xs text-gray-500 mt-1">3시간 전</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="text-sm">백로그가 업데이트되었습니다.</div>
                    <div className="text-xs text-gray-500 mt-1">5시간 전</div>
                </div>
            </div>
        </RightSideModal>
    );
};

export default RightSideNotificationModal;