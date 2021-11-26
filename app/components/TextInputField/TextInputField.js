import React from 'react';
import {
   View,
   Image,
   TextInput,
   TouchableOpacity,
   ImageBackground,
   Text,
   ImageStyle,
   StyleProp
 } from 'react-native';

import { images } from "../../assets/appImages";
import { TextInputFieldStyles as styles } from "./TextInputField-styles";

const TextInputField = (props) => {
   const { 
     placeholder='',
     inputFieldStyle, 
     icon, 
     onChangeValue, 
     onEyePress, 
     showPassword, 
     iconStyle, 
     error, 
     reference,
     returnKeyType,
     secureTextEntry,
     togglePassword=false,
     ...rest
    } = props;

   return (
     <>
     <View style={[styles.input,inputFieldStyle]}>
        <TextInput
        placeholder={placeholder}
        ref={reference}
        style={[styles.textInput,icon ? {width: 255} : {marginHorizontal: 16}]} 
        placeholderTextColor="#B4B4B4"
        {...rest}
        onChangeText={onChangeValue}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCompleteType="off"
        />
        {
            icon && 
            <>
            {
               togglePassword ?
               <TouchableOpacity onPress={onEyePress} style={styles.icon}>
               { showPassword ?
                  <Image source={images.eye} style={{height: 25, width: 25, tintColor: '#B4B4B4'}}/> : 
                  <Image
                  source={icon} 
                  style={[iconStyle,{tintColor: '#B4B4B4'}]}
                  /> 
               }
               </TouchableOpacity> 
               :
               <Image
               source={icon} 
               style={[iconStyle,{tintColor: '#B4B4B4'}, styles.icon]}
               /> 
            }
            </>
        }
     </View>
     {
         error ? <Text style={styles.error}>{error}</Text> : null
     }
     </>
   );
 };

export default TextInputField;
 
  