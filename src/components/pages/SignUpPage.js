import Layout from '../common/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signup } from '../../api/authApi';
import SmallInfoModal from '../common/modal/SmallInfoModal';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        nickname: '',
        password: '',
        passwordConfirm: ''
    });
    const [errors, setErrors] = useState({});
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다';
        }

        if (!formData.nickname) {
            newErrors.nickname = '닉네임을 입력해주세요';
        }

        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        }

        if (!formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요';
        } else if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await signup(
                formData.email,
                formData.password,
                formData.nickname
            );
            setInfoModal({
                isOpen: true,
                title: '회원가입 완료',
                message: '회원가입이 성공적으로 완료되었습니다.',
                type: 'success'
            });
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '회원가입 실패',
                message: error.message || '회원가입에 실패했습니다.',
                type: 'error'
            });
            setErrors({ submit: error.message || '회원가입에 실패했습니다' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Layout>
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white via-white to-blue-900 overflow-hidden">
                <form onSubmit={handleSubmit} className="w-full max-w-[400px] p-10 bg-white rounded-xl shadow-md flex flex-col gap-5 mx-5">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        회원가입
                    </h1>
                    
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
                                ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="닉네임"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
                                ${errors.nickname ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>}
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
                                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            placeholder="비밀번호 확인"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
                                ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
                    </div>
                    
                    {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
                    
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        회원가입
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        뒤로 가기
                    </button>
                </form>
                
                <SmallInfoModal
                    isOpen={infoModal.isOpen}
                    onClose={() => {
                        setInfoModal({ ...infoModal, isOpen: false });
                        if (infoModal.type === 'success') {
                            navigate('/');
                        }
                    }}
                    title={infoModal.title}
                    message={infoModal.message}
                    type={infoModal.type}
                />
            </div>
        </Layout>
    );
};

export default SignUpPage;