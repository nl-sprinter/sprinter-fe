import { create } from 'zustand';
import { getUserProjects } from '../api/userProjectApi';

export const useUserProjectStore = create((set) => ({
    projects: [],      // 유저가 속한 프로젝트 목록
    isLoading: false,  // 로딩 상태
    error: null,       // 에러 상태

    // 프로젝트 목록 가져오기
    fetchProjects: async () => {
        console.log('useUserProjectStore.fetchProjects 호출');
        set({ isLoading: true, error: null });
        try {
            const projects = await getUserProjects();
            set({ projects, isLoading: false });
        } catch (error) {
            console.error('프로젝트 목록을 불러오는데 실패했습니다:', error);
            set({ projects: [], error: '프로젝트 목록을 불러오는데 실패했습니다.', isLoading: false });
        }
    },

    // 프로젝트 목록 초기화 (로그아웃 시 사용)
    clearProjects: () => set({ 
        projects: [], 
        error: null 
    })
}));