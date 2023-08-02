import { InProgressParam } from '../type';
import APIService from './APIService';

const createOrder = async (param) => {
    const response = await APIService.post('/order/create', param);
    return response;
}

const inprogressOrders = async (param: InProgressParam) => {
    const response = await APIService.post('/order/inprogress', param);
    return response;
}

export default {
    createOrder,
    inprogressOrders
}