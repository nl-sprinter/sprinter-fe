import axiosInstance from './axiosInstance';


// 유저 정보 조회 (useUserStore에 저장)
export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.get('/user/info');
        console.log(`[API] userApi.getUserInfo 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(`[API] userApi.getUserInfo 호출 실패:`, {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            }
        });
        
        if (error.response?.status === 400) {
            throw new Error(`사용자 정보를 가져오는데 실패했습니다. (${error.response?.data?.message || '알 수 없는 오류'})`);
        }
        throw error;
    }
};

// 유저가 속한 프로젝트 조회
export const getUserProjects = async () => {
    const response = await axiosInstance.get('/user/projects');
    console.log(`[API] userApi.getUserProjects 호출, data=${JSON.stringify(response.data)}`);
    // const dummyData = [
    //     {projectId: 1, projectName: '더미프로젝트1'},
    //     {projectId: 2, projectName: '더미프로젝트2'},
    // ];
    // return dummyData;
    return response.data;
};

// 유저 정보 수정(닉네임, 비밀번호)
export const patchUserInfo = async (updateData) => {
    try {
        const response = await axiosInstance.patch('/user/update', updateData);
        console.log(`[API] userApi.patchUserInfo 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            error.message = error.response.data.message;
            console.log(error.response.data);
        } else {
            error.message = "알 수 없는 오류가 발생했습니다.";
        }
        throw error;
    }
}

// 유저 삭제 (회원탈퇴)
export const deleteUser = async () => {
    try {
        const response = await axiosInstance.delete('/user/delete');
        console.log(`[API] userApi.deleteUser 호출 성공, data=${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            error.message = error.response.data.message;
            console.log(error.response.data);
        } else {
            error.message = "알 수 없는 오류가 발생했습니다.";
        }
        throw error;
    }
};