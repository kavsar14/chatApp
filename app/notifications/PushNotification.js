import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Component } from "react";
import PushNotification from "react-native-push-notification";

export class PushNotificationService extends Component {

    constructor(onRegister){
        super(onRegister);
         
        PushNotification.configure({
          // (optional) Called when Token is generated (iOS and Android)
          onRegister: function (token) {
            console.log("TOKEN:", token);
            onRegister && onRegister(token)
          },
        
          // (required) Called when a remote is received or opened, or local notification is opened
          onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          },
      
        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      //   onAction: function (notification) {
      //     console.log("ACTION:", notification.action);
      //     console.log("NOTIFICATION:", notification);
      
      //     // process the action
      //   },
      
        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      //   onRegistrationError: function(err) {
      //     console.error(err.message, err);
      //   },
        senderID: "938141476907",
      
        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
      
        popInitialNotification: true,
      
        requestPermissions: true,
      });
    }

    render(){
        return null;
    }
}

