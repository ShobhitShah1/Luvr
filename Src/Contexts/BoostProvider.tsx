import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';

import { clearBoostTimers, debouncedGetBoost } from '../Services/BoostService';

import { useUserData } from './UserDataContext';

interface BoostProviderProps {
  children: React.ReactNode;
}

const BoostProvider: React.FC<BoostProviderProps> = ({ children }) => {
  const appState = useRef(AppState.currentState);
  const { userData } = useUserData();

  useEffect(() => {
    if (userData._id) {
      debouncedGetBoost(0);
    }
  }, [userData]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        userData._id
      ) {
        debouncedGetBoost(0);
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      clearBoostTimers();
    };
  }, [userData]);

  return <>{children}</>;
};

export default BoostProvider;
