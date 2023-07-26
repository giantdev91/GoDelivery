import { LOG_OUT, SET_USER, SET_TOKEN } from '../actions/ActionType';

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
                loggedIn: true,
            };
        case SET_TOKEN:
            return {
                ...state,
                authToken: action.payload,
                loggedIn: true,
            }
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