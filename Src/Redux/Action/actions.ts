import { LocalStorageFields } from '../../Types/LocalStorageFields';

export const UPDATE_FIELD = 'UPDATE_FIELD';
export const SET_USER_DATA = 'SET_USER_DATA';
export const RESET = 'RESET';
export const RESET_SWIPER_KEYS = 'RESET_SWIPER_KEYS';
export const ON_SWIPE_LEFT = 'ON_SWIPE_LEFT';
export const ON_SWIPE_RIGHT = 'ON_SWIPE_RIGHT';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const CURRENT_SCREEN = 'CURRENT_SCREEN';
export const DONATION_PRODUCTS = 'DONATION_PRODUCTS';

export type NotificationPayload = {
  title: string;
  description: string;
  date: Date;
};

export type UserField = keyof typeof LocalStorageFields;

export type UserAction =
  | {
      type: typeof UPDATE_FIELD;
      field: UserField;
      value: any;
      _id?: string;
    }
  | { type: typeof RESET }
  | { type: typeof RESET_SWIPER_KEYS }
  | { type: typeof ON_SWIPE_LEFT; userId: string }
  | { type: typeof ON_SWIPE_RIGHT; userId: string | string[] }
  | { type: typeof ADD_NOTIFICATION; payload: NotificationPayload }
  | { type: typeof SET_USER_DATA; payload: any }
  | { type: typeof CURRENT_SCREEN; payload: string };

// Action creators with proper typing
export const updateField = (field: UserField, value: any, _id?: string): UserAction => ({
  type: UPDATE_FIELD,
  field,
  value,
  _id,
});

export const setUserData = (userData: any): UserAction => ({
  type: SET_USER_DATA,
  payload: userData,
});

export const setCurrentScreenName = (screenName: string): UserAction => ({
  type: CURRENT_SCREEN,
  payload: screenName,
});

export const onSwipeLeft = (userId: string): UserAction => ({
  type: ON_SWIPE_LEFT,
  userId,
});

export const onSwipeRight = (userId: string | string[]): UserAction => ({
  type: ON_SWIPE_RIGHT,
  userId,
});

export const addNotification = (notification: NotificationPayload): UserAction => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const resetUserData = (): UserAction => ({
  type: RESET,
});

export const resetSwiperData = (): UserAction => ({
  type: RESET_SWIPER_KEYS,
});
