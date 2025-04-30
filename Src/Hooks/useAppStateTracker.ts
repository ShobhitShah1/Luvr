import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import UserService from '../Services/AuthService';

interface OnlineStatusData {
  eventName: 'online';
  is_online: boolean;
}

/**`
 * Custom hook to track app state changes and notify the backend
 * Uses memoization and refs to prevent unnecessary re-renders or API calls
 * @returns The current app state
 */
const useAppStateTracker = (): AppStateStatus => {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const currentAppStateRef = useRef<AppStateStatus>(AppState.currentState);

  const initialCallMadeRef = useRef<boolean>(false);

  const lastApiCallTimeRef = useRef<number>(0);
  const API_CALL_DEBOUNCE_MS = 1000;

  /**
   * Makes an API call to update online status if not called recently
   * @param isOnline Whether the user is online
   */
  const updateOnlineStatus = async (isOnline: boolean): Promise<void> => {
    const now = Date.now();

    if (now - lastApiCallTimeRef.current < API_CALL_DEBOUNCE_MS) {
      console.log('Debouncing API call');
      return;
    }

    try {
      const dataToSend: OnlineStatusData = {
        eventName: 'online',
        is_online: isOnline,
      };

      lastApiCallTimeRef.current = now;
      await UserService.UserRegister(dataToSend);
      console.log(`User online status updated: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
    } catch (error) {
      console.error('Failed to update online status:', error);
    }
  };

  useEffect(() => {
    if (!initialCallMadeRef.current) {
      updateOnlineStatus(true);
      initialCallMadeRef.current = true;
    }

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      currentAppStateRef.current = nextAppState;

      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        updateOnlineStatus(true);
      } else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        updateOnlineStatus(false);
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      updateOnlineStatus(false);
      subscription.remove();
    };
  }, []);

  return currentAppStateRef.current;
};

export default useAppStateTracker;
