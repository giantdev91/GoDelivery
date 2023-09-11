import axios from 'axios';
// import { API_URL } from "@env";
const API_URL = 'http://localhost:4000';
// const API_URL = 'http://10.0.2.2:4000';

// const API_URL = process.env.REACT_APP_API_URL;

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