import {LocalStorageFields} from '../../Types/LocalStorageFields';

export const UPDATE_FIELD = 'UPDATE_FIELD';
export const SET_USER_DATA = 'SET_USER_DATA';
export const RESET = 'RESET';
export const ON_SWIPE_LEFT = 'ON_SWIPE_LEFT';
export const ON_SWIPE_RIGHT = 'ON_SWIPE_RIGHT';

export type UserAction =
  | {
      type: typeof UPDATE_FIELD;
      field: keyof typeof LocalStorageFields;
      value: any;
      _id?: string;
    }
  | {type: typeof RESET};

export const updateField = (
  field: keyof typeof LocalStorageFields,
  value: any,
  _id?: string,
) => {
  return {
    type: UPDATE_FIELD,
    field,
    value,
    _id,
  };
};

export const setUserData = userData => ({
  type: SET_USER_DATA,
  payload: userData,
});

export type OnSwipeLeftAction = {
  type: typeof ON_SWIPE_LEFT;
  userId: string | string[];
};

export type OnSwipeRightAction = {
  type: typeof ON_SWIPE_RIGHT;
  userId: string | string[];
};

export const onSwipeLeft = (userId: string): OnSwipeLeftAction => ({
  type: ON_SWIPE_LEFT,
  userId,
});

export const onSwipeRight = (
  userId: string | string[],
): OnSwipeRightAction => ({
  type: ON_SWIPE_RIGHT,
  userId,
});

export const resetUserData = () => ({
  type: RESET,
});
