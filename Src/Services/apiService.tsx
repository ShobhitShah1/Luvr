import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import axios, {AxiosResponse} from 'axios';
import {Alert, Platform, ToastAndroid} from 'react-native';
import ApiConfig from '../Config/ApiConfig';

const apiService = axios.create({
  baseURL: ApiConfig.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//* Function to check internet connection
export const checkInternetConnection = async (): Promise<boolean> => {
  const netInfoState: NetInfoState = await NetInfo.fetch();
  return netInfoState.isConnected ?? false;
};

//* Function to set the authentication token
export const setAuthToken = (token: string | null): void => {
  if (token) {
    apiService.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiService.defaults.headers.common.Authorization;
  }
};

//* Axios interceptor to set the authentication token
// apiService.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     const state = store.getState();
//     const authToken = state.auth.token;

//     if (authToken) {
//       config.headers.Authorization = `Bearer ${authToken}`;
//     }

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

//* Function to make a GET request
export const get = async <T,>(
  endpoint: string,
  params: Record<string, any> = {},
): Promise<T> => {
  try {
    const isConnected: boolean = await checkInternetConnection();

    if (!isConnected) {
      throw new Error('OOPS! No internet connection');
    }

    const response: AxiosResponse<T> = await apiService.get<
      T,
      AxiosResponse<T>
    >(endpoint, {params});
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

//* Function to make a POST request
export const post = async <T,>(
  endpoint: string,
  data: Record<string, any> = {},
): Promise<T> => {
  try {
    const isConnected: boolean = await checkInternetConnection();

    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const response: AxiosResponse<T> = await apiService.post<
      T,
      AxiosResponse<T>
    >(endpoint, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

//* Handle API errors (you can customize this function based on your needs)
const handleApiError = (error: any): void => {
  console.error('API Error:', error);

  const errorMessage = error?.message || 'An error occurred. Please try again.';

  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravityAndOffset(
      errorMessage,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  if (Platform.OS === 'ios') {
    Alert.alert(
      'API Error',
      errorMessage,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }
};

export default apiService;
