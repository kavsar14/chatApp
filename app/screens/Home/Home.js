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
 import { usePubNub } from 'pubnub-react';

import ChatView from '../../components/ChatView/ChatView';
import HeaderTitle from '../../components/HeaderTitle';

import { routes } from '../../utils/route';
import { CommonAction } from '../../state/ducks/common';
import { color } from '../../utils/color';
import { toastMessages } from '../../utils/toastMessage';
import { AuthAction } from '../../state/ducks/auth';
import { getChannelLastMessage, getFilteredChannelId } from '../../pubnub/services';
import { getDateFilteredArray, getDateInFormat, isIOS } from '../../utils/globals';
 
const Home = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [chatChannel, setChatchannel] = useState([]);
  const [messageMembershipData, setMessageMembershipData] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const user = useSelector(state => state.auth.user);
  const deviceToken = useSelector(state=>state.auth.deviceToken);
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

  useEffect(()=>{
    if(isReady) {
      // setTimeout(()=>{
        setUnreadCount();
        setIsReady(false);
      // },2000)
    }
  },[isReady])

  const getUsersData = () => {
    dispatch(CommonAction.startLoading());
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
          let data = [];
          let registerchannels = [];
          querySnapshot.forEach(documentSnapshot => {
            if(documentSnapshot.data().uid != user.uid) {
                let channelId = getFilteredChannelId(documentSnapshot.data().uid, user.uid, chatChannel);
                let lastMessage = getChannelLastMessage(documentSnapshot.data().uid, user.uid, chatChannel);
                let message = lastMessage?.text;
                let date = lastMessage?.date ? lastMessage?.date?.toDate() : '';

                console.log("dates sorting ",date);

                if(message) {
                  registerchannels.push(channelId);
                }

                data = [
                  ...data,
                  {
                    ...documentSnapshot.data(),
                    message,
                    date,
                    channelId
                  }
                ]
            } else {
              dispatch(AuthAction.setUserData(documentSnapshot.data()));
            }
          });

          let dateFilteredData = getDateFilteredArray(data);
          setUserData(dateFilteredData);
          addDeviceChannels(registerchannels);
          setIsReady(true);
          dispatch(CommonAction.stopLoading());
      });
   }

   const renderChatView = ({item}) => {
      const firstname = _.get(item, 'firstname', '');
      const lastname = _.get(item, 'lastname', '');
      const uid = _.get(item, 'uid', '');
      const email = _.get(item, 'email', '');
      const message = _.get(item, 'message', '');
      const date = _.get(item, 'date', '');
      const count = _.get(item, 'count', 0);
      let formattedDate = date ? getDateInFormat(date, 'DD-MM-YY') : '';
       
      return (
        <ChatView 
        firstname={firstname}
        lastname={lastname}
        message={message}
        time={formattedDate}
        count={count}
        email={email}
        onPress={()=> checkChannels(uid, firstname, lastname)}
      />
      )
   }

   const getChatChannel = () => {
      firestore()
        .collection('chatChannels')
        .get()
        .then(querySnapshot => {
            const tempdata = [];
            querySnapshot.forEach(documentSnapshot => {
              
              let temp = documentSnapshot.data();
              tempdata.push({
                ...temp,
                id: documentSnapshot.id
              })
            });
            setChatchannel(tempdata); 
      });
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

            querySnapshot.forEach(documentSnapshot => {
             
            let temp = documentSnapshot.data();
            if((temp.userIdOne == userId && temp.userIdTwo == oppositeId) || 
              (temp.userIdOne == oppositeId && temp.userIdTwo == userId)) {
                  channelId = temp.channelId;
              }
            });

            if(channelId) {
              navigateToChat(firstname, lastname, channelId, oppositeId);
            } else {
              createChannel(firstname, lastname, userId, oppositeId);
            }
      });
   }   

   const createChannel = (firstname, lastname, userId, oppositeId) => {
      let channelName = userId + oppositeId;
      firestore().collection('chatChannels').add({
          userIdOne: userId,
          userIdTwo: oppositeId,
          channelId: channelName
      }).then(()=>{
          navigateToChat(firstname, lastname, channelName, oppositeId);
      }).catch(()=>{
        const data = { success: false, message: toastMessages.NETWORK_ERROR};
        dispatch(CommonAction.showToast(data));
        dispatch(CommonAction.stopLoading());
      });
   }

   const navigateToChat = (firstname, lastname, channelId, oppositeId) => {
      dispatch(CommonAction.stopLoading());
      navigation.navigate(routes.CHAT, {
          userId: user.uid,
          firstname,
          lastname,
          channelId,
          oppositeId,
          chatChannel
      })
    }

    const onRefresh = () => {
      setUserData([]);
      setIsRefresh(true);
    }

    const addDeviceChannels = (channels) => {
        const gateway = isIOS() ? 'apns2' : 'gcm';
         
        pubnub.push.addChannels({
            channels: channels,
            device: deviceToken,
            pushGateway: gateway,
            // environment: this.getEnvironment(),   // required for APNs2 development
            // topic: this.getBundleId(), // required for APNs2
        }, (status, response) => {
            console.log("AddChannels ===>", status, response);
        });
    }

    const getMemberShips = () => {
      pubnub.objects.getMemberships({
        uuid: user.uid,
        include: {
            customFields: true,
            channelFields: true,
            customChannelFields: true,
        }
    }, (status, response) => {
        //console.log("GetMemberships ===>", status, response);
        response.data.forEach(item=>{
           //console.log("membership chanel ",item.channel);
        })
        setMessageMembershipData(response.data);
    })
    }

    const getUnreadCounts = (channels, timeTokens) => {
      pubnub.messageCounts({
        channels: channels,
        channelTimetokens: timeTokens,
      }, (status, results) => {
        // handle status, response
        console.log("finally status ",status);
        console.log("finally results ",results);
        let updateUserData = [];
        userData.forEach(item=>{
           if(results.channels.hasOwnProperty(item.channelId)){
              updateUserData = [
                 ...updateUserData,
                 {
                   ...item,
                   count: results.channels[item.channelId]
                 }
               ]
           } else {
             updateUserData = [
               ...updateUserData,
               item
             ]
           }
        })

        console.log("new userData ",updateUserData);
        setUserData(updateUserData);
      });
    }

    const renderEmptyData = () => (
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 16, lineHeight: 20, textAlign: "center" }}>{'No users found'}</Text>
      </View>
    )

    const setUnreadCount = () => {
      pubnub.objects.getMemberships({
        uuid: user.uid,
        include: {
            customFields: true,
            channelFields: true,
            customChannelFields: true,
        }
        }, (status, response) => {
            let messageMembershipData = response.data;
            let channels = [];
            let timeTokens = [];
            messageMembershipData.forEach(item=>{
              if(item.custom.lastReadTimetoken != null && item.custom.isChat) {
                timeTokens.push(item.custom.lastReadTimetoken)
                channels.push(item.channel.id);
              }
            })
            console.log("timetokens ", timeTokens);
            if(timeTokens.length > 0) {
              getUnreadCounts(channels, timeTokens);
            }
        })
    }

   // console.log("message mebership heer", messageMembershipData);

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
 
  