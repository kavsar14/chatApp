import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo'

import { AuthAction } from '../state/ducks/auth';
import { PushNotificationService } from '../notifications/PushNotification';
import { AuthNavigator } from './auth-navigation';
import { CommonAction } from '../state/ducks/common';
import TabNavigator from './tabs-navigation';
import { routes } from '../utils/route';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

export const RootNavigation = () => {
  const [initializing, setInitializing] = useState(true);
  const user = useSelector(state=>state.auth.user);
  const userToken = useSelector(state=>state.auth.userToken);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      handleConnectivityChange(state.isConnected);
    });

    // NetInfo.fetch().then(state => {
    //     console.log("calling connection set intial");
    //     dispatch(CommonAction.setConnection(state.isConnected));
    // });  

    new PushNotificationService(onRegister);
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    setTimeout(()=>{
      SplashScreen.hide();
    },1000)

    return () => {
      subscriber();
      unsubscribe();
     } // unsubscribe on unmount
  }, []);

  const handleConnectivityChange = (isConnected) => {
    console.log("handleConnectivityChange", isConnected)
    dispatch(CommonAction.setConnection(isConnected));
  };

  const onRegister = (token) => {
      console.log('TOKEN ===> ', token);
      dispatch(AuthAction.setDeviceToken(token));
  }

  function onAuthStateChanged(user) {
    console.log("user auth ",user);
    dispatch(AuthAction.signInSuccess(user));
    if (initializing) setInitializing(false);
  }

  // if (initializing) return null;

  return (
      <Stack.Navigator screenOptions={{
         headerShown: false
      }}>
          {
            userToken == null ?
            <Stack.Screen name={routes.AUTHSTACK} component={AuthNavigator} />
            :
            <Stack.Screen name={routes.TABSTACK} component={TabNavigator} />
          }
      </Stack.Navigator>
   )
}



