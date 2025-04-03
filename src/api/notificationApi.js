import axiosInstance from './axiosInstance';

// User 의 알림 리스트 조회
export const getNotifications = async () => {
    /**
     * <응답 DTO>
     * private NotificationType notificationType (enum)->(COMMENT, ISSUE, DAILYSCRUM, TEAMMATE, SCHEDULE, CHATTING)
     * private String content
     * private LocalDateTime time
     * private boolean navigable (url 이 있는가? 에 대한 flag)
     * private String url (없으면 null)
     * private Long projectId
     * private String projectName
     *
     * <백엔드에서 보내줘야 할 URL>
     * COMMENT: /projects/:projectId/sprints/:sprintId/backlogs/:backlogId
     * ISSUE: /projects/:projectId/sprints/:sprintId/backlogs/:backlogId
     * DAILYSCRUM: /projects/:projectId/sprints/:sprintId/dailyscrums/:dailyScrumId
     * SCHEDULE: /projects/:projectId/calendar/schedule/:scheduleId
     * CHATTING: 채팅 구현후에 추가
     */
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        const response = await axiosInstance.get("/notifications");
        console.log(`[API] notificationApi.getNotifications 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] notificationApi.getNotifications 호출 실패:`, error.response?.data);
        throw error;
    }
}

// User 의 알림 카운트 조회
export const getNotificationCount = async () => {
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        const response = await axiosInstance.get("/notifications/count");
        console.log(`[API] notificationApi.getNotificationCount 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] notificationApi.getNotificationCount 호출 실패:`, error.response?.data);
        throw error;
    }
}


// 알림 단건 삭제
export const deleteNotification = async (notificationId) => {
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        const response = await axiosInstance.delete(`/notifications/${notificationId}`);
        console.log(`[API] notificationApi.deleteNotification 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] notificationApi.deleteNotification 호출 실패:`, error.response?.data);
        throw error;
    }
}

// 알림 전체 삭제
export const deleteAllNotifications = async () => {
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        const response = await axiosInstance.delete("/notifications");
        console.log(`[API] notificationApi.deleteAllNotifications 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] notificationApi.deleteAllNotifications 호출 실패:`, error.response?.data);
        throw error;
    }
}