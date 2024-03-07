import {ProfileType} from './ProfileType';

export interface SwiperCard {
  _id: string | number;
  birthdate: string;
  city: string;
  date: number;
  education: [];
  enable: number;
  full_name: string | null;
  gender: string;
  habits: [];
  hoping: string;
  identity: string;
  is_block_contact: string;
  is_orientation_visible: string;
  likes_into: [];
  login_type: string;
  magical_person: [];
  mobile_no: string;
  orientation: [];
  profile_image: string;
  radius: number;
  recent_pik: string[];
  user_from: string;
  location?: string;
}

export interface LikeAndMatchTypes {
  _id: string;
  first_approch: string;
  second_approch: string;
  status: string;
  user_details: ProfileType[];
}
