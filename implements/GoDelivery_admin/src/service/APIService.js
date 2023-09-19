import axios from 'axios';
const API_URL = 'http://34.172.13.182:4000';

const config = {
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
};

const APIServer = axios.create(config);

// const authInterceptor = (config) => {
//     const token = store.getState().CurrentUser.authToken;
//     config.headers.Authorization = token;
//     return config;
// };

// APIServer.interceptors.request.use(authInterceptor);

export default APIServer;