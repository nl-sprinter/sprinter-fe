import axios from 'axios';

// axios 기본 설정
const instance = axios.create({
    baseURL: '/api/v1',
    withCredentials: true  // JSESSIONID를 자동으로 포함시키기 위한 설정
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // 인증되지 않은 요청일 경우 로그인 페이지로 리다이렉트
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
