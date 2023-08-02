import { GetByIdParam, UpdateFcmTokenParam } from '../type';
import APIService from './APIService';

const getById = async (param: GetByIdParam) => {
    const response = await APIService.get('/client/get', { params: param });
    return response;
}

const updateFcmToken = async (param: UpdateFcmTokenParam) => {
    const response = await APIService.post('/client/updateFcmToken', param);
    return response;
}

export default {
    getById,
    updateFcmToken
}