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

export default {
    updateLocation,
    updateFcmToken
}