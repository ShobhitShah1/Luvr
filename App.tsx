/* eslint-disable react-native/no-inline-styles */
import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {UserDataProvider} from './Src/Contexts/UserDataContext';
import {persistor, store} from './Src/Redux/Store/store';
import MainRoute from './Src/Routes/MainRoute';
import ToastStyle from './Src/Screens/Auth/CreateProfile/Components/ToastStyle';
import {onDisplayNotification} from './Src/Components/onDisplayNotification';

export default function App() {
  //*
  //* Can Implement Notification Or Firebase Stuff
  //*

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const ScreenName = store ? store.getState().user?.CurrentScreen : '';
      const title = remoteMessage.notification?.title || '';
      const body = remoteMessage.notification?.body || '';

      if (title && body && ScreenName !== 'ChatRoom' && ScreenName !== 'Chat') {
        onDisplayNotification(title, body);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <UserDataProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <ToastProvider
              placement="bottom"
              duration={4000}
              offset={30}
              animationType="zoom-in"
              renderType={{
                custom_toast: toast => (
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
