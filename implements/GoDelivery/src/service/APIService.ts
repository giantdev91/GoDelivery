import axios from 'axios';
import store from '../redux/store';
// const API_URL = process.env.API_URL;
const API_URL = "http://10.0.2.2:4000";
console.log("API_URL: ", API_URL);

const config = {
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
};

const APIServer = axios.create(config);

const authInterceptor = (config: any) => {
    const token = store.getState().CurrentUser.authToken;
    config.headers.Authorization = token;
    return config;
};

APIServer.interceptors.request.use(authInterceptor);

export default APIServer;