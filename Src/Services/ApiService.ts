import {AxiosError} from 'axios';
import {get, post, postFormData} from '../utils/apiUtils';
import {transformUserDataForApi} from './dataTransformService';
import ApiConfig from '../Config/ApiConfig';
import UserDataType from '../Types/UserDataType';

// Set your authentication token if applicable
// setAuthToken('YOUR_AUTH_TOKEN');

export const fetchUserData = async (): Promise<void> => {
  try {
    const userData = await get<UserData>('/user');
    console.log('User Data:', userData);
  } catch (error) {
    handleApiError(error);
  }
};

export const postUserData = async (userData: UserDataType): Promise<void> => {
  try {
    const transformedData = transformUserDataForApi(userData);
    console.log('transformedData', transformedData);
    // await post('/user', transformedData, ApiConfig.BASE_URL);
  } catch (error) {
    // Handle errors if needed
    console.error('Error posting user data:', error);
  }
};

export const uploadImage = async (imageFormData: FormData): Promise<void> => {
  try {
    const response = await postFormData<ResponseData>(
      '/upload/image',
      imageFormData,
    );
    console.log('Upload Image Response:', response);
  } catch (error) {
    handleApiError(error);
  }
};

interface UserData {
  // Define your user data structure here
}

interface ResponseData {
  // Define your response data structure here
}

const handleApiError = (error: AxiosError<unknown>): void => {
  console.error('API Error:', error);

  const errorMessage =
    error?.response?.data?.message || 'An error occurred. Please try again.';
  console.log('Error Message:', errorMessage);
  // Handle errors based on the platform (Android/iOS)
  // ...
};
