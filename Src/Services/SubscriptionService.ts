import NetInfo from '@react-native-community/netinfo';
import RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import {
  fetchSubscriptionFailure,
  fetchSubscriptionRequest,
  fetchSubscriptionSuccess,
  setSubscriptionExpired,
  setSubscriptionCancelled,
} from '../Redux/Reducer/membershipReducer';
import { store } from '../Redux/Store/store';
import { SubscriptionData } from '../Types/SubscriptionTypes';
import UserService from './AuthService';

// Unified timer management
let subscriptionCheckTimeout: NodeJS.Timeout | null = null;
let periodicValidationInterval: NodeJS.Timeout | null = null;
let gracePeriodTimeout: NodeJS.Timeout | null = null;
let fetchTimeout: NodeJS.Timeout | null = null;

/**
 * Unified subscription validation with comprehensive checks
 */
export const validateSubscription = async (
  subscription: SubscriptionData,
  includeStoreValidation = false
): Promise<{
  isValid: boolean;
  isExpired: boolean;
  needsRenewal: boolean;
  daysUntilExpiry: number;
  expiryTimestamp: number;
  storeValidation?: {
    isValid: boolean;
    error?: string;
    storeData?: any;
  };
}> => {
  if (!subscription?.payment_response) {
    return {
      isValid: false,
      isExpired: true,
      needsRenewal: false,
      daysUntilExpiry: 0,
      expiryTimestamp: 0,
    };
  }

  const { payment_response } = subscription;
  const currentTime = Date.now();
  const expiryTimestamp = calculateExpiryTimestamp(subscription);

  const daysUntilExpiry = Math.floor((expiryTimestamp - currentTime) / (1000 * 60 * 60 * 24));
  const isExpired = expiryTimestamp <= currentTime;
  const isValidState = payment_response.purchaseState === 1 || payment_response?.purchaseState === 'purchased';
  const isAutoRenewing = payment_response.autoRenewing !== false;

  let storeValidation;
  if (includeStoreValidation) {
    storeValidation = await validateWithPlatformStore(subscription);
  }

  return {
    isValid: isValidState && !isExpired && storeValidation?.isValid !== false,
    isExpired,
    needsRenewal: daysUntilExpiry <= 3 && isAutoRenewing,
    daysUntilExpiry: Math.max(0, daysUntilExpiry),
    expiryTimestamp,
    storeValidation,
  };
};

/**
 * Platform store validation (iOS/Android)
 */
