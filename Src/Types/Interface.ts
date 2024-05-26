import {ProfileType} from './ProfileType';

export interface LikeInterface {
  _id: string;
  first_approch: string;
  second_approch: string;
  status: string;
  user_details: ProfileType[];
}
