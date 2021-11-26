import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Home from '../screens/Home/Home';
import Profile from '../screens/Profile/Profile';
import Chat from '../screens/Chat/Chat';

import { color } from '../utils/color';
import { routes } from '../utils/route';
import { Image } from 'react-native';
import { images } from '../assets/appImages';

const Tabs = createBottomTabNavigator();

const Stack = createStackNavigator();

const ChatStack = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName == routes.CHAT) {
        navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
        navigation.setOptions({tabBarStyle: {display: 'flex'}});
    }
}, [navigation, route]);

  return (
    <Stack.Navigator screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
            backgroundColor: color.GREENTHEME
        },
        headerTitleStyle: {
            color: color.WHITE
        },
        headerShown: true,
        headerTintColor: color.WHITE
    }}>
      <Stack.Screen name={routes.HOME} component={Home} />
      <Stack.Screen name={routes.CHAT} component={Chat} options={{
         headerShown: true
      }}/>
    </Stack.Navigator>
  );
}

const TabNavigator = () => {
  return (
    <Tabs.Navigator screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
            backgroundColor: color.GREENTHEME
        },
        headerTitleStyle: {
            color: color.WHITE
        },
        headerShown: true,
        headerTintColor: color.WHITE
    }}
      tabBarOptions= {{
        activeTintColor: color.GREENTHEME,
        inactiveTintColor: color.BLACK,
        showLabel: false,
    }}
    >
        <Tabs.Screen name={routes.CHATSTACK} component={ChatStack} options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({color}) => (
            <Image source={images.chat} style={{ height: 30, width: 30, tintColor: color}} />
          )
        }}/>
        <Tabs.Screen name={routes.PROFILE} component={Profile} options={{
          tabBarIcon: ({color}) => (
            <Image source={images.profile} style={{ height: 30, width: 30, tintColor: color}} />
        )
        }}/>
    </Tabs.Navigator>
  );
}

export default TabNavigator;