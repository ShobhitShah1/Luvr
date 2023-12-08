/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';

// ========================== AUTH SCREENS ==========================
import {
  AddDailyHabits,
  AddRecentPics,
  DistancePreference,
  HopingToFind,
  IdentifyYourSelf,
  LocationPermission,
  LoginScreen,
  ManageContacts,
  OTPScreen,
  PhoneNumber,
  SexualOrientation,
  WelcomeScreen,
  WhatAboutYou,
  YourEducation,
  YourIntro,
  AvoidContacts,
} from '../Screens/Auth';

// ========================== HOME SCREENS ==========================
import HomeScreen from '../Screens/Home/HomeScreen';
import ExploreCard from '../Screens/Explore/ExploreCard';
import SplashScreen from 'react-native-splash-screen';
import BottomTab from './BottomTab';

export default function MainRoute() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const LoginStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
          statusBarAnimation: 'fade',
        }}>
        <Stack.Screen component={LoginScreen} name="Login" />
        <Stack.Screen component={WelcomeScreen} name="Welcome" />
        <Stack.Screen component={PhoneNumber} name="PhoneNumber" />
        <Stack.Screen component={OTPScreen} name="OTP" />

        {/* CreateProfile: Why Added Here? Its Part Of Login */}

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
        <Stack.Screen
          component={LocationPermission}
          name="LocationPermission"
        />
        <Stack.Screen component={AvoidContacts} name="AvoidContacts" />
        <Stack.Screen component={ManageContacts} name="ManageContacts" />
      </Stack.Navigator>
    );
  }; 

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          customAnimationOnGesture: true,
        }}>
        {/* <Stack.Screen name="LoginStack" component={LoginStack} /> */}
        <Stack.Screen name="BottomTab" component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
