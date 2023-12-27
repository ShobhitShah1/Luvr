import React from 'react';
import MainRoute from './Src/Routes/MainRoute';
import {UserDataProvider} from './Src/Contexts/UserDataContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { ToastProvider } from 'react-native-toast-notifications';
import ToastStyle from './Src/Screens/Auth/CreateProfile/Components/ToastStyle';

export default function App() {
  //*
  //* Can Implement Notification Or Firebase Stuff
  //*

  return (
    <UserDataProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <ToastProvider
          placement="bottom"
          duration={4000}
          offset={30}
          animationType="zoom-in"
          renderType={{
            custom_toast: toast => (
              <ToastStyle
                title={toast?.title}
                message={toast?.message}
                status={toast?.status}
              />
            ),
          }}>
          <MainRoute />
        </ToastProvider>
      </GestureHandlerRootView>
    </UserDataProvider>
  );
}
