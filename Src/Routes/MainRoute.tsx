/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useSelector} from 'react-redux';
import {useLocationPermission} from '../Hooks/useLocationPermission';

// ========================== AUTH SCREENS ==========================
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

// ========================== HOME SCREENS ==========================
import ApiConfig from '../Config/ApiConfig';
import {setCurrentScreenName, updateField} from '../Redux/Action/userActions';
import {store} from '../Redux/Store/store';
import ChatScreen from '../Screens/Chat/ChatScreen';
import DonationScreen from '../Screens/Donation/DonationScreen';
import CategoryDetailCardsScreen from '../Screens/Home/ExploreCards/CategoryDetailCardsScreen';
import ExploreCardDetailScreen from '../Screens/Home/ExploreCards/ExploreCardDetailScreen';
import NotificationScreen from '../Screens/Notification/NotificationScreen';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';
import SettingScreen from '../Screens/Setting/SettingScreen';
import {initGoogleSignIn} from '../Services/AuthService';
import {LocalStorageFields} from '../Types/LocalStorageFields';
import BottomTab from './BottomTab';
import {navigationRef} from './RootNavigation';
import AddEmail from '../Screens/Auth/CreateProfile/AddEmail';
import {useCustomToast} from '../Utils/toastUtils';

export default function MainRoute() {
  const Stack = createNativeStackNavigator();
  const ReduxUserData = useSelector((state: any) => state.user);
  const isUserVerified: boolean = ReduxUserData?.isVerified;
  const [initialRoute, setInitialRoute] = useState<string>('');
  const {checkLocationPermission} = useLocationPermission();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const {showToast} = useCustomToast();

  useEffect(() => {
    Promise.all([
      determineInitialRoute(),
      HandleNotificationPermission(),
      initGoogleSignIn(),
    ]);
  }, []);

  const HandleNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();

    if (authStatus === 1) {
      const Token = await messaging().getToken();
      if (Token) {
        console.log('FCM TOKEN:', Token);
        store.dispatch(
          updateField(LocalStorageFields.notification_token, Token),
        );
      }
    }
  };

  const determineInitialRoute = useCallback(async () => {
    try {
      const checkLoginPermission = await checkLocationPermission();

      if (!isUserVerified) {
        setInitialRoute('NumberVerification');
        return;
      }

      if (!checkLoginPermission) {
        setInitialRoute('LocationStack');
        return;
      }
      if (!ReduxUserData.mobile_no || ReduxUserData.mobile_no.length === 0) {
        setInitialRoute('NumberVerification');
        navigationRef &&
          navigationRef?.navigate('NumberVerification', {
            screen: 'PhoneNumber',
          });
        return;
      }
      if (
        ReduxUserData?.isImageUploaded ||
        (ReduxUserData?.userData?.recent_pik &&
          ReduxUserData?.userData?.recent_pik?.length !== 0)
      ) {
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

  useEffect(() => {
    if (initialRoute) {
      SplashScreen.hide();
      console.log('--------------- SPLASH END ----------------');
    }
  }, [initialRoute, isUserVerified, ApiConfig]);

  const NumberVerificationStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={LoginScreen} name="Login" />
        <Stack.Screen component={PhoneNumber} name="PhoneNumber" />
        <Stack.Screen component={OTPScreen} name="OTP" />
      </Stack.Navigator>
    );
  };

  const LocationStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          component={LocationPermission}
          name="LocationPermission"
        />
      </Stack.Navigator>
    );
  };

  const LoginStack = () => {
    return (
      <React.Fragment>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {ReduxUserData?.identity &&
            ReduxUserData?.identity?.length === 0 &&
            store.getState().user?.identity &&
            store.getState().user?.identity?.length === 0 && (
              <Stack.Screen component={AddEmail} name="AddEmail" />
            )}
          <Stack.Screen component={IdentifyYourSelf} name="IdentifyYourSelf" />
          <Stack.Screen
            component={SexualOrientation}
            name="SexualOrientationScreen"
          />
          <Stack.Screen component={HopingToFind} name="HopingToFind" />
          <Stack.Screen
            component={DistancePreference}
            name="DistancePreference"
          />
          <Stack.Screen component={YourEducation} name="YourEducation" />
          <Stack.Screen component={AddDailyHabits} name="AddDailyHabits" />
          <Stack.Screen component={WhatAboutYou} name="WhatAboutYou" />
          <Stack.Screen component={YourIntro} name="YourIntro" />
          <Stack.Screen component={AddRecentPics} name="AddRecentPics" />
        </Stack.Navigator>
      </React.Fragment>
    );
  };

  const StateChangesCall = ref => {
    const currentRouteName = ref?.getCurrentRoute()?.name;
    if (currentRouteName) {
      if (
        !currentRouteName.includes('Login') &&
        !currentRouteName.includes('PhoneNumber') &&
        !currentRouteName.includes('OTP') &&
        !currentRouteName.includes('IdentifyYourSelf') &&
        !currentRouteName.includes('SexualOrientationScreen') &&
        !currentRouteName.includes('DistancePreference') &&
        !currentRouteName.includes('HopingToFind') &&
        !currentRouteName.includes('AddDailyHabits') &&
        !currentRouteName.includes('YourEducation') &&
        !currentRouteName.includes('WhatAboutYou') &&
        !currentRouteName.includes('YourIntro') &&
        !currentRouteName.includes('AddRecentPics') &&
        !currentRouteName.includes('LocationPermission') &&
        !currentRouteName.includes('AddEmail')
      ) {
        return currentRouteName;
      }
    }
    return null;
  };

  return (
    <React.Fragment>
      {initialRoute && (
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            setIsNavigationReady(true);
          }}
          onStateChange={() => {
            const currentRouteName = StateChangesCall(navigationRef.current);
            if (currentRouteName) {
              store.dispatch(setCurrentScreenName(currentRouteName));
            }
          }}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={initialRoute}>
            <Stack.Screen
              name="NumberVerification"
              component={NumberVerificationStack}
            />
            <Stack.Screen name="LocationStack" component={LocationStack} />
            <Stack.Screen name="LoginStack" component={LoginStack} />
            <Stack.Screen name="BottomTab" component={BottomTab} />
            <Stack.Screen
              name="CategoryDetailCards"
              component={CategoryDetailCardsScreen}
            />
            <Stack.Screen
              name="ExploreCardDetail"
              component={ExploreCardDetailScreen}
            />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="Donation" component={DonationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </React.Fragment>
  );
}
