import axiosInstance from './axiosInstance';

// 유저 닉네임 조회
export const getUserNickname = async () => {
    const response = await axiosInstance.get('/user/nickname');
    return response.data;
};

// 유저 정보 조회 (useUserStore에 저장)
export const getUserInfo = async () => {
    // const response = await axiosInstance.get('/user/info');
    console.log('userApi.getUserInfo axios 호출');
    const dummyData = {
        id: 1,
        nickname: 'dummyuser',
        email: 'dummyuser@gmail.com',
        role: 'USER',
    };
    return dummyData;
};

// 유저가 속한 프로젝트 조회
export const getUserProjects = async () => {
    const response = await axiosInstance.get('/user/projects');
    console.log(`[API] userProjectApi.getUserProjects 호출, data=${JSON.stringify(response.data)}`);
    // const dummyData = [
    //     {projectId: 1, projectName: '더미프로젝트1'},
    //     {projectId: 2, projectName: '더미프로젝트2'},
    // ];
    // return dummyData;
    return response.data;
};