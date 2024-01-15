/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
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
import BottomTab from './BottomTab';
import ChatScreen from '../Screens/Chat/ChatScreen';
import CategoryDetailCardsScreen from '../Screens/Home/ExploreCards/CategoryDetailCardsScreen';
import ExploreCardDetailScreen from '../Screens/Home/ExploreCards/ExploreCardDetailScreen';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';
import SettingScreen from '../Screens/Setting/SettingScreen';

export default function MainRoute() {
  const Stack = createNativeStackNavigator();
  const ReduxUserData = useSelector((state: any) => state.user);
  const isUserVerified: boolean = ReduxUserData?.isVerified;
  const [initialRoute, setInitialRoute] = useState<string>('');
  //* On Profile Creation Stack Check Data For All Screen Navigate To Missing Screen's (Screen With No Skip Option)

  // const getMissingDataScreen = () => {
  //   const missingData = [];

  //   if (!ReduxUserData.mobileNo) {
  //     missingData.push('mobileNo');
  //   }
  //   if (!ReduxUserData.otp) {
  //     missingData.push('OTP');
  //   }
  //   if (!ReduxUserData.fullName) {
  //     missingData.push('fullName');
  //   }
  //   if (!ReduxUserData.hoping) {
  //     missingData.push('hoping');
  //   }
  //   if (!ReduxUserData.radius) {
  //     missingData.push('radius');
  //   }

  //   // if (!ReduxUserData.collegeName) {
  //   //   missingData.push('collegeName');
  //   // }
  //   // if (
  //   //   !ReduxUserData.habitsDrink ||
  //   //   !ReduxUserData.habitsExercise ||
  //   //   !ReduxUserData.habitsMovies ||
  //   //   !ReduxUserData.habitsSmoke
  //   // ) {
  //   //   missingData.push('habitsScreen');
  //   // }

  //   // if (!ReduxUserData.identity) {
  //   //   missingData.push('identity');
  //   // }
  //   // if (!ReduxUserData.likesInto || ReduxUserData.likesInto.length === 0) {
  //   //   missingData.push('likesInto');
  //   // }
  //   // if (!ReduxUserData.magicalPersonCommunicationStr) {
  //   //   missingData.push('magicalPersonCommunicationStr');
  //   // }
  //   if (!ReduxUserData.recentPik) {
  //     missingData.push('recentPik');
  //   }
  //   console.log('missingData', missingData[0]);

  //   switch (missingData.length) {
  //     case 0:
  //       return 'BottomTab';
  //     case 1:
  //       switch (missingData[0]) {
  //         case 'mobileNo':
  //           return 'PhoneNumber';
  //         case 'OTP':
  //           return 'OTP';
  //         case 'fullName':
  //           return 'IdentifyYourSelf';
  //         case 'hoping':
  //           return 'HopingToFind';
  //         // case 'identity':
  //         //   return 'IdentityScreen';
  //         // case 'collegeName':
  //         //   return 'CollegeNameScreen';
  //         // case 'habitsDrink':
  //         //   return 'HabitsDrinkScreen';
  //         // case 'likesInto':
  //         //   return 'LikesIntoScreen';
  //         // case 'magicalPersonCommunicationStr':
  //         //   return 'MagicalPersonCommunicationStrScreen';
  //         case 'radius':
  //           return 'DistancePreference';
  //         case 'recentPik':
  //           return 'AddRecentPics';
  //         default:
  //           return 'LoginStack';
  //       }
  //     default:
  //       return 'PhoneNumber';
  //   }
  // };

  // const initialRouteName = getMissingDataScreen();

  const {checkLocationPermission} = useLocationPermission();

  const determineInitialRoute = useCallback(async () => {
    try {
      const checkLoginPermission = await checkLocationPermission();
      console.log('checkLoginPermission', checkLoginPermission);

      if (isUserVerified) {
        if (checkLoginPermission) {
          if (ReduxUserData?.isImageUploaded) {
            setInitialRoute('BottomTab');
          } else {
            setInitialRoute('LoginStack');
          }
        } else {
          setInitialRoute('LocationStack');
        }
      } else {
        setInitialRoute('NumberVerification');
      }
    } catch (error) {
      console.error('Error determining initial route:', error);
      setInitialRoute('NumberVerification');
    }
  }, [isUserVerified]);

  useEffect(() => {
    determineInitialRoute();
  }, [determineInitialRoute]);

  useEffect(() => {
    if (initialRoute) {
      SplashScreen.hide();
      console.log('📄 UserData Splash Screen:', ReduxUserData);
      console.log('🆔 User Verified:', isUserVerified ? '✅' : '❌');
      console.log('📱 Screen Will Show:', initialRoute);
      console.log('--------------- SPLASH END ----------------');
    }
  }, [initialRoute, isUserVerified]);

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
      {initialRoute && (
        <NavigationContainer>
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
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </React.Fragment>
  );
}
