
import { StyleSheet } from 'react-native';
import { color } from '../../utils/color';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: color.WHITE,
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
        elevation: 5
    },
    title: {
        fontSize: 16,  
        color: color.GREENTHEME,
        fontWeight: '500'
    },
});

export default styles;