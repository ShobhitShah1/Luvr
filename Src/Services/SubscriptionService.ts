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
 * Helper function to format dates for logging
 */
const formatDateForLog = (timestamp: number): string => {
  if (!timestamp || timestamp <= 0) return 'Invalid/No Date';
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
};

/**
 * Helper function to format duration for logging
 */
const formatDurationForLog = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Expired';

  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
};

/**
 * Log subscription status with detailed information
 */
const logSubscriptionStatus = (
  subscription: SubscriptionData | null,
  validation?: any,
  context: string = 'Subscription Status'
): void => {
  console.log(`\n🔍 [${context}] ==========================================`);

  if (!subscription) {
    console.log('❌ No subscription found');
    console.log('==========================================\n');
    return;
  }

  const { payment_response } = subscription;
  const currentTime = Date.now();

  console.log(`📱 Platform: ${payment_response?.platform || 'Unknown'}`);
  console.log(`🆔 Subscription ID: ${subscription._id || 'N/A'}`);
  console.log(`📦 Product ID: ${payment_response?.productId || 'N/A'}`);
  console.log(`💰 Purchase State: ${payment_response?.purchaseState || 'N/A'}`);
  console.log(`🔄 Auto Renewing: ${payment_response?.autoRenewing ? 'Yes' : 'No'}`);

  // Transaction dates
  if (payment_response?.transactionDate) {
    console.log(`📅 Transaction Date: ${formatDateForLog(payment_response.transactionDate)}`);
  }

  if (payment_response?.expiresDate) {
    console.log(`⏰ Expires Date: ${formatDateForLog(payment_response.expiresDate)}`);
  }

  if (payment_response?.gracePeriodExpiresDate) {
    console.log(`🛡️ Grace Period Expires: ${formatDateForLog(payment_response.gracePeriodExpiresDate)}`);
  }

  // Current time
  console.log(`🕐 Current Time: ${formatDateForLog(currentTime)}`);

  if (validation) {
    console.log(`\n✅ Validation Results:`);
    console.log(`   Active: ${validation.isValid ? '✅ Yes' : '❌ No'}`);
    console.log(`   Expired: ${validation.isExpired ? '❌ Yes' : '✅ No'}`);
    console.log(`   Needs Renewal: ${validation.needsRenewal ? '⚠️ Yes' : '✅ No'}`);
    console.log(`   Days Until Expiry: ${validation.daysUntilExpiry}`);
    console.log(`   Time Until Expiry: ${formatDurationForLog(validation.expiryTimestamp - currentTime)}`);

    if (validation.storeValidation) {
      console.log(`\n🏪 Store Validation:`);
      console.log(`   Valid: ${validation.storeValidation.isValid ? '✅ Yes' : '❌ No'}`);
      if (validation.storeValidation.error) {
        console.log(`   Error: ${validation.storeValidation.error}`);
      }
      if (validation.storeValidation.storeData) {
        console.log(`   Store Data:`, validation.storeValidation.storeData);
      }
    }
  }

  console.log('==========================================\n');
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
  };
}> => {
  console.log('🔍 [VALIDATE] Starting subscription validation...');

  if (!subscription?.payment_response) {
    console.log('❌ [VALIDATE] No payment response found');
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

  console.log(`⏰ [VALIDATE] Calculated expiry timestamp: ${formatDateForLog(expiryTimestamp)}`);

  const daysUntilExpiry = Math.floor((expiryTimestamp - currentTime) / (1000 * 60 * 60 * 24));
  const isExpired = expiryTimestamp <= currentTime;
  const isValidState = payment_response.purchaseState === 1 || payment_response?.purchaseState === 'purchased';
  const isAutoRenewing = payment_response.autoRenewing !== false;

  console.log(`📊 [VALIDATE] Days until expiry: ${daysUntilExpiry}`);
  console.log(`📊 [VALIDATE] Is expired: ${isExpired}`);
  console.log(`📊 [VALIDATE] Valid state: ${isValidState}`);
  console.log(`📊 [VALIDATE] Auto renewing: ${isAutoRenewing}`);

  let storeValidation;
  if (includeStoreValidation) {
    console.log('🏪 [VALIDATE] Including store validation...');
    storeValidation = await validateWithPlatformStore(subscription);
    console.log(`🏪 [VALIDATE] Store validation result: ${storeValidation.isValid ? 'Valid' : 'Invalid'}`);
  }

  const finalValidation = {
    isValid: isValidState && !isExpired && storeValidation?.isValid !== false,
    isExpired,
    needsRenewal: daysUntilExpiry <= 3 && isAutoRenewing,
    daysUntilExpiry: Math.max(0, daysUntilExpiry),
    expiryTimestamp,
    storeValidation,
  };

  console.log(`✅ [VALIDATE] Final validation result: ${finalValidation.isValid ? 'Valid' : 'Invalid'}`);

  return finalValidation;
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
  console.log(`🏪 [STORE_VALIDATE] Starting platform store validation for ${Platform.OS}`);

  try {
    const { payment_response } = subscription;

    if (Platform.OS === 'ios') {
      console.log('🍎 [STORE_VALIDATE] iOS validation logic');
      const receiptData = payment_response.receiptData || payment_response.transactionReceipt;
      if (!receiptData) {
        console.log('❌ [STORE_VALIDATE] No receipt data available for iOS');
        return { isValid: false, error: 'No receipt data available' };
      }

      // iOS validation logic
      const expiresDate = payment_response.expiresDate || 0;
      const gracePeriodExpiresDate = payment_response.gracePeriodExpiresDate || 0;
      const currentTime = Date.now();

      console.log(`🍎 [STORE_VALIDATE] iOS expires date: ${formatDateForLog(expiresDate)}`);
      console.log(`🍎 [STORE_VALIDATE] iOS grace period expires: ${formatDateForLog(gracePeriodExpiresDate)}`);

      // Consider grace period for iOS
      const effectiveExpiryDate = Math.max(expiresDate, gracePeriodExpiresDate);
      const isValid = effectiveExpiryDate > currentTime;

      console.log(`🍎 [STORE_VALIDATE] iOS effective expiry: ${formatDateForLog(effectiveExpiryDate)}`);
      console.log(`🍎 [STORE_VALIDATE] iOS validation result: ${isValid ? 'Valid' : 'Invalid'}`);

      return {
        isValid,
        storeData: {
          expiresDate,
          gracePeriodExpiresDate,
          isInGracePeriod: gracePeriodExpiresDate > currentTime && expiresDate <= currentTime,
        },
      };
    } else if (Platform.OS === 'android') {
      console.log('🤖 [STORE_VALIDATE] Android validation logic');
      const purchaseToken = payment_response.purchaseToken;
      const productId = payment_response.productId;

      if (!purchaseToken || !productId) {
        console.log('❌ [STORE_VALIDATE] Missing purchase token or product ID for Android');
        return { isValid: false, error: 'Missing purchase token or product ID' };
      }

      // Android validation logic
      const currentTime = Date.now();
      const purchaseTime = payment_response.transactionDate || payment_response.purchaseTime || 0;

      console.log(`🤖 [STORE_VALIDATE] Android purchase time: ${formatDateForLog(purchaseTime)}`);
      console.log(`🤖 [STORE_VALIDATE] Android purchase state: ${payment_response.purchaseState}`);

      // For Android, we consider the subscription valid if:
      // 1. It has a valid purchase token
      // 2. The purchase state is 1 (purchased) or 0 (pending)
      // 3. The purchase time is valid
      const isValid =
        purchaseToken &&
        (payment_response.purchaseState === 1 || payment_response.purchaseState === 0) &&
        purchaseTime > 0;

      console.log(`🤖 [STORE_VALIDATE] Android validation result: ${isValid ? 'Valid' : 'Invalid'}`);

      return {
        isValid,
        storeData: {
          purchaseTime,
          purchaseState: payment_response.purchaseState,
          autoRenewing: payment_response.autoRenewing,
        },
      };
    }

    console.log('❌ [STORE_VALIDATE] Unsupported platform');
    return { isValid: false, error: 'Unsupported platform' };
  } catch (error) {
    console.log(`❌ [STORE_VALIDATE] Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // For iOS: Try gracePeriodExpiresDate, then expiresDate, then fallback
  if (payment_response.platform === 'ios') {
    if (payment_response.gracePeriodExpiresDate && payment_response.gracePeriodExpiresDate !== null) {
      return payment_response.gracePeriodExpiresDate;
    }
    if (payment_response.expiresDate && payment_response.expiresDate !== null) {
      return payment_response.expiresDate;
    }
    // Fallback for iOS: use transactionDate + period
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
    const calculatedExpiry = transactionDate + periodInDays * 24 * 60 * 60 * 1000;
    return calculatedExpiry;
  }

  // For Android and others, keep existing logic
  if (payment_response.expiresDate && payment_response.expiresDate !== null) {
    return payment_response.expiresDate;
  }
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
  const calculatedExpiry = transactionDate + periodInDays * 24 * 60 * 60 * 1000;
  return calculatedExpiry;
};

/**
 * Handle subscription expiry with proper cleanup
 */
const handleSubscriptionExpiry = async (subscription: SubscriptionData): Promise<void> => {
  console.log('⚠️ [EXPIRY] Handling subscription expiry...');
  logSubscriptionStatus(subscription, null, 'EXPIRY HANDLER');

  try {
    // Final validation with store before cancellation
    console.log('🔍 [EXPIRY] Performing final store validation...');
    const storeValidation = await validateWithPlatformStore(subscription);

    if (storeValidation.isValid) {
      console.log('✅ [EXPIRY] Store validation passed, scheduling next check...');
      scheduleSubscriptionCheck(subscription);
      return;
    }

    console.log('❌ [EXPIRY] Store validation failed, cancelling subscription...');
    // Cancel the subscription
    const cancelled = await cancelSubscription(subscription._id);

    if (cancelled) {
      console.log('✅ [EXPIRY] Subscription cancelled successfully');
      clearAllTimers();
      // Instead of calling getSubscription again, update the Redux state to null to break the loop
      store.dispatch(fetchSubscriptionSuccess(null));
    } else {
      console.log('❌ [EXPIRY] Failed to cancel subscription');
    }
  } catch (error) {
    console.log(`❌ [EXPIRY] Error handling expiry: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
 * Main subscription fetcher with unified validation
 */
export const getSubscription = async (): Promise<boolean> => {
  console.log('📡 [FETCH] Starting subscription fetch...');

  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      console.log('❌ [FETCH] No internet connection');
      return false;
    }

    console.log('✅ [FETCH] Internet connection available');
    store.dispatch(fetchSubscriptionRequest());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const dataToSend = {
      eventName: 'get_purchase',
      include_validation: false,
      timestamp: Date.now(),
    };

    console.log('📡 [FETCH] Sending API request...');
    const response = await UserService.UserRegister(dataToSend);
    clearTimeout(timeoutId);

    if (response?.code !== 200) {
      console.log(`❌ [FETCH] Invalid response code: ${response?.code}`);
      store.dispatch(fetchSubscriptionFailure('Invalid response'));
      return false;
    }

    console.log('✅ [FETCH] API response received successfully');
    const subscriptionData = response.data;

    if (subscriptionData?._id) {
      console.log('🔍 [FETCH] Subscription data found, validating...');
      const validation = await validateSubscription(subscriptionData, true);

      logSubscriptionStatus(subscriptionData, validation, 'FETCH RESULT');

      if (validation.isValid) {
        console.log('✅ [FETCH] Subscription is valid, dispatching success...');
        store.dispatch(fetchSubscriptionSuccess(subscriptionData));
        scheduleSubscriptionCheck(subscriptionData);
      } else {
        console.log('❌ [FETCH] Subscription is invalid, dispatching null...');
        // await handleSubscriptionExpiry(subscriptionData);
        store.dispatch(fetchSubscriptionSuccess(null));
      }
    } else {
      console.log('❌ [FETCH] No subscription data found, dispatching null...');
      store.dispatch(fetchSubscriptionSuccess(null));
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`❌ [FETCH] Error fetching subscription: ${errorMessage}`);
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
  console.log('📊 [DETAILED_STATUS] Getting detailed subscription status...');

  const state = store.getState();
  const subscription = state?.membership?.subscription;

  if (!subscription) {
    console.log('❌ [DETAILED_STATUS] No subscription found in store');
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

  console.log('🔍 [DETAILED_STATUS] Validating subscription...');
  const validation = await validateSubscription(subscription, true);

  logSubscriptionStatus(subscription, validation, 'DETAILED_STATUS');

  const result = {
    hasSubscription: true,
    isActive: validation.isValid,
    isExpired: validation.isExpired,
    needsRenewal: validation.needsRenewal,
    daysUntilExpiry: validation.daysUntilExpiry,
    expiryDate: validation.expiryTimestamp ? new Date(validation.expiryTimestamp) : null,
    platform: subscription.payment_response.platform || 'unknown',
    storeValidation: validation.storeValidation,
  };

  console.log('📊 [DETAILED_STATUS] Status result:', result);
  return result;
};

/**
 * Force validate subscription with store
 */
export const forceValidateSubscription = async (): Promise<{
  isValid: boolean;
  error?: string;
  details?: any;
}> => {
  console.log('🔍 [FORCE_VALIDATE] Force validating subscription...');

  const state = store.getState();
  const subscription = state?.membership?.subscription;

  if (!subscription) {
    console.log('❌ [FORCE_VALIDATE] No subscription found');
    return { isValid: false, error: 'No subscription found' };
  }

  try {
    console.log('🔍 [FORCE_VALIDATE] Performing validation with store...');
    const validation = await validateSubscription(subscription, true);

    logSubscriptionStatus(subscription, validation, 'FORCE_VALIDATE');

    if (!validation.isValid) {
      console.log('❌ [FORCE_VALIDATE] Validation failed, handling expiry...');
      await handleSubscriptionExpiry(subscription);
    }

    const result = {
      isValid: validation.isValid,
      error: validation.storeValidation?.error,
      details: validation.storeValidation?.storeData,
    };

    console.log('📊 [FORCE_VALIDATE] Force validation result:', result);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Validation failed';
    console.log(`❌ [FORCE_VALIDATE] Error: ${errorMessage}`);
    return {
      isValid: false,
      error: errorMessage,
    };
  }
};

/**
 * Check if user has active subscription
 */
export const hasActiveSubscription = (): boolean => {
  const state = store.getState();
  const isActive = state?.membership?.isSubscriptionActive || false;
  console.log(`🔍 [HAS_ACTIVE] Subscription active: ${isActive ? 'Yes' : 'No'}`);
  return isActive;
};

/**
 * Debounced subscription fetcher
 */
export const debouncedGetSubscription = (delayMs = 300): Promise<boolean> => {
  console.log(`⏰ [DEBOUNCE] Debouncing subscription fetch with ${delayMs}ms delay`);

  return new Promise((resolve) => {
    if (fetchTimeout) {
      console.log('⏰ [DEBOUNCE] Clearing existing timeout');
      clearTimeout(fetchTimeout);
    }

    fetchTimeout = setTimeout(async () => {
      console.log('⏰ [DEBOUNCE] Debounced fetch triggered');
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
  console.log('🧹 [CLEAR_TIMERS] Clearing subscription timers...');

  if (subscriptionCheckTimeout) {
    console.log('🧹 [CLEAR_TIMERS] Clearing subscription check timeout');
    clearTimeout(subscriptionCheckTimeout);
    subscriptionCheckTimeout = null;
  }

  if (gracePeriodTimeout) {
    console.log('🧹 [CLEAR_TIMERS] Clearing grace period timeout');
    clearTimeout(gracePeriodTimeout);
    gracePeriodTimeout = null;
  }
};

/**
 * Clear all timers
 */
const clearAllTimers = (): void => {
  console.log('🧹 [CLEAR_ALL] Clearing all timers...');

  clearSubscriptionTimers();

  if (periodicValidationInterval) {
    console.log('🧹 [CLEAR_ALL] Clearing periodic validation interval');
    clearInterval(periodicValidationInterval);
    periodicValidationInterval = null;
  }

  if (fetchTimeout) {
    console.log('🧹 [CLEAR_ALL] Clearing fetch timeout');
    clearTimeout(fetchTimeout);
    fetchTimeout = null;
  }
};

/**
 * Initialize subscription monitoring
 */
export const initializeSubscriptionMonitoring = async (): Promise<void> => {
  console.log('🚀 [INIT] Initializing subscription monitoring...');

  // Clear any existing timers
  clearAllTimers();

  // Fetch current subscription with validation
  console.log('📡 [INIT] Fetching current subscription...');
  await getSubscription();

  console.log('✅ [INIT] Subscription monitoring initialized');
};

// Export cleanup function with different name to avoid confusion
export const cleanupSubscriptionService = (): void => {
  console.log('🧹 [CLEANUP] Cleaning up subscription service...');
  clearAllTimers();
  console.log('✅ [CLEANUP] Subscription service cleaned up');
};
