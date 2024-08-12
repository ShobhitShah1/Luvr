import NetInfo from '@react-native-community/netinfo';
import UserService from '../Services/AuthService';
import {LocalStorageFields} from '../Types/LocalStorageFields';
import {store} from '../Redux/Store/store';
import {setUserData, updateField} from '../Redux/Action/actions';
import {flattenObject} from './flattenObject';

export const getProfileData = async () => {
  const InInternetConnected = (await NetInfo.fetch()).isConnected;

  if (!InInternetConnected) {
    return;
  }

  try {
    const userDataForApi = {eventName: 'get_profile'};

    const APIResponse = await UserService.UserRegister(userDataForApi);
    if (APIResponse?.code === 200) {
      const flattenedData = flattenObject(APIResponse.data);
      Object.entries(flattenedData).forEach(([field, value]) => {
        if (field in LocalStorageFields) {
          const validField = field as keyof typeof LocalStorageFields;
          store.dispatch(updateField(validField, value));
        }
      });
      store.dispatch(setUserData(APIResponse.data));
    }
  } catch (error) {
    console.log(error);
  }
};
