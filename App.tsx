/* eslint-disable react-native/no-inline-styles */
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {onDisplayNotification} from './Src/Components/onDisplayNotification';
import {UserDataProvider} from './Src/Contexts/UserDataContext';
import {persistor, store} from './Src/Redux/Store/store';
import MainRoute from './Src/Routes/MainRoute';
import ToastStyle from './Src/Screens/Auth/CreateProfile/Components/ToastStyle';
import {navigationRef} from './Src/Routes/RootNavigation';
import {setRootViewBackgroundColor} from '@pnthach95/react-native-root-view-background';
import {COLORS} from './Src/Common/Theme';

export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      const ScreenName = store ? store.getState().user?.CurrentScreen : '';
      const title = remoteMessage.notification?.title || '';
      const body = remoteMessage.notification?.body || '';

      if (title && body && ScreenName !== 'ChatRoom' && ScreenName !== 'Chat') {
        onDisplayNotification(title, body);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          const Token = store ? store.getState().user?.Token : '';

          if (Token?.length !== 0) {
            navigationRef &&
              navigationRef?.navigate('BottomTab', {
                screen: 'ChatRoom',
              });
          }
          break;
      }
    });
  }, []);

  useEffect(() => {
    setRootViewBackgroundColor(COLORS.Secondary);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <UserDataProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <ToastProvider
              placement="top"
              duration={4000}
              offset={30}
              animationType="zoom-in"
              renderType={{
                custom_toast: (toast: any) => (
                  <ToastStyle
                    title={toast?.title}
                    message={toast?.message}
                    status={toast?.status}
                  />
                ),
              }}>
              <MainRoute />
            </ToastProvider>
          </GestureHandlerRootView>
        </UserDataProvider>
      </PersistGate>
    </Provider>
  );
}
