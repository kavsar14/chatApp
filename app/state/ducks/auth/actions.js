import * as types from './types';

export const signIn = (data, success, failure) => {
    return {
        type: types.SIGN_IN,
        payload: data,
        success: (res) => success(res),
        failure: (res) => failure(res)
    }
}

export const signInSuccess = (data) => {
    return {
        type: types.SIGN_IN_SUCCESS,
        payload: data
    }
}

export const setUserToken = (data) => {
    return {
        type: types.SET_USER_TOKEN,
        payload: data
    }
}

export const logout = () => {
    return {
        type: types.LOGOUT
    }
}

export const setDeviceToken = (data) => {
    return {
        type: types.SET_DEVICE_TOKEN,
        payload: data
    }
}

export const setUserData = (data) => {
    return {
        type: types.SET_USER_DATA,
        payload: data
    }
}


