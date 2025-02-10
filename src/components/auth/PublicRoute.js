/**
 * 로그인이 필요없는 라우트 포인트에 적용한다.
 * 로그인 된 사용자: /home 으로 네비게이트
 * 로그인 안된 사용자: 통과
 */

import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PublicRoute; 