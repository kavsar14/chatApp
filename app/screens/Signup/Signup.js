import React, { useRef, useState } from 'react';
import {
   Text,
   StatusBar,
   TouchableOpacity,
   View
 } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import CommonButton from '../../components/CommonButton/CommonButton';
import TextInputField from '../../components/TextInputField/TextInputField';

import { color } from '../../utils/color';
import { validateEmail, validateName, validatePassword } from '../../utils/validations';
import styles from './styles'
import { CommonAction } from '../../state/ducks/common';
import { routes } from '../../utils/route';
import { AuthAction } from '../../state/ducks/auth';
import { messages, toastMessages } from '../../utils/toastMessage';
import { images } from '../../assets/appImages';
 
const Signup = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstname, setFirstname] = useState('');
  const [firstnameError, setFirstnameError] = useState('');
  const [lastname, setLastname] = useState('');
  const [lastnameError, setLastnameError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isConnected = useSelector(state => state.common.isConnected);

  const onChangeEmail = (text) => {
    setEmail(text);
    let EmailError = validateEmail(text);
    setEmailError(EmailError);
  }

  const onChangeConfirmPassword = (text) => {
    setConfirmPassword(text);
    let ConfirmPasswordError = '';
    if(password != text) {
       ConfirmPasswordError = `Password and Confirm password doesn't match`;
    }
    setConfirmPasswordError(ConfirmPasswordError);
  }

  const onChangePassword = (text) => {
    setPassword(text);
    let PasswordError = validatePassword(text);
    setPasswordError(PasswordError);
  }

  const onChangeFirstname = (text) => {
    setFirstname(text);
    let FirstNameError = '';
    if(text == ''){
      FirstNameError = 'Firstname cannot be empty';
    } else if(validateName(text)) {
      FirstNameError = validateName(text);
    } else {
      FirstNameError = '';
    }
    setFirstnameError(FirstNameError);
  }

  const onChangeLastname = (text) => {
    setLastname(text);
    let LastNameError = '';
    if(text == ''){
      LastNameError = 'Lastname cannot be empty';
    } else if(validateName(text)) {
      LastNameError = validateName(text);
    } else {
      LastNameError = '';
    }
    setLastnameError(LastNameError);
  }

  const isFormError = () => {
    if(emailError || passwordError ||  confirmPasswordError || firstnameError || lastnameError){
      return true;
    } else {
      if(email == '' ||  password == '' || confirmPassword == '' || firstname == '' || lastname == ''){
          return true;
      } else {
          return false;
      }
    }
  }

  const onAuthSignup = () => {
    if(isConnected) {
      dispatch(CommonAction.startLoading());
        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            saveUserData();
        })
        .catch(error => {
            let msg = '';
            if (error.code === 'auth/email-already-in-use') {
              console.log('That email address is already in use!');
              msg = 'That email address is already in use!';
            } else if (error.code === 'auth/invalid-email') {
              console.log('That email address is invalid!');
              msg = 'That email address is invalid!';
            } else {
              msg = messages.NETWORK_ERROR;
            }

            const data = { success: false, message: msg };
            dispatch(CommonAction.showToast(data));
            dispatch(CommonAction.stopLoading());
            console.error(error);
        });
    } else {
      const data = { success: false, message: toastMessages.CONNECTION_ERROR };
      dispatch(CommonAction.showToast(data));
    }
  }

  const saveUserData = () => {
     const user = auth().currentUser;
     const firstName = firstname.charAt(0).toUpperCase() + firstname.slice(1);
     const lastName = lastname.charAt(0).toUpperCase() + lastname.slice(1);

     firestore().collection('users').add({
        firstname: firstName, 
        lastname: lastName,
        email: email,
        uid: user.uid
      }).then(()=>{
          user.getIdToken().then(function(idToken) {  // <------ Check this line
            console.log(idToken); // It shows the Firebase token now
            dispatch(AuthAction.setUserToken(idToken));
          });

          clearData()
          const data = { success: true, message: 'You are succussfully registered.'}
          dispatch(CommonAction.showToast(data));
          dispatch(CommonAction.stopLoading());
      })
  }

  const clearData = () => {
    setFirstname('');
    setLastname('');
    setEmail('');
    setConfirmPassword('');
    setPassword('');
    setEmailError('');
    setConfirmPasswordError('');
    setPasswordError('');
    setFirstnameError('');
    setLastnameError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  const togglePasswordShow = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordShow = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

    return (
      <>
      <StatusBar barStyle="light-content" backgroundColor={color.GREENTHEME} />
       <KeyboardAwareScrollView
         style={{flex: 1, backgroundColor: color.WHITE}}
       >
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          <TextInputField 
              placeholder={'Firstname*'}
              keyboardType="default"
              inputFieldStyle={[{marginTop: 20}, firstnameError ? {borderColor : '#FF5353'} : null]}
              value={firstname}
              onChangeValue={(text)=>onChangeFirstname(text)}
              error={firstnameError}
              onSubmitEditing={()=>{
                lastNameRef.current.focus();
              }}
              returnKeyType={'next'}
          />
          <TextInputField 
              placeholder={'Lastname*'}
              keyboardType="default"
              inputFieldStyle={[{marginTop: 24},lastnameError ? {borderColor : '#FF5353'} : null]}
              value={lastname}
              onChangeValue={(text)=>onChangeLastname(text)}
              error={lastnameError}
              reference={lastNameRef}
              onSubmitEditing={()=>{
                emailRef.current.focus();
              }}
              returnKeyType={'next'}
          />  
          <TextInputField 
              placeholder={'Email Id*'}
              keyboardType="email-address"
              inputFieldStyle={[{marginTop: 24},emailError ? {borderColor : '#FF5353'} : null]}
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
              returnKeyType={'next'}
              onSubmitEditing={()=>{
                confirmPasswordRef.current.focus();
              }}
              togglePassword={true}
              showPassword={showPassword}
              onEyePress={togglePasswordShow}
              icon={images.eyeClosed}
          />
          <TextInputField 
              placeholder={'Confirm Password*'}
              keyboardType="default"
              inputFieldStyle={[{marginTop: 24}, confirmPasswordError ? {borderColor : '#FF5353'} : null]}
              value={confirmPassword}
              onChangeValue={(text)=>onChangeConfirmPassword(text)}
              error={confirmPasswordError}
              reference={confirmPasswordRef}
              secureTextEntry={!showConfirmPassword}
              returnKeyType={'done'}
              togglePassword={true}
              showPassword={showConfirmPassword}
              onEyePress={toggleConfirmPasswordShow}
              icon={images.eyeClosed}
          />
          <CommonButton
              buttonStyle={
                [{marginTop: 40},isFormError() ? {
                backgroundColor: color.GREY
              } :  
              null ]}
              buttonText={'SUBMIT'}
              buttonTextStyle={
                isFormError() ? {
                   backgroundColor: color.GREY
                } :  
                null
              }
              onPressButton={()=>onAuthSignup()}
              isDisabled={isFormError()}
          />
          <TouchableOpacity style={styles.loginRedirectView} onPress={()=>{
              navigation.navigate(routes.LOGIN);
              clearData()
          }}>
            <Text style={styles.loginRedirect}>
                Already have an account ? Click here to Login
            </Text>
          </TouchableOpacity>
        </View>
       </KeyboardAwareScrollView>
       </>
    );
 };

 export default Signup;
 
  