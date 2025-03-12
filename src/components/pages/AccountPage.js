import Layout from '../common/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { patchUserInfo, deleteUser } from '../../api/userApi';
import SmallInfoModal from '../common/modal/SmallInfoModal';
import SmallFormModal from '../common/modal/form/SmallFormModal';

const AccountPage = () => {
    const navigate = useNavigate();
    const { user, fetchUserInfo } = useUserStore();
    const [formData, setFormData] = useState({
        nickname: user?.nickname || '',
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
    });
    const [errors, setErrors] = useState({});
    const [infoModal, setInfoModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nickname.trim()) {
            newErrors.nickname = '닉네임을 입력해주세요';
        }

        if (formData.newPassword || formData.newPasswordConfirm) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
            }
            if (formData.newPassword !== formData.newPasswordConfirm) {
                newErrors.newPasswordConfirm = '새 비밀번호가 일치하지 않습니다';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const updateData = {
                userId: user.userId,
                nickname: formData.nickname,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword || null
            };

            const response = await patchUserInfo(updateData);
            
            // 비밀번호 관련 필드만 초기화
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                newPasswordConfirm: ''
            }));

            // 성공 메시지 표시
            setInfoModal({
                isOpen: true,
                title: '회원정보 수정 완료',
                message: '회원정보가 성공적으로 수정되었습니다.',
                type: 'success'
            });

            await fetchUserInfo();

        } catch (error) {
            // 현재 비밀번호가 틀린 경우 (401 에러)
            if (error.status === 401) {
                setErrors(prev => ({
                    ...prev,
                    currentPassword: error.message
                }));
                setInfoModal({
                    isOpen: true,
                    title: '수정할 수 없습니다.',
                    message: error.message,
                    type: 'error'
                });
                return;
            }

            // 닉네임이 중복된 경우 (409 에러)
            if (error.status === 409) {
                setErrors(prev => ({
                    ...prev,
                    nickname: error.message
                }));
                setInfoModal({
                    isOpen: true,
                    title: '수정할 수 없습니다.',
                    message: error.message,
                    type: 'error'
                });
                return;
            }

            // 기타 에러
            setInfoModal({
                isOpen: true,
                title: '회원정보 수정 실패',
                message: error.response?.data?.message || '회원정보 수정에 실패했습니다.',
                type: 'error'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 에러 메시지 초기화
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser();
            setIsDeleteModalOpen(false);
            setInfoModal({
                isOpen: true,
                title: '계정 삭제 완료',
                message: '계정이 성공적으로 삭제되었습니다. 잠시 후 메인 화면으로 이동합니다.',
                type: 'success'
            });
            // 계정 삭제 후 로그아웃 처리를 위해 /logout으로 이동
            setTimeout(() => {
                navigate('/logout');
            }, 1500);
        } catch (error) {
            setInfoModal({
                isOpen: true,
                title: '계정 삭제 실패',
                message: error.message || '계정 삭제에 실패했습니다.',
                type: 'error'
            });
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">
                    계정 정보 수정
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.nickname && (
                            <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            현재 비밀번호
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
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
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
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
                            name="newPasswordConfirm"
                            value={formData.newPasswordConfirm}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.newPasswordConfirm && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPasswordConfirm}</p>
                        )}
                    </div>
                
                    <div className="flex justify-end gap-4 mt-8">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                        >
                            뒤로가기
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                        >
                            수정
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            계정 삭제
                        </button>
                    </div>
                </form>

                <SmallInfoModal
                    isOpen={infoModal.isOpen}
                    onClose={() => {
                        setInfoModal({ ...infoModal, isOpen: false });
                        if (infoModal.type === 'success') {
                            navigate('/home');
                        }
                    }}
                    title={infoModal.title}
                    message={infoModal.message}
                    type={infoModal.type}
                />

                <SmallFormModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="계정 삭제 확인"
                    submitText="삭제"
                    onSubmit={handleDeleteAccount}
                >
                    <div className="space-y-4">
                        <p className="text-red-600 font-medium">
                            경고: 계정 삭제는 되돌릴 수 없습니다.
                        </p>
                        <p className="text-gray-600">
                            계정을 삭제하면 모든 개인 정보와 활동 내역이 삭제됩니다.
                            <br/>
                            정말로 계정을 삭제하시겠습니까?
                        </p>
                    </div>
                </SmallFormModal>
            </div>
        </Layout>
    );
};

export default AccountPage;