const validateWithPlatformStore = async (
  subscription: SubscriptionData
): Promise<{
  isValid: boolean;
  error?: string;
  storeData?: any;
}> => {
  try {
    const { payment_response } = subscription;

    if (Platform.OS === 'ios') {
      const receiptData = payment_response.receiptData || payment_response.transactionReceipt;
      if (!receiptData) {
        return { isValid: false, error: 'No receipt data available' };
      }

      // iOS validation logic
      const expiresDate = payment_response.expiresDate || 0;
      const gracePeriodExpiresDate = payment_response.gracePeriodExpiresDate || 0;
      const currentTime = Date.now();

      // Consider grace period for iOS
      const effectiveExpiryDate = Math.max(expiresDate, gracePeriodExpiresDate);
      const isValid = effectiveExpiryDate > currentTime;

      return {
        isValid,
        storeData: {
          expiresDate,
          gracePeriodExpiresDate,
          isInGracePeriod: gracePeriodExpiresDate > currentTime && expiresDate <= currentTime,
        },
      };
    } else if (Platform.OS === 'android') {
      const purchaseToken = payment_response.purchaseToken;
      const productId = payment_response.productId;

      if (!purchaseToken || !productId) {
        return { isValid: false, error: 'Missing purchase token or product ID' };
      }

      // Android validation logic
      const currentTime = Date.now();
      const purchaseTime = payment_response.transactionDate || payment_response.purchaseTime || 0;

      // For Android, we consider the subscription valid if:
      // 1. It has a valid purchase token
      // 2. The purchase state is 1 (purchased) or 0 (pending)
      // 3. The purchase time is valid
      const isValid =
        purchaseToken &&
        (payment_response.purchaseState === 1 || payment_response.purchaseState === 0) &&
        purchaseTime > 0;

      return {
        isValid,
        storeData: {
          purchaseTime,
          purchaseState: payment_response.purchaseState,
          autoRenewing: payment_response.autoRenewing,
        },
      };
    }

    return { isValid: false, error: 'Unsupported platform' };
  } catch (error) {
    console.warn('Store validation failed:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
};

/**
 * Calculate expiry timestamp with fallback logic
 */
const calculateExpiryTimestamp = (subscription: SubscriptionData): number => {
  if (!subscription?.payment_response) {
    return 0;
  }

  const { payment_response } = subscription;

  // Priority 1: iOS grace period (if exists and valid)
  if (payment_response.platform === 'ios' && payment_response.gracePeriodExpiresDate) {
    return payment_response.gracePeriodExpiresDate;
  }

  // Priority 2: Direct expiry date
  if (payment_response.expiresDate) {
    return payment_response.expiresDate;
  }

  // Priority 3: Android expiry from receipt
  // if (payment_response.platform === 'android' && payment_response.transactionReceipt) {
  //   try {
  //     const receipt =
  //       typeof payment_response.transactionReceipt === 'string'
  //         ? JSON.parse(payment_response.transactionReceipt)
  //         : payment_response.transactionReceipt;

  //     const expiryTime = parseInt(receipt.expiryTimeMillis || '0');
  //     if (expiryTime > 0) {
  //       return expiryTime;
  //     }
  //   } catch (error) {
  //     console.warn('Failed to parse receipt for expiry:', error);
  //   }
  // }

  // Fallback: Calculate from transaction date and product ID
  const { transactionDate, productId } = payment_response;
  if (!transactionDate || !productId) {
    return 0;
  }

  let periodInDays = 30; // Default monthly
  const productIdLower = productId.toLowerCase();

  if (productIdLower.includes('yearly') || productIdLower.includes('annual')) {
    periodInDays = 365;
  } else if (productIdLower.includes('quarterly') || productIdLower.includes('3month')) {
    periodInDays = 90;
  } else if (productIdLower.includes('6month') || productIdLower.includes('halfyear')) {
    periodInDays = 180;
  } else if (productIdLower.includes('weekly') || productIdLower.includes('week')) {
    periodInDays = 7;
  }

  return transactionDate + periodInDays * 24 * 60 * 60 * 1000;
};

/**
 * Handle subscription expiry with proper cleanup
 */
const handleSubscriptionExpiry = async (subscription: SubscriptionData): Promise<void> => {
  try {
    console.log('Handling subscription expiry for:', subscription._id);

    // Final validation with store before cancellation
    const storeValidation = await validateWithPlatformStore(subscription);

    if (storeValidation.isValid) {
      console.log('Store validation shows subscription is still valid, rescheduling check');
      scheduleSubscriptionCheck(subscription);
      return;
    }

    // Cancel the subscription
    const cancelled = await cancelSubscription(subscription._id);

    if (cancelled) {
      console.log('Subscription successfully cancelled due to expiry');
      clearAllTimers();

      // Refresh subscription data after cancellation
      await getSubscription();
    }
  } catch (error) {
    console.error('Error handling subscription expiry:', error);
  }
};

/**
 * Unified subscription checking and scheduling
 */
const scheduleSubscriptionCheck = async (subscription: SubscriptionData): Promise<void> => {
  if (!subscription?._id) return;

  // Clear existing timers
  clearSubscriptionTimers();

  // Validate subscription
  const validation = await validateSubscription(subscription, false);

  if (!validation.isValid) {
    if (validation.isExpired) {
      await handleSubscriptionExpiry(subscription);
    }
    return;
  }

  const timeUntilExpiry = validation.expiryTimestamp - Date.now();
  console.log(`Subscription expires in ${validation.daysUntilExpiry} days`);

  // Determine check frequency based on time until expiry
  let checkDelay: number;
  let includeStoreValidation = false;

  if (validation.daysUntilExpiry > 7) {
    // More than 7 days - check every 2 days
    checkDelay = 2 * 24 * 60 * 60 * 1000;
  } else if (validation.daysUntilExpiry > 1) {
    // 1-7 days - check every 6 hours with store validation
    checkDelay = 6 * 60 * 60 * 1000;
    includeStoreValidation = true;
  } else if (validation.daysUntilExpiry >= 0) {
    // Less than 24 hours - check every hour with store validation
    checkDelay = Math.min(60 * 60 * 1000, timeUntilExpiry);
    includeStoreValidation = true;
  } else {
    // Already expired
    await handleSubscriptionExpiry(subscription);
    return;
  }

  // Schedule next check
  subscriptionCheckTimeout = setTimeout(async () => {
    const currentState = store.getState();
    const currentSubscription = currentState?.membership?.subscription;

    if (currentSubscription?._id) {
      const revalidation = await validateSubscription(currentSubscription, includeStoreValidation);

      if (!revalidation.isValid || revalidation.isExpired) {
        await handleSubscriptionExpiry(currentSubscription);
      } else {
        scheduleSubscriptionCheck(currentSubscription);
      }
    }
  }, checkDelay);

  // Handle iOS grace period separately
  if (subscription.payment_response.platform === 'ios' && subscription.payment_response.gracePeriodExpiresDate) {
    const gracePeriodTime = subscription.payment_response.gracePeriodExpiresDate - Date.now();

    if (gracePeriodTime > 0 && gracePeriodTime < timeUntilExpiry) {
      gracePeriodTimeout = setTimeout(async () => {
        console.log('Grace period expired, forcing validation');
        const finalValidation = await validateSubscription(subscription, true);
        if (!finalValidation.isValid) {
          await handleSubscriptionExpiry(subscription);
        }
      }, gracePeriodTime);
    }
  }
};

/**
 * Start periodic background validation
 */
const startPeriodicValidation = (): void => {
  if (periodicValidationInterval) {
    clearInterval(periodicValidationInterval);
  }

  // Check every 6 hours
  periodicValidationInterval = setInterval(
    async () => {
      const state = store.getState();
      const subscription = state?.membership?.subscription;

      if (subscription?._id) {
        const validation = await validateSubscription(subscription, true);

        if (!validation.isValid || validation.isExpired) {
          await handleSubscriptionExpiry(subscription);
        } else if (validation.needsRenewal) {
          console.log('Subscription needs renewal, performing store validation');
          // Additional store validation is already included above
        }
      }
    },
    6 * 60 * 60 * 1000
  );
};

/**
 * Main subscription fetcher with unified validation
 */
export const getSubscription = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return false;
    }

    store.dispatch(fetchSubscriptionRequest());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const dataToSend = {
      eventName: 'get_purchase',
      user_id: store.getState()?.user?._id || '',
      include_validation: true,
      timestamp: Date.now(),
    };

    const response = await UserService.UserRegister(dataToSend);
    clearTimeout(timeoutId);

    if (response?.code !== 200) {
      store.dispatch(fetchSubscriptionFailure('Invalid response'));
      return false;
    }

    const subscriptionData = response.data;

    if (subscriptionData?._id) {
      const validation = await validateSubscription(subscriptionData, true);

      if (validation.isValid) {
        store.dispatch(fetchSubscriptionSuccess(subscriptionData));
        scheduleSubscriptionCheck(subscriptionData);
      } else {
        await handleSubscriptionExpiry(subscriptionData);
        store.dispatch(fetchSubscriptionSuccess(null));
      }
    } else {
      store.dispatch(fetchSubscriptionSuccess(null));
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    store.dispatch(fetchSubscriptionFailure(errorMessage));
    return false;
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (purchaseId: string): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return false;
    }

    const dataToSend = { eventName: 'cancel_purchase', purchase_id: purchaseId };
    const response = await UserService.UserRegister(dataToSend);

    if (response?.code === 200) {
      await debouncedGetSubscription(0);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return false;
  }
};

