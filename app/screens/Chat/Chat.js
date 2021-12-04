import React, { useEffect, useLayoutEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import { usePubNub } from "pubnub-react";
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/core';

import { CommonAction } from '../../state/ducks/common';
import setHeaderLeft from '../../utils/setHeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import { images } from '../../assets/appImages';
import { isIOS } from '../../utils/globals';
import { toastMessages } from '../../utils/toastMessage';
import { PubnubAction } from '../../state/ducks/pubnub';
import { getFilteredChannelDocId } from '../../pubnub/services';
 
const Chat = ({route, navigation}) => {
    const pubnub = usePubNub();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const user = useSelector(state=>state.auth.user);
    const deviceToken = useSelector(state=>state.auth.deviceToken);
    const userDetails = useSelector(state=>state.auth.userDetails);
    const isConnected = useSelector(state => state.common.isConnected);
    const channels = useSelector(state => state.pubnub.channels);

    const channelId = _.get(route, 'params.channelId', '');
    const username = `${_.get(route, 'params.firstname', '')} ${_.get(route, 'params.lastname', '')}`;
    const chatChannels = _.get(route, 'params.chatChannel', []);
    const oppositeId = _.get(route, 'params.oppositeId', '');

    const [messages, setMessages] = useState([]);
    const [loginUser, setLoginUser] = useState({});
    const [channelDocId, setChannelDocId] = useState('');

    useEffect(() => {
       getUserData();
       addChannels();
    }, [])

    useEffect(()=>{
        if(!isFocused){
            setMemberships();
        }
    },[isFocused])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => setHeaderLeft(images.leftArrow),
            headerTitle: () => <HeaderTitle title={username} />,
            tabBarVisible: false
        });
    }, [navigation])

    useEffect(() => {
          const listener = pubnub && pubnub.addListener({ message: handleMessage });
          const subscriber = channelId && pubnub.subscribe({ channels : [channelId] });
    }, [pubnub, channelId]);

    const handleMessage = event => {
        if(event) {
           setGiftedMessage([event]);
        }
    };

    const setGiftedMessage = (messages) => {
        messages.forEach((msg) => {
            const message = {};
            // if (msg.message.messageType == messageType.IMAGE) {
            //     message._id = msg.timetoken;
            //     message.text = '';
            //     message.createdAt = msg.message.date
            //         ? new Date(msg.message.date)
            //         : new Date();
            //     message.user = msg.message.sender;
            //     message.image = msg.message.image;
            //     message.messageType = messageType.IMAGE;
            // } else if (msg.message.messageType == messageType.FILE) {
            //     message._id = msg.timetoken;
            //     message.text = msg.message.image;
            //     message.createdAt = msg.message.date
            //         ? new Date(msg.message.date)
            //         : new Date();
            //     message.user = msg.message.sender;
            //     message.name = msg.message.name;
            //     message.messageType = messageType.FILE;
            // } else 

            if (msg.message.messageType == 'text') {
                message._id = msg.message._id;
                message.text = msg.message.text; 
                message.createdAt = msg.message.date
                    ? new Date(msg.message.date)
                    : new Date();
                message.user = msg.message.user;
                message.messageType = 'text';
            }
            !_.isEmpty(message) && setMessages((prevMessages) => GiftedChat.append(prevMessages, [message]));
        });
    }

    const getAllMesssageHistory = () => {
        // start, end, count are optional
        if(isConnected) {
            dispatch(CommonAction.startLoading());
            pubnub.fetchMessages({
                channels: [`${channelId}`]
            },
            (status, response) => {
            dispatch(CommonAction.stopLoading());
                const obj = _.get(response, `channels[${channelId}]`, []);
                if (obj.length) {
                    setGiftedMessage(obj);
                }
            });
        } else {
            const data = { success: false, message: toastMessages.CONNECTION_ERROR };
            dispatch(CommonAction.showToast(data));
        }
    }

    const deleteMessageHistory = () => {
        pubnub.deleteMessages(
          {
              channel: channelId,
              start: '',
              end: '16369573223213714'
          },
          (result) => {
              console.log("delete res", result);
          }
        );
    }

    const addChannels = () => {
        const gateway = isIOS() ? 'apns2' : 'gcm';
        pubnub.push.addChannels({
            channels: [channelId],
            device: deviceToken,
            pushGateway: gateway,
            // environment: this.getEnvironment(),   // required for APNs2 development
            // topic: this.getBundleId(), // required for APNs2
        }, (status, response) => {
            console.log("AddChannels ===>", status, response);
        });
    }

    const getUserData = () => {
        const _id = userDetails.uid;
        const name = `${_.get(userDetails, 'firstname', '')} ${_.get(userDetails, 'lastname', '')}`;
        let channelDocId = getFilteredChannelDocId(oppositeId, _id, chatChannels);
        const userData = {
            _id,
            name,
            image: ''
        }
        setLoginUser(userData);
        setChannelDocId(channelDocId);
        getAllMesssageHistory();  
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

    const publishMessage = (spaceId, msgObj) => {
        let messagePayload = msgObj;
        const title = _.get(msgObj, 'user.name', '');
        const text = _.get(msgObj, 'text', '');
       // const type = _.get(msgObj, 'messageType', messageType.TEXT);
        // const image = type == messageType.IMAGE ? 'Photo' :
        //     type == messageType.FILE ? 'Document' : '';
        const pn_apns = {
            "aps": {
                "sound": "default",
                "badge": 1,
                "alert": {
                    "title": title,
                    "body": text,
                }
            },
            "pn_push": [
                {
                    "push_type": "alert",
                    "auth_method": "token",
                    "targets": [{
                        "environment": getEnvironment(),
                        "topic": getBundleId(),
                        "excluded_devices": [deviceToken]
                    }],
                    "version": "v2"
                }
            ],
            "pn_exceptions": [deviceToken]
        }

        const pn_gcm = {
            "notification": {
                "title": title,
                "body": text,
                "sound": "default"
            },
            "pn_exceptions": [deviceToken]
        }
        messagePayload = { ...msgObj, pn_apns, pn_gcm, pn_debug: true };
        //messagePayload = [messagePayload];
        onPublish(spaceId, messagePayload);
    }

    const onSend = (newMessages = []) => {
        const message = newMessages[0];
        const msgObj = {
            user: message.user,
            date: message.createdAt,
            messageType: 'text',
            text: message.text,
            _id: message._id
        };
        publishMessage(channelId, msgObj);
    }


    const onPublish = async (spaceId, message) => {
        pubnub.publish({
            channel: spaceId,
            message
        }, (status, response) => {
            console.log("message plis ",message);
            console.log("Publish ===>", status, response)
            updateChatChannelLastMessage(message);
           // setMemberships();
        });
    };

    const updateChatChannelLastMessage = (message) => {
        firestore().collection("chatChannels").doc(channelDocId).update({
            lastMessage : {
                text: message.text,
                date: new Date(message.date)
            }
        }).then(()=>{
            console.log("success");
        }).catch((error)=>{
            console.log("error ",error);
        });
    }

    const setMemberships = () => {
        console.log("calling set membership");
        pubnub.objects.setMemberships({
            uuid: userDetails.uid,
            channels: [{
                id: channelId,
                custom: {
                    lastReadTimetoken: new Date() * 10000,
                    trialPeriod: false,
                    isChat: true,
                },
                include: {
                    // To include channel fields in response
                    channelFields: true
                }
            }]
        }, (status, response) => {
            console.log("SetMemberships ===>", status, response);
        })
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={loginUser}
            listViewProps={{
                initialNumToRender: 15
            }}
            // //infiniteScroll={true}
            // onLoadEarlier={()=>{
            //     console.log("fun called earlier");
            // }}
            // loadEarlier={true}
       />
    );
 };

 export default Chat;
 
  