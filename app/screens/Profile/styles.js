
import { StyleSheet } from 'react-native';
import { color } from '../../utils/color';

const styles = StyleSheet.create({
    noImage: {
        display: 'flex',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: color.GREY, 
       // borderWidth: 1, 
        //alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: '#D3D3D3',
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 20
    }
});

export default styles;