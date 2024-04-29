import {Notification} from '@notifee/react-native';
import {LocalStorageFields} from '../../Types/LocalStorageFields';

export const UPDATE_FIELD = 'UPDATE_FIELD';
export const SET_USER_DATA = 'SET_USER_DATA';
export const RESET = 'RESET';
export const RESET_SWIPER_KEYS = 'RESET_SWIPER_KEYS';
export const ON_SWIPE_LEFT = 'ON_SWIPE_LEFT';
export const ON_SWIPE_RIGHT = 'ON_SWIPE_RIGHT';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const CURRENT_SCREEN = 'CURRENT_SCREEN';

export type NotificationPayload = {
  title: string;
  description: string;
  date: Date;
};

export type UserAction =
  | {
      type: typeof UPDATE_FIELD;
      field: keyof typeof LocalStorageFields;
      value: any;
      _id?: string;
    }
  | {type: typeof RESET}
  | {type: typeof ADD_NOTIFICATION; notification: string};

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

export const setUserData = (userData: any) => ({
  type: SET_USER_DATA,
  payload: userData,
});

export const setCurrentScreenName = (screenName: string) => ({
  type: CURRENT_SCREEN,
  payload: screenName,
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

export const addNotification = (notification: NotificationPayload) => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const resetUserData = () => ({
  type: RESET,
});

export const resetSwiperData = () => ({
  type: RESET_SWIPER_KEYS,
});
