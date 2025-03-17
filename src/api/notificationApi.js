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
        // const response = await axiosInstance.get("/notifications");
        // console.log(`[API] notificationApi.getNotifications 호출 성공, data=${JSON.stringify(response.data)}`);
        // return response.data;
        
        // 더미 데이터
        const dummyNotifications = [
            {
                id: 1,
                notificationType: 'COMMENT',
                content: '홍길동님이 "로그인 기능 구현" 백로그에 댓글을 남겼습니다.',
                time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
                navigable: true,
                url: '/projects/1/sprints/1/backlogs/1'
            },
            {
                id: 2,
                notificationType: 'ISSUE',
                content: '김철수님이 "회원가입 페이지" 백로그에 새로운 이슈를 등록했습니다.',
                time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
                navigable: true,
                url: '/projects/1/sprints/1/backlogs/11'
            },
            {
                id: 3,
                notificationType: 'DAILYSCRUM',
                content: '오늘 오전 10시에 데일리 스크럼이 예정되어 있습니다.',
                time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
                navigable: true,
                url: '/projects/1/sprints/1/dailyscrums/2'
            },
            {
                id: 4,
                notificationType: 'TEAMMATE',
                content: '이영희님이 프로젝트에 참여했습니다.',
                time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
                navigable: false,
                url: null
            },
            {
                id: 5,
                notificationType: 'SCHEDULE',
                content: '내일 오후 2시에 "스프린트 계획 회의"가 예정되어 있습니다.',
                time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
                navigable: true,
                url: '/projects/1/calendar/schedule/3'
            },
            {
                id: 6,
                notificationType: 'CHATTING',
                content: '박지민님이 새로운 메시지를 보냈습니다: "회의 자료 확인해주세요"',
                time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2일 전
                navigable: false,
                url: null
            }
        ];
        
        console.log(`[API] notificationApi.getNotifications 더미 데이터 반환`);
        return dummyNotifications;
    } catch (error) {
        console.error(`[API] notificationApi.getNotifications 호출 실패:`, error.response?.data);
        throw error;
    }
}

// User 의 알림 카운트 조회
export const getNotificationCount = async () => {
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        // const response = await axiosInstance.get("/notifications/count");
        // console.log(`[API] notificationApi.getNotificationCount 호출 성공, data=${JSON.stringify(response.data)}`);
        // return response.data;
        
        // 더미 데이터 - 랜덤하게 1~10 사이의 숫자 반환
        const count = Math.floor(Math.random() * 10 + 1);
        console.log(`[API] notificationApi.getNotificationCount 더미 데이터 반환: ${count}`);
        return count;
    } catch (error) {
        console.error(`[API] notificationApi.getNotificationCount 호출 실패:`, error.response?.data);
        throw error;
    }
}

// User 가 알림을 읽어서 알림 카운트를 0으로 만듬.
export const setNotificationCountToZero = async () => {
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        // const response = await axiosInstance.patch("/notifications/count");
        // console.log(`[API] notificationApi.getNotifications 호출 성공, data=${JSON.stringify(response.data)}`);
        // return response.data;
        
        console.log(`[API] notificationApi.setNotificationCountToZero 더미 호출 성공`);
        return { success: true };
    } catch (error) {
        console.error(`[API] notificationApi.readAllNotifications 호출 실패:`, error.response?.data);
        throw error;
    }
}

// 알림 단건 삭제
export const deleteNotification = async (notificationId) => {
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        // const response = await axiosInstance.delete(`/notifications/${notificationId}`);
        // console.log(`[API] notificationApi.deleteNotification 호출 성공, data=${JSON.stringify(response.data)}`);
        // return response.data;
        
        console.log(`[API] notificationApi.deleteNotification 더미 호출 성공: ID ${notificationId}`);
        return { success: true };
    } catch (error) {
        console.error(`[API] notificationApi.deleteNotification 호출 실패:`, error.response?.data);
        throw error;
    }
}

// 알림 전체 삭제
export const deleteAllNotifications = async () => {
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        // const response = await axiosInstance.delete("/notifications");
        // console.log(`[API] notificationApi.deleteAllNotifications 호출 성공, data=${JSON.stringify(response.data)}`);
        // return response.data;
        
        console.log(`[API] notificationApi.deleteAllNotifications 더미 호출 성공`);
        return { success: true };
    } catch (error) {
        console.error(`[API] notificationApi.deleteAllNotifications 호출 실패:`, error.response?.data);
        throw error;
    }
}