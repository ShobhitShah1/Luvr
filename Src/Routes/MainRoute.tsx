import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SplashScreen from '../Screens/Splash/SplashScreen';
import LoginScreen from '../Screens/Auth/Login/LoginScreen';
import CreateAccount from '../Screens/Auth/CreateAccount/CreateAccount';
import PhoneNumber from '../Screens/Auth/PhoneNumber/PhoneNumber';
import OTPScreen from '../Screens/Auth/OTP/OTPScreen';
import MyFirstName from '../Screens/Auth/CreateProfile/MyFirstName';
import MyBirthDate from '../Screens/Auth/CreateProfile/MyBirthDate';
import MyInterests from '../Screens/Auth/CreateProfile/MyInterests';
import MyGender from '../Screens/Auth/CreateProfile/MyGender';
import MyPhotos from '../Screens/Auth/CreateProfile/MyPhotos';

export default function MainRoute() {
  const Stack = createNativeStackNavigator();

  const LoginStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={LoginScreen} name="Login" />
        <Stack.Screen component={CreateAccount} name="CreateAccount" />
        <Stack.Screen component={PhoneNumber} name="PhoneNumber" />
        <Stack.Screen component={OTPScreen} name="OTP" />

        {/* CreateProfile: Why Added Here? Its Part Of Login */}

        <Stack.Screen component={MyFirstName} name="MyFirstName" />
        <Stack.Screen component={MyBirthDate} name="MyBirthDate" />
        <Stack.Screen component={MyGender} name="MyGender" />
        <Stack.Screen component={MyInterests} name="MyInterests" />
        <Stack.Screen component={MyPhotos} name="MyPhotos" />
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
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LoginStack" component={LoginStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
