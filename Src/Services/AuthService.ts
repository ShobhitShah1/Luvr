import ApiConfig from '../Config/ApiConfig';
import {fetchWrapper} from './fetch.service';

const baseUrl = ApiConfig.BASE_URL;

const UserService = {
  UserRegister,
};

async function UserRegister(params: object) {
  const postDataResponse = await fetchWrapper.post(baseUrl + 'data', params);
  return postDataResponse;
}

export default UserService;
