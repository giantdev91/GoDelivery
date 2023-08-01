import { } from '../type';
import APIService from './APIService';

const createOrder = async (param) => {
    const response = await APIService.post('/order/create', param);
    return response;
}

export default {
    createOrder,
}