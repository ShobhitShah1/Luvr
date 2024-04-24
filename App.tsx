/* eslint-disable react-native/no-inline-styles */
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {APP_NAME} from './Src/Config/Setting';
import {UserDataProvider} from './Src/Contexts/UserDataContext';
import {addNotification} from './Src/Redux/Action/userActions';
import {persistor, store} from './Src/Redux/Store/store';
import MainRoute from './Src/Routes/MainRoute';
import ToastStyle from './Src/Screens/Auth/CreateProfile/Components/ToastStyle';

export default function App() {
  //*
  //* Can Implement Notification Or Firebase Stuff
  //*

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title =
        remoteMessage.notification?.title || `${APP_NAME} Notification`;
      const body = remoteMessage.notification?.body || '';
      onDisplayNotification(title, body);
      store &&
        store.dispatch(
          addNotification({title, description: body, date: new Date()}),
        );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const title =
        remoteMessage.notification?.title || `${APP_NAME} Notification`;
      const body = remoteMessage.notification?.body || '';
      onDisplayNotification(title, body);
      store &&
        store.dispatch(
          addNotification({title, description: body, date: new Date()}),
        );
    });
  }, []);

  async function onDisplayNotification(title: string, body: string) {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'General',
      name: 'General Notification',
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: title || `${APP_NAME} Notification`,
      body: body,
      android: {
        channelId,
      },
    });
  }

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
