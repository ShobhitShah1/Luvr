import type { BoostData, BoostState } from '../../Types/Interface';

export const FETCH_BOOST_REQUEST = 'FETCH_BOOST_REQUEST';
export const FETCH_BOOST_SUCCESS = 'FETCH_BOOST_SUCCESS';
export const FETCH_BOOST_FAILURE = 'FETCH_BOOST_FAILURE';

interface FetchBoostRequestAction {
  type: typeof FETCH_BOOST_REQUEST;
}

interface FetchBoostSuccessAction {
  type: typeof FETCH_BOOST_SUCCESS;
  payload: BoostData | null;
}

interface FetchBoostFailureAction {
  type: typeof FETCH_BOOST_FAILURE;
  payload: string;
}

export type BoostActionTypes =
  | FetchBoostRequestAction
  | FetchBoostSuccessAction
  | FetchBoostFailureAction;

export const fetchBoostRequest = (): FetchBoostRequestAction => ({
  type: FETCH_BOOST_REQUEST,
});

export const fetchBoostSuccess = (boost: BoostData | null): FetchBoostSuccessAction => ({
  type: FETCH_BOOST_SUCCESS,
  payload: boost,
});

export const fetchBoostFailure = (error: string): FetchBoostFailureAction => ({
  type: FETCH_BOOST_FAILURE,
  payload: error,
});

const isBoostActive = (boost: BoostData | null): boolean => {
  if (!boost || !boost._id) {
    return false;
  }

  //   if (!boost.is_active) {
  //     return false;
  //   }

  if (boost.expires_at) {
    return new Date(boost.expires_at).getTime() > Date.now();
  }

  if (boost.payment_response && boost.payment_response.transactionDate) {
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

    const expiryTime = transactionDate + periodInMinutes * 60 * 1000;

    return expiryTime > Date.now();
  }

  return false;
};

const initialState: BoostState = {
  isLoading: false,
  error: null,
  activeBoost: null,
  isBoostActive: false,
};

const boostReducer = (state = initialState, action: BoostActionTypes): BoostState => {
  switch (action.type) {
    case FETCH_BOOST_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_BOOST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        activeBoost: action.payload,
        isBoostActive: isBoostActive(action.payload),
      };
    case FETCH_BOOST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default boostReducer;
