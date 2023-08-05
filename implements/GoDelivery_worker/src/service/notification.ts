import { CreatedOrderListParam, AcceptRequestParam, CancelOrderParam } from '../type';
import APIService from './APIService';

const list = async (param) => {
    const response = await APIService.post('/notification/list', param);
    return response;
}

export default {
    list,
}