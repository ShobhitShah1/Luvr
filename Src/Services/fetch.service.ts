import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {store} from '../Redux/Store/store';
import ApiConfig from '../Config/ApiConfig';

interface FetchWrapper {
  get: (
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  post: (
    url: string,
    params: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  put: (
    url: string,
    params: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  delete: (
    url: string,
    params: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  getAxios: (
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  uploadHandler: (
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<any>;
  getLoc: (url: string, config?: AxiosRequestConfig) => Promise<any>;
}

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
  put,
  delete: _delete,
  getAxios,
  uploadHandler,
  getLoc,
};

let cancelTokenSource: axios.CancelTokenSource | undefined;

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

async function put(
  url: string,
  params: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<any> {
  return makeRequest(url, 'put', params, config);
}

async function _delete(
  url: string,
  params: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<any> {
  return makeRequest(url, 'delete', params, config);
}

async function getAxios(
  url: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<any> {
  handleLogs(url, params);

  if (cancelTokenSource) {
    cancelTokenSource.cancel();
  }

  cancelTokenSource = axios.CancelToken.source();
  try {
    const response = await axios.get(url, {
      cancelToken: cancelTokenSource.token,
      params,
      ...config,
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

async function uploadHandler(
  url: string,
  formData: FormData,
  config?: AxiosRequestConfig,
): Promise<any> {
  handleLogs(url);

  try {
    const token = store.getState()?.user?.Token;
    console.log('token', token);
    console.log('`Bearer ${token}`', `Bearer ${token}`);
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        ...commonConfig.headers,
      },
      ...config,
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

async function getLoc(url: string, config?: AxiosRequestConfig): Promise<any> {
  return makeRequest(url, 'get', undefined, config);
}

async function makeRequest(
  url: string,
  method: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig,
): Promise<any> {
  initToken();
  handleLogs(url, params);

  // Retrieve token from Redux store
  const token = store.getState().user?.Token;
  // console.log('TToken', token);
  // Set the token in the headers
  const headers = {
    ...commonConfig.headers,
    Authorization: `Bearer ${token}`,
  };

  const mergedConfig: AxiosRequestConfig = {
    // ...commonConfig,
    method,
    url,
    data: params,
    headers,
    ...config,
  };

  return axios(mergedConfig)
    .then(response => handleResponse(response))
    .catch(error => handleError(error));
}

function initToken() {
  const userState = store.getState().user;
  const token = userState && userState.Token ? userState.Token : '';

  if (ApiConfig.DEBUG) {
    console.log('Init Token DEBUG:', token);
  }

  if (token) {
    axios.defaults.headers.common.Authorization = token;
  }
}

function handleResponse(response: AxiosResponse<any>) {
  if (ApiConfig.DEBUG) {
    console.log('Response:', response.data);
  }

  if (response && response.data?.code === 200) {
    return response.data;
  } else {
    return handleError({response});
  }
}

async function handleError(error: any) {
  if (ApiConfig.DEBUG) {
    console.log('Error:', error);
  }

  if (
    (error.response && error.response.status === 403) ||
    (error.response.data && error.response.data.errorCode === 403)
  ) {
    return {
      status: false,
      error: 'Please login again to proceed.',
    };
  } else {
    console.log('Fetch Service handleError ---->', error.response.data);
    return {
      status: false,
      error:
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : '',
    };
  }
}

function handleLogs(url: string, params?: Record<string, any>) {
  if (ApiConfig.DEBUG) {
    console.log('--------------- handleLogs --------------');
    console.log('URL: ', url);
    console.log('Request: ', params);
  }
}