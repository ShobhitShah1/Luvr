import { useEffect, useRef } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useBoostModal } from './useBoostModal';
import { useBoost } from './useBoost';
import { useIsFocused } from '@react-navigation/native';
import { getToken } from '../Services/fetch.service';

export const useBoostTimer = () => {
  const isFocus = useIsFocused();
  const { showModal } = useBoostModal();
  const { isBoostActive } = useBoost();
  const boostTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setupBoostTimer();
    return () => {
      if (boostTimerRef.current) {
        clearTimeout(boostTimerRef.current);
      }
    };
  }, [isFocus, isBoostActive]);

  const setupBoostTimer = async () => {
    try {
      const token = getToken();
      remoteConfig().fetchAndActivate();

      if (isFocus && !isBoostActive && token) {
        const boostTimer = remoteConfig().getValue('boost_modal_timer').asNumber();
        console.log('boostTimer:', boostTimer);

        const timerDuration = boostTimer || 300000;

        console.log('timerDuration:', timerDuration);

        if (boostTimerRef.current) {
          clearTimeout(boostTimerRef.current);
        }

        boostTimerRef.current = setTimeout(() => {
          showModal();
        }, timerDuration);
      }
    } catch (error) {
      console.error('Boost timer setup error:', error);
    }
  };

  const resetBoostTimer = () => {
    if (boostTimerRef.current) {
      clearTimeout(boostTimerRef.current);
    }
    setupBoostTimer();
  };

  return {
    resetBoostTimer,
  };
};
