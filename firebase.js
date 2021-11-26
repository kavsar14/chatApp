// Import the functions you need from the SDKs you need
//import { initializeApp } from "@react-native-firebase/app";
import firebase from '@react-native-firebase/app';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEcjl6GSv2zawK7fxwthvY5rQyRrgrygk",
  authDomain: "chatapp-3eb7e.firebaseapp.com",
  projectId: "chatapp-3eb7e",
  storageBucket: "chatapp-3eb7e.appspot.com",
  messagingSenderId: "938141476907",
  appId: "1:938141476907:web:896636d04b3e1281f5e26e",
  measurementId: "G-Q6JP0ZYC3B"
};

firebase.initializeApp(firebaseConfig);
// Initialize Firebase
//const appDb = initializeApp(firebaseConfig);
//const analytics = getAnalytics(appDb);
