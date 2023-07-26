import { LoginParam, SignupParam } from '../type';
import APIService from './APIService';

const login = async (param: LoginParam) => {
    const response = await APIService.post('/client/signin', param);
    return response;
}

const signup = async (param: SignupParam) => {
    const response = await APIService.post('/client/signup', param);
    return response;
}

export default {
    login,
    signup
}