import { GET_USER, SET_USER } from './ActionType';

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

export default {
    setUser,
    getUser,
}