import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { CommonAction } from '../../state/ducks/common';
import { isIOS, screenWidth } from '../../utils/globals';
import { color } from '../../utils/color';

const ToastMessage = () => {
    const dispatch = useDispatch();

    const visible = useSelector(state => state.common.visible);
    const message = useSelector(state => state.common.message);
    const success = useSelector(state => state.common.success);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                dispatch(CommonAction.hideToast());
            }, 3000);
        }
    }, [visible])

    if (visible) {
        return (
            <View style={styles.mainView}>
                <View style={success ? styles.containersuccess : styles.containerinfo}>
                    {/* <CustomIcon name={success ? "done" : "info"}
                        style={{
                            marginRight: 8,
                            color: Color.WHITE,
                            fontSize: success ? Font.SIZE_20 : Font.SIZE_20
                        }} /> */}
                    <Text style={styles.message}>
                        {message}
                    </Text>
                </View>
            </View>
        )
    } else {
        return null
    }
}

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: isIOS() ? 50 : 30,
        left: 0
    },
    containersuccess: {
        flexDirection: 'row',
        backgroundColor: color.GREENTHEME,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    containerinfo: {
        flexDirection: 'row',
        backgroundColor: color.RED,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    message: {
        fontSize: 14,
        fontFamily: 'normal',
        maxWidth: screenWidth - 115,
        color: color.WHITE,
        padding: 7
    }
});

export default ToastMessage;