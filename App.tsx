import React from 'react';
import MainRoute from './Src/Routes/MainRoute';
import {UserDataProvider} from './Src/Contexts/UserDataContext';

export default function App() {
  //*
  //* Can Implement Notification Or Firebase Stuff
  //*

  return (
    <UserDataProvider>
      <MainRoute />
    </UserDataProvider>
  );
}
