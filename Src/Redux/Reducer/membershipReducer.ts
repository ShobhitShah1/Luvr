import { SubscriptionData, MembershipState } from '../../Types/SubscriptionTypes';

export const FETCH_SUBSCRIPTION_REQUEST = 'FETCH_SUBSCRIPTION_REQUEST';
export const FETCH_SUBSCRIPTION_SUCCESS = 'FETCH_SUBSCRIPTION_SUCCESS';
export const FETCH_SUBSCRIPTION_FAILURE = 'FETCH_SUBSCRIPTION_FAILURE';
export const RESET_SUBSCRIPTION = 'RESET_SUBSCRIPTION';

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
};

const checkSubscriptionActive = (subscription: SubscriptionData | null): boolean => {
  if (!subscription) return false;

  return subscription.payment_response.purchaseState === 1;
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
      return {
        ...state,
        subscription,
        isSubscriptionActive: checkSubscriptionActive(subscription),
        isLoading: false,
        error: null,
      };
    case FETCH_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case RESET_SUBSCRIPTION:
      return initialState;
    default:
      return state;
  }
};

export default membershipReducer;
