import { GetByIdParam } from '../type';
import APIService from './APIService';

const getById = async (param: GetByIdParam) => {
    const response = await APIService.get('/client/get', { params: param });
    return response;
}

export default {
    getById,
}