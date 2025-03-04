import {create} from 'zustand';

/**
 * 프로젝트 관련한 네비게이트 스토어
 */
export const useProjectNavigationStore = create((set) => ({
    projectId: null,
    sprintId: null,
    backlogId: null,

    setProjectId: (projectId) => {
        console.log(`projectId가 ${projectId}로 변경되었습니다.`);
        set({
            projectId,
            sprintId: null,
            backlogId: null,
        });
    },

    setSprintId: (sprintId) => set({
        sprintId,
        backlogId: null,
    }),

    setTaskId: (taskId) => set({
        taskId
    }),

    reset: () => set({
        projectId: null,
        sprintId: null,
        backlogId: null,
    })
}));