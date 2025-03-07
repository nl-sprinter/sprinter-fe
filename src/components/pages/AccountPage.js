import Layout from '../common/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';

const AccountPage = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
    });
    const [errors, setErrors] = useState({});
    
    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">
                    계정 정보 수정
                </h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            이메일
                        </label>
                        <input
                            type="email"
                            disabled
                            value={user?.email}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            닉네임
                        </label>
                        <input
                            type="text"
                            disabled
                            value={user?.nickname}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            현재 비밀번호
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            새 비밀번호
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            새 비밀번호 확인
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.newPasswordConfirm && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPasswordConfirm}</p>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                    >
                        뒤로가기
                    </button>
                    <button 
                        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                    >
                        수정
                    </button>
                    <button 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        회원 탈퇴
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default AccountPage;