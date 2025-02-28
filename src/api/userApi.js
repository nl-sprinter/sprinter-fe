import axiosInstance from './axiosConfig';

export const getUserProjects = async () => {
    const response = await axiosInstance.get('/user/projects');
    return response.data;
}; 


export const getUserNickname = async () => {
    const response = await axiosInstance.get('/user/nickname');
    return response.data;
};