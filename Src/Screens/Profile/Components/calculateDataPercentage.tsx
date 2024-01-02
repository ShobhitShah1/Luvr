import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import UserDataType from '../../../Types/UserDataType';

const excludeFields = [
  LocalStorageFields.OTP, // Assuming LocalStorageFields.OTP is the field for OTP token
  LocalStorageFields.userFrom,
  LocalStorageFields.phoneNumberWithoutCode,
  LocalStorageFields.phoneNumberCountryCode,
];

const calculateTotalFields = (obj: Record<string, any>): number => {
  return Object.keys(obj).filter(key => !excludeFields.includes(key)).length;
};

const calculateDataPercentage = (userData: UserDataType): number => {
  const totalFields = calculateTotalFields(userData);
  const filledFields = Object.values(userData).filter(
    (value, index) =>
      !excludeFields.includes(Object.keys(userData)[index]) &&
      value !== null &&
      value !== undefined &&
      value !== '',
  ).length;

  const percentage = (filledFields / totalFields) * 100;
  return percentage;
};

export default calculateDataPercentage;
