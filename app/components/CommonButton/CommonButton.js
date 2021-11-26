import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

import { CommonButtonStyles as styles } from "./CommonButton.styles";

const CommonButton = (props) => {
  const {isDisabled, buttonStyle, buttonText, buttonTextStyle, onPressButton} = props;
  return (
    <TouchableOpacity disabled={isDisabled} style={[styles.button,buttonStyle]} onPress={onPressButton}>
        <Text style={[styles.buttonText,buttonTextStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default CommonButton;

 