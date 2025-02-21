import { useLoading } from '../contexts/LoadingContext';
import { useError } from '../contexts/ErrorContext';

const useApiCall = () => {
    const { setIsLoading } = useLoading();
    const { showError } = useError();

    const callApi = async (apiFunction, ...args) => {
        setIsLoading(true);
        try {
            const response = await apiFunction(...args);
            return response;
        } catch (error) {
            console.error('API 호출 에러:', error);
            if (!navigator.onLine) {
                showError('인터넷 연결이 끊어졌습니다. 네트워크 연결을 확인해주세요.');
            } else if (error.code === 'ERR_NETWORK') {
                showError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
            } else {
                showError(error.response?.data?.message || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { callApi };
};

export default useApiCall; 