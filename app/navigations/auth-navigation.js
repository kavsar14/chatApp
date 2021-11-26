import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Signup from '../screens/Signup/Signup';
import Login from '../screens/Login/Login';
import { routes } from '../utils/route';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={routes.LOGIN} screenOptions={{
         headerShown: false
      }}
    >
      <Stack.Screen name={routes.SIGNUP} component={Signup} />
      <Stack.Screen name={routes.LOGIN} component={Login} />
    </Stack.Navigator>
  )
}



