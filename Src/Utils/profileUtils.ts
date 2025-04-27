import NetInfo from '@react-native-community/netinfo';
import { batch } from 'react-redux';
import UserService from '../Services/AuthService';
import { LocalStorageFields } from '../Types/LocalStorageFields';
import { store } from '../Redux/Store/store';
import { setUserData, updateField } from '../Redux/Action/actions';
import { flattenObject } from './flattenObject';

const VALID_FIELDS = new Set(Object.keys(LocalStorageFields));

type FieldValuePair = [string, any];

/**
 * Fetches and updates user profile data from the server
 * @returns {Promise<boolean>} True if profile was successfully fetched, false otherwise
 */
export const getProfileData = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const APIResponse = await UserService.UserRegister({ eventName: 'get_profile' });
    clearTimeout(timeoutId);

    if (APIResponse?.code !== 200 || !APIResponse.data) {
      return false;
    }

    const flattenedData = flattenObject(APIResponse.data);
    const validFields: FieldValuePair[] = [];

    for (const [field, value] of Object.entries(flattenedData)) {
      if (VALID_FIELDS.has(field)) {
        validFields.push([field, value]);
      }
    }

    if (typeof batch === 'function') {
      batch(() => {
        batchUpdateFields(validFields, APIResponse.data);
      });
    } else {
      batchUpdateFields(validFields, APIResponse.data);
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to update fields in store
 */
const batchUpdateFields = (validFields: FieldValuePair[], fullData: any): void => {
  for (const [field, value] of validFields) {
    store.dispatch(updateField(field as keyof typeof LocalStorageFields, value));
  }

  store.dispatch(setUserData(fullData));
};

let profileFetchTimeout: NodeJS.Timeout | null = null;

export const debouncedGetProfileData = (delayMs = 300): Promise<boolean> => {
  return new Promise((resolve) => {
    if (profileFetchTimeout) {
      clearTimeout(profileFetchTimeout);
    }

    profileFetchTimeout = setTimeout(async () => {
      const result = await getProfileData();
      resolve(result);
      profileFetchTimeout = null;
    }, delayMs);
  });
};
