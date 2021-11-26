import _ from 'lodash';

import * as types from './types';

const initialState = {
    user: {},
    isLogin: false,
    userToken: null,
    refreshToken: null,
    deviceToken: null,
    userDetails: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SIGN_IN_SUCCESS:
            return {
                ...state,
                user: action.payload
            }
        case types.SET_DEVICE_TOKEN:
            return {
                ...state,
                deviceToken: _.get(action, 'payload.token', ''),
            };
        case types.SET_USER_TOKEN:
            return {
                ...state,
                userToken: _.get(action, 'payload', null),
            };
        case types.SET_USER_DATA:
            return {
                ...state,
                userDetails: _.get(action, 'payload', {}),
            };    
        case types.LOGOUT:
                return {
                    ...state,
                    userToken: null,
                    user: {}
                };        
        default:
            return state;
    }
}

export default reducer;