import { LoginParam, SignupParam, PhoneCheckParam } from '../type';
import APIService from './APIService';

const login = async (param: LoginParam) => {
    const response = await APIService.post('/deliveryman/signin', param);
    return response;
}

export default {
    login,
}