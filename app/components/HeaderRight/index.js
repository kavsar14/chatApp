import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import CustomIcon from '../CustomIcon';
import Label from '../Label';

import { Color, Font } from '../../utils/theme';

const HeaderRight = ({ actions }) => {
  const renderAction = (obj, key) => (
    <TouchableOpacity
      key={key}
      style={styles.buttonStyle}
      disabled={obj.disabled}
      onPress={obj.onPress}>
      {obj.iconName || !obj.buttonTitle ?
        <CustomIcon
          name={obj.iconName}
          style={[styles.iconStyle, obj.iconStyle]}
        />
        :
        <Label style={[styles.titleStyle, obj.titleStyle]}>
          {obj.buttonTitle}
        </Label>
      }
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {
        actions &&
        (Array.isArray(actions) ?
          actions.map((action, i) => renderAction(action, i))
          :
          renderAction(actions)
        )
      }
    </View>
  );
};

HeaderRight.propTypes = {
  actions: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: Color.DEEPBLUE
  },
  iconStyle: {
    fontSize: Font.SIZE_20,
    color: Color.DEEPBLUE
  },
  titleStyle: {
    fontFamily: Font.COMFORTAA_REGULAR,
    fontSize: Font.SIZE_16,
    color: Color.DEEPBLUE,
  }
});

export default HeaderRight;
