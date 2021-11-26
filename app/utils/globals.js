import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export const screenWidth = width;
export const screenHeight = height;

export const isIOS = () => {
    return Platform.OS === 'ios' ? true : false
}

export const getUpperCase = (value) => {
    return value.toUpperCase();
}

export const subscribeKey = 'sub-c-ed884d78-45c7-11ec-8ee6-ce954cd2c970';
export const publishKey = 'pub-c-7803f2bd-6db0-42b0-baf4-d68c1250f2cd';