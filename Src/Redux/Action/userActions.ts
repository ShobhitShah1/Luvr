import {LocalStorageFields} from '../../Types/LocalStorageFields';

export const UPDATE_FIELD = 'UPDATE_FIELD';
export const RESET = 'RESET';
export const ON_SWIPE_LEFT = 'ON_SWIPE_LEFT';

export type UserAction =
  | {
      type: typeof UPDATE_FIELD;
      field: keyof typeof LocalStorageFields;
      value: any;
    }
  | {type: typeof RESET};

export const updateField = (
  field: keyof typeof LocalStorageFields,
  value: any,
) => {
  return {
    type: UPDATE_FIELD,
    field,
    value,
  };
};

export type OnSwipeLeftAction = {
  type: typeof ON_SWIPE_LEFT;
  userId: string;
};

export const onSwipeLeft = (userId: string): OnSwipeLeftAction => ({
  type: ON_SWIPE_LEFT,
  userId,
});

export const resetUserData = () => ({
  type: RESET,
});
