import { LOG_OUT, SET_USER } from '../actions/ActionType';

const InitialState = {
    loggedIn: false,
    authToken: '',
    user: {},
};

const CurrentUser = (state = InitialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                authToken: action.payload.token,
                loggedIn: true,
            };
        case LOG_OUT:
            return {
                ...state,
                user: {},
                loggedIn: false,
            };
        default:
            return state;
    }
};

export default CurrentUser;