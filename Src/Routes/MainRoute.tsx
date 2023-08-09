import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SplashScreen from '../Screens/Splash/SplashScreen';
import LoginScreen from '../Screens/Auth/Login/LoginScreen';
import CreateAccount from '../Screens/Auth/CreateAccount/CreateAccount';

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
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LoginStack" component={LoginStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
