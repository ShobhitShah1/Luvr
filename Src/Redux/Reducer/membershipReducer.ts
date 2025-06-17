import { SubscriptionData, MembershipState } from '../../Types/SubscriptionTypes';

export const FETCH_SUBSCRIPTION_REQUEST = 'FETCH_SUBSCRIPTION_REQUEST';
export const FETCH_SUBSCRIPTION_SUCCESS = 'FETCH_SUBSCRIPTION_SUCCESS';
export const FETCH_SUBSCRIPTION_FAILURE = 'FETCH_SUBSCRIPTION_FAILURE';
export const RESET_SUBSCRIPTION = 'RESET_SUBSCRIPTION';
export const SET_SUBSCRIPTION_EXPIRED = 'SET_SUBSCRIPTION_EXPIRED';
export const SET_SUBSCRIPTION_CANCELLED = 'SET_SUBSCRIPTION_CANCELLED';
export const SET_SUBSCRIPTION_VALIDATION_STATUS = 'SET_SUBSCRIPTION_VALIDATION_STATUS';

export const setSubscriptionExpired = (payload: { subscriptionId: string; expiredAt: number }) => ({
  type: SET_SUBSCRIPTION_EXPIRED,
  payload,
});

export const setSubscriptionCancelled = (payload: { subscriptionId: string; cancelledAt: number; reason: string }) => ({
  type: SET_SUBSCRIPTION_CANCELLED,
  payload,
});

export const setSubscriptionValidationStatus = (payload: {
  isValid: boolean;
  lastValidated: number;
  validationError?: string;
}) => ({
  type: SET_SUBSCRIPTION_VALIDATION_STATUS,
  payload,
});

export const fetchSubscriptionRequest = () => ({
  type: FETCH_SUBSCRIPTION_REQUEST,
});

export const fetchSubscriptionSuccess = (subscription: SubscriptionData | null) => ({
  type: FETCH_SUBSCRIPTION_SUCCESS,
  payload: subscription,
});

export const fetchSubscriptionFailure = (error: string) => ({
  type: FETCH_SUBSCRIPTION_FAILURE,
  payload: error,
});

export const resetSubscription = () => ({
  type: RESET_SUBSCRIPTION,
});

const initialState: MembershipState = {
  subscription: null,
  isSubscriptionActive: false,
  isLoading: false,
  error: null,
  lastExpiredSubscriptionId: undefined,
  lastCancelledSubscription: undefined,
  validationStatus: {
    isValid: false,
    lastValidated: 0,
    validationError: undefined,
  },
};

const checkSubscriptionActive = (subscription: SubscriptionData | null): boolean => {
  if (!subscription?.payment_response) return false;

  const { payment_response } = subscription;
  const currentTime = Date.now();

  // Check basic purchase state
  const isValidState = payment_response.purchaseState === 1 || payment_response.purchaseState === 'purchased';

  if (!isValidState) return false;

  // Check expiry for iOS
  if (payment_response.platform === 'ios') {
    if (payment_response.expiresDate && payment_response.expiresDate <= currentTime) {
      // Check grace period
      if (payment_response.gracePeriodExpiresDate && payment_response.gracePeriodExpiresDate > currentTime) {
        return true; // Still in grace period
      }
      return false; // Expired
    }
  }

  // Check expiry for Android
  if (payment_response.platform === 'android' && payment_response.transactionReceipt) {
    try {
      const receipt =
        typeof payment_response.transactionReceipt === 'string'
          ? JSON.parse(payment_response.transactionReceipt)
          : payment_response.transactionReceipt;

      if (receipt.expiryTimeMillis && parseInt(receipt.expiryTimeMillis) <= currentTime) {
        return false; // Expired
      }
    } catch (error) {}
  }

  // Check auto-renewal status
  if (payment_response.autoRenewing === false) {
    // For non-auto-renewing subscriptions, calculate expiry
    const { transactionDate, productId } = payment_response;

    if (transactionDate && productId) {
      const productIdLower = productId.toLowerCase();
      let periodInDays = 30; // Default monthly

      if (productIdLower.includes('yearly') || productIdLower.includes('annual')) {
        periodInDays = 365;
      } else if (productIdLower.includes('quarterly') || productIdLower.includes('3month')) {
        periodInDays = 90;
      } else if (productIdLower.includes('6month') || productIdLower.includes('halfyear')) {
        periodInDays = 180;
      } else if (productIdLower.includes('weekly') || productIdLower.includes('week')) {
        periodInDays = 7;
      }

      const expiryTime = transactionDate + periodInDays * 24 * 60 * 60 * 1000;
      return expiryTime > currentTime;
    }
  }

  return true; // Active by default if no expiry conditions met
};

const membershipReducer = (state = initialState, action: any): MembershipState => {
  switch (action.type) {
    case FETCH_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_SUBSCRIPTION_SUCCESS:
      const subscription = action.payload;
      const isActive = checkSubscriptionActive(subscription);

      return {
        ...state,
        subscription,
        isSubscriptionActive: checkSubscriptionActive(subscription),
        isLoading: false,
        error: null,
        validationStatus: {
          isValid: isActive,
          lastValidated: Date.now(),
          validationError: undefined,
        },
      };
    case FETCH_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case SET_SUBSCRIPTION_EXPIRED:
      return {
        ...state,
        subscription: state.subscription?._id === action.payload.subscriptionId ? null : state.subscription,
        isSubscriptionActive:
          state.subscription?._id === action.payload.subscriptionId ? false : state.isSubscriptionActive,
        lastExpiredSubscriptionId: action.payload.subscriptionId,
        error: `Subscription expired at ${new Date(action.payload.expiredAt).toLocaleString()}`,
      };

    case SET_SUBSCRIPTION_CANCELLED:
      return {
        ...state,
        subscription: state.subscription?._id === action.payload.subscriptionId ? null : state.subscription,
        isSubscriptionActive:
          state.subscription?._id === action.payload.subscriptionId ? false : state.isSubscriptionActive,
        lastCancelledSubscription: action.payload,
        error: `Subscription cancelled: ${action.payload.reason}`,
      };

    case SET_SUBSCRIPTION_VALIDATION_STATUS:
      return {
        ...state,
        validationStatus: action.payload,
        error: action.payload.validationError || state.error,
      };
    case RESET_SUBSCRIPTION:
      return initialState;
    default:
      return state;
  }
};

export default membershipReducer;
