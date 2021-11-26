import _ from 'lodash';

import * as types from './types';

const initialState = {
    isLoading: false,
    visible: false,
    success: true,
    message: null,
    isConnected: false,
    connectionChecked: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.START_LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case types.STOP_LOADING:
            return {
                ...state,
                isLoading: false
            }
        case types.SHOW_TOAST:
            return {
                ...state,
                visible: true,
                success: _.get(action, 'payload.success', true),
                message: _.get(action, 'payload.message', null),
            }
        case types.HIDE_TOAST:
            return {
                ...state,
                visible: false,
                message: null,
            }
        case types.SET_CONNECTION:
            return {
                ...state,
                isConnected: action.payload,
                connectionChecked: true
            }
        default:
            return state;
    }
}

export default reducer;