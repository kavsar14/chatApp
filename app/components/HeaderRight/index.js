import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { color } from '../../utils/color';
import IconButton from '../IconButton';

const HeaderRight = (props) => {
    const { onPress, iconUrl, iconStyle } = props;

    return (
        <IconButton
            style={styles.container}
            onPress={onPress}
            iconUrl={iconUrl}
            iconStyle={[styles.iconStyle, iconStyle]} />
    )
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

export default HeaderRight;
