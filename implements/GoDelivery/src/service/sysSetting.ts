import APIService from './APIService';

const get = async () => {
    const response = await APIService.get('/sysSetting/get');
    return response;
}


export default {
    get
}