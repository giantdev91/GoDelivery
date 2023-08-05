import { CreatedOrderListParam, AcceptRequestParam, CancelOrderParam } from '../type';
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

const cancelOrder = async (param: CancelOrderParam) => {
    const response = await APIService.post('/order/cancel', param);
    return response;
}

const completeOrders = async (param) => {
    const response = await APIService.post('/order/list', param);
    return response;
}

export default {
    createOrder,
    createdOrderList,
    acceptOrder,
    fetchMyOrder,
    cancelOrder,
    completeOrders
}