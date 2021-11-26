import _ from 'lodash';

import * as types from './types';

const initialState = {
    channels: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CHANNELS:
            return {
                ...state,
                channels: _.get(action, 'payload', []),
            };
        case types.REMOVE_CHANNELS:
            return {
                channels: []
            }
        default:
            return state;
    }
}

export default reducer;