import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
   Alert,
   SafeAreaView,
   StatusBar,
   Text,
   View
 } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { usePubNub } from 'pubnub-react';
import { useIsFocused } from '@react-navigation/core';

import CommonButton from '../../components/CommonButton/CommonButton';
import CommonDataView from '../../components/CommonDataView/CommonDataView';
import HeaderTitle from '../../components/HeaderTitle';

import { CommonAction } from '../../state/ducks/common';
import { AuthAction } from '../../state/ducks/auth';
import { color } from '../../utils/color';
import { toastMessages } from '../../utils/toastMessage';
import { PubnubAction } from '../../state/ducks/pubnub';
import { getUpperCase, isIOS } from '../../utils/globals';
import styles from './styles'
import { images } from '../../assets/appImages';
import setHeaderLeft from '../../utils/setHeaderLeft';
import HeaderRight from '../../components/HeaderRight';
 
const Profile = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const user = useSelector(state => state.auth.user);
    const userDetails = useSelector(state => state.auth.userDetails);
    const deviceToken = useSelector(state=>state.auth.deviceToken);
    const isConnected = useSelector(state => state.common.isConnected);
    const channels = useSelector(state => state.pubnub.channels);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const pubnub = usePubNub();

    console.log("isConnected ", isConnected);

    useEffect(()=>{
      getUserData();
    },[])

    useEffect(()=>{
      listChannels();
    },[isFocused])

    useLayoutEffect(() => {
         navigation.setOptions({
            headerTitle: () => <HeaderTitle title={'Profile'} />,
            headerRight: () => <HeaderRight iconUrl={images.logout} onPress={()=>{
               confirmLogout()
            }} />
         });
   }, [navigation])

   const onLogout = () => {
       if(isConnected) {
         dispatch(CommonAction.startLoading());
         auth()
         .signOut()
         .then(() => {
            console.log('User signed out!');
            removeChannels();
            dispatch(AuthAction.logout());
            const data = { success: true, message: 'You are succussfully logged out.'};
            dispatch(CommonAction.showToast(data));
            dispatch(CommonAction.stopLoading());
         });
      } else {
         const data = { success: false, message: toastMessages.CONNECTION_ERROR };
         dispatch(CommonAction.showToast(data));
      }
   }

   const removeChannels = () => {
      const gateway = isIOS() ? 'apns2' : 'gcm';
      pubnub.push.removeChannels({
          channels: channels,
          device: deviceToken,
          pushGateway: gateway,
          environment: getEnvironment(),   // required for APNs2 development
          topic: getBundleId(), // required for APNs2
      }, (status, response) => {
          console.log("RemoveChannels ===>", status, response);
      });
   }

   const listChannels = () => {
      console.log("calling list channel");
      const gateway = isIOS() ? 'apns2' : 'gcm';
      pubnub.push.listChannels({
         device: deviceToken,
         pushGateway: gateway,
         environment: getEnvironment(),   // required for APNs2 development
         topic: getBundleId(), // required for APNs2
      }, (status, response) => {
         console.log("ListChannels ===>", status, response);
         dispatch(PubnubAction.setChannels(response.channels));
      });
    }

   const getEnvironment = () => {
         const environment = "development"; // production
         //const environment = "production"; // development
         return environment;
   }

   const getBundleId = () => {
         const bundleId = "org.reactjs.native.example.ChatApp";
         return bundleId;
   }

   const getUserData = () => {
      setEmail(userDetails.email);
      setFirstname(userDetails.firstname);
      setLastname(userDetails.lastname);
   }

   const confirmLogout = () => {
      Alert.alert(
         // "Discard draft?",
         'Logout Confirmation',
         'Are you sure you want to logout ?',
         [
             {
                 // text: "Keep",
                 text: 'Yes',
                 onPress: () => onLogout()
             },
             {
                 // text: "Discard",
                 text: 'Cancel',
                 onPress: () => {
                      
                 },
             },
         ],
         { cancelable: false },
     );
   }

    return (
      <>
        <StatusBar barStyle="default" backgroundColor={color.GREENTHEME} />
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={styles.noImage}>
               <Text style={{ color: color.GREENTHEME, fontSize: 50 }}>
                  {`${getUpperCase(firstname.substring(0, 1))}${getUpperCase(lastname.substring(0, 1))}`}
               </Text>
          </View>
          <CommonDataView 
             label={'First Name'}
             value={firstname}
             icon={images.account}
          />
          <CommonDataView 
             label={'Last Name'}
             value={lastname}
             icon={images.account}
          />
          <CommonDataView 
             label={'Email'}
             value={email}
             icon={images.email}
          />
        </SafeAreaView>
      </>
    );
 };

 export default Profile;
 
  