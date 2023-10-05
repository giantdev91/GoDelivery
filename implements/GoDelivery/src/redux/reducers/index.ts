import { combineReducers } from 'redux';

import CurrentUser from './UserReducer';
import NewOrder from './OrderReducer';

const rootReducer = combineReducers({
    CurrentUser,
    NewOrder
});

export default rootReducer;