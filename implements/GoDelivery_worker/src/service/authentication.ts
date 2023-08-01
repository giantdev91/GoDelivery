import { LoginParam, UpdateFcmTokenParam } from '../type';
import APIService from './APIService';

const login = async (param: LoginParam) => {
    const response = await APIService.post('/deliveryman/signin', param);
    return response;
}

const updateFcmToken = async (param: UpdateFcmTokenParam) => {
    const response = await APIService.post('/deliveryman/updateFcmToken', param);
    return response;
}

export default {
    login,
    updateFcmToken
}