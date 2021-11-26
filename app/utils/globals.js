import { Dimensions } from "react-native";
import moment from 'moment';

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

export const getDateInFormat = (passingDate = '', format = dateFormate, isDayInclude = false) => {
    if(isDayInclude) {
        const passDate = moment(passingDate).format(format);
        const date = moment(passingDate).calendar( null, {
            lastDay:  '[Yesterday], HH:mm',
            sameDay:  '[Today], HH:mm',
            nextDay:  '[Tomorrow], HH:mm',
            // when the date is further away, use from-now functionality             
            sameElse: format
        })
        return date;
    } else {
        if (passingDate) {
            console.log("passingDate ",passingDate);
            const passDate = moment(passingDate).format(format);
            console.log("pass date ",passDate);
            return passDate;
        } else {
            const date = moment().format(format);
            return date;
        }
    }
}