import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAccessTokenAndRefreshTokenFromOAuth2 } from '../../api/authApi';
import { useUserStore } from '../../store/useUserStore';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const { fetchUserInfo } = useUserStore();

    useEffect(() => {
        const handleRefresh = async () => {
            try {
                await saveAccessTokenAndRefreshTokenFromOAuth2();
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
        <></>
    );
};

export default OAuth2RedirectHandler;