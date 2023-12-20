// src/utils/apiUtils.ts
import NetInfo from '@react-native-community/netinfo';
import axios, {AxiosResponse, AxiosError} from 'axios';
import {Alert, Platform, ToastAndroid} from 'react-native';
import ApiConfig from '../Config/ApiConfig';

const apiService = axios.create({
  baseURL: ApiConfig.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const netInfoState = await NetInfo.fetch();
    return netInfoState.isConnected ?? false;
  } catch (error) {
    console.error('Error checking internet connection:', error);
    return false;
  }
};

export const setAuthToken = (token: string): void => {
  if (token) {
    apiService.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiService.defaults.headers.common.Authorization;
  }
};

const handleApiError = (error: AxiosError<unknown, any>): void => {
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

export const get = async <T>(
  endpoint: string,
  params: Record<string, any> = {},
): Promise<T> => {
  try {
    const isConnected = await checkInternetConnection();

    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const response: AxiosResponse<T> = await apiService.get(endpoint, {params});
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const post = async <T>(
  endpoint: string,
  data: Record<string, any> = {},
): Promise<T> => {
  try {
    const isConnected = await checkInternetConnection();

    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const response: AxiosResponse<T> = await apiService.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const postFormData = async <T>(
  endpoint: string,
  formData: FormData,
): Promise<T> => {
  try {
    const isConnected = await checkInternetConnection();

    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const response: AxiosResponse<T> = await apiService.post(
      endpoint,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
