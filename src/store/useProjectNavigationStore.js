import {create} from 'zustand';
import { getSprintList } from '../api/projectApi';

/**
 * 프로젝트 관련한 네비게이트 스토어
 */
export const useProjectNavigationStore = create((set, get) => ({
    projectId: null,
    sprintId: null,
    backlogId: null,
    sprints: [],
    isSprintOpen: false,

    setProjectId: async (projectId) => {
        console.log(`projectId가 ${projectId}로 변경되었습니다.`);
        try {
            // projectId 설정과 동시에 해당 프로젝트의 스프린트 목록을 가져옴
            const sprintList = await getSprintList(projectId);
            set({
                projectId,
                sprintId: null,
                backlogId: null,
                sprints: sprintList
            });
        } catch (error) {
            console.error('스프린트 목록을 불러오는데 실패했습니다:', error);
            set({
                projectId,
                sprintId: null,
                backlogId: null,
                sprints: []
            });
        }
    },

    fetchSprints: async () => {
        const projectId = get().projectId;
        if (!projectId) return;
        
        try {
            const sprintList = await getSprintList(projectId);
            set({ sprints: sprintList });
        } catch (error) {
            console.error('스프린트 목록을 불러오는데 실패했습니다:', error);
        }
    },

    setSprintId: (sprintId) => set({
        sprintId,
        backlogId: null,
    }),

    setTaskId: (taskId) => set({
        taskId
    }),

    setIsSprintOpen: (isOpen) => set({
        isSprintOpen: isOpen
    }),

    reset: () => set({
        projectId: null,
        sprintId: null,
        backlogId: null,
        sprints: [],
        isSprintOpen: false
    })
}));