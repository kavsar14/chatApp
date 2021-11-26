import * as types from './types';

export const removeChannels = () => {
    return {
        type: types.REMOVE_CHANNELS
    }
}

export const setChannels = (data) => {
    return {
        type: types.SET_CHANNELS,
        payload: data
    }
}