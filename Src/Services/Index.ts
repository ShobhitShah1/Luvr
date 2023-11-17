import axios from 'axios';
import ApiConfig from '../Config/ApiConfig';

const JsonHeader = {
  'Content-Type': 'application/json',
  // Authorization: Token,
};

const MultipartHeader = {
  'Content-Type': 'multipart/form-data',
  // Authorization: Token,
};

export const client = axios.create({
  baseURL: ApiConfig.BASE_URL,
  headers: {'Content-Type': 'application/json'},
  timeout: 5000,
});

export const clientMultipart = axios.create({
  baseURL: ApiConfig.BASE_URL,
  headers: {'Content-Type': 'multipart/form-data'},
  timeout: 5000,
});

export const clientMultipartToken = axios.create({
  baseURL: ApiConfig.BASE_URL,
  headers: MultipartHeader,
  timeout: 5000,
});

export const clientJsonToken = axios.create({
  baseURL: ApiConfig.BASE_URL,
  headers: JsonHeader,
  timeout: 5000,
});
