import APIService from './APIService';

const list = async (param: any) => {
    const response = await APIService.post('/notification/list', param);
    return response;
}

export default {
    list,
}