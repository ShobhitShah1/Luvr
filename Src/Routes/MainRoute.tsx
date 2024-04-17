/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
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
  AvoidContacts,
  DistancePreference,
  HopingToFind,
  IdentifyYourSelf,
  LocationPermission,
  LoginScreen,
  ManageContacts,
  OTPScreen,
  PhoneNumber,
  SexualOrientation,
  WhatAboutYou,
  YourEducation,
  YourIntro,
} from '../Screens/Auth';

// ========================== HOME SCREENS ==========================
import ChatScreen from '../Screens/Chat/ChatScreen';
import CategoryDetailCardsScreen from '../Screens/Home/ExploreCards/CategoryDetailCardsScreen';
import ExploreCardDetailScreen from '../Screens/Home/ExploreCards/ExploreCardDetailScreen';
import NotificationScreen from '../Screens/Notification/NotificationScreen';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';
import SettingScreen from '../Screens/Setting/SettingScreen';
import {initGoogleSignIn} from '../Services/AuthService';
import BottomTab from './BottomTab';
import {navigationRef} from './RootNavigation';
import messaging from '@react-native-firebase/messaging';
import {store} from '../Redux/Store/store';
import {LocalStorageFields} from '../Types/LocalStorageFields';
import {updateField} from '../Redux/Action/userActions';
import DonationScreen from '../Screens/Donation/DonationScreen';
import ApiConfig from '../Config/ApiConfig';

// SplashScreen.show();

export default function MainRoute() {
  const Stack = createNativeStackNavigator();
  const ReduxUserData = useSelector((state: any) => state.user);
  const isUserVerified: boolean = ReduxUserData?.isVerified;
  const [initialRoute, setInitialRoute] = useState<string>('');
  const {checkLocationPermission} = useLocationPermission();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    Promise.all([
      determineInitialRoute(),
      HandleNotificationPermission(),
      initGoogleSignIn(),
    ]);
  }, []);

  const HandleNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('authStatus', authStatus);

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
      console.log('checkLoginPermission', checkLoginPermission);

      if (!isUserVerified) {
        setInitialRoute('NumberVerification');
        return;
      }

      console.log('Pass isUserVerified ✅');
      console.log('ReduxUserData', ReduxUserData);
      console.log(
        'ReduxUserData.mobile_no',
        ReduxUserData.mobile_no,
        ReduxUserData.mobile_no.length === 0,
      );

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
      console.log('Pass checkLoginPermission ✅');
      console.log('isNavigationReady', isNavigationReady);
      if (
        ReduxUserData?.isImageUploaded ||
        (ReduxUserData?.userData?.recent_pik &&
          ReduxUserData?.userData?.recent_pik?.length !== 0)
      ) {
        console.log('Pass recent_pik ✅');
        setInitialRoute('BottomTab');
      } else {
        console.log('Fail recent_pik ❌');
        console.log('navigationRef', navigationRef.isReady());
        setInitialRoute('LoginStack');
        navigationRef &&
          navigationRef?.navigate('LoginStack', {
            screen: 'AddRecentPics',
          });
      }
    } catch (error) {
      console.error('Error determining initial route:', error);
      setInitialRoute('NumberVerification');
    } finally {
      // SplashScreen.hide();
    }
  }, [
    initialRoute,
    isUserVerified,
    navigationRef,
    isNavigationReady,
    ApiConfig,
  ]);

  useEffect(() => {
    if (initialRoute) {
      SplashScreen.hide();
      console.log('📄 UserData Splash Screen:', ReduxUserData);
      console.log('🆔 User Verified:', isUserVerified ? '✅' : '❌');
      console.log('📱 Screen Will Show:', initialRoute);
      console.log('--------------- SPLASH END ----------------');
    }
  }, [initialRoute, isUserVerified, navigationRef, ApiConfig]);

  // Add another useEffect to hide the splash screen when navigation is ready and initial setup is done
  // useEffect(() => {
  //   if (isNavigationReady && initialRoute && navigationRef) {
  //     SplashScreen.hide();
  //   }
  // }, [isNavigationReady, initialRoute]);

  const NumberVerificationStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // animation: 'slide_from_right',
          // statusBarAnimation: 'fade',
          // animationTypeForReplace: 'push',
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
          // animation: 'slide_from_right',
          // statusBarAnimation: 'fade',
          // animationTypeForReplace: 'push',
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
            // animation: 'slide_from_right',
            // statusBarAnimation: 'fade',
            // animationTypeForReplace: 'push',
          }}>
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
          <Stack.Screen component={AvoidContacts} name="AvoidContacts" />
          <Stack.Screen component={ManageContacts} name="ManageContacts" />
        </Stack.Navigator>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {/* {initialRoute && ( */}
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setIsNavigationReady(true);
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
      {/* )} */}
    </React.Fragment>
  );
}
