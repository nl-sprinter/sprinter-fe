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



// 스프린트 리스트 가져오기
export const getSprintList = async (projectId) => {
    // const response = await axiosInstance.get(`/project/${projectId}/sprint`);
    console.log("projectApi.getSprintList axios 호출");
    const dummyData = [
        {
            sprintId: 1,
            sprintName: '설계하기',
            startDate: '2026-01-01',
            endDate: '2026-01-15',
            sprintOrder: 1
        },
        {
            sprintId: 2,
            sprintName: '구현하기',
            startDate: '2026-01-16',
            endDate: '2026-01-30',
            sprintOrder: 2
        },
        {
            sprintId: 3,
            sprintName: '테스트하기',
            startDate: '2026-01-31',
            endDate: '2026-02-15',
            sprintOrder: 3
        }
    ]
    return dummyData;
};


// 프로덕트 백로그 탭 전용 데이터 가져오기
// 백로그id
// 백로그name
// 스프린트id
// 스프린트name
// 스프린트order
// weight
// isFinished
export const getProductBacklog = async (projectId) => {
    // const response = await axiosInstance.get(`/project/${projectId}/product-backlog`);
    console.log("projectApi.getProductBacklog axios 호출");
    const dummyData = [
        {
            backlogId: 1,
            backlogName: '1-1설계',
            sprintId: 1,
            sprintName: '설계하기',
            sprintOrder: 1,
            weight: 3,
            isFinished: false
        },
        {
            backlogId: 2,
            backlogName: '1-2설계',
            sprintId: 1,
            sprintName: '설계하기',
            sprintOrder: 1,
            weight: 2,
            isFinished: false
        },
        {
            backlogId: 3,
            backlogName: '1-3설계',
            sprintId: 1,
            sprintName: '설계하기',
            sprintOrder: 1,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 4,
            backlogName: '2-1구현',
            sprintId: 2,
            sprintName: '구현하기',
            sprintOrder: 2,
            weight: 3,
            isFinished: false
        },
        {
            backlogId: 5,
            backlogName: '2-2구현',
            sprintId: 2,
            sprintName: '구현하기',
            sprintOrder: 2, 
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 6,
            backlogName: '3-1테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 7,
            backlogName: '3-2테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 2,
            isFinished: false
        },
        {
            backlogId: 8,
            backlogName: '3-3테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 9,
            backlogName: '3-4테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 10,
            backlogName: '3-5테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 11,
            backlogName: '3-6테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 12,
            backlogName: '3-7테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 13,
            backlogName: '3-8테스트',
            sprintId: 3,
            sprintName: '테스트하기',
            sprintOrder: 3,
            weight: 1,
            isFinished: false
        },
    ];
    // return response.data;
    return dummyData;
};