import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import ApiConfig from '../Config/ApiConfig';
import {fetchWrapper} from './fetch.service';
import axios from 'axios';

const baseUrl = ApiConfig.BASE_URL;

const UserService = {
  UserRegister,
  UploadImages,
};

async function UserRegister(params: object) {
  const postDataResponse = await fetchWrapper.post(baseUrl + 'data', params);
  return postDataResponse;
}

async function UploadImages(params: object) {
  const postDataResponse = await fetchWrapper.uploadHandler(
    baseUrl + 'upload',
    params,
  );
  return postDataResponse;
}

export const fetchCountryCode = async () => {
  try {
    const response = await axios.get(ApiConfig.GET_LOCATION_API);
    return response.data.countryCode;
  } catch (error) {
    console.error('Error fetching device country code:', error);
    throw error;
  }
};

export const initGoogleSignIn = async () => {
  try {
    GoogleSignin.configure({
      webClientId: ApiConfig.GOOGLE_WEB_CLIENT_ID,
    });
  } catch {}
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // User cancelled the login flow
      console.log('Google sign-in cancelled');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Google sign-in is already in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available');
    } else {
      console.log('Error in Google sign-in', error);
    }
    return null;
  }
};

export default UserService;
