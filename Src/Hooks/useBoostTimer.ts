import { useEffect, useRef } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { useBoostModal } from './useBoostModal';
import { useBoost } from './useBoost';
import { getToken } from '../Services/fetch.service';

export const useBoostTimer = () => {
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
  }, [isBoostActive]);

  const setupBoostTimer = async () => {
    try {
      const token = getToken();

      await remoteConfig().fetchAndActivate();

      const boostTimer = remoteConfig().getValue('boost_modal_timer').asNumber();
      const timerDuration = boostTimer || 300000;

      if (!isBoostActive && token) {
        if (boostTimerRef.current) {
          clearTimeout(boostTimerRef.current);
        }

        boostTimerRef.current = setTimeout(() => {
          showModal();
        }, timerDuration);
      }
    } catch (error) {}
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
