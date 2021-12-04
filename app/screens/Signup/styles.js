
import { StyleSheet } from 'react-native';
import { color } from '../../utils/color';
import { screenHeight } from '../../utils/globals';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.WHITE,
    },
    title: {
        fontSize: 30, 
        marginTop: screenHeight/7, 
        alignSelf: "center", 
        color: color.GREENTHEME,
        fontWeight: "bold",
        letterSpacing: 0.5
    },
    loginRedirect: {
        fontSize: 16,
        color: color.BLACK
    },
    loginRedirectView: {
        marginTop: 15,
        marginHorizontal: 32,
        alignSelf: "center"
    },
    or: {
        marginTop: 5,
        marginHorizontal: 32,
        alignSelf: "center",
        fontSize: 16,
        color: color.GREY
    },
    socialLoginView: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 15
    },
    facebook: {
        backgroundColor: color.FBLOGIN,
        width: 150
    },
    google: { 
        backgroundColor: color.GOOGLELOGIN,
        width: 150,
        alignSelf: "center"
    }
});

export default styles;