import React from 'react';
import {
  Text, View
} from 'react-native';
import styles from './styles';

const CommonDataView = (props) => {
  const {
    label,
    value
  } = props;

  return (
     <View style={styles.container}>
         <Text style={styles.title}>
             {label}
         </Text>
         <Text>
             {value}
         </Text>
     </View>
  );
};

export default CommonDataView;

 