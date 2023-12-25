import NetInfo from '@react-native-community/netinfo';
import axios, {AxiosResponse, AxiosError, AxiosInstance} from 'axios';
import {Alert, Platform, ToastAndroid} from 'react-native';
import ApiConfig from '../Config/ApiConfig';

const createApiService = (baseURL: string): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const defaultApiService = createApiService(ApiConfig.BASE_URL);

export const checkInternetConnection = async (
  apiService: AxiosInstance,
): Promise<boolean> => {
  try {
    const response = await apiService.get('/');
    return !!response;
  } catch (error) {
    console.error('Error checking internet connection:', error);
    return false;
  }
};

export const setAuthToken = (
  token: string | null,
  apiService: AxiosInstance,
): void => {
  if (token) {
    apiService.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiService.defaults.headers.common.Authorization;
  }
};

const handleApiError = (error: AxiosError): void => {
  console.error('API Error:', error);

  const errorMessage =
    error?.response?.data?.message || 'An error occurred. Please try again.';

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
    Alert.alert('API Error', errorMessage, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  }
};

const makeRequest = async <T>(
  method: 'get' | 'post',
  endpoint: string,
  data: Record<string, any> = {},
  formData?: FormData,
  baseURL: string = ApiConfig.BASE_URL,
): Promise<T> => {
  try {
    const apiService = createApiService(baseURL);
    const isConnected: boolean = await checkInternetConnection(apiService);

    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const config: any = {
      method,
      url: endpoint,
    };

    if (method === 'get') {
      config.params = data;
    } else {
      config.data = formData ? formData : data;
    }

    const response: AxiosResponse<T> = await apiService.request(config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const get = async <T>(
  endpoint: string,
  params: Record<string, any> = {},
  baseURL: string = ApiConfig.BASE_URL,
): Promise<T> => {
  return makeRequest<T>('get', endpoint, params, undefined, baseURL);
};

export const post = async <T>(
  endpoint: string,
  data: Record<string, any> = {},
  baseURL: string = ApiConfig.BASE_URL,
): Promise<T> => {
  return makeRequest<T>('post', endpoint, data, undefined, baseURL);
};

export const postFormData = async <T>(
  endpoint: string,
  formData: FormData,
  baseURL: string = ApiConfig.BASE_URL,
): Promise<T> => {
  return makeRequest<T>('post', endpoint, {}, formData, baseURL);
};

export default defaultApiService;