/**
 * Get detailed subscription status
 */
export const getDetailedSubscriptionStatus = async (): Promise<{
  hasSubscription: boolean;
  isActive: boolean;
  isExpired: boolean;
  needsRenewal: boolean;
  daysUntilExpiry: number;
  expiryDate: Date | null;
  platform: string;
  storeValidation?: any;
}> => {
  const state = store.getState();
  const subscription = state?.membership?.subscription;

  if (!subscription) {
    return {
      hasSubscription: false,
      isActive: false,
      isExpired: true,
      needsRenewal: false,
      daysUntilExpiry: 0,
      expiryDate: null,
      platform: 'unknown',
    };
  }

  const validation = await validateSubscription(subscription, true);

  return {
    hasSubscription: true,
    isActive: validation.isValid,
    isExpired: validation.isExpired,
    needsRenewal: validation.needsRenewal,
    daysUntilExpiry: validation.daysUntilExpiry,
    expiryDate: validation.expiryTimestamp ? new Date(validation.expiryTimestamp) : null,
    platform: subscription.payment_response.platform || 'unknown',
    storeValidation: validation.storeValidation,
  };
};

/**
 * Force validate subscription with store
 */
export const forceValidateSubscription = async (): Promise<{
  isValid: boolean;
  error?: string;
  details?: any;
}> => {
  const state = store.getState();
  const subscription = state?.membership?.subscription;

  if (!subscription) {
    return { isValid: false, error: 'No subscription found' };
  }

  try {
    const validation = await validateSubscription(subscription, true);

    if (!validation.isValid) {
      await handleSubscriptionExpiry(subscription);
    }

    return {
      isValid: validation.isValid,
      error: validation.storeValidation?.error,
      details: validation.storeValidation?.storeData,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
};

/**
 * Check if user has active subscription
 */
export const hasActiveSubscription = (): boolean => {
  const state = store.getState();
  return state?.membership?.isSubscriptionActive || false;
};

/**
 * Debounced subscription fetcher
 */
export const debouncedGetSubscription = (delayMs = 300): Promise<boolean> => {
  return new Promise((resolve) => {
    if (fetchTimeout) {
      clearTimeout(fetchTimeout);
    }

    fetchTimeout = setTimeout(async () => {
      const result = await getSubscription();
      resolve(result);
      fetchTimeout = null;
    }, delayMs);
  });
};

/**
 * Clear subscription-specific timers
 */
const clearSubscriptionTimers = (): void => {
  if (subscriptionCheckTimeout) {
    clearTimeout(subscriptionCheckTimeout);
    subscriptionCheckTimeout = null;
  }

  if (gracePeriodTimeout) {
    clearTimeout(gracePeriodTimeout);
    gracePeriodTimeout = null;
  }
};

/**
 * Clear all timers
 */
const clearAllTimers = (): void => {
  clearSubscriptionTimers();

  if (periodicValidationInterval) {
    clearInterval(periodicValidationInterval);
    periodicValidationInterval = null;
  }

  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
    fetchTimeout = null;
  }
};

/**
 * Initialize subscription monitoring
 */
export const initializeSubscriptionMonitoring = async (): Promise<void> => {
  console.log('Initializing unified subscription monitoring');

  // Clear any existing timers
  clearAllTimers();

  // Fetch current subscription with validation
  await getSubscription();

  // Start periodic background validation
  startPeriodicValidation();
};

// Export cleanup function with different name to avoid confusion
export const cleanupSubscriptionService = (): void => {
  clearAllTimers();
};
