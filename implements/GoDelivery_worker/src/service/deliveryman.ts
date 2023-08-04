import { UpdateLocationParam, UpdateFcmTokenParam } from '../type';
import APIService from './APIService';


const updateLocation = async (param: UpdateLocationParam) => {
    const response = await APIService.post('/deliveryman/updateLocation', param);
    return response;
}

const updateFcmToken = async (param: UpdateFcmTokenParam) => {
    const response = await APIService.post('/deliveryman/updateFcmToken', param);
    return response;
}

const getById = async (id: string) => {
    const response = await APIService.get(`/deliveryman/${id}`);
    return response;
}

const updateDeliverymanStatus = async (param: any) => {
    const response = await APIService.post('/deliveryman/updatestate', param);
    return response;
}

export default {
    updateLocation,
    updateFcmToken,
    getById,
    updateDeliverymanStatus,
}