import axiosInstance from './axiosInstance';

// User 의 todo 리스트 조회
export const getTodos = async () => {
    /**
     * <응답 DTO>
     * private TodoType todoType (enum)->(TASK, SCHEDULE)
     * private String content
     * private String url
     *
     * <백엔드에서 보내줘야 할 URL>
     * TASK: /projects/:projectId/sprints/:sprintId/backlogs/:backlogId
     * SCHEDULE: /projects/:projectId/calendar/schedule/:scheduleId
     */
    try {
        // 실제 API 호출 (백엔드 완성 후 사용)
        // const response = await axiosInstance.get("/todo");
        // console.log(`[API] todoApi.getTodos 호출 성공, data=${JSON.stringify(response.data)}`);
        // return response.data;
        
        // 더미 데이터
        const dummyTodos = [
            {
                id: 1,
                todoType: 'TASK',
                content: '로그인 기능 구현',
                url: '/projects/1/sprints/1/backlogs/1'
            },
            {
                id: 2,
                todoType: 'SCHEDULE',
                content: '스프린트 계획 회의',
                url: '/projects/1/calendar/schedule/3'
            },
            {
                id: 3,
                todoType: 'TASK',
                content: '회원가입 페이지 개발',
                url: '/projects/1/sprints/1/backlogs/1'
            }
        ];
        console.log(`[API] todoApi.getTodos 더미 데이터 반환`);
        return dummyTodos;
    } catch (error) {
        console.error(`[API] todoApi.getTodos 호출 실패:`, error.response?.data);
        throw error;
    }
}

// User 의 todo 카운트 조회
export const getTodoCount = async () => {
    try {
        const response = await axiosInstance.get("/todo/count");
        console.log(`[API] todoApi.getTodoCount 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] notificationApi.getNotificationCount 호출 실패:`, error.response?.data);
        throw error;
    }
}