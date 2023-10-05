import { SET_NEW_ORDER } from './ActionType';

const setNewOrder = (orderObj: any) => {
    return {
        type: SET_NEW_ORDER,
        payload: orderObj,
    };
};

export default {
    setNewOrder,
}