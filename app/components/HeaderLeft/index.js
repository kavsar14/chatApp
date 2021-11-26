import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import IconButton from '../IconButton';

//import { Color, Font } from '../../utils/theme';
import { images } from '../../assets/appImages';
import { color } from '../../utils/color';

const HeaderLeft = (props) => {
    const { onPress, iconUrl, iconStyle } = props;

    return (
        <IconButton
            style={styles.container}
            onPress={onPress}
            iconUrl={iconUrl}
            iconStyle={[styles.iconStyle, iconStyle]} />
    )
}

HeaderLeft.defaultProps = {
    iconUrl: images.leftArrow
}

HeaderLeft.propTypes = {
    onPress: PropTypes.func,

    iconUrl: PropTypes.any,
    iconStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    iconStyle: {
        height: 20,
        width: 20,
        tintColor: color.WHITE
    }
});

export default HeaderLeft