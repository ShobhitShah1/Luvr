/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

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
import CategoryDetailCardsScreen from '../Screens/Home/ExploreCards/CategoryDetailCardsScreen';
import ExploreCardDetailScreen from '../Screens/Home/ExploreCards/ExploreCardDetailScreen';
import BottomTab from './BottomTab';
import SplashScreen from 'react-native-splash-screen';

export default function MainRoute() {
  const Stack = createNativeStackNavigator();
  const ReduxUserData = useSelector((state: any) => state.user);

  const getMissingDataScreen = () => {
    const missingData = [];

    if (!ReduxUserData.mobileNo) {
      missingData.push('mobileNo');
    }
    if (!ReduxUserData.otp) {
      missingData.push('OTP');
    }
    if (!ReduxUserData.fullName) {
      missingData.push('fullName');
    }
    if (!ReduxUserData.hoping) {
      missingData.push('hoping');
    }
    if (!ReduxUserData.radius) {
      missingData.push('radius');
    }

    // if (!ReduxUserData.collegeName) {
    //   missingData.push('collegeName');
    // }
    // if (
    //   !ReduxUserData.habitsDrink ||
    //   !ReduxUserData.habitsExercise ||
    //   !ReduxUserData.habitsMovies ||
    //   !ReduxUserData.habitsSmoke
    // ) {
    //   missingData.push('habitsScreen');
    // }

    // if (!ReduxUserData.identity) {
    //   missingData.push('identity');
    // }
    // if (!ReduxUserData.likesInto || ReduxUserData.likesInto.length === 0) {
    //   missingData.push('likesInto');
    // }
    // if (!ReduxUserData.magicalPersonCommunicationStr) {
    //   missingData.push('magicalPersonCommunicationStr');
    // }
    if (!ReduxUserData.recentPik) {
      missingData.push('recentPik');
    }
    console.log('missingData', missingData[0]);

    switch (missingData.length) {
      case 0:
        return 'BottomTab';
      case 1:
        switch (missingData[0]) {
          case 'mobileNo':
            return 'PhoneNumber';
          case 'OTP':
            return 'OTP';
          case 'fullName':
            return 'IdentifyYourSelf';
          case 'hoping':
            return 'HopingToFind';
          // case 'identity':
          //   return 'IdentityScreen';
          // case 'collegeName':
          //   return 'CollegeNameScreen';
          // case 'habitsDrink':
          //   return 'HabitsDrinkScreen';
          // case 'likesInto':
          //   return 'LikesIntoScreen';
          // case 'magicalPersonCommunicationStr':
          //   return 'MagicalPersonCommunicationStrScreen';
          case 'radius':
            return 'DistancePreference';
          case 'recentPik':
            return 'AddRecentPics';
          default:
            return 'LoginStack';
        }
      default:
        return 'PhoneNumber';
    }
  };

  const initialRouteName = getMissingDataScreen();
  console.log('initialRouteName', initialRouteName);

  useEffect(() => {
    console.log('ReduxUserData', ReduxUserData);
    if (initialRouteName) {
      SplashScreen.hide();
    }
  }, [ReduxUserData, initialRouteName]);

  const LoginStack = () => {
    return (
      <React.Fragment>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'none',
            statusBarAnimation: 'fade',
          }}
          initialRouteName="AddRecentPics">
          <Stack.Screen component={LoginScreen} name="Login" />
          <Stack.Screen component={PhoneNumber} name="PhoneNumber" />
          <Stack.Screen component={OTPScreen} name="OTP" />
          <Stack.Screen
            component={LocationPermission}
            name="LocationPermission"
          />
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          customAnimationOnGesture: true,
        }}
        initialRouteName="BottomTab">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
