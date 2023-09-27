import { InProgressParam, OrderUpdateParam, LeaveFeedbackParam, CancelOrderParam } from '../type';
import APIService from './APIService';

const createOrder = async (param) => {
    const response = await APIService.post('/order/create', param);
    return response;
}

const inprogressOrders = async (param: InProgressParam) => {
    const response = await APIService.post('/order/inprogress', param);
    return response;
}

const sendGoods = async (param: OrderUpdateParam) => {
    const response = await APIService.post('/order/send', param);
    return response;
}

const receiveGoods = async (param: OrderUpdateParam) => {
    const response = await APIService.post('/order/receive', param);
    return response;
}

const completeOrders = async (param) => {
    const response = await APIService.post('/order/list', param);
    return response;
}

const leaveFeedback = async (param: LeaveFeedbackParam) => {
    const response = await APIService.post('/order/rate', param);
    return response;
}

const cancelOrder = async (param: CancelOrderParam) => {
    const response = await APIService.post('/order/cancel', param);
    return response;
}

const getByID = async (param: {
    orderID: any
}) => {
    const response = await APIService.post('/order/getByID', param);
    return response;
}

export default {
    createOrder,
    inprogressOrders,
    sendGoods,
    receiveGoods,
    completeOrders,
    leaveFeedback,
    cancelOrder,
    getByID
}