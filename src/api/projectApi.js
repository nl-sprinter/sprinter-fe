import axiosInstance from './axiosInstance';

export const createProject = async (data) => {
    const requestBody = {
        project: {
            project_name: data.project.project_name
        },
        sprint: {
            sprint_count: data.sprint.sprint_count,
            sprint_duration: data.sprint.sprint_duration
        },
        backlog: data.backlog.map(item => ({
            sprint_number: item.sprint_number,
            title: item.title,
            weight: item.weight
        }))
    };

    console.log("서버로 보내는 최종 프로젝트데이터",requestBody);

    const response = await axiosInstance.post('/project/create', requestBody);
    return response.data;
};