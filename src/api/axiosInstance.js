import axios from 'axios';

// LoadingContext와 ErrorContext import
let loadingCallback = () => {};
let errorCallback = () => {};

export const setLoadingHandler = (callback) => {
    loadingCallback = callback;
};

export const setErrorHandler = (callback) => {
    errorCallback = callback;
};

// axios 기본 설정
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // axios 할 때 기본 URL을 여기서 설정
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
    },
    withCredentials: true
});

// 요청 인터셉터 (서버로 요청을 보내기 전에 인터셉트)
// JWT 토큰을 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
        loadingCallback(true); // 요청 시작시 로딩 표시
        const token = localStorage.getItem('accessToken'); // localStorage에 저장된 accessToken 가져오기
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 토큰이 있다면, 요청헤더에 추가
        }
        return config;
    },
    (error) => {
        loadingCallback(false);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (서버로부터 응답을 받은 후 자동으로 실행)
// 토큰 만료 처리
axiosInstance.interceptors.response.use(
    (response) => {
        loadingCallback(false); // 응답 완료시 로딩 숨김
        return response;
    },
    async (error) => {
        if (!error.response) {
            if (!navigator.onLine) {
                errorCallback('인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.');
            } else if (error.code === 'ERR_NETWORK') {
                errorCallback('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
            } else {
                errorCallback('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            loadingCallback(false);
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        // 401 에러 & 재시도하지 않은 요청 & 리프레시 요청이 아닌 경우
        if (error.response.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/refresh')) {
            
            originalRequest._retry = true;

            try {
                const refreshResponse = await axiosInstance.post('/auth/refresh', {}, {withCredentials: true});

                // 새로운 accessToken을 localStorage에 저장
                const newAccessToken = refreshResponse.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken); // 새로운 accessToken을 저장

                // 기존 요청을 newAccessToken으로 다시 실행
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // refreshToken도 만료되었을 경우 로그아웃 처리
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        errorCallback(error.response?.data?.message || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        loadingCallback(false);
        return Promise.reject(error);
    }
);

export default axiosInstance;
