/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import messaging from '@react-native-firebase/messaging';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { updateField } from '../Redux/Action/actions';
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
import QRCodeScreen from '../Screens/Donation/QRCodeScreen';
import RedeemReferralCode from '../Screens/Donation/RedeemReferralCode';
import CategoryDetailCardsScreen from '../Screens/Home/ExploreCards/CategoryDetailCardsScreen';
import ExploreCardDetailScreen from '../Screens/Home/ExploreCards/ExploreCardDetailScreen';
import IncognitoScreen from '../Screens/Incognito/Index';
import NotificationScreen from '../Screens/Notification/NotificationScreen';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';
import SettingScreen from '../Screens/Setting/SettingScreen';
import SplashScreen from '../Screens/SplashScreen';
import { initGoogleSignIn } from '../Services/AuthService';
import { RootStackParamList } from '../Types/Interface';
import { LocalStorageFields } from '../Types/LocalStorageFields';
import BottomTab from './BottomTab';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NumberVerificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={PhoneNumber} name="PhoneNumber" />
      <Stack.Screen component={OTPScreen} name="OTP" />
    </Stack.Navigator>
  );
};

const LocationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <Stack.Screen component={LocationPermission} name="LocationPermission" />
    </Stack.Navigator>
  );
};

export default function MainRoute() {
  const storedData = useSelector((state: any) => state.user);

  useEffect(() => {
    Promise.all([handleNotificationPermission(), initGoogleSignIn()]);
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

  const LoginStack = () => {
    const userIdentityExists = storedData?.identity?.length === 0 && store.getState().user?.identity?.length === 0;

    return (
      <>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
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

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
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
      <Stack.Screen name="IncognitoScreen" component={IncognitoScreen} />
    </Stack.Navigator>
  );
}
