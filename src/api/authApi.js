import axiosInstance from './axiosInstance';

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password
        }, {withCredentials: true});
        console.log('전체 헤더:', Object.keys(response.headers));

        const accessToken = response.headers['authorization']?.split(' ')[1];
        console.log(accessToken);
        if (!accessToken) {
            throw new Error('accessToken 실종');
        }
        console.log(`accessToken: ${accessToken}`);
        localStorage.setItem('accessToken', accessToken);

        // refreshToken은 HttpOnly로 되어있어서 리액트에서 접근불가 -> localStorage에 못넣음


        // response.data 안에 200 OK를 리턴해줘야함
        return response.data;
    } catch (error) {
        console.log(`로그인 요청 실패:${error}`)
        throw error;
    }
};

export const signup = async (email, password, nickname) => {
    try {
        const response = await axiosInstance.post('/auth/signup', {
            email,
            password,
            nickname
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => { ////////TODO.로그아웃하려면 /logout하면 됨 일단
    localStorage.removeItem('accessToken');
};

// export const checkAuth = async () => {
//     try {
//         const response = await axiosInstance.get('/auth/check');
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };
