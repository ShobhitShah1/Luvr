export const LocalStorageFields = {
  firstName: 'firstName',
  dob: 'dob',
  gender: 'gender',
  sexualOrientation: 'sexualOrientation',
} as const;

export type UserField = keyof typeof LocalStorageFields;
