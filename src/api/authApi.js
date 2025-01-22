import axios from './axiosConfig';

export const authApi = {
    signup: async (email, password, nickname) => {
        console.log(`received email=${email}, password=${password}, nickname=${nickname}`)
        try {
            const response = await axios.post('/auth', {
                email,
                password,
                nickname
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    login: async (email, password) => {
        try {
            const response = await axios.post('/login', {
                email,
                password
            });
            return response;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
