import { SET_NEW_ORDER } from '../actions/ActionType';

const InitialState = {
    orderInfo: {},
};

const NewOrder = (state = InitialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case SET_NEW_ORDER:
            return {
                ...state,
                orderInfo: action.payload,
            };
        default:
            return state;
    }
};

export default NewOrder;