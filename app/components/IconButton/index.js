import React from 'react';
import { TouchableOpacity, ViewPropTypes, Image } from 'react-native';
import PropTypes from 'prop-types';

const IconButton = (props) => {
    const { style, disabled, onPress, iconUrl, iconStyle } = props;

    return (
        <TouchableOpacity
            style={style}
            disabled={disabled}
            onPress={onPress}>
            <Image 
            source={iconUrl} style={iconStyle}/>
        </TouchableOpacity>
    )
}

IconButton.propTypes = {
    style: ViewPropTypes.style,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,

    iconUrl: PropTypes.any,
    iconStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
};

export default IconButton;