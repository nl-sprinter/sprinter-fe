import axiosInstance from './axiosInstance';

export const createProject = async (data) => {
    const requestBody = {
        project: {
            project_name: data.project.project_name
        },
        sprint: {
            sprint_period: data.sprint.sprint_period,
            sprint_count: data.sprint.sprint_count
        },
        backlog: data.backlog.map(item => ({
            sprint_number: item.sprint_number,
            title: item.title,
            weight: item.weight
        }))
    };

    const response = await axiosInstance.post('/projects/create', requestBody);
    console.log(`[API] projectApi.getSprintList 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};



// 스프린트 리스트 가져오기
export const getSprintList = async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints`);
    console.log(`[API] projectApi.getSprintList 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};


// 프로덕트 백로그 탭 전용 데이터 가져오기
// 백로그id
// 백로그name
// 스프린트id
// 스프린트name
// 스프린트order
// weight
// isFinished
export const getProductBacklogList = async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/productbacklogs`);
    console.log(`[API] projectApi.getProductBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 프로젝트 삭제
export const deleteProject = async (projectId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}`);
    console.log(`[API] projectApi.deleteProject 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 프로젝트 이름 업데이트
export const updateProjectName = async (projectId, newProjectName) => {
    const response = await axiosInstance.patch(`/projects/${projectId}`, {
        projectName: newProjectName
    });
    console.log(`[API] projectApi.updateProjectName 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 스프린트 백로그 리스트 가져오기
export const getSprintBacklogList = async (projectId, sprintId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/backlogs`);
    console.log(`[API] projectApi.getSprintBacklogList 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 스프린트 이름 업데이트
export const updateSprintName = async (projectId, sprintId, newSprintName) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}`, {
        sprintName: newSprintName
    });
    console.log(`[API] projectApi.updateSprintName 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 스프린트 주기 조회
export const getSprintPeriod = async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprintperiod`);
    console.log(`[API] projectApi.getSprintPeriod 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 스프린트 주기 업데이트
export const updateSprintPeriod = async (projectId, sprintPeriod) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprintperiod`, {
        sprintPeriod
    });
    console.log(`[API] projectApi.updateSprintPeriod 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};


// 스프린트 생성
export const createSprint = async (projectId, sprintName) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints`, {
        sprintName
    });
    console.log(`[API] projectApi.createSprint 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 프로젝트에 속한 유저 조회
export const getUsersInProject = async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/users`);
    console.log(`[API] projectApi.getUsersInProject 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};

// 프로젝트에 추가할 유저 검색
export const searchUserToAddProject = async (projectId, keyword) => {
    try {
        const response = await axiosInstance.get(`/projects/${projectId}/users/search?keyword=${keyword}`);
        console.log(`[API] projectApi.searchUserToAddProject 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] projectApi.searchUserToAddProject 호출 실패:`, error.response?.data);
        throw error;
    }
};

// 프로젝트에 유저 추가
export const addUserToProject = async (projectId, userId) => {
    try {
        const response = await axiosInstance.post(`/projects/${projectId}/users`, { userId });
        console.log(`[API] projectApi.addUserToProject 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] projectApi.addUserToProject 호출 실패:`, error.response?.data);
        throw error;
    }
};

// 프로젝트에서 유저 삭제
export const removeUserFromProject = async (projectId, userId) => {
    try {
        const response = await axiosInstance.delete(`/projects/${projectId}/users?targetUserId=${userId}`);
        console.log(`[API] projectApi.removeUserFromProject 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] projectApi.removeUserFromProject 호출 실패:`, error.response?.data);
        throw error;
    }
};

// 프로젝트 유저 자진탈퇴
export const goOutUserInProject = async (projectId) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/users`);
    console.log(`[API] projectApi.goOutUserInProject 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 유저가 해당 프로젝트의 팀장인지 확인
export const checkUserIsProjectLeader = async (projectId, token) => {
    const response = await axiosInstance.get(`/projects/${projectId}/users/isleader`, {
        headers: { Authorization: token }
    });
    console.log(`[API] projectApi.checkUserIsProjectLeader : ${JSON.stringify(response.data)}`);
    return response.data;
};



