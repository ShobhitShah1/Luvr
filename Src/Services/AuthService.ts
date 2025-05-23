import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

import ApiConfig from '../Config/ApiConfig';

import { fetchWrapper } from './fetch.service';

const baseUrl = ApiConfig.BASE_URL;

const UserService = {
  UserRegister,
  UploadImages,
};

async function UserRegister(params: object) {
  const postDataResponse = await fetchWrapper.post(`${baseUrl}data`, params);

  return postDataResponse;
}

async function UploadImages(params: object) {
  const postDataResponse = await fetchWrapper.uploadHandler(`${baseUrl}upload`, params);

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
      offlineAccess: true,
    });
  } catch {}
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    return userInfo;
  } catch (error: any) {
    return null;
  }
};

export default UserService;
