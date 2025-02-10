import axiosInstance from './axiosConfig';

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password
        });
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signup = async (email, password, nickname) => {
    try {
        const response = await axiosInstance.post('/auth/signup', {
            email,
            password,
            nickname
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
};

export const checkAuth = async () => {
    try {
        const response = await axiosInstance.get('/auth/check');
        return response.data;
    } catch (error) {
        throw error;
    }
};
