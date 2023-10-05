import { CreatedOrderListParam, AcceptRequestParam, CancelOrderParam, OrderUpdateParam } from '../type';
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

const receiveGoods = async (param: OrderUpdateParam) => {
    const response = await APIService.post('/order/receive', param);
    return response;
}

const sendGoods = async (param: OrderUpdateParam) => {
    const response = await APIService.post('/order/send', param);
    return response;
}

const sendArriveNotification = async (param: OrderUpdateParam) => {
    const response = await APIService.post("/order/arriveNotification", param);
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
    createdOrderList,
    acceptOrder,
    fetchMyOrder,
    cancelOrder,
    completeOrders,
    receiveGoods,
    sendGoods,
    sendArriveNotification,
    getByID
}