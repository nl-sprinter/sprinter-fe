import axiosInstance from "./axiosInstance";

// 모든 유저 조회 (페이징 처리 해서 보내줘야함!!)
/**
 * 유저 dto
    private Long userId;

    private String nickname;

    private String password;

    private String email;

    private String role;
 */
export const getUserList = async (page = 1, size = 20, searchTerm = "") => {
    try {
        const response = await axiosInstance.get('/admin/users', {
            params: { page: page - 1, size, searchTerm }
        });
        return response.data;
    } catch (error) {
        console.error('[API] adminApi.getUserList 에러:', error);
        throw error;
    }
};

// 선택한 유저들에게 알림 보내기
export const sendAlertToSelectedUsers = async (userIds, message) => {
    try {
        const response = await axiosInstance.post('/admin/users/message/selected', { userIds, message });
        return response.data;
    } catch (error) {
        console.error('[API] adminApi.sendAlertToSelectedUsers 에러:', error);
        throw error;
    }
};

// 선택한 유저들 삭제
export const deleteSelectedUsers = async (userIds) => {
    try {
        const response = await axiosInstance.delete('/admin/users', { data: { userIds } });
        return response.data;
    } catch (error) {
        console.error('[API] adminApi.deleteSelectedUsers 에러:', error);
        throw error;
    }
};