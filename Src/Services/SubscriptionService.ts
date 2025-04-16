// Services/SubscriptionService.ts
import UserService from './AuthService';
import { store } from '../Redux/Store/store';
import {
  fetchSubscriptionRequest,
  fetchSubscriptionSuccess,
  fetchSubscriptionFailure,
} from '../Redux/Reducer/membershipReducer';
import NetInfo from '@react-native-community/netinfo';

/**
 * Fetches subscription data from the server and updates Redux store
 * @returns {Promise<boolean>} True if subscription was successfully fetched
 */
export const getSubscription = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('Network unavailable, skipping subscription fetch');
      return false;
    }

    store.dispatch(fetchSubscriptionRequest());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const dataToSend = {
      eventName: 'get_purchase',
      user_id: store.getState().user._id || '',
    };

    const response = await UserService.UserRegister(dataToSend);

    clearTimeout(timeoutId);

    if (response?.code !== 200 || !response.data) {
      store.dispatch(fetchSubscriptionFailure('Invalid response'));
      return false;
    }

    store.dispatch(fetchSubscriptionSuccess(response.data));
    return true;
  } catch (error) {
    store.dispatch(fetchSubscriptionFailure(error instanceof Error ? error.message : 'Unknown error'));
    return false;
  }
};

/**
 * Checks if user has an active subscription
 * @returns {boolean} True if user has active subscription
 */
export const hasActiveSubscription = (): boolean => {
  const state = store.getState();
  return state.membership.isSubscriptionActive;
};

let subscriptionFetchTimeout: NodeJS.Timeout | null = null;

export const debouncedGetSubscription = (delayMs = 300): Promise<boolean> => {
  return new Promise((resolve) => {
    if (subscriptionFetchTimeout) {
      clearTimeout(subscriptionFetchTimeout);
    }

    subscriptionFetchTimeout = setTimeout(async () => {
      const result = await getSubscription();
      resolve(result);
      subscriptionFetchTimeout = null;
    }, delayMs);
  });
};
