import {Alert} from 'react-native'; // Assuming you're using React Native
import {Dispatch} from 'redux'; // Import Dispatch if you're using Redux
import {LocalStorageFields} from '../Types/LocalStorageFields';

export const storeToken = async (
  dispatch: Dispatch,
  updateField: any,
  token: string,
) => {
  try {
    await dispatch(updateField(LocalStorageFields.Token, token));
  } catch (error) {
    console.error('Error storing token:', error);
    Alert.alert('Error!', 'Could not store token');
  }
};

export const handleProfileResponse = (
  navigation: any,
  ProfileAPIResponse: any,
) => {
  const {data} = ProfileAPIResponse;

  if (data?.full_name || data?.birthdate) {
    if (data?.recent_pik?.length !== 0) {
      navigation.replace('BottomTab');
    } else {
      navigation.replace('AddRecentPics');
    }
  } else {
    navigation.replace('LoginStack');
  }
};

export default {
  storeToken,
  handleProfileResponse,
};
