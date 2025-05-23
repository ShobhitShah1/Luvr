/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import { AppRegistry, LogBox, Text } from 'react-native';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import App from './App';
import { name as appName } from './app.json';
import { onDisplayNotification } from './Src/Components/onDisplayNotification';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

if (!__DEV__) {
  console.log = () => {};
}

LogBox.ignoreAllLogs();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const title = remoteMessage.notification?.title || '';
  const body = remoteMessage.notification?.body || '';
  if (title && body) {
    onDisplayNotification(title, body);
  }
});

AppRegistry.registerComponent(appName, () => App);
