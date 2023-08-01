import { GET_USER, SET_USER, SET_TOKEN } from './ActionType';

const setUser = (userObj: any) => {
    return {
        type: SET_USER,
        payload: userObj,
    };
};

const getUser = () => {
    return {
        type: GET_USER,
    };
};

const setToken = (token: string) => {
    return {
        type: SET_TOKEN,
        payload: token,
    }
}

export default {
    setUser,
    getUser,
    setToken
}