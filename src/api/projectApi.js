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
