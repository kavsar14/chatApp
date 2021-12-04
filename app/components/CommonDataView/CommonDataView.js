import React from 'react';
import {
  Image,
  Text, View
} from 'react-native';
import styles from './styles';

const CommonDataView = (props) => {
  const {
    label,
    value,
    icon
  } = props;

  return (
     <View style={styles.container}>
         <Text style={styles.title}>
             {label}
         </Text>
         <View style={styles.valueContainer}>
            <Text style={styles.value}>
                {value}
            </Text>
            <Image source={icon} style={styles.image}/>
         </View>
     </View>
  );
};

export default CommonDataView;

 