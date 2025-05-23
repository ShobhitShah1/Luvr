import UserService from '../../Services/AuthService';

import type { AppDispatch, AppThunk } from './Index';

export const SHOW_BOOST_MODAL = 'SHOW_BOOST_MODAL';
export const HIDE_BOOST_MODAL = 'HIDE_BOOST_MODAL';
export const SET_BOOST_LOADING = 'SET_BOOST_LOADING';
export const SET_BOOST_ERROR = 'SET_BOOST_ERROR';
export const CLEAR_BOOST_ERROR = 'CLEAR_BOOST_ERROR';

interface ShowBoostModalAction {
  type: typeof SHOW_BOOST_MODAL;
}

interface HideBoostModalAction {
  type: typeof HIDE_BOOST_MODAL;
}

interface SetBoostLoadingAction {
  type: typeof SET_BOOST_LOADING;
  payload: boolean;
}

interface SetBoostErrorAction {
  type: typeof SET_BOOST_ERROR;
  payload: string;
}

interface ClearBoostErrorAction {
  type: typeof CLEAR_BOOST_ERROR;
}

export type BoostModalActionTypes =
  | ShowBoostModalAction
  | HideBoostModalAction
  | SetBoostLoadingAction
  | SetBoostErrorAction
  | ClearBoostErrorAction;

export const showBoostModal = (): ShowBoostModalAction => ({
  type: SHOW_BOOST_MODAL,
});

export const hideBoostModal = (): HideBoostModalAction => ({
  type: HIDE_BOOST_MODAL,
});

export const setBoostLoading = (isLoading: boolean): SetBoostLoadingAction => ({
  type: SET_BOOST_LOADING,
  payload: isLoading,
});

export const setBoostError = (error: string): SetBoostErrorAction => ({
  type: SET_BOOST_ERROR,
  payload: error,
});

export const clearBoostError = (): ClearBoostErrorAction => ({
  type: CLEAR_BOOST_ERROR,
});

export const purchaseBoost = (): AppThunk => {
  return async (dispatch: AppDispatch) => {
    dispatch(setBoostLoading(true));
    dispatch(clearBoostError());

    try {
      const dataToSend = { eventName: 'purchase_boost' };

      const response = await UserService.UserRegister(dataToSend);

      if (response?.code === 200) {
        dispatch(hideBoostModal());
      } else {
        dispatch(setBoostError(response?.message || 'Failed to purchase boost'));
      }
    } catch (error: any) {
      dispatch(setBoostError(error?.message || 'An error occurred'));
    } finally {
      dispatch(setBoostLoading(false));
    }
  };
};
