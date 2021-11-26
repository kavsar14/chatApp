
import { StyleSheet } from 'react-native';
import { color } from '../../utils/color';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 5,
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: color.WHITE,
        borderRadius: 5,
        marginVertical: 3,
        padding: 10,
        elevation: 5,
        justifyContent: 'space-evenly'
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
        fontWeight: '200',
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
        fontWeight: '200',
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