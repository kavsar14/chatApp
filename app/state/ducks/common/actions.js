import * as types from './types';

export const startLoading = () => {
    return {
        type: types.START_LOADING,
    }
}

export const stopLoading = () => {
    return {
        type: types.STOP_LOADING
    }
}

export const showToast = (data) => {
    return {
        type: types.SHOW_TOAST,
        payload: data
    }
}

export const hideToast = () => {
    return {
        type: types.HIDE_TOAST
    }
}

export const setConnection = (data) => {
    return {
        type: types.SET_CONNECTION,
        payload: data
    }
}