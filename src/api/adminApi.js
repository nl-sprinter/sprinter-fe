import axiosInstance from "./axiosInstance";

const getDummyUsers = () => {
    let userList = [];
    for (let i=0; i<100; i++) {
        userList.push({
            userId: i+1,
            nickname: `더미닉네임${i+1}`,
            password: "********",
            email: `dummy${i+1}@example.com`,
            role: "ROLE_USER"
        })
    }
    return userList;
}


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
        // 백엔드 완성 시 사용할 코드
        // const response = await axiosInstance.get('/admin/users', {
        //     params: { page: page - 1, size, searchTerm }
        // });
        // return response.data;
        
        // 더미 데이터 반환 (페이지네이션 구현)
        console.log(`[API] adminApi.getUserList 호출 - 페이지: ${page}, 크기: ${size}, 검색어: ${searchTerm}`);
        
        // 더미 유저 목록
        const allUsers = getDummyUsers();
        
        // 검색어 필터링
        let filteredUsers = allUsers;
        if (searchTerm) {
            filteredUsers = allUsers.filter(user => 
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // 페이지네이션 처리
        const totalElements = filteredUsers.length;
        const totalPages = Math.ceil(totalElements / size);
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, totalElements);
        const content = filteredUsers.slice(startIndex, endIndex);
        
        // Spring Data JPA Page 객체와 유사한 형식으로 반환
        return {
            content,
            pageable: {
                pageNumber: page - 1,
                pageSize: size
            },
            totalElements,
            totalPages,
            last: page >= totalPages,
            first: page === 1,
            size,
            number: page - 1,
            sort: {
                sorted: true
            },
            numberOfElements: content.length
        };
    } catch (error) {
        console.error('[API] adminApi.getUserList 에러:', error);
        throw error;
    }
};

// 특정 유저에게 알림 보내기
export const sendAlertToUser = async (userId, message) => {
    try {
        // 백엔드 완성 시 사용할 코드
        // const response = await axiosInstance.post(`/admin/users/message/${userId}`, { message });
        // return response.data;
        
        // 더미 응답 반환
        console.log(`[API] adminApi.sendAlertToUser 호출 - userId: ${userId}, message: ${message}`);
        return { success: true, message: `${userId}번 사용자에게 알림을 보냈습니다.` };
    } catch (error) {
        console.error('[API] adminApi.sendAlertToUser 에러:', error);
        throw error;
    }
};

// 선택한 유저들에게 알림 보내기
export const sendAlertToSelectedUsers = async (userIds, message) => {
    try {
        // 백엔드 완성 시 사용할 코드
        // const response = await axiosInstance.post('/admin/users/message/selected', { userIds, message });
        // return response.data;
        
        // 더미 응답 반환
        console.log(`[API] adminApi.sendAlertToSelectedUsers 호출 - userIds: ${userIds}, message: ${message}`);
        return { success: true, message: `${userIds.length}명의 사용자에게 알림을 보냈습니다.` };
    } catch (error) {
        console.error('[API] adminApi.sendAlertToSelectedUsers 에러:', error);
        throw error;
    }
};

// 특정 유저 삭제
export const deleteUser = async (userId) => {
    try {
        // 백엔드 완성 시 사용할 코드
        // const response = await axiosInstance.delete(`/admin/users/${userId}`);
        // return response.data;
        
        // 더미 응답 반환
        console.log(`[API] adminApi.deleteUser 호출 - userId: ${userId}`);
        return { success: true, message: `${userId}번 사용자가 삭제되었습니다.` };
    } catch (error) {
        console.error('[API] adminApi.deleteUser 에러:', error);
        throw error;
    }
};

// 선택한 유저들 삭제
export const deleteSelectedUsers = async (userIds) => {
    try {
        // 백엔드 완성 시 사용할 코드
        // const response = await axiosInstance.delete('/admin/users', { data: { userIds } });
        // return response.data;
        
        // 더미 응답 반환
        console.log(`[API] adminApi.deleteSelectedUsers 호출 - userIds: ${userIds}`);
        return { success: true, message: `${userIds.length}명의 사용자가 삭제되었습니다.` };
    } catch (error) {
        console.error('[API] adminApi.deleteSelectedUsers 에러:', error);
        throw error;
    }
};