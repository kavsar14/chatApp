import {TextStyle, ViewStyle} from 'react-native';
import { screenWidth } from '../../utils/globals';

export const TextInputFieldStyles = {
   input: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        height: 48,
        width: screenWidth - 32,
        justifyContent: "space-between",
        borderColor: '#2D2F32',
        borderWidth: 1,
        alignSelf: "center"
   },
   textInput: {
       fontSize: 16,
       fontWeight: '400',
       lineHeight: 20,
       marginHorizontal: 16,
       flex: 1
   },
   icon: {
      // position: "absolute", 
      marginRight: 10
   },
   error: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 20,
        color: '#FF5353',
        marginTop: 8,
        width: screenWidth - 32,
        alignSelf: "center"
  }
}