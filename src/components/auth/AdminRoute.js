/**
 * 어드민 페이지 라우트에 적용한다.
 * 어드민: /admin/userlist 으로 네비게이트
 * 일반 유저: /home 으로 네비게이트
 */

import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { useEffect, useState } from 'react';

const AdminRoute = ({ children }) => {
    const user = useUserStore(state => state.user);
    const fetchUserInfo = useUserStore(state => state.fetchUserInfo);
    const [isChecking, setIsChecking] = useState(true);
    
    useEffect(() => {
        const checkUser = async () => {
            if (!user) {
                try {
                    await fetchUserInfo();
                } catch (error) {
                    console.error('사용자 정보 가져오기 실패:', error);
                }
            }
            setIsChecking(false);
        };
        
        checkUser();
    }, [user, fetchUserInfo]);
    
    // 로딩 중이거나 사용자 확인 중일 때 로딩 표시
    if (isChecking) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    
    // user가 null인 경우 로그인 페이지로 리디렉션
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    // 어드민이 아니면 홈으로 리디렉션
    if (user.role !== 'ROLE_ADMIN') {
        return <Navigate to="/home" replace />;
    }
    
    // 어드민인 경우 자식 컴포넌트 렌더링
    return children;
};

export default AdminRoute; 