import React from 'react';
import MainRoute from './Src/Routes/MainRoute';
import {UserDataProvider} from './Src/Contexts/UserDataContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  //*
  //* Can Implement Notification Or Firebase Stuff
  //*

  return (
    <UserDataProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <MainRoute />
      </GestureHandlerRootView>
    </UserDataProvider>
  );
}
