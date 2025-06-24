import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import {
  fetchSubscriptionFailure,
  fetchSubscriptionRequest,
  fetchSubscriptionSuccess,
} from '../Redux/Reducer/membershipReducer';
import { store } from '../Redux/Store/store';
import { SubscriptionData } from '../Types/SubscriptionTypes';
import UserService from './AuthService';

const SHARED_IOS_SECRET = '902f584208a741a78015a878caaf2660';

// Unified timer management
let subscriptionCheckTimeout: NodeJS.Timeout | null = null;
let periodicValidationInterval: NodeJS.Timeout | null = null;
let gracePeriodTimeout: NodeJS.Timeout | null = null;
let fetchTimeout: NodeJS.Timeout | null = null;

/**
 * Validate iOS receipt using Apple's validation service
 */
const validateIOSReceipt = async (
  purchaseHistory: any[]
): Promise<{
  isValid: boolean;
  isExpired: boolean;
  expirationDate?: number;
  error?: string;
}> => {
  if (!SHARED_IOS_SECRET) {
    console.log('No shared iOS secret available.');
    return { isValid: false, isExpired: true, error: 'No shared secret' };
  }

  if (!purchaseHistory || purchaseHistory.length === 0) {
    return { isValid: false, isExpired: true, error: 'No purchase history' };
  }

  try {
    const latestPurchase = purchaseHistory[purchaseHistory.length - 1];

    if (!latestPurchase.transactionReceipt) {
      return { isValid: false, isExpired: true, error: 'No transaction receipt' };
    }

    const receiptValidation = await RNIap.validateReceiptIos({
      receiptBody: {
        'receipt-data': latestPurchase.transactionReceipt,
        password: SHARED_IOS_SECRET,
      },
      isTest: __DEV__,
    });

    if (!receiptValidation.latest_receipt_info || receiptValidation.latest_receipt_info.length === 0) {
      return { isValid: false, isExpired: true, error: 'No receipt info from Apple' };
    }

    const renewalHistory = receiptValidation.latest_receipt_info;
    const latestRenewal = renewalHistory[renewalHistory.length - 1];
    const expirationMs = parseInt(latestRenewal.expires_date_ms);
    const currentTime = Date.now();

    const isExpired = expirationMs < currentTime;

    console.log('iOS Receipt Validation Result:', {
      expirationDate: new Date(expirationMs),
      currentTime: new Date(currentTime),
      isExpired,
      productId: latestRenewal.product_id,
    });

    return {
      isValid: !isExpired,
      isExpired,
      expirationDate: expirationMs,
    };
  } catch (error) {
    console.log(`Error, unable to validate iOS subscription receipt:`, error);
    return {
      isValid: false,
      isExpired: true,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
};

/**
 * Enhanced iOS validation with mobile-side receipt checking
 */
const validateIOSSubscriptionMobile = async (
  subscription: SubscriptionData
): Promise<{
  isValid: boolean;
  isExpired: boolean;
  error?: string;
  source: 'apple' | 'local';
  expirationDate?: number;
}> => {
  try {
    const { payment_response } = subscription;

    // First, try to get current purchase history from the device
    let purchaseHistory: any[] = [];

    try {
      // Get available purchases from device
      const availablePurchases = await RNIap.getAvailablePurchases();

      if (availablePurchases && availablePurchases.length > 0) {
        purchaseHistory = availablePurchases;
        console.log('Found available purchases on device:', availablePurchases.length);
      } else {
        // Fallback to stored receipt data
        const receiptData = payment_response.receiptData || payment_response.transactionReceipt;
        if (receiptData) {
          purchaseHistory = [{ transactionReceipt: receiptData }];
        }
      }
    } catch (purchaseError) {
      console.log('Could not fetch available purchases:', purchaseError);

      // Use stored receipt as fallback
      const receiptData = payment_response.receiptData || payment_response.transactionReceipt;
      if (receiptData) {
        purchaseHistory = [{ transactionReceipt: receiptData }];
      }
    }

    if (purchaseHistory.length === 0) {
      return {
        isValid: false,
        isExpired: true,
        error: 'No purchase history available',
        source: 'local',
      };
    }

    // Validate with Apple's servers
    const appleValidation = await validateIOSReceipt(purchaseHistory);

    if (appleValidation.error) {
      console.log('Apple validation failed, falling back to local validation');

      // Fallback to local validation using stored expiry data
      const localExpiry = payment_response.expiresDate || payment_response.gracePeriodExpiresDate || 0;
      const isLocalExpired = localExpiry <= Date.now();

      return {
        isValid: !isLocalExpired,
        isExpired: isLocalExpired,
        error: `Apple validation failed: ${appleValidation.error}`,
        source: 'local',
        expirationDate: localExpiry,
      };
    }

    return {
      isValid: appleValidation.isValid,
      isExpired: appleValidation.isExpired,
      source: 'apple',
      expirationDate: appleValidation.expirationDate,
    };
  } catch (error) {
    console.log('iOS mobile validation error:', error);

    // Final fallback to local stored data
    const localExpiry =
      subscription.payment_response.expiresDate || subscription.payment_response.gracePeriodExpiresDate || 0;
    const isLocalExpired = localExpiry <= Date.now();

    return {
      isValid: !isLocalExpired,
      isExpired: isLocalExpired,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'local',
      expirationDate: localExpiry,
    };
  }
};

/**
 * Enhanced platform store validation with mobile-side iOS validation
 */
const validateWithPlatformStore = async (
  subscription: SubscriptionData
): Promise<{
  isValid: boolean;
  error?: string;
  storeData?: any;
  source?: string;
}> => {
  try {
    const { payment_response } = subscription;

    if (Platform.OS === 'ios') {
      // Use enhanced mobile-side iOS validation
      const iosValidation = await validateIOSSubscriptionMobile(subscription);

      return {
        isValid: iosValidation.isValid,
        error: iosValidation.error,
        source: iosValidation.source,
        storeData: {
          expiresDate: iosValidation.expirationDate,
          isExpired: iosValidation.isExpired,
          validationSource: iosValidation.source,
          originalExpiresDate: payment_response.expiresDate,
          gracePeriodExpiresDate: payment_response.gracePeriodExpiresDate,
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

      const isValid =
        purchaseToken &&
        (payment_response.purchaseState === 1 || payment_response.purchaseState === 0) &&
        purchaseTime > 0;

      return {
        isValid,
        source: 'android_local',
        storeData: {
          purchaseTime,
          purchaseState: payment_response.purchaseState,
          autoRenewing: payment_response.autoRenewing,
        },
      };
    }

    return { isValid: false, error: 'Unsupported platform' };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
};

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
    source?: string;
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
  let expiryTimestamp = calculateExpiryTimestamp(subscription);

  let storeValidation;
  if (includeStoreValidation) {
    storeValidation = await validateWithPlatformStore(subscription);

    // If we have a more recent expiry from store validation, use it
    if (storeValidation.storeData?.expiresDate && storeValidation.storeData.expiresDate > expiryTimestamp) {
      expiryTimestamp = storeValidation.storeData.expiresDate;
    }
  }

  const daysUntilExpiry = Math.floor((expiryTimestamp - currentTime) / (1000 * 60 * 60 * 24));
  const isExpired = expiryTimestamp <= currentTime;
  const isValidState = payment_response.purchaseState === 1 || payment_response?.purchaseState === 'purchased';
  const isAutoRenewing = payment_response.autoRenewing !== false;

  // For iOS, prioritize store validation result when available
  const finalIsValid =
    Platform.OS === 'ios' && storeValidation?.isValid !== undefined
      ? storeValidation.isValid
      : isValidState && !isExpired && storeValidation?.isValid !== false;

  return {
    isValid: finalIsValid,
    isExpired,
    needsRenewal: daysUntilExpiry <= 3 && isAutoRenewing,
    daysUntilExpiry: Math.max(0, daysUntilExpiry),
    expiryTimestamp,
    storeValidation,
  };
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
 * Handle subscription expiry with proper cleanup and iOS-specific handling
 */
const handleSubscriptionExpiry = async (subscription: SubscriptionData): Promise<void> => {
  try {
    console.log('Handling subscription expiry for:', subscription._id);

    // For iOS, always do a final mobile validation before marking as expired
    if (Platform.OS === 'ios') {
      console.log('Performing final iOS validation before expiry');
      const finalIOSValidation = await validateIOSSubscriptionMobile(subscription);

      if (finalIOSValidation.isValid) {
        console.log('iOS subscription is still valid, rescheduling check');
        scheduleSubscriptionCheck(subscription);
        return;
      }

      console.log('iOS subscription confirmed expired:', finalIOSValidation);
    } else {
      // For Android, do final store validation
      const storeValidation = await validateWithPlatformStore(subscription);

      if (storeValidation.isValid) {
        console.log('Android subscription is still valid, rescheduling check');
        scheduleSubscriptionCheck(subscription);
        return;
      }
    }

    // Cancel the subscription
    const cancelled = await cancelSubscription(subscription._id);

    if (cancelled) {
      clearAllTimers();
      console.log('Subscription cancelled successfully');

      // Refresh subscription data after cancellation
      await getSubscription();
    }
  } catch (error) {
    console.log('Error handling subscription expiry:', error);
  }
};

/**
 * Enhanced subscription fetcher with mobile-side validation fallback
 */
export const getSubscription = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('No network connection, skipping API call');

      // If offline, try to validate existing subscription using mobile-side validation
      const state = store.getState();
      const existingSubscription = state?.membership?.subscription;

      if (existingSubscription && Platform.OS === 'ios') {
        const mobileValidation = await validateIOSSubscriptionMobile(existingSubscription);
        if (mobileValidation.isValid) {
          console.log('Offline iOS validation successful');
          return true;
        }
      }

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

    console.log('response:', response);
    clearTimeout(timeoutId);

    // Handle API returning false or invalid response
    if (response?.code !== 200 || !response?.data) {
      console.log('API returned false or invalid response, checking mobile-side validation');

      // Get existing subscription from state
      const state = store.getState();
      const existingSubscription = state?.membership?.subscription;

      console.log('existingSubscription:', existingSubscription);

      if (Platform.OS === 'ios') {
        if (existingSubscription) {
          console.log('Attempting mobile-side iOS validation (existing subscription)');
          const mobileValidation = await validateIOSSubscriptionMobile(existingSubscription);

          console.log('mobileValidation:', mobileValidation);

          if (mobileValidation.isValid) {
            console.log('Mobile-side validation successful, keeping subscription active');
            store.dispatch(fetchSubscriptionSuccess(existingSubscription));
            scheduleSubscriptionCheck(existingSubscription);
            return true;
          } else {
            console.log('Mobile-side validation failed:', mobileValidation.error);
          }
        } else {
          // No local subscription, try to fetch from device receipts
          try {
            console.log('No local subscription, attempting to fetch available purchases from device');
            const availablePurchases = await RNIap.getAvailablePurchases();
            if (availablePurchases && availablePurchases.length > 0) {
              // Try to find a valid subscription from available purchases
              for (const purchase of availablePurchases) {
                const iosValidation = await validateIOSReceipt([purchase]);
                if (iosValidation.isValid && !iosValidation.isExpired) {
                  // Construct a SubscriptionData object from purchase
                  const subscriptionData: SubscriptionData = {
                    _id: purchase.transactionId || purchase.productId || 'local-ios',
                    payment_response: {
                      ...purchase,
                      platform: 'ios',
                      expiresDate: iosValidation.expirationDate,
                    },
                  } as any; // Cast as any if SubscriptionData is strict
                  console.log('Found valid iOS subscription from device:', subscriptionData);
                  store.dispatch(fetchSubscriptionSuccess(subscriptionData));
                  scheduleSubscriptionCheck(subscriptionData);
                  return true;
                }
              }
              console.log('No valid iOS subscription found in device receipts');
            } else {
              console.log('No available purchases found on device');
            }
          } catch (deviceError) {
            console.log('Error fetching available purchases from device:', deviceError);
          }
        }
      }

      store.dispatch(fetchSubscriptionFailure('API validation failed and mobile validation unsuccessful'));
      return false;
    }

    const subscriptionData = response.data;

    if (subscriptionData?._id) {
      const validation = await validateSubscription(subscriptionData, true);

      if (validation.isValid) {
        store.dispatch(fetchSubscriptionSuccess(subscriptionData));
        scheduleSubscriptionCheck(subscriptionData);
        console.log('Subscription validated and scheduled for monitoring');
      } else {
        console.log('Subscription validation failed, handling expiry');
        await handleSubscriptionExpiry(subscriptionData);
        store.dispatch(fetchSubscriptionSuccess(null));
      }
    } else {
      store.dispatch(fetchSubscriptionSuccess(null));
    }

    return true;
  } catch (error) {
    console.log('Error in getSubscription:', error);

    // On error, try mobile-side validation as fallback
    const state = store.getState();
    const existingSubscription = state?.membership?.subscription;

    if (existingSubscription && Platform.OS === 'ios') {
      console.log('API error occurred, trying mobile-side validation');
      const mobileValidation = await validateIOSSubscriptionMobile(existingSubscription);

      if (mobileValidation.isValid) {
        console.log('Mobile-side validation successful despite API error');
        return true;
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    store.dispatch(fetchSubscriptionFailure(errorMessage));
    return false;
  }
};

/**
 * Force validate iOS subscription using mobile receipt validation
 */
export const forceValidateIOSSubscription = async (): Promise<{
  isValid: boolean;
  error?: string;
  details?: any;
}> => {
  if (Platform.OS !== 'ios') {
    return { isValid: false, error: 'Not an iOS device' };
  }

  const state = store.getState();
  const subscription = state?.membership?.subscription;

  if (!subscription) {
    return { isValid: false, error: 'No subscription found' };
  }

  try {
    const validation = await validateIOSSubscriptionMobile(subscription);

    return {
      isValid: validation.isValid,
      error: validation.error,
      details: {
        source: validation.source,
        expirationDate: validation.expirationDate ? new Date(validation.expirationDate) : null,
        isExpired: validation.isExpired,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
};

// ... (keep all the existing functions unchanged)

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
          console.log('Subscription needs renewal soon');
        }
      }
    },
    6 * 60 * 60 * 1000
  );
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
  // Clear any existing timers
  clearAllTimers();

  // Fetch current subscription with validation
  await getSubscription();

  // Start periodic background validation
  startPeriodicValidation();
};

// Export cleanup function
export const cleanupSubscriptionService = (): void => {
  clearAllTimers();
};
