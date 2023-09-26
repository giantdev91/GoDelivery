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

const updateProfile = async (param: any) => {
    const response = await APIService.post('/client/updateclient', param);
    return response;
}

const updatePassword = async (param: any) => {
    const response = await APIService.post('/client/changePassword', param);
    return response;
}

const deleteAccount = async (param: any) => {
    const response = await APIService.post('/client/delete', param);
    return response;
}

export default {
    getById,
    updateFcmToken,
    updateProfile,
    updatePassword,
    deleteAccount
}