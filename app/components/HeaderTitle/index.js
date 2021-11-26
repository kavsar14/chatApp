import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import { color } from '../../utils/color';

//import { Color, Font } from '../../utils/theme';

const HeaderTitle = (props) => {
    const { title } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
        </View>
    )
}

HeaderTitle.propTypes = {
    title: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: color.WHITE,
        alignSelf: 'center',
        includeFontPadding: false
    }
});

export default HeaderTitle;