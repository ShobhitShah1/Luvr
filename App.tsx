/* eslint-disable react-native/no-inline-styles */
import notifee, { EventType } from '@notifee/react-native';
import { setRootViewBackgroundColor } from '@pnthach95/react-native-root-view-background';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getProducts, initConnection } from 'react-native-iap';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { COLORS } from './Src/Common/Theme';
import { onDisplayNotification } from './Src/Components/onDisplayNotification';
import { skus } from './Src/Config/ApiConfig';
import { UserDataProvider } from './Src/Contexts/UserDataContext';
import { DONATION_PRODUCTS } from './Src/Redux/Action/actions';
import { persistor, store } from './Src/Redux/Store/store';
import MainRoute from './Src/Routes/MainRoute';
import { navigationRef } from './Src/Routes/RootNavigation';
import ToastStyle from './Src/Screens/Auth/CreateProfile/Components/ToastStyle';
import { ThemeProvider } from './Src/Contexts/ThemeContext';
import { StatusBar } from 'react-native';

export default function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
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
    return notifee.onForegroundEvent(({ type }) => {
      switch (type) {
        case EventType.PRESS:
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const connected = await initConnection();
      if (connected && skus && store) {
        const products = await getProducts({ skus });

        if (products) {
          store.dispatch({
            type: DONATION_PRODUCTS,
            donationProducts: products,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <UserDataProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ToastProvider
                placement="top"
                duration={4000}
                offset={30}
                animationType="zoom-in"
                renderType={{
                  custom_toast: (toast: any) => (
                    <ToastStyle title={toast?.title} message={toast?.message} status={toast?.status} />
                  ),
                }}
              >
                <MainRoute />
              </ToastProvider>
            </GestureHandlerRootView>
          </UserDataProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
