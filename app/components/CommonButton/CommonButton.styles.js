import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import { color } from '../../utils/color';
import { screenWidth } from '../../utils/globals';

export const CommonButtonStyles = StyleSheet.create({
    button: {
       width: screenWidth - 32,
       borderRadius: 10,
       backgroundColor: color.GREENTHEME,
       height: 48,
       alignItems: "center",
       justifyContent: "center",
       textAlign: "center",
       alignSelf: "center"
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        color: color.WHITE
    }
})