
import { StyleSheet } from 'react-native';
import { color } from '../../utils/color';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 0,
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: color.WHITE,
        borderRadius: 0,
        marginVertical: 0.5,
        padding: 8,
        justifyContent: 'space-evenly',
        borderBottomWidth: 1,
        borderBottomColor: color.LIGHTGREY
    },
    name: {
        fontSize: 20,  
        color: color.BLACK,
        fontWeight: '600'
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: color.BLACK,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 0
    },
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    message: {
        fontSize: 16,  
        color: color.GREY,
        fontWeight: '400',
        width: '80%'  
    },
    imageTitle: {
        fontSize: 16,  
        color: color.BLACK,
        fontWeight: '400' 
    },
    timeView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    time: {
        fontSize: 16,
        fontWeight: '500',
        color: color.GREENTHEME
    },
    count: {
        fontSize: 14,
        fontWeight: '400',
        color: color.WHITE
    },
    badgeView: {
        backgroundColor: color.GREENTHEME,
        height: 24,
        width: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15
    },
    completeView: {
        width: '85%',
        flexDirection: 'column'
    }
});

export default styles;