import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
   SafeAreaView,
   Text,
   StatusBar,
   View,
   FlatList
 } from 'react-native';
 import firestore from '@react-native-firebase/firestore';
 import { useDispatch, useSelector } from 'react-redux';
 import _ from 'lodash';
 import { useIsFocused } from '@react-navigation/native';

import ChatView from '../../components/ChatView/ChatView';
import HeaderTitle from '../../components/HeaderTitle';

import { routes } from '../../utils/route';
import { CommonAction } from '../../state/ducks/common';
import { color } from '../../utils/color';
import { messages, toastMessages } from '../../utils/toastMessage';
import { AuthAction } from '../../state/ducks/auth';
import { usePubNub } from 'pubnub-react';
 
const Home = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [chatChannel, setChatchannel] = useState()
  //const [chatChannel, setChatchannel] = useState()
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const pubnub = usePubNub();

  useEffect(()=>{
    if(isFocused) {
      getChatChannel();
    }
  },[isFocused])

  useLayoutEffect(() => {
      navigation.setOptions({
          headerTitle: () => <HeaderTitle title={'Home'} />
      });
  }, [navigation])

  useEffect(() => {
      if (isRefresh) {
      //getChatChannel();
          // getUsersData();
      }
  }, [isRefresh]);

  useEffect(() =>{
    if(chatChannel) {
      getUsersData(); 
    }
  },[chatChannel])

  const getUsersData = () => {
    dispatch(CommonAction.startLoading());
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
          let data = [];
          querySnapshot.forEach(documentSnapshot => {
            if(documentSnapshot.data().uid != user.uid) {
                data = [
                  ...data,
                  documentSnapshot.data()
                ]
            } else {
              dispatch(AuthAction.setUserData(documentSnapshot.data()));
            }
          });
          setUserData(data);
          dispatch(CommonAction.stopLoading());
      });
   }

   const renderChatView = ({item}) => {
      const firstname = _.get(item, 'firstname', '');
      const lastname = _.get(item, 'lastname', '');
      const uid = _.get(item, 'uid', '');
      const email = _.get(item, 'email', '');
      let message = '';
      let date = undefined;
      let channelId = filterdata(uid);
      getMesssageHistory(channelId, (response)=>{
        if(response) {
          console.log("response ",response.message.text);
          message = response.message.text;
          date = new Date(response.message.date);
        } 
      });
      console.log("message of ", email, message);
      //setUid(uid)
      //const channelId = _.get(item, 'channelId', '');

      //console.log("chnnel ",channelId);

      return (
        <ChatView 
        firstname={firstname}
        lastname={lastname}
        message={''}
        time={''}
        count={0}
        email={email}
        onPress={()=> checkChannels(uid, firstname, lastname)}
      />
      )
   }

   const getMesssageHistory = (channelId, callBack) => {
        dispatch(CommonAction.startLoading());
        pubnub.fetchMessages({
            channels: [`${channelId}`],
            count: 1
        },
        (status, response) => {
        dispatch(CommonAction.stopLoading());
            const obj = _.get(response, `channels[${channelId}]`, []);
            if (obj.length) {
              callBack(obj[0]);
            } else {
              callBack('');
            }
        });
   }

   const getChatChannel = (uid) => {
     let oppositeId = uid;
     let userId = user.uid;
     let channelId = '';

      firestore()
        .collection('chatChannels')
        .get()
        .then(querySnapshot => {
            const tempdata = [];
            querySnapshot.forEach(documentSnapshot => {
              let temp = documentSnapshot.data();
              tempdata.push(temp)
              // if((temp.userIdOne == userId && temp.userIdTwo == oppositeId) || 
              // (temp.userIdOne == oppositeId && temp.userIdTwo == userId)) {
              //     channelId = temp.channelId;
              // }
            });
            setChatchannel(tempdata)
            
      });
   }

   const filterdata = (uid) => {
    let oppositeId = uid;
    let userId = user.uid;
      let channel = chatChannel?.filter((temp) => {
        if((temp.userIdOne == userId && temp.userIdTwo == oppositeId) || 
        (temp.userIdOne == oppositeId && temp.userIdTwo == userId)) {
          return temp.channelId
        }
      })
      //console.log('channel :', channel[0]?.channelId);
      if(channel.length > 0) {
        return channel[0]?.channelId;
      } else {
        return '';
      }
   }
   
   const checkChannels = (uid, firstname, lastname) => {
      let oppositeId = uid;
      let userId = user.uid;

      dispatch(CommonAction.startLoading());
      firestore()
        .collection('chatChannels')
        .get()
        .then(querySnapshot => {
            let channelId = '';

            // console.log("user chanels ",querySnapshot);

            querySnapshot.forEach(documentSnapshot => {
            console.log("user chanels ",documentSnapshot);

              let temp = documentSnapshot.data();
              if((temp.userIdOne == userId && temp.userIdTwo == oppositeId) || 
              (temp.userIdOne == oppositeId && temp.userIdTwo == userId)) {
                  channelId = temp.channelId;
              }
            });

            if(channelId) {
              navigateToChat(firstname, lastname, channelId);
            } else {
              createChannel(firstname, lastname, userId, oppositeId);
            }
      });
   }   

   const createChannel = (firstname, lastname, userId, oppositeId) => {
      let channelName = userId + oppositeId;
      console.log("add chnl ",channelName);
      firestore().collection('chatChannels').add({
          userIdOne: userId,
          userIdTwo: oppositeId,
          channelId: channelName
      }).then(()=>{
          navigateToChat(firstname, lastname, channelName);
      }).catch(()=>{
        const data = { success: false, message: toastMessages.NETWORK_ERROR};
        dispatch(CommonAction.showToast(data));
        dispatch(CommonAction.stopLoading());
      });
   }

   const navigateToChat = (firstname, lastname, channelId) => {
      dispatch(CommonAction.stopLoading());
      navigation.navigate(routes.CHAT, {
          userId: user.uid,
          firstname,
          lastname,
          channelId
      })
    }

    const onRefresh = () => {
      setUserData([]);
      setIsRefresh(true);
    }

    const renderEmptyData = () => (
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 16, lineHeight: 20, textAlign: "center" }}>{'No users found'}</Text>
      </View>
    )

    return (
      <>
        <StatusBar barStyle="default" backgroundColor={color.GREENTHEME}/>
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <FlatList
                contentContainerStyle={{ flex: userData.length > 0 ? 0 : 1 }}
                data={userData}
                renderItem={renderChatView}
                refreshing={isRefresh}
                onRefresh={() => onRefresh()}
                keyExtractor={(_, index) => index.toString()}
                ListEmptyComponent={renderEmptyData}
            />
        </SafeAreaView>
      </>
    );
 };

 export default Home;
 
  