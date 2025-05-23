import type { UserField } from './LocalStorageFields';

export type UserDataType = {
  [K in UserField]: any;
};

export default UserDataType;
