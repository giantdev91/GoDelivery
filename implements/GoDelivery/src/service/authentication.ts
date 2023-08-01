import { LoginParam, SignupParam, PhoneCheckParam } from '../type';
import APIService from './APIService';

const login = async (param: LoginParam) => {
    const response = await APIService.post('/client/signin', param);
    return response;
}

const signup = async (param: SignupParam) => {
    const response = await APIService.post('/client/signup', param);
    return response;
}

const phoneCheck = async (param: PhoneCheckParam) => {
    const response = await APIService.post('/client/phonecheck', param);
    return response;
}

export default {
    login,
    signup,
    phoneCheck
}