/**
 * 로그인이 필요한 라우트 포인트에 적용한다.
 * 로그인 된 사용자: 통과
 * 로그인 안된 사용자: /login 으로 네비게이트
 */

import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
