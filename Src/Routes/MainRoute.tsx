/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import { setRootViewBackgroundColor } from '@pnthach95/react-native-root-view-background';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import ApiConfig from '../Config/ApiConfig';
import { useTheme } from '../Contexts/ThemeContext';
import { useLocationPermission } from '../Hooks/useLocationPermission';
import { setCurrentScreenName, updateField } from '../Redux/Action/actions';
import { store } from '../Redux/Store/store';
import {
  AddDailyHabits,
  AddRecentPics,
  DistancePreference,
  HopingToFind,
  IdentifyYourSelf,
  LocationPermission,
  LoginScreen,
  OTPScreen,
  PhoneNumber,
  SexualOrientation,
  WhatAboutYou,
  YourEducation,
  YourIntro,
} from '../Screens/Auth';
import AddEmail from '../Screens/Auth/CreateProfile/AddEmail';
import ChatScreen from '../Screens/Chat/ChatScreen';
import DonationScreen from '../Screens/Donation/DonationScreen';
import CategoryDetailCardsScreen from '../Screens/Home/ExploreCards/CategoryDetailCardsScreen';
import ExploreCardDetailScreen from '../Screens/Home/ExploreCards/ExploreCardDetailScreen';
import NotificationScreen from '../Screens/Notification/NotificationScreen';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';
import SettingScreen from '../Screens/Setting/SettingScreen';
import SplashScreen from '../Screens/SplashScreen';
import { initGoogleSignIn } from '../Services/AuthService';
import { LocalStorageFields } from '../Types/LocalStorageFields';
import { useCustomToast } from '../Utils/toastUtils';
import BottomTab from './BottomTab';
import { navigationRef } from './RootNavigation';
import QRCodeScreen from '../Screens/Donation/QRCodeScreen';
import RedeemReferralCode from '../Screens/Donation/RedeemReferralCode';

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
];

const Stack = createNativeStackNavigator();

const NumberVerificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={PhoneNumber} name="PhoneNumber" />
      <Stack.Screen component={OTPScreen} name="OTP" />
    </Stack.Navigator>
  );
};

const LocationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={LocationPermission} name="LocationPermission" />
    </Stack.Navigator>
  );
};

export default function MainRoute() {
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();
  const { checkLocationPermission } = useLocationPermission();
  const ReduxUserData = useSelector((state: any) => state.user);
  const isUserVerified = useMemo(() => {
    return ReduxUserData?.isVerified;
  }, [ReduxUserData]);

  const [initialRoute, setInitialRoute] = useState<string>('');
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setRootViewBackgroundColor(isDark ? 'rgba(141, 71, 242, 1)' : colors.Secondary);
    Promise.all([getScreenToNavigate(), handleNotificationPermission(), initGoogleSignIn()]);
  }, []);

  const handleNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();

    if (authStatus === 1) {
      const Token = await messaging().getToken();
      if (Token) {
        store.dispatch(updateField(LocalStorageFields.notification_token, Token));
      }
    }
  };

  const getScreenToNavigate = useCallback(async () => {
    try {
      const checkLoginPermission = await checkLocationPermission();
      const isNumber = !ReduxUserData.mobile_no || ReduxUserData.mobile_no.length === 0;
      const isImageUploaded =
        ReduxUserData?.isImageUploaded ||
        (ReduxUserData?.userData?.recent_pik && ReduxUserData?.userData?.recent_pik?.length !== 0);

      if (!isUserVerified) {
        setInitialRoute('NumberVerification');
        return;
      }

      if (!checkLoginPermission) {
        setInitialRoute('LocationStack');
        return;
      }

      if (isNumber) {
        setInitialRoute('NumberVerification');
        navigationRef &&
          navigationRef?.navigate('NumberVerification', {
            screen: 'PhoneNumber',
          });
        return;
      }

      if (isImageUploaded) {
        setInitialRoute('BottomTab');
      } else {
        setInitialRoute('LoginStack');
        navigationRef &&
          navigationRef?.navigate('LoginStack', {
            screen: 'AddRecentPics',
          });
      }
    } catch (error) {
      showToast('Error', String(error), 'error');
      setInitialRoute('NumberVerification');
    }
  }, [isUserVerified, navigationRef, isNavigationReady, ApiConfig]);

  const LoginStack = () => {
    const userIdentityExists = ReduxUserData?.identity?.length === 0 && store.getState().user?.identity?.length === 0;

    return (
      <>
        <StatusBar barStyle={isDark ? 'dark-content' : 'light-content'} backgroundColor={colors.Primary} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userIdentityExists && <Stack.Screen component={AddEmail} name="AddEmail" />}
          <Stack.Screen component={IdentifyYourSelf} name="IdentifyYourSelf" />
          <Stack.Screen component={SexualOrientation} name="SexualOrientationScreen" />
          <Stack.Screen component={HopingToFind} name="HopingToFind" />
          <Stack.Screen component={DistancePreference} name="DistancePreference" />
          <Stack.Screen component={YourEducation} name="YourEducation" />
          <Stack.Screen component={AddDailyHabits} name="AddDailyHabits" />
          <Stack.Screen component={WhatAboutYou} name="WhatAboutYou" />
          <Stack.Screen component={YourIntro} name="YourIntro" />
          <Stack.Screen component={AddRecentPics} name="AddRecentPics" />
        </Stack.Navigator>
      </>
    );
  };

  const stateChangesCall = useCallback((ref: any) => {
    const currentRouteName = ref?.getCurrentRoute()?.name || '';

    if (currentRouteName && !excludedRoutes.some((route) => currentRouteName.includes(route))) {
      return currentRouteName;
    }

    return null;
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const currentRouteName = stateChangesCall(navigationRef.current);
        if (currentRouteName) {
          store.dispatch(setCurrentScreenName(currentRouteName));
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'ios' }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="NumberVerification" component={NumberVerificationStack} />
        <Stack.Screen name="LocationStack" component={LocationStack} />
        <Stack.Screen name="LoginStack" component={LoginStack} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="CategoryDetailCards" component={CategoryDetailCardsScreen} />
        <Stack.Screen name="ExploreCardDetail" component={ExploreCardDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Donation" component={DonationScreen} />
        <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
        <Stack.Screen name="RedeemReferralCode" component={RedeemReferralCode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
