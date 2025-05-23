export const LocalStorageFields = {
  _id: '_id',
  eventName: 'eventName',
  about: 'about',
  login_type: 'login_type',
  user_from: 'user_from',
  mobile_no: 'mobile_no',
  identity: 'identity',
  profile_image: 'profile_image',
  full_name: 'full_name',
  birthdate: 'birthdate',
  gender: 'gender',
  city: 'city',
  orientation: 'orientation',
  is_orientation_visible: 'is_orientation_visible',
  hoping: 'hoping',
  digree: 'digree',
  college_name: 'college_name',
  exercise: 'exercise',
  smoke: 'smoke',
  movies: 'movies',
  drink: 'drink',
  communication_stry: 'communication_stry',
  recived_love: 'recived_love',
  education_level: 'education_level',
  star_sign: 'star_sign',
  likes_into: 'likes_into',
  is_block_contact: 'is_block_contact',
  latitude: 'latitude',
  longitude: 'longitude',
  radius: 'radius',
  recent_pik: 'recent_pik',
  isImageUploaded: 'isImageUploaded',
  OTP: 'OTP',
  isVerified: 'isVerified',
  Token: 'Token',
  phoneNumberWithoutCode: 'phoneNumberWithoutCode',
  phoneNumberCountryCode: 'phoneNumberCountryCode',
  notification_token: 'notification_token',
  setting_active_status: 'setting_active_status',
  setting_age_range_min: 'setting_age_range_min',
  setting_distance_preference: 'setting_distance_preference',
  setting_notification_email: 'setting_notification_email',
  setting_notification_push: 'setting_notification_push',
  setting_notification_team: 'setting_notification_team',
  setting_people_with_range: 'setting_people_with_range',
  setting_show_me: 'setting_show_me',
  setting_show_people_with_range: 'setting_show_people_with_range',
  email: 'email',
  CurrentScreen: 'CurrentScreen',
  apple_id: 'apple_id',
  incognito_identity: 'incognito_identity',
  incognito_mobile: 'incognito_mobile',
  incognito_mode: 'incognito_mode',
  see_who_is_online: 'see_who_is_online',
  is_online: 'is_online',
} as const;

export type UserField = keyof typeof LocalStorageFields;
