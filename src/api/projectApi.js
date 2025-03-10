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

    const response = await axiosInstance.post('/projects/create', requestBody);
    console.log(`[API] projectApi.getSprintList 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
};



// 스프린트 리스트 가져오기
export const getSprintList = async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/sprints`);
    console.log(`[API] projectApi.getSprintList 호출, data=${JSON.stringify(response.data)}`);
    return response.data;
    // const dummyData = [
    //     {
    //         sprintId: 1,
    //         sprintName: '설계하기',
    //         startDate: '2026-01-01',
    //         endDate: '2026-01-15',
    //         sprintOrder: 1
    //     },
    //     {
    //         sprintId: 2,
    //         sprintName: '구현하기',
    //         startDate: '2026-01-16',
    //         endDate: '2026-01-30',
    //         sprintOrder: 2
    //     },
    //     {
    //         sprintId: 3,
    //         sprintName: '테스트하기',
    //         startDate: '2026-01-31',
    //         endDate: '2026-02-15',
    //         sprintOrder: 3
    //     },
    //     {
    //         sprintId: 4,
    //         sprintName: '배포하기',
    //         startDate: '2026-02-16',
    //         endDate: '2026-02-28',
    //         sprintOrder: 4
    //     },
    //     {
    //         sprintId: 5,
    //         sprintName: '배포하기',
    //         startDate: '2026-02-16',
    //         endDate: '2026-02-28',
    //         sprintOrder: 5
    //     }
    // ]
    // return dummyData;
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
    console.log("[API] projectApi.getProductBacklog 호출");
    const dummyData = [
        {
            backlogId: 1,
            backlogName: '프로젝트 전체 설계 및 디자인하기',
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
        {
            backlogId: 14,
            backlogName: '4-1배포',
            sprintId: 4,
            sprintName: '배포하기',
            sprintOrder: 4,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 15,
            backlogName: '4-2배포', 
            sprintId: 4,
            sprintName: '배포하기',
            sprintOrder: 4,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 16,
            backlogName: '5-1배포',
            sprintId: 5,
            sprintName: '배포하기',
            sprintOrder: 5,
            weight: 1,
            isFinished: false
        },
        {
            backlogId: 17,
            backlogName: '5-2배포',
            sprintId: 5,
            sprintName: '배포하기',
            sprintOrder: 5,
            weight: 1,
            isFinished: false
        }
    ];
    // return response.data;
    return dummyData;
};

// 프로젝트 삭제
export const deleteProject = async (projectId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}`);
    return response.data;
};

// 프로젝트 이름 업데이트
export const updateProjectName = async (projectId, newProjectName) => {
    const response = await axiosInstance.patch(`/projects/${projectId}`, {
        projectName: newProjectName
    });
    return response.data;
};