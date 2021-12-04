import { Dimensions } from "react-native";
import moment from 'moment';
import _ from 'lodash';

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
           // lastDay:  '[Yesterday], HH:mm',
            sameDay:  'HH:mm',
            // when the date is further away, use from-now functionality             
            sameElse: format
        })
        return date;
    } else {
        if (passingDate) {
            let finalDateFormat;
            let today = moment(new Date()).format('DD-MM-YY');
            let passDateFormat = moment(passingDate).format('DD-MM-YY');
            let passDateFormatYesterday = moment(passingDate).add(1, 'day').format('DD-MM-YY');
            
            if(today == passDateFormat) {
                finalDateFormat = moment(passingDate).format('HH:mm');
            } else if(today == passDateFormatYesterday) {
                finalDateFormat = moment(passingDate).format('ddd, HH:mm')
            } else {
                finalDateFormat = moment(passingDate).format(format);
            }
             
            return finalDateFormat;
        } else {
            const date = moment().format(format);
            return date;
        }
    }
}

export const getDateFilteredArray = (data) => {
    let dateFilteredArray = _.sortBy(data, function(value) {return value.date;});
    let userDateFilteredArray = _.reverse(dateFilteredArray);
    return userDateFilteredArray;
}