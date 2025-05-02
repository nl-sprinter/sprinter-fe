import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useState, useEffect } from 'react';
import { login } from '../../api/authApi';
import { useUserStore } from '../../store/useUserStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const { user, fetchUserInfo } = useUserStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    useEffect(() => {
        if (loginSuccess && user) {
            if (user.role === 'ROLE_ADMIN') {
                navigate('/admin/userlist');
            } else {
                navigate('/home');
            }
        }
    }, [user, loginSuccess, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData.email, formData.password);
            console.log(`response:${JSON.stringify(response)}`);
            if (response.status === 200) {
                setLoginSuccess(true);
                
                const user = await fetchUserInfo();
                console.log(`user:${JSON.stringify(user)}`);

                if (user && user.role) {
                    if (user.role === 'ROLE_ADMIN') {
                        navigate('/admin/userlist');
                    } else {
                        navigate('/home');
                    }
                }
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            if (!error.response) {
                setError('서버와의 통신에 실패했습니다.');
            } else if (error.response.status !== 200) {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else {
                setError('로그인 중 오류가 발생했습니다.');
            }
        }
    };

    const handleGoogleLogin = async () => {
        // alert("Google 로그인 기능은 도메인 문제로 현재 지원 중단 되었습니다.")
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <MainLayout>
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white via-white to-[#3F5F8F] overflow-hidden">
                <form onSubmit={handleSubmit} className="w-full max-w-[400px] p-10 bg-white rounded-xl shadow-md flex flex-col gap-5 mx-5">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        로그인
                    </h1>
                    
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일"
                            required
                            autoComplete="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호"
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    
                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        로그인
                    </button>
                    
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-full border-t border-gray-300"></div>
                        <span className="relative px-4 bg-white text-sm text-gray-500">또는</span>
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <FcGoogle className="text-xl" />
                        Start with Google
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        뒤로 가기
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default LoginPage;