/* eslint-disable react-native/no-inline-styles */
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { getStateFromPath, NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getProducts, initConnection } from 'react-native-iap';
import { ToastProvider } from 'react-native-toast-notifications';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { onDisplayNotification } from './Src/Components/onDisplayNotification';
import { skus } from './Src/Config/ApiConfig';
import { BoostModalProvider } from './Src/Contexts/BoostModalProvider';
import BoostProvider from './Src/Contexts/BoostProvider';
import { SubscriptionModalProvider } from './Src/Contexts/SubscriptionModalContext';
import { ThemeProvider } from './Src/Contexts/ThemeContext';
import { UserDataProvider } from './Src/Contexts/UserDataContext';
import useAppStateTracker from './Src/Hooks/useAppStateTracker';
import { DONATION_PRODUCTS, setCurrentScreenName, setDeepLinkUrl } from './Src/Redux/Action/actions';
import { persistor, store } from './Src/Redux/Store/store';
import MainRoute from './Src/Routes/MainRoute';
import { navigationRef } from './Src/Routes/RootNavigation';
import ToastStyle from './Src/Screens/Auth/CreateProfile/Components/ToastStyle';
import { getToken } from './Src/Services/fetch.service';

export interface DeepLinkEvent {
  url: string;
}

const excludedRoutes = [
  'Login',
  'PhoneNumber',
  'OTP',
  'IdentifyYourSelf',
  'SexualOrientationScreen',
  'DistancePreference',
  'HopingToFind',
  'AddDailyHabits',
  'YourEducation',
  'WhatAboutYou',
  'YourIntro',
  'AddRecentPics',
  'LocationPermission',
  'AddEmail',
] as const;

const linking = {
  prefixes: ['luvr://', 'https://nirvanatechlabs.in', 'https://nirvanatechlabs.in/app'],
  config: {
    initialRouteName: 'BottomTab',
    screens: {
      BottomTab: {
        screens: {},
      },
      CategoryDetailCards: 'category/:id',
      ExploreCardDetail: 'profile/:id',
      Chat: 'chat/:id',
    },
  },
  getStateFromPath: (path: string, config: any) => {
    try {
      return getStateFromPath(path, config);
    } catch (error) {
      console.error('Deep link parsing error:', error);
      return {
        routes: [{ name: 'BottomTab' }],
      };
    }
  },
};

const App: React.FC = () => {
  useAppStateTracker();
  const [lastHandledUrl, setLastHandledUrl] = useState<string | null>(null);

  const handleNotification = useCallback(async (remoteMessage: any) => {
    try {
      const ScreenName = store?.getState().user?.CurrentScreen ?? '';
      const title = remoteMessage.notification?.title;
      const body = remoteMessage.notification?.body;

      if (title && body && !['ChatRoom', 'Chat'].includes(ScreenName)) {
        await onDisplayNotification(title, body);
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(handleNotification);
    return () => unsubscribe();
  }, [handleNotification]);

  const handleNotificationPress = useCallback(() => {
    if (!navigationRef.getCurrentRoute) return;

    const token = getToken();
    const targetScreen = token?.length ? 'BottomTab' : 'NumberVerification';
    const params = token?.length ? { screen: 'ChatRoom' } : undefined;

    navigationRef?.navigate(targetScreen, params);
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) {
        handleNotificationPress();
      }
    });
  }, [handleNotificationPress]);

  const handleDeepLink = useCallback(({ url }: DeepLinkEvent) => {
    if (!navigationRef?.current) return;

    try {
      store.dispatch(setDeepLinkUrl(url));

      if (url?.includes('app/profile')) {
        const profileId = url.split('/').pop();
        if (profileId) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'ExploreCardDetail', params: { id: profileId } }],
          });
        }
      } else if (url?.includes('app/chat')) {
        const profileId = url.split('/').pop();
        if (profileId) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'Chat', params: { id: profileId } }],
          });
        }
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    const getInitialURL = async () => {
      try {
        const initialURL = await Linking.getInitialURL();
        if (initialURL) {
          handleDeepLink({ url: initialURL });
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    getInitialURL();

    return () => {
      subscription.remove();
      setLastHandledUrl(null);
    };
  }, [handleDeepLink]);

  const fetchProducts = useCallback(async () => {
    try {
      const connected = await initConnection();
      if (!connected || !skus || !store) return;

      const products = await getProducts({ skus });
      if (products?.length) {
        store.dispatch({
          type: DONATION_PRODUCTS,
          donationProducts: products,
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const stateChangesCall = useCallback((ref: any) => {
    try {
      const currentRouteName = ref?.getCurrentRoute()?.name;
      if (!currentRouteName) return null;

      return excludedRoutes.some((route) => currentRouteName.includes(route)) ? null : currentRouteName;
    } catch (error) {
      console.error('Error in state changes:', error);
      return null;
    }
  }, []);

  const handleStateChange = useCallback(() => {
    const currentRouteName = stateChangesCall(navigationRef.current);
    if (currentRouteName) {
      store.dispatch(setCurrentScreenName(currentRouteName));
    }
  }, [stateChangesCall]);

  const toastConfig = useMemo(
    () => ({
      custom_toast: (toast: any) => <ToastStyle title={toast?.title} message={toast?.message} status={toast?.status} />,
    }),
    []
  );

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <UserDataProvider>
            <BoostProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ToastProvider
                  placement="top"
                  duration={2000}
                  offset={30}
                  animationType="zoom-in"
                  renderType={toastConfig}
                >
                  <NavigationContainer ref={navigationRef} linking={linking} onStateChange={handleStateChange}>
                    <SubscriptionModalProvider>
                      <BoostModalProvider>
                        <MainRoute />
                      </BoostModalProvider>
                    </SubscriptionModalProvider>
                  </NavigationContainer>
                </ToastProvider>
              </GestureHandlerRootView>
            </BoostProvider>
          </UserDataProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
