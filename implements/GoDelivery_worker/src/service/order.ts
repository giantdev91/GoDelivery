import { CreatedOrderListParam, AcceptRequestParam } from '../type';
import APIService from './APIService';

const createOrder = async (param) => {
    const response = await APIService.post('/order/create', param);
    return response;
}

const createdOrderList = async (param: CreatedOrderListParam) => {
    const response = await APIService.post('/order/createdOrderList', param);
    return response;
}

const acceptOrder = async (param: AcceptRequestParam) => {
    const response = await APIService.post('/order/acceptrequest', param);
    return response;
}

const fetchMyOrder = async (param: any) => {
    const response = await APIService.post('/order/processingDetailByDeliveryman', param);
    return response;
}

export default {
    createOrder,
    createdOrderList,
    acceptOrder,
    fetchMyOrder
}