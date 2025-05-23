import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import type UserDataType from '../../../Types/UserDataType';

const excludeFields = [
  'socket_id',
  LocalStorageFields.OTP,
  LocalStorageFields.user_from,
  LocalStorageFields.Token,
  LocalStorageFields.profile_image,
  LocalStorageFields.is_block_contact,
  LocalStorageFields.longitude,
  LocalStorageFields.latitude,
  LocalStorageFields.user_from,
  LocalStorageFields.eventName,
  LocalStorageFields.login_type,
  LocalStorageFields.isVerified,
  LocalStorageFields.isImageUploaded,
  LocalStorageFields.phoneNumberWithoutCode,
  LocalStorageFields.phoneNumberCountryCode,
  LocalStorageFields.notification_token,
  LocalStorageFields.setting_active_status,
  LocalStorageFields.setting_age_range_min,
  LocalStorageFields.setting_distance_preference,
  LocalStorageFields.setting_notification_email,
  LocalStorageFields.setting_notification_push,
  LocalStorageFields.setting_notification_team,
  LocalStorageFields.setting_people_with_range,
  LocalStorageFields.setting_show_me,
  LocalStorageFields.setting_show_people_with_range,
  LocalStorageFields.apple_id,
  LocalStorageFields.CurrentScreen,
  LocalStorageFields.incognito_identity,
  LocalStorageFields.incognito_mobile,
  LocalStorageFields.is_online,
  LocalStorageFields.see_who_is_online,
  LocalStorageFields.incognito_mode,
];

const calculateDataPercentage = (userData: UserDataType): number => {
  const isFilled = (value: any): boolean => {
    if (value === null || value === 'null' || value === undefined || value === '') {
      return false;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Treat null values as filled only for object fields
      return true;
    } else if (typeof value === 'object' || Array.isArray(value)) {
      // For arrays and object values, check if every element is filled
      return value.every((element: any) => isFilled(element));
    } else {
      return true;
    }
  };

  const totalFields = Object.keys(userData).filter(key => !excludeFields.includes(key)).length;

  let filledFieldsCount = 0;
  const missingFields: string[] = [];

  // console.info('------------------ Start ------------------------');
  // console.info('Total Fields:', totalFields);

  Object.entries(userData).forEach(([key, value]) => {
    if (!excludeFields.includes(key)) {
      if (isFilled(value)) {
        filledFieldsCount++;
        // console.info(`- ${key}: ${value}`);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // If the value is an object and not an array, recursively log its details
        // console.info(`- ${key}:`);
        // Object.entries(value as any).forEach(([nestedKey, nestedValue]) => {
        //   console.info(`  - ${nestedKey}: ${nestedValue}`);
        // });
      } else {
        missingFields.push(key);
      }
    }
  });

  // if (filledFieldsCount > 0) {
  //   console.info('Filled Fields:', filledFieldsCount);
  // } else {
  //   console.info('No fields are filled.');
  // }

  // if (missingFields.length > 0) {
  //   console.info('Missing Fields:');
  //   missingFields.forEach((field) => {
  //     console.info(`  - ${field}`);
  //   });
  // } else {
  //   console.info('All fields are filled.');
  // }

  const percentage = (filledFieldsCount / totalFields) * 100;
  // console.info('Percentage of filled data:', percentage + '%');
  // console.info('---------------------------------------------');

  return percentage;
};

export default calculateDataPercentage;
