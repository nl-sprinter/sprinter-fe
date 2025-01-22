import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // JSESSIONID 쿠키 확인
    const isAuthenticated = document.cookie.includes('JSESSIONID');
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default PrivateRoute;
