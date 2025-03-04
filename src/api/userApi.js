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
