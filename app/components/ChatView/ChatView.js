import React from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { getUpperCase } from '../../utils/globals';
import styles from './styles';

const ChatView = (props) => {
  const {
    firstname,
    lastname,
    message,
    time,
    count,
    onPress,
    email
  } = props;

  return (
     <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={{width: '15%'}}>
          <View style={styles.image}>
              <Text style={styles.imageTitle}>{`${getUpperCase(firstname.substring(0, 1))}${getUpperCase(lastname.substring(0, 1))}`}</Text>
          </View>
        </View>
        <View style={styles.completeView}>
          <View style={styles.mainView}>
            <Text style={styles.name}>
                {`${firstname} ${lastname}`}
            </Text>
            {
              time ?
              <Text style={styles.time}>
                {time}
              </Text> : null
            }
          </View>
          <View style={styles.timeView}>
            {
              message ?
              <Text numberOfLines={1} style={styles.message}>
                {message}
              </Text> : <View style={{width: '80%', height: 18}}/>
            }
            {
              count != 0 && 
              <View style={styles.badgeView}>
              <Text style={styles.count}>
                  {count}
              </Text>
              </View>
            }
          </View>
        </View>
     </TouchableOpacity>
  );
};

export default ChatView;

 