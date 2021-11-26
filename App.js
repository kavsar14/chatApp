/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, { useEffect } from 'react';
 import { NavigationContainer } from '@react-navigation/native';
 import { Provider, useDispatch } from "react-redux";
 import { PersistGate } from 'redux-persist/lib/integration/react';
 import SplashScreen from 'react-native-splash-screen';
 import PubNub from "pubnub";
 import { PubNubProvider } from "pubnub-react";
 import { LogBox } from 'react-native';
 
 import { RootNavigation } from "./app/navigations/root-navigation";
 import store, { persistor } from './app/state/store';
 import ActivityIndicatorComponent from './app/components/ActivityIndicatorComponent/ActivityIndicatorComponent';
 import ToastMessage from './app/components/ToastMessage';
 //import './firebase';

 const pubnub = new PubNub({
  subscribeKey: "sub-c-ed884d78-45c7-11ec-8ee6-ce954cd2c970",
  publishKey: "pub-c-7803f2bd-6db0-42b0-baf4-d68c1250f2cd",
  uuid: PubNub.generateUUID()
});

 LogBox.ignoreAllLogs();
 
 const App = () => {

   useEffect(()=>{
      //  setTimeout(()=>{
      //    SplashScreen.hide();
      //  },1000)
   },[])
 
   return (
     <Provider store={store}>
       <NavigationContainer>
         <PubNubProvider client={pubnub}>
            <PersistGate loading={null} persistor={persistor}>
              <ActivityIndicatorComponent />
              <ToastMessage />
              <RootNavigation />
            </PersistGate>
         </PubNubProvider>
       </NavigationContainer>
     </Provider>
   );
 };
 
 export default App;
 