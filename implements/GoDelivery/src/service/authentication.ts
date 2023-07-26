import { LoginPram } from '../type';
import APIService from './APIService';

const login = async (param: LoginPram) => {
    const response = await APIService.post('/client/signin', param);
    return response;
}

export default {
    login,
}