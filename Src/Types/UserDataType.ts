import {LocalStorageFields} from './LocalStorageFields';

export interface UserDataType {
  [LocalStorageFields._id]: number;
  [LocalStorageFields.eventName]: string;
  [LocalStorageFields.login_type]: string;
  [LocalStorageFields.about]: string;
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
  [LocalStorageFields.notification_token]: string;
  [LocalStorageFields.setting_active_status]: boolean;
  [LocalStorageFields.setting_age_range_min]: string;
  [LocalStorageFields.setting_distance_preference]: string;
  [LocalStorageFields.setting_notification_email]: boolean;
  [LocalStorageFields.setting_notification_push]: boolean;
  [LocalStorageFields.setting_notification_team]: boolean;
  [LocalStorageFields.setting_people_with_range]: boolean;
  [LocalStorageFields.setting_show_me]: string;
  [LocalStorageFields.setting_show_people_with_range]: boolean;
}

export default UserDataType;