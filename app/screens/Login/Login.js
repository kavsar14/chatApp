import React, { useEffect, useRef, useState } from 'react';
import {
   SafeAreaView,
   Text,
   StatusBar,
   TouchableOpacity,
   View
 } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import CommonButton from '../../components/CommonButton/CommonButton';
import TextInputField from '../../components/TextInputField/TextInputField';

import { color } from '../../utils/color';
import { validateEmail, validatePassword } from '../../utils/validations';
import styles from './styles'
import { CommonAction } from '../../state/ducks/common';
import { routes } from '../../utils/route';
import { AuthAction } from '../../state/ducks/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { messages, toastMessages } from '../../utils/toastMessage';
import { images } from '../../assets/appImages';
 
const Login = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isConnected = useSelector(state => state.common.isConnected);

  useEffect(()=> {
      GoogleSignin.configure({
        webClientId: "938141476907-bhp4fk9dp36gsiuqaa4qodpnskjkamv3.apps.googleusercontent.com"
      });
  },[])

  const onChangeEmail = (text) => {
    setEmail(text);
    let EmailError = validateEmail(text);
    setEmailError(EmailError);
  }

  const onChangePassword = (text) => {
    setPassword(text);
    let PasswordError = validatePassword(text);
    setPasswordError(PasswordError);
  }

  const isFormError = () => {
    if(emailError || passwordError){
      return true;
    } else {
      if(email == '' ||  password == ''){
          return true;
      } else {
          return false;
      }
    }
  }
   
  const onAuthSignin = () => {
    if(isConnected) {
      dispatch(CommonAction.startLoading());
        auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            saveUserToken();
        })
        .catch(error => {
            let msg = '';
            if (error.code === 'auth/wrong-password') {
              console.log('That email address is already in use!');
              msg = 'The password is invalid. Please enter valid password';
            } else if (error.code === 'auth/user-not-found') {
              msg = 'There is no user user found with this email address. Are you sure you entered valid email address ?';
            } else {
              msg = messages.NETWORK_ERROR;
            }

            const data = { success: false, message: msg };
            dispatch(CommonAction.showToast(data));
            dispatch(CommonAction.stopLoading());
        });
    } else {
        const data = { success: false, message: toastMessages.CONNECTION_ERROR };
        dispatch(CommonAction.showToast(data));
    }
  }

  const saveUserToken = () => {
      const user = auth().currentUser;
      user.getIdToken().then(function(idToken) {  // <------ Check this line
        console.log("token ",idToken); // It shows the Firebase token now
        dispatch(AuthAction.setUserToken(idToken));
      });

      const data = { success: true, message: 'You are succussfully login'}
      dispatch(CommonAction.showToast(data));
      dispatch(CommonAction.stopLoading());
  }

  const clearData = () => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setShowPassword(false);
  }

  const handleGoogleLogin = async() => {
      try {
          await GoogleSignin.hasPlayServices();
          console.log("userInfo before");
          const userInfo = await GoogleSignin.signIn();
          console.log("userInfo ",userInfo);
         // Alert.alert("Google login success");
      } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              console.log("user cancelled the login flow");
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
              console.log("operation (e.g. sign in) is in progress already");
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              console.log("play services not available or outdated");
            // play services not available or outdated
          } else {
              console.log("some other error happened ", error);
            // some other error happened
          }
      }
  }

  const _responseInfoCallback = async(error, result) => {
      if (error) {
        console.log('Error fetching data: ' + error.toString());
      } else {
        console.log('Success fetching data: ' + result.toString());
        console.log("result of user ",result);
        checkUserExist(result);
      }
  }

  const fbLogin = async(resCallBack) => {
    try {
      // Login the User and get his public profile and email id.
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
  
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }
  
      // Get the Access Token 
      const data = await AccessToken.getCurrentAccessToken();
  
      // If we don't get the access token, then something has went wrong.
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
  
      // Use the Access Token to create a facebook credential.
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
      dispatch(CommonAction.startLoading());
      // Use the facebook credential to sign in to the application.
      auth().signInWithCredential(facebookCredential).then(()=>{
          dispatch(CommonAction.stopLoading());
          const infoRequest = new GraphRequest(
              '/me?fields=email,name,picture',
              null,
              resCallBack
          );
          new GraphRequestManager().addRequest(infoRequest).start();
       }).catch(error => {
          console.log(error);
          let msg = 'Something went wrong. Please try again';
          const data = { success: false, message: msg };
          dispatch(CommonAction.showToast(data));
          dispatch(CommonAction.stopLoading());
        }
       );
    } catch (error) {
      dispatch(CommonAction.stopLoading());
      console.log(error);
    }
  }

  const checkUserExist = (data) => {
      dispatch(CommonAction.startLoading());
      const user = auth().currentUser;

      firestore().collection('users')
      .get()
      .then(querySnapshot => {
          dispatch(CommonAction.stopLoading());
          let userExists = false;
            querySnapshot.forEach(documentSnapshot => {
              if(documentSnapshot.data().uid == user.uid) {
                  userExists = true;
              } 
            });
            
          if(userExists) {
            saveUserToken();
          } else {
            saveUserData(data);
          } 
      }).catch(error => {
          dispatch(CommonAction.stopLoading());
          console.log("errro in login ",error);
      })
  }

  const saveUserData = (data) => {
      dispatch(CommonAction.startLoading());
      const user = auth().currentUser;
      let username = data.name;
      let firstName = '';
      let lastName = '';
      const nameArray = username.split(" ");

      if(nameArray.length == 2) {
        firstName = nameArray[0];
        lastName = nameArray[1];
      } else {
        firstName = nameArray[0];
      }

      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

      firestore().collection('users').add({
        firstname: firstName, 
        lastname: lastName,
        email: data.email,
        uid: user.uid
      }).then(()=>{
          dispatch(CommonAction.stopLoading());
          user.getIdToken().then(function(idToken) {  // <------ Check this line
            console.log(idToken); // It shows the Firebase token now
            dispatch(AuthAction.setUserToken(idToken));
          });

          clearData()
          const data = { success: true, message: 'You are succussfully registered.'}
          dispatch(CommonAction.showToast(data));
          dispatch(CommonAction.stopLoading());
      }).catch(error => {
          dispatch(CommonAction.stopLoading());
      })
  }
    
  const togglePasswordShow = () => {
    setShowPassword(!showPassword);
  }

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor={color.GREENTHEME} />
    <KeyboardAwareScrollView
        style={{flex: 1, backgroundColor: color.WHITE}}
      >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <TextInputField 
          placeholder={'Email Id*'}
          keyboardType="email-address"
          inputFieldStyle={[{marginTop: 20},emailError ? {borderColor : '#FF5353'} : null]}
          value={email}
          onChangeValue={(text)=>onChangeEmail(text)}
          error={emailError}
          reference={emailRef}
          onSubmitEditing={()=>{
              passwordRef.current.focus();
          }}
          returnKeyType={'next'}
        />
        <TextInputField 
          placeholder={'Password*'}
          keyboardType="default"
          secureTextEntry={!showPassword}
          inputFieldStyle={[{marginTop: 24},passwordError ? {borderColor : '#FF5353'} : null]}
          value={password}
          onChangeValue={(text)=>onChangePassword(text)}
          error={passwordError}
          reference={passwordRef}
          returnKeyType={'done'}
          togglePassword={true}
          showPassword={showPassword}
          onEyePress={togglePasswordShow}
          icon={images.eyeClosed}
        />
        <CommonButton
          buttonStyle={[{marginTop: 40}, isFormError() ? {
            backgroundColor: color.GREY
          } :  null ]}
          buttonText={'SUBMIT'}
          buttonTextStyle={
            isFormError() ? {
              backgroundColor: color.GREY
            } :  
            null
          }
          onPressButton={()=>onAuthSignin()}
          isDisabled={isFormError()}
        />
        <TouchableOpacity style={styles.signupRedirectView} onPress={()=>{
            navigation.navigate(routes.SIGNUP);
            clearData();
        }}>
          <Text style={styles.signupRedirect}>
              New User ? Click here to Register
          </Text>
        </TouchableOpacity>
        <Text style={styles.or}>
            Or Login With
        </Text>
        <View style={styles.socialLoginView}>
          <CommonButton 
              buttonStyle={styles.facebook}
              buttonText={'Facebook'}
              buttonTextStyle={{color : color.WHITE}}
              onPressButton={()=> fbLogin(_responseInfoCallback)}
          />
          {/* <CommonButton 
              buttonStyle={styles.google}
              buttonText={'Google'}
              buttonTextStyle={{color : color.WHITE}}
              onPressButton={handleGoogleLogin}
              // isDisabled={isFormError()}
              />  */}
        </View>
      </SafeAreaView>
      </KeyboardAwareScrollView>
      </>
  );
 };

export default Login;
 
  