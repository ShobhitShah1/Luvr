/**
 * @format
 */

import {AppRegistry, Text} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import App from './App';
import {name as appName} from './app.json';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

if (!__DEV__) {
  console.log = () => {};
}

AppRegistry.registerComponent(appName, () => App);
