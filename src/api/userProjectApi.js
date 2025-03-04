import axiosInstance from './axiosInstance';

// 사이드바에서 유저 프로젝트 조회
export const getUserProjects = async () => {
    // const response = await axiosInstance.get('/user/projects_sidebar');
    console.log('userProjectApi.getUserProjects axios 호출');
    const dummyData = [
        { projectId: 1, projectName: '더미프로젝트1' },
        { projectId: 2, projectName: '더미프로젝트2' },
    ];
    return dummyData;
};
