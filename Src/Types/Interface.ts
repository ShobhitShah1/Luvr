import {ProfileType} from './ProfileType';

export interface MyLikesType {
  like: Like[];
  match: Like[];
}

export interface LikeInterface {
  _id: string;
  first_approch: string;
  second_approch: string;
  status: string;
  user_details: ProfileType[];
}
