import ApiConfig from '../Config/ApiConfig';
import {fetchWrapper} from './fetch.service';

const baseUrl = ApiConfig.BASE_URL;

const UserService = {
  UserRegister,
};

function UserRegister(params: object) {
  console.log('params', params);
  return fetchWrapper.post(baseUrl + 'data', params);
}

export default UserService;
