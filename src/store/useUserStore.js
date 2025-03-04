import { create } from 'zustand';
import { getUserInfo } from '../api/userApi';

export const useUserStore = create((set) => ({
    user: null, // 사용자 정보 (id, nickname, email, role 포함)
    isLoading: false,
    error: null,

    // 사용자 정보 불러오기
    fetchUserInfo: async () => {
        console.log('useUserStore.fetchUserInfo 호출');
        set({ isLoading: true, error: null });
        try {
            const user = await getUserInfo();
            set({ user, isLoading: false });
        } catch (error) {
            set({ error: '사용자 정보를 불러오는데 실패했습니다.', isLoading: false });
        }
    },

    // 사용자 정보 초기화 (로그아웃 시 사용)
    clearUser: () => set({ user: null, error: null })
}));