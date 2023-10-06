import APIService from './APIService';

const totalRevenue = async (param: any) => {
    const response = await APIService.post('/statistics/totalValueOfDeliveryman', param);
    return response;
}

const todayRevenue = async (param: any) => {
    const response = await APIService.post('/statistics/todayValueOfDeliveryman', param);
    return response;
}

const weekRevenue = async (param: any) => {
    const response = await APIService.post('/statistics/weekValueOfDeliveryman', param);
    return response;
}

const monthRevenue = async (param: any) => {
    const response = await APIService.post('/statistics/monthValueOfDeliveryman', param);
    return response;
}

export default {
    totalRevenue,
    todayRevenue,
    weekRevenue,
    monthRevenue
}