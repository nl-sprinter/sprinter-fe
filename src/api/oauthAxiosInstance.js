import axios from 'axios';

const oauthAxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
    },
    withCredentials: true
});

export default oauthAxiosInstance; 