// Sprint 에 Backlog 추가
export const addBacklogToSprint = async(projectId, sprintId, title, weight) => {
try {
        const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/backlogs`, {
            title,
            weight
        });
        console.log(`[API] projectApi.addBacklogToSprint 호출, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] projectApi.addBacklogToSprint 호출 실패:`, error.response?.data);
        throw error;
    } 
}

//////////////////// Backlog 관련 API ////////////////////
export const updateBacklog = async (projectId, sprintId, backlogId, title, weight) => {
    console.log(`[API] projectApi.updateBacklog 호출, data=${JSON.stringify({title, weight})}`);
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}`, {
        title,
        weight
    });
    console.log(`[API] projectApi.updateBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// Backlog 완료 toggle
export const updateBacklogFinished = async (backlogId, finish) => {
    const response = await axiosInstance.patch(`/projects/0/sprints/0/backlogs/${backlogId}/finish`, {
        finish: finish
    });
    console.log(`[API] projectApi.updateBacklogFinished 호출, data=${JSON.stringify(response.data)}`);
    return response.data.finish;
}

export const getUsersInBacklog = async (projectId, sprintId, backlogId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/users`);
    console.log(`[API] projectApi.getUsersInBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

export const addUserInBacklog = async (projectId, sprintId, backlogId, userId) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/users/${userId}`);
    console.log(`[API] projectApi.addUserInBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

export const deleteUserInBacklog = async (projectId, sprintId, backlogId, userId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/users?userId=${userId}`);
    console.log(`[API] projectApi.deleteUserInBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 유저가 참여하는 백로그 조회
export const getUsersBacklogs = async (projectId, token) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/user-backlogs`, {
        headers: { Authorization: token }
    });
    console.log(`[API] projectApi.getUsersBacklogs 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

//////////////////// Task 관련 API ////////////////////

// Task 조회
export const getTasksInBacklog = async (projectId, sprintId, backlogId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks`);
    console.log(`[API] projectApi.getTasksInBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}



// Task 추가
export const addTaskToBacklog = async (projectId, sprintId, backlogId, taskContent) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks`, {
        content: taskContent
    });
    console.log(`[API] projectApi.addTaskToBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// Task 완료 상태 변경 (toggle)
export const updateTaskChecked = async (projectId, sprintId, backlogId, taskId, checked) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks/${taskId}/check`, {
        checked: checked
    });
    console.log(`[API] projectApi.updateTaskChecked 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// Task content 수정
export const updateTaskContent = async (projectId, sprintId, backlogId, taskId, content) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks/${taskId}/content`, {
        content: content
    });
    console.log(`[API] projectApi.updateTaskContent 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// Task 에 유저 추가
export const addUserOnTask = async (projectId, sprintId, backlogId, taskId, userId) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks/${taskId}/user`, {
        userId: userId
    });
    console.log(`[API] projectApi.addUserOnTask 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// Task 에 유저 삭제
export const deleteUserOnTask = async (projectId, sprintId, backlogId, taskId, userId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks/${taskId}/user`, {
        userId: userId
    });
    console.log(`[API] projectApi.deleteUserOnTask 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// Task 삭제
export const deleteTask = async (projectId, sprintId, backlogId, taskId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks/${taskId}`);
    console.log(`[API] projectApi.deleteTask 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 백로그 내 Task 완료 비율 조회
export const getBacklogTaskCompleteRate = async (projectId, sprintId, backlogId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/tasks/complete-rate`);
    console.log(`[API] projectApi.getBacklogTaskCompleteRate 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

//////////////////// Issue 관련 API ////////////////////

export const getIssuesInBacklog = async (projectId, sprintId, backlogId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/issues`);
    console.log(`[API] projectApi.getIssuesInBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

export const addIssueToBacklog = async (projectId, sprintId, backlogId, content) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/issues`, {
        content: content
    });
    console.log(`[API] projectApi.addIssueToBacklog 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

export const updateIssueChecked = async (projectId, sprintId, backlogId, issueId, checked) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/issues/${issueId}/check`, {
        checked: checked
    });
    console.log(`[API] projectApi.updateIssueChecked 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

export const updateIssueContent = async (projectId, sprintId, backlogId, issueId, content) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/issues/${issueId}`, {
        content: content
    });
    console.log(`[API] projectApi.updateIssueContent 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

export const deleteIssue = async (projectId, sprintId, backlogId, issueId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/issues/${issueId}`);
    console.log(`[API] projectApi.deleteIssue 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

//////////////////// DailyScrum 관련 API ////////////////////

// Sprint id 로 DailyScrum 리스트 조회
export const getDailyScrumList = async (projectId, sprintId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/dailyscrums`);
    console.log(`[API] projectApi.getDailyScrumList 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 오늘 날짜의 DailyScrum 조회
export const getDailyScrumInToday = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/projects/${projectId}/sprints/0/dailyscrums/today`);
        console.log(`[API] projectApi.getDailyScrumInToday 호출, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.log(`getDailyScrumInToday 예외터짐!ㅃ!! error=${error.message}`);
    }

}

// Sprint 에 DailyScrum 생성
export const addDailyScrumToSprint = async (projectId, sprintId) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/dailyscrums`);
    console.log(`[API] projectApi.addDailyScrumToSprint 호출 성공`);
    return response.data;
}

// DailyScrum 참석 유저 조회
export const getDailyScrumUserList = async (projectId, sprintId, dailyScrumId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/users`);
    console.log(`[API] projectApi.getDailyScrumUserList 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 참석 유저 추가
export const addUserToDailyScrum = async (projectId, sprintId, dailyScrumId, userId) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/users/${userId}`);
    console.log(`[API] projectApi.addUserToDailyScrum 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 참석 유저 삭제
export const deleteUserFromDailyScrum = async (projectId, sprintId, dailyScrumId, userId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/users/${userId}`);
    console.log(`[API] projectApi.deleteUserFromDailyScrum 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 백로그 조회
export const getBacklogListInDailyScrum = async (projectId, sprintId, dailyScrumId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/backlogs`);
    console.log(`[API] projectApi.getBacklogListInDailyScrum 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 에 백로그 추가
export const addBacklogToDailyScrum = async (projectId, sprintId, dailyScrumId, backlogId) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/backlogs/${backlogId}`);
    console.log(`[API] projectApi.addBacklogToDailyScrum 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 에 있는 백로그 삭제
export const removeBacklogFromDailyScrum = async (projectId, sprintId, dailyScrumId, backlogId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/backlogs/${backlogId}`);
    console.log(`[API] projectApi.removeBacklogFromDailyScrum 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 의 회의노트 조회
export const getDailyScrumContent = async (projectId, sprintId, dailyScrumId) => {
    console.log(`projectId = ${projectId}`);
    console.log(`sprintId = ${sprintId}`);
    console.log(`dailyScrumId = ${dailyScrumId}`);
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/content`);
    console.log(`[API] projectApi.getDailyScrumContent 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 에 회의노트 저장
export const saveDailyScrumContent = async (projectId, sprintId, dailyScrumId, content) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}/content`, {
        content: content
    });
    console.log(`[API] projectApi.saveDailyScrumContent 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// DailyScrum 삭제
export const deleteDailyScrum = async (projectId, sprintId, dailyScrumId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/dailyscrums/${dailyScrumId}`);
    console.log(`[API] projectApi.deleteDailyScrum 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}


//////////////////// Backlog Comment 관련 API ////////////////////
// 백로그 댓글 조회
export const getBacklogComments = async (projectId, sprintId, backlogId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/backlogcomments`);
    console.log(`[API] projectApi.getBacklogComments 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 백로그 댓글 생성
export const createBacklogComment = async (projectId, sprintId, backlogId, parentCommentId, content) => {
    const response = await axiosInstance.post(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/backlogcomments`, {
        parentCommentId: parentCommentId,
        content: content
    });
    console.log(`[API] projectApi.createBacklogComment 호출, data=${JSON.stringify(response.data)}`);
    return response.data;   
}


// 백로그 댓글 삭제
export const deleteBacklogComment = async (projectId, sprintId, backlogId, backlogCommentId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/backlogcomments/${backlogCommentId}`);
    console.log(`[API] projectApi.deleteBacklogComment 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 백로그 댓글 좋아요 누르기
export const onLikeToBacklogComment = async (projectId, sprintId, backlogId, backlogCommentId) => {
    const response = await axiosInstance.patch(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/backlogcomments/${backlogCommentId}/likes`);
    console.log(`[API] projectApi.onLikeToBacklogComment 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 백로그 댓글 좋아요 취소
export const offLikeToBacklogComment = async (projectId, sprintId, backlogId, backlogCommentId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}/sprints/${sprintId}/backlogs/${backlogId}/backlogcomments/${backlogCommentId}/likes`);
    console.log(`[API] projectApi.offLikeToBacklogComment 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}


//////////////////// Schedule 관련 API ////////////////////

// 캘린더 내 Sprint + Schedule 조회
export const getMySchedule = async (projectId, userId, year, month) => {
    const response = await axiosInstance.get(`/projects/${projectId}/calendar/users/${userId}?year=${year}&month=${month}`);
    console.log(`[API] projectApi.getMySchedule 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}

// 캘린더 내 Schedule 생성
export const addMySchedule = async (scheduleAddRequest, projectId) => {
    const response = await axiosInstance.post(`/projects/${projectId}/calendar`, scheduleAddRequest);
    console.log(`[API] projectApi.addMySchedule 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
}
// Schedule 생성 dto
/**
 * @Getter
public class ScheduleAddRequest {
    List<Long> userId;
    //제목
    String title;
    //종일여부
    Boolean isAllDay;
    //시작
    LocalDateTime startTime;
    //종료
    LocalDateTime endTime;
    //알림여부
    Boolean isAlarmOn;
    //알림 전 시간
    Integer preNotificationTime;
    //일정색상
    ScheduleColor color;
}

public enum ScheduleColor {
    RED, ORANGE , YELLOW, GREEN, BLUE, NAVY , PURPLE;
}

 */