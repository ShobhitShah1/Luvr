import NetInfo from '@react-native-community/netinfo';
import { store } from '../Redux/Store/store';
import UserService from './AuthService';
import { fetchBoostFailure, fetchBoostRequest, fetchBoostSuccess } from '../Redux/Reducer/boostReducer';
import { BoostData } from '../Types/Interface';

let boostFetchTimeout: NodeJS.Timeout | null = null;

/**
 * Calculate expiry time for a boost
 * @param {BoostData} boost - Boost data
 * @returns {number} Timestamp of expiry
 */
const calculateBoostExpiryTimestamp = (boost: BoostData): number => {
  if (!boost || !boost.payment_response) {
    return 0;
  }

  const { transactionDate, productId } = boost.payment_response;

  // Default to 30 minutes for basic boost
  let periodInMinutes = 30;

  if (productId) {
    if (productId.includes('day') || productId.includes('24hour')) {
      periodInMinutes = 24 * 60; // 24 hours in minutes
    } else if (productId.includes('hour3') || productId.includes('3hour')) {
      periodInMinutes = 3 * 60; // 3 hours in minutes
    } else if (productId.includes('hour12') || productId.includes('12hour')) {
      periodInMinutes = 12 * 60; // 12 hours in minutes
    }
  }

  return transactionDate + periodInMinutes * 60 * 1000;
};

/**
 * Cancels an active boost
 * @param {string} boostId - The ID of the boost to cancel
 * @returns {Promise<boolean>} Success status
 */
export const cancelBoost = async (boostId: string): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return false;
    }

    const dataToSend = { eventName: 'cancel_boost', boost_id: boostId };

    const response = await UserService.UserRegister(dataToSend);

    if (response?.code === 200) {
      await debouncedGetBoost(0);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * Schedules monitoring for boost expiry
 * @param {BoostData} boost - Boost data
 */
export const scheduleBoostExpiryCheck = (boost: BoostData): void => {
  if (!boost || !boost._id) {
    return;
  }

  const expiryTimestamp = calculateBoostExpiryTimestamp(boost);
  const currentTime = Date.now();

  const timeUntilExpiry = expiryTimestamp - currentTime;

  if (timeUntilExpiry <= 0 || timeUntilExpiry === 0) {
    debouncedGetBoost(0).then((refreshed) => {
      if (refreshed) {
        const state = store.getState();
        const updatedBoost = state?.boost?.activeBoost;

        if (updatedBoost && updatedBoost._id && calculateBoostExpiryTimestamp(updatedBoost) <= Date.now()) {
          cancelBoost(updatedBoost._id);
        }
      }
    });
    return;
  }

  // Schedule checks based on remaining time
  let checkDelay: number;

  if (timeUntilExpiry > 60 * 60 * 1000) {
    // More than 1 hour
    // Check every 30 minutes
    checkDelay = 30 * 60 * 1000;
  } else if (timeUntilExpiry > 15 * 60 * 1000) {
    // 15-60 minutes
    // Check every 5 minutes
    checkDelay = 5 * 60 * 1000;
  } else {
    // Less than 15 minutes
    // Check every minute
    checkDelay = 60 * 1000;
  }

  setTimeout(() => {
    debouncedGetBoost(0);
  }, checkDelay);
};

/**
 * Fetches boost data from the server
 * @returns {Promise<boolean>} Success status
 */
export const getBoost = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return false;
    }

    store.dispatch(fetchBoostRequest());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const dataToSend = { eventName: 'get_boost' };

    const response = await UserService.UserRegister(dataToSend);

    clearTimeout(timeoutId);

    if (response?.code !== 200) {
      store.dispatch(fetchBoostFailure('Invalid response'));
      return false;
    }

    store.dispatch(fetchBoostSuccess(response.data || null));

    if (response.data && response.data._id) {
      scheduleBoostExpiryCheck(response.data);
    }

    return true;
  } catch (error) {
    store.dispatch(fetchBoostFailure(error instanceof Error ? error.message : 'Unknown error'));
    return false;
  }
};

/**
 * Checks if user has an active boost
 * @returns {boolean} True if user has active boost
 */
export const hasActiveBoost = (): boolean => {
  const state = store.getState();
  return state?.boost?.isBoostActive || false;
};

/**
 * Gets remaining boost time in minutes
 * @returns {number} Minutes remaining in the boost, or 0 if no active boost
 */
export const getBoostTimeRemaining = (): number => {
  const state = store.getState();
  const boost = state?.boost?.activeBoost;

  if (!boost || !boost._id) {
    return 0;
  }

  const expiryTimestamp = calculateBoostExpiryTimestamp(boost);
  const currentTime = Date.now();
  const timeUntilExpiry = expiryTimestamp - currentTime;

  return Math.max(0, Math.floor(timeUntilExpiry / (1000 * 60)));
};

/**
 * Debounced version of getBoost
 * @param {number} delayMs - Delay in milliseconds
 * @returns {Promise<boolean>} Success status
 */
export const debouncedGetBoost = (delayMs = 300): Promise<boolean> => {
  return new Promise((resolve) => {
    if (boostFetchTimeout) {
      clearTimeout(boostFetchTimeout);
    }

    boostFetchTimeout = setTimeout(async () => {
      const result = await getBoost();
      resolve(result);
      boostFetchTimeout = null;
    }, delayMs);
  });
};

/**
 * Clears all boost timers
 * Should be called on logout or app cleanup
 */
export const clearBoostTimers = (): void => {
  if (boostFetchTimeout) {
    clearTimeout(boostFetchTimeout);
    boostFetchTimeout = null;
  }
};
