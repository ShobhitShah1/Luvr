import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {ProfileType} from '../../../Types/ProfileType';

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
];

const calculateDataPercentage = (userData: ProfileType): number => {
  const isFilled = (value: any): boolean => {
    if (value === null || value === undefined || value === '') {
      return false;
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.every((element: any) => isFilled(element));
      } else {
        for (const key in value) {
          if (value.hasOwnProperty(key) && !isFilled(value[key])) {
            return false;
          }
        }
        return true;
      }
    } else {
      return true;
    }
  };

  const totalFields = Object.keys(userData).filter(
    key => !excludeFields.includes(key),
  ).length;

  let filledFieldsCount = 0;
  const missingFields: string[] = [];

  console.info('------------------ Start ------------------------');
  console.info('Total Fields:', totalFields);

  Object.entries(userData).forEach(([key, value]) => {
    if (!excludeFields.includes(key)) {
      if (isFilled(value)) {
        filledFieldsCount++;
        console.info(`- ${key}: ${value}`);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // If the value is an object and not an array, recursively log its details
        console.info(`- ${key}:`);
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          console.info(`  - ${nestedKey}: ${nestedValue}`);
        });
      } else {
        missingFields.push(key);
      }
    }
  });

  if (filledFieldsCount > 0) {
    console.info('Filled Fields:', filledFieldsCount);
  } else {
    console.info('No fields are filled.');
  }

  if (missingFields.length > 0) {
    console.info('Missing Fields:');
    missingFields.forEach(field => {
      console.info(`  - ${field}`);
    });
  } else {
    console.info('All fields are filled.');
  }

  const percentage = (filledFieldsCount / totalFields) * 100;
  console.info('Percentage of filled data:', percentage + '%');
  console.info('---------------------------------------------');

  return percentage;
};

// const calculateDataPercentage = (userData: ProfileType): number => {
//   const totalFields = Object.keys(userData).filter(
//     key => !excludeFields.includes(key),
//   ).length;
//   const missingFields: string[] = [];
//   const filledFields: string[] = [];

//   Object.entries(userData).forEach(([key, value]) => {
//     if (!excludeFields.includes(key)) {
//       if (
//         (value as any) === null ||
//         (value as any) === undefined ||
//         (value as any) === ''
//       ) {
//         missingFields.push(key);
//       } else {
//         filledFields.push(key);
//       }
//     }
//   });

//   console.info('------------------ Start ------------------------');
//   console.info('Total Fields:', totalFields);

//   if (filledFields.length > 0) {
//     console.info('Filled Fields:');
//     filledFields.forEach(field => {
//       console.info(`  - ${field}: ${userData[field as keyof ProfileType]}`);
//     });
//   } else {
//     console.info('No fields are filled.');
//   }

//   if (missingFields.length > 0) {
//     console.info('Missing Fields:');
//     missingFields.forEach(field => {
//       console.info(`  - ${field}`);
//     });
//   } else {
//     console.info('All fields are filled.');
//   }

//   const percentage =
//     totalFields === 0 ? 100 : (filledFields.length / totalFields) * 100;
//   console.info('Percentage of filled data:', percentage + '%');
//   console.info('---------------------------------------------');

//   return percentage;
// };

export default calculateDataPercentage;
