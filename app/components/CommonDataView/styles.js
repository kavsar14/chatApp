
import { StyleSheet } from 'react-native';
import { color } from '../../utils/color';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        backgroundColor: color.WHITE,
        borderRadius: 10,
        marginVertical: 5,
        padding: 10
    },
    title: {
        fontSize: 20,  
        color: color.GREENTHEME,
        fontWeight: '500'
    },
    value: {
        fontSize: 16,  
        color: color.GREY,
        //fontWeight: '200'
    },
    valueContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    image: {
        height: 16, width: 16, tintColor: color.GREY
    }
});

export default styles;