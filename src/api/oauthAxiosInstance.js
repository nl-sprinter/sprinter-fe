import axios from 'axios';

const oauthAxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});


// 응답 인터셉터 추가
oauthAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 405) {
            console.error('Method not allowed:', error);
        }
        return Promise.reject(error);
    }
);

export default oauthAxiosInstance;