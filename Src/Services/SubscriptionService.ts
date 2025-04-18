import UserService from './AuthService';
import { store } from '../Redux/Store/store';
import {
  fetchSubscriptionRequest,
  fetchSubscriptionSuccess,
  fetchSubscriptionFailure,
} from '../Redux/Reducer/membershipReducer';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
// import BackgroundTimer from 'react-native-background-timer';
import { SubscriptionData } from '../Types/SubscriptionTypes';

// Track subscription expiry timers
let subscriptionExpiryTimer: number | null = null;
let subscriptionFetchTimeout: NodeJS.Timeout | null = null;

/**
 * Calculate expiry date based on subscription details
 * @param {SubscriptionData} subscription - Subscription data
 * @returns {number} Timestamp of expiry
 */
const calculateExpiryTimestamp = (subscription: SubscriptionData): number => {
  if (!subscription || !subscription.payment_response) {
    return 0;
  }

  const { transactionDate, productId } = subscription.payment_response;

  // Default to 30 days for monthly subscription
  let periodInDays = 30;

  if (productId) {
    if (productId.includes('yearly') || productId.includes('annual')) {
      periodInDays = 365;
    } else if (productId.includes('quarterly') || productId.includes('3month')) {
      periodInDays = 90;
    } else if (productId.includes('6month') || productId.includes('halfyear')) {
      periodInDays = 180;
    }
  }

  return transactionDate + periodInDays * 24 * 60 * 60 * 1000;
};

/**
 * Cancels a subscription
 * @param {string} purchaseId - The ID of the purchase to cancel
 * @returns {Promise<boolean>} Success status
 */
export const cancelSubscription = async (purchaseId: string): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return false;
    }

    const dataToSend = {
      eventName: 'cancel_purchase',
      purchase_id: purchaseId,
    };

    const response = await UserService.UserRegister(dataToSend);

    if (response?.code === 200) {
      await debouncedGetSubscription(0);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
};

/**
 * Schedules monitoring for subscription expiry
 * @param {SubscriptionData} subscription - Subscription data
 */
export const scheduleSubscriptionExpiryCheck = (subscription: SubscriptionData): void => {
  if (subscriptionExpiryTimer !== null) {
    // BackgroundTimer.clearTimeout(subscriptionExpiryTimer);
    subscriptionExpiryTimer = null;
  }

  if (!subscription || !subscription._id) {
    return;
  }

  const purchaseId = subscription._id;

  if (!subscription.payment_response.autoRenewing || subscription.payment_response.purchaseState !== 1) {
    console.log('Subscription not active or not auto-renewing, skipping expiry check');
    return;
  }

  const expiryTimestamp = calculateExpiryTimestamp(subscription);
  const currentTime = Date.now();

  const timeUntilExpiry = expiryTimestamp - currentTime;

  console.log(`Subscription expiry in: ${Math.floor(timeUntilExpiry / (1000 * 60 * 60 * 24))} days`);

  if (timeUntilExpiry <= 0) {
    debouncedGetSubscription(0).then((refreshed) => {
      if (refreshed) {
        const state = store.getState();
        const updatedSubscription = state.membership.subscription;

        if (
          updatedSubscription &&
          updatedSubscription._id &&
          calculateExpiryTimestamp(updatedSubscription) <= Date.now()
        ) {
          console.log('Confirmed expiry, canceling subscription');
          cancelSubscription(updatedSubscription._id);
        }
      }
    });
    return;
  }

  // If expiry is far away, schedule a check halfway to expiry
  // If expiry is close (within 24 hours), schedule more frequent checks
  let checkDelay: number;

  if (timeUntilExpiry > 7 * 24 * 60 * 60 * 1000) {
    // More than 7 days
    // Check halfway to expiry
    checkDelay = timeUntilExpiry / 2;
  } else if (timeUntilExpiry > 24 * 60 * 60 * 1000) {
    // 1-7 days
    // Check daily
    checkDelay = 24 * 60 * 60 * 1000;
  } else {
    // Less than 24 hours
    // Check every hour
    checkDelay = 60 * 60 * 1000;
  }

  console.log(`Scheduling next subscription check in ${Math.floor(checkDelay / (1000 * 60 * 60))} hours`);

  // subscriptionExpiryTimer = BackgroundTimer.setTimeout(async () => {
  //   // Fetch latest subscription data
  //   await debouncedGetSubscription(0);

  //   // Get updated subscription status
  //   const state = store.getState();
  //   const updatedSubscription = state.membership.subscription;

  //   if (updatedSubscription && updatedSubscription._id) {
  //     const updatedExpiry = calculateExpiryTimestamp(updatedSubscription);

  //     if (Date.now() >= updatedExpiry) {
  //       console.log('Subscription expired, canceling');
  //       await cancelSubscription(updatedSubscription._id);
  //     } else {
  //       // Re-schedule check with updated data
  //       scheduleSubscriptionExpiryCheck(updatedSubscription);
  //     }
  //   }
  // }, checkDelay);
};

/**
 * Fetches subscription data from the server
 * @returns {Promise<boolean>} Success status
 */
export const getSubscription = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
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

    if (response.data && response.data._id) {
      scheduleSubscriptionExpiryCheck(response.data);
    }

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

/**
 * Debounced version of getSubscription
 * @param {number} delayMs - Delay in milliseconds
 * @returns {Promise<boolean>} Success status
 */
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

/**
 * Clears all subscription timers
 * Should be called on logout or app cleanup
 */
export const clearSubscriptionTimers = (): void => {
  if (subscriptionExpiryTimer !== null) {
    // BackgroundTimer.clearTimeout(subscriptionExpiryTimer);
    subscriptionExpiryTimer = null;
  }

  if (subscriptionFetchTimeout) {
    clearTimeout(subscriptionFetchTimeout);
    subscriptionFetchTimeout = null;
  }
};
