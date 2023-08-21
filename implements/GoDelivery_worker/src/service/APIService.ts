import axios from 'axios';
// import { API_URL } from "@env";
import store from '../redux/store';
const API_URL = 'http://34.28.220.154:4000';
// const API_URL = 'http://10.0.2.2:4000';

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