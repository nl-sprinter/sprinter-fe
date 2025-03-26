import axios from 'axios';

const oauthAxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// 요청 인터셉터 추가
oauthAxiosInstance.interceptors.request.use(
    (config) => {
        // OPTIONS 요청에 대한 처리
        if (config.method === 'options') {
            config.headers['Access-Control-Request-Method'] = 'GET,POST,PUT,DELETE,OPTIONS';
            config.headers['Access-Control-Request-Headers'] = 'Content-Type, Authorization';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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