import {LocalStorageFields} from './LocalStorageFields';

export interface UserDataType {
  [LocalStorageFields._id]: number;
  [LocalStorageFields.eventName]: string;
  [LocalStorageFields.login_type]: string;
  [LocalStorageFields.user_from]: string;
  [LocalStorageFields.mobile_no]: string;
  [LocalStorageFields.identity]: string;
  [LocalStorageFields.profile_image]: string;
  [LocalStorageFields.full_name]: string;
  [LocalStorageFields.birthdate]: string;
  [LocalStorageFields.gender]: string;
  [LocalStorageFields.city]: string;
  [LocalStorageFields.orientation]: string[];
  [LocalStorageFields.is_orientation_visible]: false;
  [LocalStorageFields.hoping]: string;
  [LocalStorageFields.digree]: string;
  [LocalStorageFields.college_name]: string;
  [LocalStorageFields.exercise]: string;
  [LocalStorageFields.smoke]: string;
  [LocalStorageFields.movies]: string;
  [LocalStorageFields.drink]: string;
  [LocalStorageFields.communication_stry]: string;
  [LocalStorageFields.recived_love]: string;
  [LocalStorageFields.education_level]: string;
  [LocalStorageFields.star_sign]: string;
  [LocalStorageFields.likes_into]: string[];
  [LocalStorageFields.is_block_contact]: false;
  [LocalStorageFields.latitude]: number;
  [LocalStorageFields.longitude]: number;
  [LocalStorageFields.radius]: number;
  [LocalStorageFields.recent_pik]: string[];
  [LocalStorageFields.OTP]: number;
  [LocalStorageFields.Token]: string;
  [LocalStorageFields.isVerified]: false;
  [LocalStorageFields.isImageUploaded]: false;
}

export default UserDataType;
