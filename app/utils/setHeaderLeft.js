
import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HeaderLeft from '../components/HeaderLeft';

export default setHeaderLeft = (iconUrl = '', onPress) => {
    const navigation = useNavigation()
    // if (iconUrl) {
        return <HeaderLeft iconUrl={iconUrl} onPress={() => {
            onPress ?
                onPress() :
                navigation.goBack()
        }} />
    // } else {
    //     return <View style={{ width: 80 }} />
    // }
}