import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refresh } from '../../api/authApi';
import { useUserStore } from '../../store/useUserStore';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const { fetchUserInfo } = useUserStore();

    useEffect(() => {
        const handleRefresh = async () => {
            try {
                await refresh();
                await fetchUserInfo();
                navigate('/home');
            } catch (error) {
                console.error('리프레시 토큰 처리 중 오류 발생:', error);
                navigate('/login');
            }
        };

        handleRefresh();
    }, [navigate, fetchUserInfo]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-600">로그인 처리 중...</div>
        </div>
    );
};

export default OAuth2RedirectHandler;