import { combineReducers } from 'redux';

import CurrentUser from './UserReducer';

const rootReducer = combineReducers({
    CurrentUser,
});

export default rootReducer;