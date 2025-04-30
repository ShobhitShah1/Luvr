export type EducationType = {
  college_name: string;
  digree: string;
};

export type HabitsType = {
  drink: string;
  exercise: string;
  movies: string;
  smoke: string;
};

export type LocationType = {
  coordinates: [number, number];
  type: string;
};

export type MagicalPersonType = {
  communication_stry: string;
  education_level: string;
  recived_love: string;
  star_sign: string;
};

export type ProfileType = {
  _id: string | number | undefined;
  about: string;
  birthdate: string;
  city: string;
  date: number;
  education: EducationType;
  enable: number;
  full_name: string | null;
  gender: string;
  habits: HabitsType;
  hoping: string[];
  identity: string;
  is_block_contact: string;
  is_orientation_visible: boolean;
  likes_into: string[];
  location: LocationType;
  login_type: string;
  magical_person: MagicalPersonType;
  mobile_no: string;
  orientation: string[];
  profile_image: string;
  radius: number;
  recent_pik: string[];
  user_from: string;
  latitude?: string | number;
  longitude?: string | number;
  notification_token: string;
  setting_active_status: boolean;
  setting_age_range_min: string;
  setting_distance_preference: string;
  setting_notification_email: boolean;
  setting_notification_push: boolean;
  setting_notification_team: boolean;
  setting_people_with_range: boolean;
  setting_show_me: string;
  setting_show_people_with_range: boolean;
  see_who_is_online: boolean;
};

export type SettingType = {
  is_direction_on: boolean;
  direction: number;
  show_me: string;
  age_to: number;
  age_from: number;
  active_status: boolean;
  latitude: string;
  longitude: string;
  Location: string;
};
