import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Reactotron from 'reactotron-react-native'
import { reactotronRedux as reduxPlugin } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

const scriptURL = NativeModules.SourceCode.scriptURL;
const scriptHostname = scriptURL.split('://')[1].split(':')[0];

const reactotron = Reactotron.configure({ name: "Moovv", host: scriptHostname }) // For iOS add System IPAddress
  .useReactNative()
  .setAsyncStorageHandler(AsyncStorage)
  .use(reduxPlugin())
  .use(sagaPlugin({ except: [''] }));

// if we're running in DEV mode, then let's connect!
if (__DEV__) {
  reactotron.connect();
  reactotron.clear();
}

console.tron = reactotron