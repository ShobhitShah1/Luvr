import {LocalStorageFields} from '../../Types/LocalStorageFields';

export const UPDATE_FIELD = 'UPDATE_FIELD';
export const RESET = 'RESET';

export type UserAction =
  | {
      type: typeof UPDATE_FIELD;
      field: keyof typeof LocalStorageFields;
      value: string;
    }
  | {type: typeof RESET};

export const updateField = (
  field: keyof typeof LocalStorageFields,
  value: string,
) => ({
  type: UPDATE_FIELD,
  field,
  value,
});

export const resetUserData = () => ({
  type: RESET,
});
