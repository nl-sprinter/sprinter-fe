import React, { useState, useEffect } from 'react';
import RightSideModal from './RightSideModal';
import { NotificationCard } from "../../common/NotificationCard";
import { FiTrash2 } from 'react-icons/fi';
import {
    getNotifications,
    deleteNotification,
    deleteAllNotifications
} from '../../../api/notificationApi';

const RightSideNotificationModal = ({ open, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const results = await getNotifications();
            setNotifications(results || []);

        } catch (error) {
            console.error('RightSideNotificationModal.fetchNotifications 에러: ', error);
            // setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 모달이 열릴 때 알림 목록 가져오기
    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    useEffect(() => {
        console.log(`notifications 변화, notifications=${JSON.stringify(notifications)}`);
    }, [notifications]);
    
    // 알림 삭제 처리
    const handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            // 삭제 후 목록 업데이트
            setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error('알림 삭제 중 오류가 발생했습니다:', error);
        }
    };
    
    // 모든 알림 삭제 처리
    const handleDeleteAllNotifications = async () => {
        try {
            await deleteAllNotifications();
            setNotifications([]);
        } catch (error) {
            console.error('모든 알림 삭제 중 오류가 발생했습니다:', error);
        }
    };

    // 전체 삭제 버튼 컴포넌트
    const DeleteAllButton = () => (
        <button
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            onClick={handleDeleteAllNotifications}
            title="모든 알림 삭제"
            disabled={notifications.length === 0}
        >
            <FiTrash2 size={18} />
        </button>
    );

    return (
        <RightSideModal
            isOpen={open}
            onClose={onClose}
            title="알림"
            contentLabel="Notification Modal"
            extraHeaderContent={<DeleteAllButton />}
        >
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-3 py-2">
                    {notifications.map((n) => (
                        <NotificationCard
                            key={n.id}
                            notificationType={n.notificationType}
                            content={n.content}
                            time={n.time}
                            navigable={n.navigable}
                            url={n.url}
                            onDelete={() => handleDeleteNotification(n.id)}
                            projectId={n.projectId}
                            projectName={n.projectName}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <p>알림이 없습니다</p>
                </div>
            )}
        </RightSideModal>
    );
};

export default RightSideNotificationModal;