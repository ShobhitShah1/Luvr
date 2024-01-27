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
  _id: string;
  bio: string;
  birthdate: string;
  city: string;
  date: number;
  education: EducationType;
  enable: number;
  full_name: string | null;
  gender: string;
  habits: HabitsType;
  hoping: string;
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
};
