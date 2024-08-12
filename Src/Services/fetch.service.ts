import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import ApiConfig from '../Config/ApiConfig';
import {store} from '../Redux/Store/store';
import {FetchWrapper} from '../Types/Interface';

const commonConfig: AxiosRequestConfig = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${ApiConfig.BASE_URL}data`,
  headers: {
    'Content-Type': 'application/json',
    app_secret: '_d_a_t_i_n_g_',
  },
};

export const fetchWrapper: FetchWrapper = {
  get,
  post,
  uploadHandler,
};

async function get(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<any> {
  return makeRequest(url, 'get', params, config);
}

async function post(
  url: string,
  params: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<any> {
  return makeRequest(url, 'post', params, config);
}

async function uploadHandler(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig,
): Promise<any> {
  handleLogs(url);

  try {
    const token = getToken();
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        ...commonConfig.headers,
      },
      ...config,
    });

    return handleResponse(response);
  } catch (error: AxiosError | any) {
    return handleError(error);
  }
}

async function makeRequest(
  url: string,
  method: 'get' | 'post',
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<any> {
  const token = getToken();
  handleLogs(url, params);

  const mergedConfig: AxiosRequestConfig = {
    method,
    url,
    data: params,
    headers: {
      ...commonConfig.headers,
      Authorization: `Bearer ${token}`,
    },
    ...config,
  };

  try {
    const response = await axios(mergedConfig);
    return handleResponse(response);
  } catch (error: AxiosError | any) {
    return handleError(error);
  }
}

function getToken(): string {
  const token = store.getState()?.user?.Token || '';
  if (ApiConfig.DEBUG) {
    console.log('Token:', token);
  }
  return token;
}

function handleResponse(response: any) {
  if (ApiConfig.DEBUG) {
    console.log('Response:', response.data);
  }

  if (response.data?.code === 200) {
    return response.data;
  } else {
    return handleError({response});
  }
}

async function handleError(error: AxiosError | any) {
  if (ApiConfig.DEBUG) {
    console.log('Error:', error);
  }

  const errorCode = error.response?.status;
  const errorMessage =
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred';

  return {
    status: false,
    error: errorMessage,
    code: errorCode,
  };
}

function handleLogs(url: string, params?: Record<string, any>) {
  if (ApiConfig.DEBUG) {
    console.log('--------------- handleLogs --------------');
    console.log('URL:', url);
    console.log('Request:', params);
  }
}
