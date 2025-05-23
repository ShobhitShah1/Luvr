import {
  SHOW_BOOST_MODAL,
  HIDE_BOOST_MODAL,
  SET_BOOST_LOADING,
  SET_BOOST_ERROR,
  CLEAR_BOOST_ERROR,
} from '../Action/BoostModalActions';
import type { BoostModalActionTypes } from '../Action/BoostModalActions';

export interface BoostModalState {
  isVisible: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: BoostModalState = {
  isVisible: false,
  isLoading: false,
  error: null,
};

const boostModalReducer = (
  state = initialState,
  action: BoostModalActionTypes,
): BoostModalState => {
  switch (action.type) {
    case SHOW_BOOST_MODAL:
      return {
        ...state,
        isVisible: true,
      };

    case HIDE_BOOST_MODAL:
      return {
        ...state,
        isVisible: false,
      };

    case SET_BOOST_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SET_BOOST_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case CLEAR_BOOST_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default boostModalReducer;
