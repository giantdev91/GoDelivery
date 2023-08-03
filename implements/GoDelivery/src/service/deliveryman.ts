import APIService from './APIService';

const getById = async (param: string) => {
    const response = await APIService.get(`/deliveryman/${param}`);
    return response;
}

export default {
    getById,
}